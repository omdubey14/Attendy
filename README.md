<div align="center">
  <h1>🎓 Attendy</h1>
  <p>A comprehensive, full-stack Student Management System built with the MERN stack and Socket.io for real-time interactions.</p>

  <div>
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
  </div>
</div>

---

## 📖 Overview

**Attendy** is a production-ready Student Management System designed to streamline school operations, attendance tracking, and performance monitoring. It features role-based access control for Admins, Teachers, and Students, complete with a modern, responsive UI and real-time event notifications.

## ✨ Features

### 👨‍🎓 For Students
- **Dashboard Summary:** Get an overview of your academic standing.
- **Profile Management:** View and update your profile, including avatar uploads.
- **Attendance & Marks:** Keep track of your daily attendance and subject marks.
- **Real-time Notifications:** Instantly receive updates on attendance and marks.
- **Report Cards:** Download official PDF report cards generated on-the-fly.

### 👩‍🏫 For Teachers
- **Teacher Dashboard:** Overview of classes and student performance.
- **Class Management:** Filter and search through students easily.
- **Attendance Tracking:** Mark and update student attendance.
- **Grade Uploads:** Upload and manage student marks.
- **Announcements:** Send class-wide or school-wide announcements.

### 🛡️ For Administrators
- **System Analytics:** Visual charts showing class strength and performance.
- **User Management:** Review, approve, or reject user registrations.
- **Class Creation:** Manage school infrastructure and classes.
- **System Logs & Reports:** Review system logs and comprehensive reports.

## 🛠️ Tech Stack

### Frontend
- **React (Vite):** Blazing fast development and optimized builds.
- **Tailwind CSS:** Utility-first styling for a sleek, responsive design.
- **Framer Motion:** Smooth UI transitions and micro-animations.
- **Recharts:** Interactive and customizable data visualization.
- **React Router & React Hook Form:** Seamless navigation and robust form handling.

### Backend
- **Node.js & Express:** Scalable API architecture with MVC pattern.
- **MongoDB & Mongoose:** Flexible schema design for user data and school records.
- **Socket.io:** Real-time bidirectional event-based communication.
- **JWT & bcrypt:** Secure authentication and password hashing.
- **PDFKit & Multer:** Dynamic PDF generation and robust file uploads.
- **Security:** Helmet headers, rate limiting, and input validation.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/attendy.git
   cd attendy
   ```

2. **Install Dependencies:**

   You can use the provided package scripts to install dependencies for both frontend and backend:
   ```bash
   npm run install:backend
   npm run install:frontend
   ```

3. **Environment Setup:**

   Navigate to the `backend/` directory and create a `.env` file based on `.env.example`:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Do the same for the `frontend/` directory:
   ```bash
   cd ../frontend
   cp .env.example .env
   ```

4. **Seed the Database (Optional):**
   Seed the database with dummy data for testing purposes.
   ```bash
   cd .. # Back to root Attendy directory
   npm run seed
   ```

5. **Start the Development Servers:**
   Run the backend:
   ```bash
   npm run dev:backend
   ```
   Run the frontend:
   ```bash
   npm run dev:frontend
   ```

## 🔐 Authentication Flow

1. **Registration:** Users register as either a student or teacher. Their account is set to `pending`.
2. **Approval:** An Admin reviews and approves the registration.
3. **Login:** Approved users log in to receive a JWT token.
4. **Access:** The token is sent with API requests to access protected routes based on their role (`admin`, `teacher`, `student`).

## 🔮 Future Improvements

- [ ] Cloudinary integration for scalable media storage.
- [ ] Redis caching for faster API response times.
- [ ] Refresh tokens and secure HTTP-only cookie authentication.
- [ ] Comprehensive unit and integration test coverage.
- [ ] CSV export functionality for reports.
- [ ] Additional modules for timetable scheduling and fee management.

---

<div align="center">
  <p>Built with ❤️ for better education management.</p>
</div>
