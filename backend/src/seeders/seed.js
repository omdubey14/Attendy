import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { TeacherProfile } from "../models/TeacherProfile.js";
import { ClassRoom } from "../models/ClassRoom.js";
import { Attendance } from "../models/Attendance.js";
import { Mark } from "../models/Mark.js";
import { Notification } from "../models/Notification.js";
import { Announcement } from "../models/Announcement.js";
import { SystemLog } from "../models/SystemLog.js";
import { ROLES, USER_STATUS } from "../utils/constants.js";

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    TeacherProfile.deleteMany({}),
    ClassRoom.deleteMany({}),
    Attendance.deleteMany({}),
    Mark.deleteMany({}),
    Notification.deleteMany({}),
    Announcement.deleteMany({}),
    SystemLog.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "System Admin",
    email: "admin@sms.com",
    password: "admin123",
    role: ROLES.ADMIN,
    status: USER_STATUS.APPROVED,
    phone: "9999999999",
  });

  // const teacher = await User.create({
  //   name: "Anita Sharma",
  //   email: "teacher@sms.com",
  //   password: "teacher123",
  //   role: ROLES.TEACHER,
  //   status: USER_STATUS.APPROVED,
  //   phone: "8888888888",
  // });

  // await TeacherProfile.create({
  //   user: teacher._id,
  //   employeeId: "EMP-001",
  //   department: "Science",
  //   qualification: "M.Sc, B.Ed",
  //   subjects: ["Physics", "Mathematics"],
  // });

  // const studentOne = await User.create({
  //   name: "Rahul Verma",
  //   email: "student1@sms.com",
  //   password: "student123",
  //   role: ROLES.STUDENT,
  //   status: USER_STATUS.APPROVED,
  //   phone: "7777777777",
  // });

  // const studentTwo = await User.create({
  //   name: "Sneha Gupta",
  //   email: "student2@sms.com",
  //   password: "student123",
  //   role: ROLES.STUDENT,
  //   status: USER_STATUS.APPROVED,
  //   phone: "6666666666",
  // });

  // await StudentProfile.insertMany([
  //   {
  //     user: studentOne._id,
  //     admissionNumber: "ADM-1001",
  //     className: "10",
  //     section: "A",
  //     guardianName: "Rakesh Verma",
  //     guardianPhone: "7000000001",
  //     address: "Delhi",
  //     bloodGroup: "B+",
  //   },
  //   {
  //     user: studentTwo._id,
  //     admissionNumber: "ADM-1002",
  //     className: "10",
  //     section: "A",
  //     guardianName: "Meena Gupta",
  //     guardianPhone: "7000000002",
  //     address: "Jaipur",
  //     bloodGroup: "O+",
  //   },
  // ]);

  // await ClassRoom.create({
  //   name: "10",
  //   section: "A",
  //   subjects: ["Physics", "Mathematics", "English"],
  //   classTeacher: teacher._id,
  //   capacity: 45,
  // });

  // await Attendance.insertMany([
  //   {
  //     student: studentOne._id,
  //     teacher: teacher._id,
  //     className: "10",
  //     subject: "Physics",
  //     date: "2026-04-10",
  //     status: "present",
  //   },
  //   {
  //     student: studentTwo._id,
  //     teacher: teacher._id,
  //     className: "10",
  //     subject: "Physics",
  //     date: "2026-04-10",
  //     status: "late",
  //   },
  // ]);

  // await Mark.insertMany([
  //   {
  //     student: studentOne._id,
  //     teacher: teacher._id,
  //     subject: "Physics",
  //     examType: "Mid Term",
  //     score: 88,
  //     maximumScore: 100,
  //     grade: "A",
  //   },
  //   {
  //     student: studentTwo._id,
  //     teacher: teacher._id,
  //     subject: "Physics",
  //     examType: "Mid Term",
  //     score: 92,
  //     maximumScore: 100,
  //     grade: "A+",
  //   },
  // ]);

  await Notification.insertMany([
    {
      recipient: studentOne._id,
      title: "Welcome",
      message: "Your student portal is now active.",
      category: "general",
    },
    {
      recipient: studentTwo._id,
      title: "New Marks Uploaded",
      message: "Physics mid-term marks are available now.",
      category: "marks",
    },
  ]);

  await Announcement.create({
    title: "Parent Meeting",
    message: "Parent-teacher meeting is scheduled for next Friday.",
    audience: "students",
    createdBy: teacher._id,
  });

  console.log("Seed completed successfully");
  console.log("Admin: admin@sms.com / admin123");
  console.log("Teacher: teacher@sms.com / teacher123");
  console.log("Student: student1@sms.com / student123");

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
