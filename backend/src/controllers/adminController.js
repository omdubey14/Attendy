import { body } from "express-validator";
import { Announcement } from "../models/Announcement.js";
import { Attendance } from "../models/Attendance.js";
import { ClassRoom } from "../models/ClassRoom.js";
import { Mark } from "../models/Mark.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { SystemLog } from "../models/SystemLog.js";
import { TeacherProfile } from "../models/TeacherProfile.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { buildPagination } from "../utils/paginate.js";
import { USER_STATUS } from "../utils/constants.js";
import { createLog } from "../services/logService.js";
import { delCache } from "../utils/cache.js";

export const classValidation = [
  body("name").notEmpty().withMessage("Class name is required"),
];

export const statusValidation = [
  body("status")
    .isIn([USER_STATUS.APPROVED, USER_STATUS.REJECTED])
    .withMessage("Status must be approved or rejected"),
];

export const getDashboard = asyncHandler(async (_req, res) => {
  const [students, teachers, pendingApprovals, classCount, attendanceCount, marksCount] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ status: USER_STATUS.PENDING }),
      ClassRoom.countDocuments(),
      Attendance.countDocuments(),
      Mark.countDocuments(),
    ]);

  const classBreakdown = await StudentProfile.aggregate([
    { $group: { _id: "$className", students: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const performanceBreakdown = await Mark.aggregate([
    { $group: { _id: "$subject", averageScore: { $avg: "$score" } } },
    { $sort: { _id: 1 } },
  ]);

  return res.status(200).json(
    apiResponse({
      data: {
        stats: {
          students,
          teachers,
          pendingApprovals,
          classCount,
          attendanceCount,
          marksCount,
        },
        charts: {
          classBreakdown,
          performanceBreakdown,
        },
      },
    })
  );
});

export const getUsers = asyncHandler(async (req, res) => {
  const { role = "", status = "", search = "", page = 1, limit = 10 } = req.query;
  const pagination = buildPagination({ page, limit });

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    apiResponse({
      data: users,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    })
  );
});

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).lean();

  delCache(["admin-dashboard"]);

  await createLog({
    actor: req.user._id,
    action: "REGISTRATION_STATUS_UPDATED",
    targetType: "User",
    targetId: req.params.id,
    details: { status },
  });

  return res.status(200).json(
    apiResponse({
      message: `Registration ${status} successfully`,
      data: user,
    })
  );
});

export const createClass = asyncHandler(async (req, res) => {
  const classRoom = await ClassRoom.create(req.body);
  delCache(["admin-dashboard"]);

  await createLog({
    actor: req.user._id,
    action: "CLASS_CREATED",
    targetType: "ClassRoom",
    targetId: classRoom._id.toString(),
  });

  return res.status(201).json(
    apiResponse({ message: "Class created successfully", data: classRoom })
  );
});

export const updateClass = asyncHandler(async (req, res) => {
  const classRoom = await ClassRoom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).lean();

  await createLog({
    actor: req.user._id,
    action: "CLASS_UPDATED",
    targetType: "ClassRoom",
    targetId: req.params.id,
  });

  return res.status(200).json(
    apiResponse({ message: "Class updated successfully", data: classRoom })
  );
});

export const deleteClass = asyncHandler(async (req, res) => {
  await ClassRoom.findByIdAndDelete(req.params.id);

  await createLog({
    actor: req.user._id,
    action: "CLASS_DELETED",
    targetType: "ClassRoom",
    targetId: req.params.id,
  });

  return res.status(200).json(apiResponse({ message: "Class deleted successfully" }));
});

export const getReports = asyncHandler(async (_req, res) => {
  const [announcements, classCount, studentProfiles, teacherProfiles] = await Promise.all([
    Announcement.find().sort({ createdAt: -1 }).limit(10).lean(),
    ClassRoom.countDocuments(),
    StudentProfile.find().sort({ createdAt: -1 }).limit(10).lean(),
    TeacherProfile.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return res.status(200).json(
    apiResponse({
      data: {
        announcements,
        classCount,
        recentStudentProfiles: studentProfiles,
        recentTeacherProfiles: teacherProfiles,
      },
    })
  );
});

export const getSystemLogs = asyncHandler(async (req, res) => {
  const pagination = buildPagination({
    page: req.query.page || 1,
    limit: req.query.limit || 10,
  });

  const [logs, total] = await Promise.all([
    SystemLog.find()
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    SystemLog.countDocuments(),
  ]);

  return res.status(200).json(
    apiResponse({
      data: logs,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    })
  );
});
