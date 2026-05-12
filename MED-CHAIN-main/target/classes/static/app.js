let currentUserRole = "UNKNOWN";
let currentPage = 0;
const pageSize = 10;
let currentRecords = [];

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("jwt_token");
    if (token) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.remove('hidden');
        checkUserRole();
        loadMedicalRecords();
    }
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getAuthHeaders(isFile = false) {
    const token = localStorage.getItem("jwt_token");
    const headers = { 'Authorization': `Bearer ${token}` };
    if (!isFile) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}

function login() {
    const usernameField = document.getElementById('user');
    const passwordField = document.getElementById('pass');
    if (!usernameField || !passwordField) return;

    const username = usernameField.value.trim();
    const password = passwordField.value.trim();

    if (username === "" || password === "") {
        showToast("Please fill in both Username and Password fields.", "error");
        return; 
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(async response => {
        if (!response.ok) throw new Error("Bad credentials");
        const data = await response.json();
        localStorage.setItem("jwt_token", data.token);
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.remove('hidden');

        checkUserRole();
        loadMedicalRecords();
    })
    .catch(error => showToast("Login Failed: Incorrect Username or Password", "error"));
}

function checkUserRole() {
    fetch('/api/user/role', { headers: getAuthHeaders() })
        .then(response => {
            if (!response.ok) {
                if(response.status === 401 || response.status === 403) logout();
                throw new Error("Failed to fetch role");
            }
            return response.text();
        })
        .then(role => {
            currentUserRole = role;
            const portalTitle = document.querySelector('nav h1');
            if (portalTitle) {
                if (role.includes('ADMIN')) portalTitle.innerText = "Admin Dashboard";
                else if (role.includes('DOCTOR')) portalTitle.innerText = "Doctor Portal";
                else portalTitle.innerText = "Patient Portal";
            }

            const doctorSection = document.getElementById('doctor-section');
            const adminUsersBtn = document.getElementById('admin-users-btn');
            if (role.includes('ADMIN')) {
                if(adminUsersBtn) adminUsersBtn.classList.remove('hidden');
            }
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
    const usernameInput  = document.getElementById('pUsername');
    const fileInput = document.getElementById('pFile');

    if (!nameInput.value || !condInput.value) {
        showToast("Patient Name and Condition are required!", "error");
        return;
    }

    const patientData = {
        patientName: nameInput.value,
        conditionName: condInput.value,
        hospitalName: hospInput.value,
        medication: medInput.value,
        doctorName: docInput.value,
        duration: durInput.value,
        patientUsername: usernameInput.value
    };

    fetch('/api/medical/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(patientData)
    })
    .then(async response => {
        if (!response.ok) throw new Error("Validation Error");
        const record = await response.json();
        
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            await fetch(`/api/medical/upload/${record.id}`, {
                method: 'POST',
                headers: getAuthHeaders(true),
                body: formData
            });
        }
        
        showToast("Record Saved Successfully!");
        nameInput.value = ""; condInput.value = ""; hospInput.value = "";
        medInput.value = ""; docInput.value = ""; durInput.value = ""; usernameInput.value = ""; fileInput.value = "";

        loadMedicalRecords(); 
    })
    .catch(error => showToast("Failed to save. Please check required fields.", "error"));
}

function searchTable() {
    const query = document.getElementById('searchInput').value;
    const url = query ? `/api/medical/search?name=${encodeURIComponent(query)}&page=${currentPage}&size=${pageSize}` 
                      : `/api/medical/all?page=${currentPage}&size=${pageSize}`;

    fetch(url, { headers: getAuthHeaders() })
        .then(response => {
            if(response.status === 401) logout();
            return response.json();
        })
        .then(data => {
            if(data.content) {
                currentRecords = data.content;
                populateTable(data.content);
                updatePaginationInfo(data);
            } else {
                currentRecords = data;
                populateTable(data);
            }
        })
        .catch(error => console.error("Error searching:", error));
}

function loadMedicalRecords() {
    searchTable();
}

function populateTable(records) {
    const tableBody = document.querySelector('tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No records found</td></tr>';
        return;
    }

    records.forEach(record => {
        let actionHtml = '-';
        if (currentUserRole.includes('ADMIN') || currentUserRole.includes('DOCTOR')) {
            actionHtml = `
                <button onclick="openEditModal(${record.id})" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">Edit</button>
                <button onclick="deleteEntry(${record.id})" style="margin-left: 5px;">Delete</button>
            `;
        }

        const attachHtml = record.attachmentPath ? `<a href="${record.attachmentPath}" target="_blank">View File</a>` : '-';

        const row = `
            <tr>
                <td>${record.patientName}</td>
                <td>${record.conditionName}</td>
                <td>${record.hospitalName || '-'}</td>
                <td>${record.doctorName || '-'}</td>
                <td>${record.medication || '-'}</td>
                <td>${record.duration || '-'}</td>
                <td>${attachHtml}</td>
                <td>${actionHtml}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteEntry(id) {
    if(!confirm("Are you sure you want to delete this record?")) return;
    fetch('/api/medical/delete/' + id, { method: 'DELETE', headers: getAuthHeaders() })
        .then(response => {
            if(response.ok) {
                showToast("Record deleted");
                loadMedicalRecords(); 
            }
        });
}

function nextPage() { currentPage++; loadMedicalRecords(); }
function prevPage() { if(currentPage > 0) { currentPage--; loadMedicalRecords(); } }

function updatePaginationInfo(pageData) {
    document.getElementById('page-info').innerText = `Page ${pageData.number + 1} of ${pageData.totalPages || 1}`;
    document.getElementById('btn-prev').disabled = pageData.first;
    document.getElementById('btn-next').disabled = pageData.last;
}

// EDIT MODAL
function openEditModal(id) {
    const record = currentRecords.find(r => r.id === id);
    if(!record) return;
    document.getElementById('eId').value = record.id;
    document.getElementById('eName').value = record.patientName;
    document.getElementById('eCond').value = record.conditionName;
    document.getElementById('eHospital').value = record.hospitalName || '';
    document.getElementById('eDoctor').value = record.doctorName || '';
    document.getElementById('eMedication').value = record.medication || '';
    document.getElementById('eDuration').value = record.duration || '';
    document.getElementById('eUsername').value = record.patientUsername || '';
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function submitEdit() {
    const id = document.getElementById('eId').value;
    const data = {
        patientName: document.getElementById('eName').value,
        conditionName: document.getElementById('eCond').value,
        hospitalName: document.getElementById('eHospital').value,
        doctorName: document.getElementById('eDoctor').value,
        medication: document.getElementById('eMedication').value,
        duration: document.getElementById('eDuration').value,
        patientUsername: document.getElementById('eUsername').value
    };

    fetch(`/api/medical/update/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    }).then(res => {
        if(res.ok) {
            showToast("Record updated");
            closeEditModal();
            loadMedicalRecords();
        } else {
            showToast("Failed to update record", "error");
        }
    });
}

// USER MANAGEMENT MODAL
function openUserModal() {
    document.getElementById('user-modal').classList.remove('hidden');
    loadUsers();
}
function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

function loadUsers() {
    fetch('/api/admin/users', { headers: getAuthHeaders() })
    .then(res => res.json())
    .then(users => {
        const tbody = document.getElementById('user-tbody');
        tbody.innerHTML = '';
        users.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.role}</td>
                    <td><button onclick="deleteUser(${u.id})">Delete</button></td>
                </tr>
            `;
        });
    });
}

function createUser() {
    const uName = document.getElementById('uName').value;
    const uPass = document.getElementById('uPass').value;
    const uRole = document.getElementById('uRole').value;
    
    if(!uName || !uPass) return showToast("Username and Password required", "error");

    fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({username: uName, password: uPass, role: uRole})
    }).then(res => {
        if(res.ok) {
            showToast("User created");
            loadUsers();
            document.getElementById('uName').value = '';
            document.getElementById('uPass').value = '';
        }
    });
}

function deleteUser(id) {
    if(!confirm("Delete user?")) return;
    fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() })
    .then(res => { if(res.ok) loadUsers(); });
}

function logout() {
    localStorage.removeItem("jwt_token");
    window.location.reload();
}
