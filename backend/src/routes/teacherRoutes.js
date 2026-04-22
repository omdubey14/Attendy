import { Router } from "express";
import {
  announcementValidation,
  attendanceValidation,
  getClasses,
  getStudents,
  getTeacherDashboard,
  markAttendance,
  marksValidation,
  sendAnnouncement,
  uploadMarks,
} from "../controllers/teacherController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/errorHandler.js";

const router = Router();

router.use(protect, authorize("teacher"));

router.get("/dashboard", getTeacherDashboard);
router.get("/students", getStudents);
router.get("/classes", getClasses);
router.post("/attendance", attendanceValidation, validateRequest, markAttendance);
router.post("/marks", marksValidation, validateRequest, uploadMarks);
router.post(
  "/announcements",
  announcementValidation,
  validateRequest,
  sendAnnouncement
);

export default router;
