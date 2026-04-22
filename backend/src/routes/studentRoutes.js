import { Router } from "express";
import {
  downloadReportCard,
  getAttendance,
  getMarks,
  getNotifications,
  getProfile,
  getStudentDashboard,
  profileUpdateValidation,
  uploadAvatar,
  updateProfile,
} from "../controllers/studentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { cacheResponse } from "../middleware/cacheMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(protect, authorize("student"));

router.get("/dashboard", getStudentDashboard);
router.get(
  "/profile",
  cacheResponse((req) => `student-profile:${req.user._id}`, 60),
  getProfile
);
router.put("/profile", profileUpdateValidation, validateRequest, updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.get(
  "/attendance",
  cacheResponse((req) => `student-attendance:${req.user._id}`, 60),
  getAttendance
);
router.get("/marks", getMarks);
router.get("/notifications", getNotifications);
router.get("/report-card", downloadReportCard);

export default router;
