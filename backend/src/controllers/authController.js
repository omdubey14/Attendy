import { body } from "express-validator";
import { User } from "../models/User.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { TeacherProfile } from "../models/TeacherProfile.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import { ROLES, USER_STATUS } from "../utils/constants.js";
import { createLog } from "../services/logService.js";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn([ROLES.STUDENT, ROLES.TEACHER])
    .withMessage("Role must be student or teacher"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, gender, profile = {} } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(409, "An account with this email already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    gender,
    status: USER_STATUS.PENDING,
  });

  if (role === ROLES.STUDENT) {
    await StudentProfile.create({
      user: user._id,
      admissionNumber: profile.admissionNumber,
      className: profile.className,
      section: profile.section || "A",
      guardianName: profile.guardianName || "",
      guardianPhone: profile.guardianPhone || "",
      address: profile.address || "",
      dateOfBirth: profile.dateOfBirth || null,
      bloodGroup: profile.bloodGroup || "",
    });
  }

  if (role === ROLES.TEACHER) {
    await TeacherProfile.create({
      user: user._id,
      employeeId: profile.employeeId,
      department: profile.department,
      qualification: profile.qualification || "",
      subjects: profile.subjects || [],
    });
  }

  await createLog({
    actor: user._id,
    action: "REGISTERED",
    targetType: "User",
    targetId: user._id.toString(),
    details: { role: user.role },
  });

  return res.status(201).json(
    apiResponse({
      message: "Registration submitted successfully. Await admin approval.",
      data: { id: user._id, status: user.status },
    })
  );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  if (user.status === USER_STATUS.REJECTED) {
    return next(new ApiError(403, "Your registration has been rejected"));
  }

  const token = generateToken({ id: user._id, role: user.role });
  user.lastLoginAt = new Date();
  await user.save();

  return res.status(200).json(
    apiResponse({
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        },
      },
    })
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const baseUser = await User.findById(req.user._id).lean();

  let profile = null;
  if (baseUser.role === ROLES.STUDENT) {
    profile = await StudentProfile.findOne({ user: baseUser._id }).lean();
  }
  if (baseUser.role === ROLES.TEACHER) {
    profile = await TeacherProfile.findOne({ user: baseUser._id }).lean();
  }

  return res.status(200).json(
    apiResponse({
      data: {
        ...baseUser,
        profile,
      },
    })
  );
});
