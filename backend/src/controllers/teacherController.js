import { body } from "express-validator";
import { Announcement } from "../models/Announcement.js";
import { Attendance } from "../models/Attendance.js";
import { ClassRoom } from "../models/ClassRoom.js";
import { Mark } from "../models/Mark.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { buildPagination } from "../utils/paginate.js";
import { createLog } from "../services/logService.js";
import { sendNotification } from "../services/notificationService.js";
import { delCache } from "../utils/cache.js";
import { getSocket } from "../config/socket.js";

const calculateGrade = (score, maximumScore) => {
  const percentage = (score / maximumScore) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

export const attendanceValidation = [
  body("records").isArray({ min: 1 }).withMessage("Attendance records are required"),
];

export const marksValidation = [
  body("studentId").notEmpty().withMessage("Student is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("examType").notEmpty().withMessage("Exam type is required"),
  body("score").isNumeric().withMessage("Score must be numeric"),
];

export const announcementValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

export const getTeacherDashboard = asyncHandler(async (req, res) => {
  const [classes, attendanceCount, marksCount, announcements] = await Promise.all([
    ClassRoom.find({ classTeacher: req.user._id }).lean(),
    Attendance.countDocuments({ teacher: req.user._id }),
    Mark.countDocuments({ teacher: req.user._id }),
    Announcement.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).limit(5),
  ]);

  return res.status(200).json(
    apiResponse({
      data: {
        stats: {
          classesAssigned: classes.length,
          attendanceMarked: attendanceCount,
          marksUploaded: marksCount,
        },
        classes,
        announcements,
      },
    })
  );
});

export const getStudents = asyncHandler(async (req, res) => {
  const { search = "", className = "", page = 1, limit = 10 } = req.query;
  const pagination = buildPagination({ page, limit });

  const profileFilter = {};
  if (className) profileFilter.className = className;
  if (search) {
    profileFilter.$or = [
      { admissionNumber: { $regex: search, $options: "i" } },
      { guardianName: { $regex: search, $options: "i" } },
    ];
  }

  const studentProfiles = await StudentProfile.find(profileFilter)
    .populate({
      path: "user",
      select: "name email phone avatar status",
    })
    .lean();

  const filteredProfiles = studentProfiles
    .filter((item) => item.user)
    .filter((item) => {
      if (!search) return true;
      return (
        item.user.name.toLowerCase().includes(String(search).toLowerCase()) ||
        item.user.email.toLowerCase().includes(String(search).toLowerCase()) ||
        item.admissionNumber.toLowerCase().includes(String(search).toLowerCase())
      );
    });

  const paginatedData = filteredProfiles.slice(
    pagination.skip,
    pagination.skip + pagination.limit
  );

  return res.status(200).json(
    apiResponse({
      data: paginatedData,
      meta: {
        total: filteredProfiles.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(filteredProfiles.length / pagination.limit) || 1,
      },
    })
  );
});

export const markAttendance = asyncHandler(async (req, res) => {
  const results = [];

  for (const record of req.body.records) {
    const savedRecord = await Attendance.findOneAndUpdate(
      {
        student: record.studentId,
        subject: record.subject,
        date: record.date,
      },
      {
        student: record.studentId,
        teacher: req.user._id,
        className: record.className,
        subject: record.subject,
        date: record.date,
        status: record.status,
        remarks: record.remarks || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    results.push(savedRecord);

    await sendNotification({
      recipient: record.studentId,
      title: "Attendance Updated",
      message: `Your ${record.subject} attendance for ${record.date} is marked as ${record.status}.`,
      category: "attendance",
      metadata: { date: record.date, subject: record.subject },
    });

    try {
      const io = getSocket();
      io.to(`user:${record.studentId}`).emit("attendance:updated", savedRecord);
    } catch (_error) {
      // Ignore socket errors when the server is not active.
    }
  }

  const impactedStudents = req.body.records.map((record) => `student-attendance:${record.studentId}`);
  delCache(impactedStudents);

  await createLog({
    actor: req.user._id,
    action: "ATTENDANCE_MARKED",
    targetType: "Attendance",
    details: { count: results.length },
  });

  return res.status(200).json(
    apiResponse({
      message: "Attendance saved successfully",
      data: results,
    })
  );
});

export const uploadMarks = asyncHandler(async (req, res) => {
  const { studentId, subject, examType, score, maximumScore = 100, remarks = "" } =
    req.body;

  const grade = calculateGrade(Number(score), Number(maximumScore));
  const mark = await Mark.findOneAndUpdate(
    { student: studentId, subject, examType },
    {
      student: studentId,
      teacher: req.user._id,
      subject,
      examType,
      score,
      maximumScore,
      grade,
      remarks,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await sendNotification({
    recipient: studentId,
    title: "Marks Uploaded",
    message: `${subject} ${examType} marks updated. You scored ${score}/${maximumScore}.`,
    category: "marks",
    metadata: { subject, examType },
  });

  await createLog({
    actor: req.user._id,
    action: "MARKS_UPLOADED",
    targetType: "Mark",
    targetId: mark._id.toString(),
    details: { studentId, subject, examType },
  });

  return res.status(201).json(
    apiResponse({
      message: "Marks uploaded successfully",
      data: mark,
    })
  );
});

export const sendAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, audience = "students" } = req.body;

  const announcement = await Announcement.create({
    title,
    message,
    audience,
    createdBy: req.user._id,
  });

  const recipientFilter = {};
  if (audience === "students") recipientFilter.role = "student";
  if (audience === "teachers") recipientFilter.role = "teacher";

  const recipients = await User.find(recipientFilter).select("_id");
  await Promise.all(
    recipients.map((user) =>
      sendNotification({
        recipient: user._id,
        title,
        message,
        category: "announcement",
        metadata: { announcementId: announcement._id },
      })
    )
  );

  await createLog({
    actor: req.user._id,
    action: "ANNOUNCEMENT_SENT",
    targetType: "Announcement",
    targetId: announcement._id.toString(),
    details: { audience },
  });

  return res.status(201).json(
    apiResponse({
      message: "Announcement sent successfully",
      data: announcement,
    })
  );
});

export const getClasses = asyncHandler(async (req, res) => {
  const classes = await ClassRoom.find({
    $or: [{ classTeacher: req.user._id }, { classTeacher: null }],
  }).lean();

  return res.status(200).json(apiResponse({ data: classes }));
});
