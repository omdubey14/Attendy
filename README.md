# Student Management System

A production-ready MERN Student Management System built with:

- React + Tailwind CSS + React Hook Form
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication with role-based access
- Socket.io for real-time notifications and attendance updates
- Local file uploads for student avatars

## Features

- Student panel
  - Register and login
  - View and update profile
  - View attendance
  - View marks
  - Download report card as PDF
  - Receive real-time notifications
- Teacher panel
  - Login
  - View students list with search/filter/pagination
  - Mark attendance by subject and date
  - Upload marks
  - Send announcements
- Admin panel
  - Dashboard with analytics and charts
  - Manage users and registration approvals
  - Create classes
  - Review reports
  - Audit system logs

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seeders/
    services/
    utils/
frontend/
  src/
    components/
    context/
    hooks/
    pages/
    services/
    utils/
docs/
```

## Setup

### 1. Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

Update `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/student_management_system
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CACHE_TTL=120
UPLOAD_DIR=uploads
```

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
```

Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Seed dummy data

Make sure MongoDB is running locally, then:

```bash
cd backend
npm run seed
```

Demo credentials:

- Admin: `admin@sms.com` / `admin123`
- Teacher: `teacher@sms.com` / `teacher123`
- Student: `student1@sms.com` / `student123`

### 4. Start the apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Important API Areas

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/students/dashboard`
- `GET /api/v1/students/attendance`
- `GET /api/v1/students/marks`
- `GET /api/v1/students/report-card`
- `POST /api/v1/teachers/attendance`
- `POST /api/v1/teachers/marks`
- `POST /api/v1/teachers/announcements`
- `GET /api/v1/admin/dashboard`
- `PATCH /api/v1/admin/registrations/:id`

## Verification

- Backend module load verified successfully
- Frontend production build verified successfully with `npm run build`
- Backend syntax checked with `node --check`

## Notes

- File uploads use local storage through Multer
- Real-time updates use Socket.io rooms per user
- API caching uses in-memory NodeCache for frequently requested read endpoints
- Passwords are hashed with bcrypt
- Security middleware includes Helmet, CORS, compression, and rate limiting

For a beginner-friendly implementation walkthrough, see [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md).
