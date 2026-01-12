import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    video: { type: String, required: true, trim: true },
    videoPublicId: { type: String, required: true, trim: true },
    videoDuration: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Module = mongoose.model("Module", moduleSchema);
export default Module;
