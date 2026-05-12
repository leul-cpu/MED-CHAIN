# MED-CHAIN: Secure Medical Records System

**MED-CHAIN** is a secure, full-stack application built with **Java**, **Spring Boot**, and Vanilla JS. It is designed to manage medical records securely, allowing medical personnel to manage patients while ensuring strict data privacy through JWT authentication and data segregation.

## 🚀 Tech Stack
* **Language:** Java 21
* **Framework:** Spring Boot 3.2.4
* **Security:** Spring Security (Stateless JWT Authentication)
* **Database:** MySQL & Spring Data JPA
* **Frontend:** HTML5, CSS3 (Glassmorphism UI), Vanilla JavaScript
* **Tools:** Maven, Lombok

## ⚙️ Features & Capabilities
* **JWT Authentication:** Secure, stateless login system using JSON Web Tokens.
* **Role-Based Access Control (RBAC):** `ADMIN`, `DOCTOR`, and `PATIENT` roles with distinct permissions.
* **Data Segregation:** Patients can *only* view their own medical history. Doctors and Admins have global access.
* **File Uploads:** Ability to attach PDF or image files to individual medical records.
* **Pagination & Sorting:** Optimized database queries utilizing Spring Data `Pageable` for large datasets.
* **Admin Dashboard:** Admins can dynamically create and remove users from the system.
* **Premium UI:** A modern, dark-themed glassmorphism frontend with animated backgrounds, modals, and toast notifications.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user and returns JWT token |

### Medical Records
| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/medical/all` | Paginated list of records (Segregated by User) | All Users |
| `GET` | `/api/medical/search?name=` | Search records by patient name (Paginated) | All Users |
| `POST` | `/api/medical/add` | Adds a new medical record | `ADMIN`, `DOCTOR` |
| `PUT` | `/api/medical/update/{id}` | Edits an existing record | `ADMIN`, `DOCTOR` |
| `POST` | `/api/medical/upload/{id}` | Uploads an attachment to a record | `ADMIN`, `DOCTOR` |
| `DELETE` | `/api/medical/delete/{id}` | Deletes a specific record | `ADMIN`, `DOCTOR` |

### User Management
| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List all system users | `ADMIN` |
| `POST` | `/api/admin/users` | Create a new user | `ADMIN` |
| `DELETE` | `/api/admin/users/{id}`| Delete a user | `ADMIN` |

## 🛠️ How to Run Locally

If you are a recruiter or developer wanting to test this application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/leul-cpu/MED-CHAIN.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd MED-CHAIN/MED-CHAIN-main
   ```
3. **Configure your Database:**
   Ensure you have MySQL running. The application is configured to create the database automatically if it does not exist. Check `src/main/resources/application.properties` to ensure the credentials match your MySQL setup:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/medical_pro_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
   *(Note: Update `spring.datasource.password` to match your local MySQL root password)*
4. **Run the Application:**
   Use the Maven wrapper to start the Spring Boot server:
   ```bash
   ./mvnw spring-boot:run
   ```
5. **Access the Application:**
   Open your browser and navigate to `http://localhost:8080/`. You can log in using the demo accounts automatically created on the first run (`admin`, `doctor`, `patient` - passwords match the usernames).
