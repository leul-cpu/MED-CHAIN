
document.addEventListener("DOMContentLoaded", function() {
    console.log("App started...");

    checkUserRole();
    loadMedicalRecords();
});


function login() {
    const usernameField = document.getElementById('user');
    const passwordField = document.getElementById('pass');


    if (!usernameField || !passwordField) return;

    const username = usernameField.value.trim(); // .trim() removes accidental spaces
    const password = passwordField.value.trim();


    if (username === "" || password === "") {
        alert("Please fill in both Username and Password fields.");
        return; 
    }

  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('/login', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            // Spring Security redirects to ?error on failure
            if (response.url && response.url.includes("error")) {
                alert("Login Failed: Incorrect Username or Password");
                return;
            }
            if (response.redirected || response.ok) {
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('dashboard').classList.remove('hidden');

                checkUserRole();
                loadMedicalRecords();
            } else {
                alert("Login Failed: Bad Credentials");
            }
        })
        .catch(error => console.error("Login error:", error));
}

let currentUserRole = "UNKNOWN";

function checkUserRole() {
    fetch('/api/user/role')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch role");
            return response.text();
        })
        .then(role => {
            console.log("Current User Role: " + role); 
            currentUserRole = role;

            // Update portal title dynamically
            const portalTitle = document.querySelector('nav h1');
            if (portalTitle) {
                if (role.includes('ADMIN')) portalTitle.innerText = "Admin Dashboard";
                else if (role.includes('DOCTOR')) portalTitle.innerText = "Doctor Portal";
                else portalTitle.innerText = "Patient Portal";
            }

            const doctorSection = document.getElementById('doctor-section');
            if (doctorSection) {
               
                if (role.includes('DOCTOR') || role.includes('ADMIN')) {
                    doctorSection.style.display = 'block';
                } else {
                    doctorSection.style.display = 'none';
                }
            }
        })
        .catch(error => console.error("Error checking role:", error));
}
function saveEntry() {
    const nameInput = document.getElementById('pName');
    const condInput = document.getElementById('pCond');
    const hospInput = document.getElementById('pHospital');
    const medInput  = document.getElementById('pMedication');
    const docInput  = document.getElementById('pDoctor');
    const durInput  = document.getElementById('pDuration');

    if (!nameInput.value || !condInput.value) {
        alert("Patient Name and Condition are required!");
        return;
    }

    const patientData = {
        patientName: nameInput.value,
        conditionName: condInput.value,
        hospitalName: hospInput.value,
        medication: medInput.value,
        doctorName: docInput.value,
        duration: durInput.value
    };

    fetch('/api/medical/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
    })
        .then(response => {
            if (response.ok) {
                alert("Record Saved Successfully!");
                // Clear inputs
                nameInput.value = ""; condInput.value = ""; hospInput.value = "";
                medInput.value = ""; docInput.value = ""; durInput.value = "";

                loadMedicalRecords(); // Refresh table
            } else {
                alert("Failed to save. Status: " + response.status);
            }
        })
        .catch(error => console.error("Error saving entry:", error));
}


function searchTable() {
    const query = document.getElementById('searchInput').value;

    const url = query ? `/api/medical/search?name=${encodeURIComponent(query)}` : '/api/medical/all';

    fetch(url)
        .then(response => response.json())
        .then(records => {
            populateTable(records);
        })
        .catch(error => console.error("Error searching:", error));
}


function loadMedicalRecords() {
    fetch('/api/medical/all')
        .then(response => response.json())
        .then(records => populateTable(records))
        .catch(error => console.error("Error loading records:", error));
}

function populateTable(records) {
    const tableBody = document.querySelector('tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No records found</td></tr>';
        return;
    }

    records.forEach(record => {
        let actionHtml = '-';
        if (currentUserRole.includes('ADMIN') || currentUserRole.includes('DOCTOR')) {
            actionHtml = `<button onclick="deleteEntry(${record.id})">Delete</button>`;
        }

        const row = `
            <tr>
                <td>${record.patientName}</td>
                <td>${record.conditionName}</td>
                <td>${record.hospitalName || '-'}</td>
                <td>${record.doctorName || '-'}</td>
                <td>${record.medication || '-'}</td>
                <td>${record.duration || '-'}</td>
                <td>${actionHtml}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}


function deleteEntry(id) {
    if(!confirm("Are you sure you want to delete this record?")) return;
    fetch('/api/medical/delete/' + id, { method: 'DELETE' })
        .then(response => {
            if(response.ok) searchTable(); 
        });
}

function logout() {
    window.location.href = "/logout";

}
