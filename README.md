# 🎓 CampusFlow – Student Management System

CampusFlow is a full-stack student management system designed to simplify the management of student records through a clean and user-friendly interface. The application supports essential CRUD (Create, Read, Update, Delete) operations and uses Docker to containerize the frontend and backend for easier deployment.

## 🚀 Features

* **Student Management:** Add, view, edit, and delete student records.
* **CRUD Operations:** Perform Create, Read, Update, and Delete operations on student data.
* **Data Persistence:** Store student records in MongoDB so that changes remain available after refreshing the application.
* **REST API:** Communicate between the frontend and backend using REST API endpoints.
* **Responsive Interface:** Manage student records through a React-based user interface.
* **Docker Support:** Containerize the frontend and backend using Docker.
* **Docker Compose:** Build and run the application services with a single command.

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* Nginx

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB

### Containerization

* Docker
* Docker Compose

## 🏗️ Project Architecture

CampusFlow follows a frontend–backend–database architecture.

```text
                 User
                  |
                  v
          React Frontend
             + Nginx
                  |
                  | HTTP API Requests
                  v
          Express.js Backend
             + Node.js
                  |
                  | MongoDB Connection
                  v
              MongoDB
                  |
                  v
          Student Records
```

The React frontend communicates with the Express backend through API requests. The backend processes these requests and interacts with MongoDB to store and retrieve student information.

Docker containers are used to run the frontend and backend, while Docker Compose manages their configuration.

## 📂 Project Structure

```text
Student-Management-Docker/
│
├── backend/
│   ├── models/
│   │   └── Student.js
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── index.html
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

*Note: The structure above highlights the main project files. Other configuration and source files may also be present.*

## ⚙️ Prerequisites

Before running the project, ensure you have installed:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Git (optional, for cloning the repository)

The current Docker Compose configuration expects a MongoDB instance to be accessible on port `27017` of the Docker Desktop host. Ensure the existing MongoDB container is running before starting the application.

## 🐳 Running the Application with Docker

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd <YOUR_PROJECT_FOLDER>
```

Replace the placeholders with your actual repository URL and project folder name.

### 2. Start MongoDB

Ensure that your MongoDB container is running and accessible on port `27017`.

For the current configuration, the database connection is:

```text
mongodb://host.docker.internal:27017/campusflow
```

### 3. Build and Start the Application

Run the following command from the project root:

```bash
docker compose up --build -d
```

This command builds the frontend and backend Docker images and starts the application containers in the background.

### 4. Check the Containers

```bash
docker compose ps
```

The frontend and backend containers should be running.

### 5. Access the Application

Open the following addresses in your browser:

* **Frontend:** http://localhost:5174
* **Backend Health Check:** http://localhost:5001/api/health

The frontend is exposed on port `5174`, while the backend is exposed on port `5001`.

### 6. Stop the Application

To stop the frontend and backend containers, run:

```bash
docker compose down
```

This command does not remove the existing MongoDB container because MongoDB is managed separately in the current configuration.

To start the application again, use:

```bash
docker compose up -d
```

## 🔌 API Endpoints

The backend provides REST API endpoints for managing student records.

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/health`       | Check backend health     |
| GET    | `/api/students`     | Retrieve student records |
| GET    | `/api/students/:id` | Retrieve a student by ID |
| POST   | `/api/students`     | Add a new student        |
| PUT    | `/api/students/:id` | Update an exi            |
