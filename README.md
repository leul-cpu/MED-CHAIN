# MED-CHAIN: Medical Record API

**MED-CHAIN** is a secure, backend RESTful API built with **Java** and **Spring Boot**. It is designed to manage medical records, allowing authorized medical personnel (Doctors and Admins) to add and delete patient records, while providing search capabilities.

> **Note:** This repository contains the **backend code** for the application. It is not a static website, so it is not hosted on GitHub Pages. You can clone this repository to run the API locally or deploy it to a backend hosting service (like Render, Heroku, or AWS).

## 🚀 Tech Stack
* **Language:** Java 21
* **Framework:** Spring Boot 3.2.4
* **Security:** Spring Security
* **Database:** MySQL & Spring Data JPA
* **Tools:** Maven, Lombok

## ⚙️ Features & Capabilities
* **Role-Based Access Control (RBAC):** Uses Spring Security to ensure only users with `ADMIN` or `DOCTOR` roles can modify or delete records.
* **RESTful Endpoints:** Clean and structured API endpoints for CRUD operations.
* **Database Integration:** Configured to work seamlessly with a MySQL relational database.

## 📡 API Endpoints

Here are the primary endpoints available in this application:

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/role` | Returns the current user's role | All Authenticated Users |
| `POST` | `/api/medical/add` | Adds a new medical record | `ADMIN`, `DOCTOR` |
| `GET` | `/api/medical/all` | Retrieves a list of all medical records | All Users |
| `DELETE` | `/api/medical/delete/{id}` | Deletes a specific medical record by ID | `ADMIN`, `DOCTOR` |
| `GET` | `/api/medical/search?name=` | Searches for records by patient name | All Users |

## 🛠️ How to Run Locally

If you are a recruiter or developer wanting to test this API locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/MED-CHAIN.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd MED-CHAIN/MED-CHAIN-main
   ```
3. **Configure your Database:**
   Ensure you have MySQL running. Open `src/main/resources/application.properties` (or `application.yml`) and update your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
4. **Run the Application:**
   Use the Maven wrapper to start the Spring Boot server:
   ```bash
   ./mvnw spring-boot:run
   ```
5. **Test the Endpoints:**
   You can now use tools like **Postman** or **cURL** to send requests to `http://localhost:8080/api/...`
