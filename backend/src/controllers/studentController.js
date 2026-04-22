import { body } from "express-validator";
import { Attendance } from "../models/Attendance.js";
import { Mark } from "../models/Mark.js";
import { Notification } from "../models/Notification.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateReportCardPdf } from "../utils/pdfGenerator.js";
import { createLog } from "../services/logService.js";
import { delCache } from "../utils/cache.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

const buildAttendanceSummary = (attendance) =>
  attendance.reduce(
    (accumulator, item) => {
      accumulator[item.status] += 1;
      return accumulator;
    },
    { present: 0, absent: 0, late: 0 }
  );

export const profileUpdateValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("phone").optional().isString(),
];

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const [student, attendance, marks, notifications] = await Promise.all([
    User.findById(req.user._id).lean(),
    Attendance.find({ student: req.user._id }).sort({ date: -1 }).limit(8).lean(),
    Mark.find({ student: req.user._id }).sort({ createdAt: -1 }).lean(),
    Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(5),
  ]);

  return res.status(200).json(
    apiResponse({
      data: {
        student,
        attendance,
        marks,
        notifications,
        summary: {
          attendance: buildAttendanceSummary(attendance),
          averageMarks:
            marks.length > 0
              ? (
                  marks.reduce((total, mark) => total + mark.score, 0) / marks.length
                ).toFixed(2)
              : 0,
        },
      },
    })
  );
});

export const getProfile = asyncHandler(async (req, res) => {
  const [user, profile] = await Promise.all([
    User.findById(req.user._id).lean(),
    StudentProfile.findOne({ user: req.user._id }).lean(),
  ]);

  return res.status(200).json(apiResponse({ data: { ...user, profile } }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, gender, avatar, profile = {} } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, gender, avatar },
    { new: true }
  ).lean();

  const updatedProfile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      guardianName: profile.guardianName,
      guardianPhone: profile.guardianPhone,
      address: profile.address,
      bloodGroup: profile.bloodGroup,
      dateOfBirth: profile.dateOfBirth,
    },
    { new: true }
  ).lean();

  delCache([`student-profile:${req.user._id}`, `student-attendance:${req.user._id}`]);

  await createLog({
    actor: req.user._id,
    action: "STUDENT_PROFILE_UPDATED",
    targetType: "User",
    targetId: req.user._id.toString(),
  });

  return res.status(200).json(
    apiResponse({
      message: "Profile updated successfully",
      data: { ...updatedUser, profile: updatedProfile },
    })
  );
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarUrl = `/${env.uploadDir}/${req.file.filename}`;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true }
  ).lean();

  delCache([`student-profile:${req.user._id}`]);

  return res.status(200).json(
    apiResponse({
      message: "Avatar uploaded successfully",
      data: updatedUser,
    })
  );
});

export const getAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ student: req.user._id })
    .sort({ date: -1 })
    .lean();

  return res.status(200).json(
    apiResponse({
      data: attendance,
      meta: { summary: buildAttendanceSummary(attendance) },
    })
  );
});

export const getMarks = asyncHandler(async (req, res) => {
  const marks = await Mark.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(apiResponse({ data: marks }));
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(apiResponse({ data: notifications }));
});

export const downloadReportCard = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id).lean();
  const [profile, marks, attendance] = await Promise.all([
    StudentProfile.findOne({ user: req.user._id }).lean(),
    Mark.find({ student: req.user._id }).lean(),
    Attendance.find({ student: req.user._id }).lean(),
  ]);

  const attendanceSummary = buildAttendanceSummary(attendance);
  const pdfBuffer = await generateReportCardPdf({
    student: { ...student, studentProfile: profile },
    marks,
    attendance: attendanceSummary,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report-card.pdf");
  res.send(pdfBuffer);
});
