import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    examType: { type: String, required: true },
    score: { type: Number, required: true },
    maximumScore: { type: Number, default: 100 },
    grade: { type: String, required: true },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

markSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

export const Mark = mongoose.model("Mark", markSchema);
