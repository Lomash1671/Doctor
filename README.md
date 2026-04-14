# MedCare Pro - Clinic Management System

A full-stack modern Clinic Management System built with the MERN stack (MongoDB, Express, React, Node.js). Features a beautiful glassmorphism UI, robust authentication, comprehensive CRUD operations, and an intelligent "Offline Mode" mock data fallback.

## 🚀 Features
- **Secure Authentication**: JWT-based authentication with session storage for maximum security.
- **Glassmorphism UI**: Beautiful, premium, and fully responsive user interface context.
- **Offline Mode Fallback**: App gracefully functions using local dummy data if backend API drops.
- **Doctor & Patient Management**: Full CRUD capabilities for medical professionals and their patients.
- **Visits/Scheduling**: Track and schedule appointments seamlessly.

## 📦 Project Structure
- `/frontend` - React application built with Vite
- `/backend` - Node.js & Express REST API Server

## ⚙️ Setup Instructions

### 1. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

**Environment Variables**:
Create a `.env` file in the `backend/` directory using the provided example:
```bash
cp .env.example .env
```
Fill in the following variables in your new `backend/.env` file:
- `PORT=5000`
- `MONGODB_URI=your_mongodb_connection_string` *(Get this from MongoDB Atlas)*
- `JWT_SECRET=your_super_secret_key`

**Seed Database (Optional)**:
You can import initial data (admin users) using the seeder script:
```bash
npm run data:import
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

## 🔑 Demo Access
When the application is running, you can log in easily utilizing the built-in offline mock fallback:
**Email:** `test@doctor.com`
**Password:** `123456`
