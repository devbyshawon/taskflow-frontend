# TaskFlow — Team Project & Task Management App

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)

**Live Demo:** [https://taskflow-shawon.vercel.app](https://taskflow-shawon.vercel.app)  
**Backend Repository:** [https://github.com/devbyshawon/taskflow-backend](https://github.com/devbyshawon/taskflow-backend)

> ⚠️ The backend is hosted on Render's free tier. The first request after a period of inactivity may take 20–30 seconds due to a cold start. Subsequent requests will be fast.

---

## Screenshots

> ![Login Page](./screenshots/login.png)
> ![Dashboard](./screenshots/dashboard.png)
> ![Project Detail](./screenshots/project-detail.png)
> ![Add Task Form](./screenshots/add-task.png)
> ![Members Section](./screenshots/members.png)

---

## About The Project

TaskFlow is a full-stack team project and task management application built with the MERN stack. It allows users to create projects, invite team members, and manage tasks through a Kanban-style board with three stages — **To Do**, **In Progress**, and **Done**. Tasks can be assigned to specific team members, given due dates, and updated in real time without page refreshes.

The application features a role-based access control system where project admins have full control over project settings, task management, and member management, while regular members can update the status of tasks assigned to them. The project was built from scratch as a portfolio centerpiece, covering the complete development lifecycle from API design and database modeling to frontend state management and cloud deployment.

---

## Features

- **JWT Authentication** — Secure signup and login with bcrypt password hashing and JSON Web Token-based session management
- **Project Management** — Create, edit, and delete projects with persistent storage in MongoDB
- **Kanban Task Board** — Visual task board with three columns (To Do / In Progress / Done), color-coded status badges, and instant UI updates
- **Task Management** — Create tasks with title, description, assignee, and due date; edit and delete tasks with role-based permissions
- **Role-Based Access Control** — Project admins can manage all tasks, members, and project settings; regular members can only update tasks assigned to them
- **Member Management** — Add members by email, view member roles, and remove members from projects
- **Protected Routes** — Unauthenticated users are automatically redirected to the login page
- **Persistent Authentication** — Login state persists across page refreshes using localStorage and React Context
- **Responsive Design** — Fully responsive layout that works on both desktop and mobile devices
- **Form Validation** — Frontend validation with inline error messages for all forms, scoped per form to avoid cross-form interference
- **Loading States** — All API calls have loading indicators and disabled buttons to prevent duplicate submissions

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router DOM, Axios |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| State Management | React Context API |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | MongoDB Atlas |

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                 │
│  Pages: Login, Signup, Dashboard, Project Detail        │
│  State: AuthContext (JWT + user info)                   │
│  HTTP: Axios instance with request interceptor          │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS REST API
                           │ Authorization: Bearer <token>
┌──────────────────────────▼──────────────────────────────┐
│                 SERVER (Node.js + Express)               │
│  Auth Middleware: JWT verification                      │
│  Routes: /api/auth, /api/projects, /api/tasks           │
│  Controllers: authController, projectController,        │
│               taskController                            │
└──────────────────────────┬──────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────┐
│                  DATABASE (MongoDB Atlas)                │
│  Collections: users, projects, tasks                    │
│  Relationships: User → Projects → Tasks                 │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A MongoDB Atlas account (free tier)

### Installation

**1. Clone both repositories:**
```bash
git clone https://github.com/devbyshawon/taskflow-frontend
git clone https://github.com/devbyshawon/taskflow-backend
```

**2. Set up the backend:**
```bash
cd taskflow-backend
npm install
```

Create a `.env` file in the root of `taskflow-backend`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key
```

Start the backend server:
```bash
node server.js
```
The backend runs on `http://localhost:5001`

**3. Set up the frontend:**
```bash
cd taskflow-frontend
npm install
```

Update `src/services/api.js` to point to your local backend:
```javascript
baseURL: 'http://localhost:5001/api'
```

Start the frontend:
```bash
npm run dev
```
The frontend runs on `http://localhost:5173`

---

## Environment Variables

The following environment variables are required for the backend. Create a `.env` file in the `taskflow-backend` root directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/taskflow` |
| `JWT_SECRET` | Secret key used to sign JWT tokens | Any long random string |

> Never commit your `.env` file to GitHub. It is already included in `.gitignore`.

---

## API Overview

The full API documentation is available in the [backend repository](https://github.com/devbyshawon/taskflow-backend).

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| GET | `/api/projects` | Get all user's projects | Yes |
| POST | `/api/projects` | Create a new project | Yes |
| PUT | `/api/projects/:id` | Update a project | Yes (Admin) |
| DELETE | `/api/projects/:id` | Delete a project | Yes (Admin) |
| POST | `/api/projects/:id/members` | Add a member by email | Yes (Admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove a member | Yes (Admin) |
| GET | `/api/projects/:id/tasks` | Get all tasks for a project | Yes |
| POST | `/api/projects/:id/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes (Admin) |

---

## Author

**MD. Shawon Hossain (Arham)**  
Final-year CSE Student, BRAC University  
[GitHub](https://github.com/devbyshawon) · [LinkedIn](https://www.linkedin.com/in/devbyshawon-/)

---

## License

This project is open source and available under the [MIT License](LICENSE).
