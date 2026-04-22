import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    section: { type: String, default: "A" },
    subjects: [{ type: String }],
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    capacity: { type: Number, default: 40 },
  },
  { timestamps: true }
);

export const ClassRoom = mongoose.model("ClassRoom", classRoomSchema);
