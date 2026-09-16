# CareWash - Doorstep Car Wash Application

A full-stack web application designed for booking premium doorstep car wash services. The architecture is built to be scalable for future automotive services (detailing, PPF, etc).

## Technologies Used

### Backend
- Java 21
- Spring Boot 3.x
- MySQL
- Spring Security + JWT
- Spring Data JPA
- Maven

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Lucide React (Icons)

## Setup Instructions

### Prerequisites
- JDK 21
- Maven
- Node.js (v18+)
- MySQL Server

### 1. Database Setup
Ensure you have a MySQL server running locally on port 3306.
Create a database named `MotorMate`.
```sql
CREATE DATABASE IF NOT EXISTS MotorMate;
```

### 2. Backend Setup
1. Open terminal and navigate to the `backend` directory.
2. The application is configured to connect to MySQL on `127.0.0.1:3306` with database `MotorMate`, username `root`. You can override the credentials using environment variables if needed:
   - `DB_USERNAME=yourusername`
   - `DB_PASSWORD=yourpassword`
3. Run the application:
```bash
cd backend
mvn spring-boot:run
```
The backend API will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install the dependencies:
```bash
cd frontend
npm install
```
3. Start the Vite development server:
```bash
npm run dev
```
The frontend application will start on `http://localhost:5173`.

## Architecture Details
- **Generic Services Model:** The `Service` entity is designed generically (Name, Price, Duration) so that adding "Ceramic Coating" or "Interior Detailing" later requires zero schema changes.
- **Role Based Auth:** Supports `CUSTOMER`, `ADMIN`, `SERVICE_PROVIDER`. Phase 1 APIs are primarily Customer-facing.
- **JWT Protection:** State-less JWT authentication for protected routes (bookings, profile).

## Sample API Requests

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"9876543210"}'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 3. Fetch Active Services (Public)
```bash
curl -X GET http://localhost:8080/api/services
```
