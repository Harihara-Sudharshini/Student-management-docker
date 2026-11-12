# 🎓 CampusFlow – Student Management System

CampusFlow is a full-stack student management system designed to simplify the management of student records through a clean and user-friendly interface. The application supports CRUD (Create, Read, Update, Delete) operations and uses Docker to containerize the frontend and backend.

The project also demonstrates container orchestration and application deployment using **Kubernetes and Minikube**.

## 🚀 Features

- **Student Management:** Add, view, edit, and delete student records.
- **CRUD Operations:** Perform Create, Read, Update, and Delete operations.
- **Data Persistence:** Store student records in MongoDB.
- **REST API:** Communicate between frontend and backend using REST API endpoints.
- **Responsive Interface:** Manage student records through a React-based interface.
- **Docker Support:** Containerize frontend and backend using Docker.
- **Docker Compose:** Build and run application services with a single command.
- **Kubernetes Deployment:** Deploy application components using Kubernetes Deployments and Services.
- **Database Integration:** Connect the backend to MongoDB.

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- Nginx

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB

### Containerization and Deployment
- Docker
- Docker Compose
- Kubernetes
- Minikube

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

Docker containers are used to run the application components, while Docker Compose manages the containers. Kubernetes is used to deploy and manage the application components in Minikube.

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
├── deployment.yaml
├── service.yaml
├── backend-deployment.yaml
├── backend-service.yaml
├── mongodb-deployment.yaml
├── mongodb-service.yaml
├── docker-compose.yml
├── .gitignore
└── README.md
```

*Note: This structure highlights the main project files. Additional configuration and source files may also be present.*

## ⚙️ Prerequisites

Before running the project, ensure you have installed:

- Docker Desktop
- Git
- kubectl
- Minikube

Ensure Docker Desktop is running before executing Docker commands.

## 🐳 Running the Application with Docker

### 1. Clone the Repository

```bash
git clone https://github.com/Harihara-Sudharshini/Student-management-docker.git
```

Navigate into the project directory:

```bash
cd Student-management-docker
```

### 2. Start MongoDB

Ensure that your MongoDB container is running and accessible on port `27017`.

The current database connection configuration uses:

```text
mongodb://host.docker.internal:27017/campusflow
```

### 3. Build and Start the Application

Run the following command from the project root:

```bash
docker compose up --build -d
```

### 4. Check the Containers

```bash
docker compose ps
```

### 5. Access the Application

- **Frontend:** http://localhost:5174
- **Backend Health Check:** http://localhost:5001/api/health

### 6. View Application Logs

```bash
docker compose logs
```

### 7. Stop the Application

```bash
docker compose down
```

This command stops the frontend and backend containers without removing the separately managed MongoDB container.

## 🐳 Docker Hub Images

The application Docker images are published on Docker Hub.

| Component | Docker Hub Image |
|---|---|
| Frontend | `sudharshh/studentmanagement-frontend:latest` |
| Backend | `sudharshh/studentmanagement-backend:latest` |

Docker Hub: https://hub.docker.com/u/sudharshh

## ☸️ Kubernetes Deployment Using Minikube

The application is configured for deployment using Kubernetes YAML files.

### 1. Start Minikube

```bash
minikube start
```

### 2. Check the Kubernetes Cluster

```bash
kubectl get nodes
```

### 3. Deploy MongoDB

```bash
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml
```

### 4. Deploy the Backend

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
```

### 5. Deploy the Frontend

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### 6. Verify Kubernetes Resources

Check deployments:

```bash
kubectl get deployments
```

Check Pods:

```bash
kubectl get pods
```

Check Services:

```bash
kubectl get services
```

### 7. Access the Frontend

Get the Minikube IP:

```bash
minikube ip
```

Check the frontend NodePort:

```bash
kubectl get services
```

Open the application using:

```text
http://<MINIKUBE-IP>:<NODE-PORT>
```

The frontend Service is configured to expose port `30080`.

## 🔌 API Endpoints

The backend provides REST API endpoints for managing student records.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/students` | Retrieve all student records |
| GET | `/api/students/:id` | Retrieve a student by ID |
| POST | `/api/students` | Add a new student |
| PUT | `/api/students/:id` | Update an existing student |
| DELETE | `/api/students/:id` | Delete a student |

## 🐳 Docker Architecture

The application consists of three main components:

- **Frontend:** Serves the React application using Nginx.
- **Backend:** Runs the Express.js application and provides API endpoints.
- **Database:** Stores student records in MongoDB.

Docker Compose manages the services and their communication.

## ☸️ Kubernetes Architecture

Kubernetes manages the application components through:

- **Deployments:** Manage frontend, backend, and MongoDB Pods.
- **Services:** Enable communication between application components.
- **NodePort:** Exposes the frontend application for external access.
- **ClusterIP:** Enables internal communication between services.
- **Minikube:** Provides a local Kubernetes environment for deployment and testing.

## 📚 Learning Outcomes

- Understanding full-stack application architecture.
- Creating Dockerfiles for frontend and backend services.
- Configuring services using Docker Compose.
- Connecting a Node.js backend to MongoDB.
- Implementing CRUD operations.
- Building and publishing Docker images.
- Creating Kubernetes Deployment YAML files.
- Creating Kubernetes Service YAML files.
- Deploying applications using Minikube.
- Understanding Kubernetes Pods, Deployments, and Services.

## 👩‍💻 Author

**Harihara Sudharshini S**
