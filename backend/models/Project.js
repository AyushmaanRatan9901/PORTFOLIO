import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String },
    name: { type: String },
    concept: { type: String },
    description: { type: String },
    role: { type: String },
    year: { type: String },
    technologies: { type: mongoose.Schema.Types.Mixed, default: [] },
    githubLink: { type: String },
    liveLink: { type: String },
    github: { type: String },
    liveUrl: { type: String },
    image: { type: String },
    images: { type: mongoose.Schema.Types.Mixed, default: [] },
    videos: { type: mongoose.Schema.Types.Mixed, default: [] },
    media: { type: mongoose.Schema.Types.Mixed, default: [] },
    featured: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Project", projectSchema);
