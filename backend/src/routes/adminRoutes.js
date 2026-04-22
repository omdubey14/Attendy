import { Router } from "express";
import {
  classValidation,
  createClass,
  deleteClass,
  getDashboard,
  getReports,
  getSystemLogs,
  getUsers,
  statusValidation,
  updateClass,
  updateRegistrationStatus,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { cacheResponse } from "../middleware/cacheMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get(
  "/dashboard",
  cacheResponse(() => "admin-dashboard", 60),
  getDashboard
);
router.get("/users", getUsers);
router.patch(
  "/registrations/:id",
  statusValidation,
  validateRequest,
  updateRegistrationStatus
);
router.post("/classes", classValidation, validateRequest, createClass);
router.put("/classes/:id", updateClass);
router.delete("/classes/:id", deleteClass);
router.get("/reports", getReports);
router.get("/logs", getSystemLogs);

export default router;
