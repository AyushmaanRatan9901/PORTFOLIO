import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Ayushmaan_Ratan_Resume.pdf",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: "",
    },
    fileSize: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      default: "application/pdf",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
