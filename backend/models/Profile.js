import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Ayushmaan Ratan" },
    role: { type: String, required: true, default: "Full Stack & React Native Developer" },
    location: { type: String, default: "Meerut, Uttar Pradesh, India" },
    phone: { type: String, default: "+91 7983212577" },
    email: { type: String, default: "ayushmaanratan9901@gmail.com" },
    linkedin: { type: String, default: "https://www.linkedin.com/in/ayushmaan-ratan" },
    github: { type: String, default: "https://github.com/AyushmaanRatan9901" },
    leetcode: { type: String, default: "https://leetcode.com/" },
    resume: { type: mongoose.Schema.Types.Mixed, default: "/Ayushmaan_Ratan_Resume.pdf" },
    avatar: { type: mongoose.Schema.Types.Mixed, default: "" },
    summary: {
      type: String,
      default:
        "Passionate Full Stack and React Native Developer with hands-on experience building scalable mobile and web applications using React Native, React.js, Node.js, Express.js, MongoDB, MySQL, and Supabase. Skilled in REST APIs, Socket.IO, Firebase, Cloudinary, authentication systems, and modern UI development.",
    },
    skills: [
      {
        category: { type: String },
        items: [{ type: String }],
      },
    ],
    stats: [
      {
        label: { type: String },
        value: { type: String },
        color: { type: String },
      },
    ],
    projects: [
      {
        name: { type: String, required: true },
        concept: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        github: { type: String },
        liveUrl: { type: String },
        media: { type: mongoose.Schema.Types.Mixed, default: [] },
      },
    ],
    experience: [
      {
        role: { type: String, required: true },
        company: { type: String, required: true },
        date: { type: String },
        badge: { type: String },
        color: { type: String, default: "violet" },
        points: [{ type: String }],
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        college: { type: String, required: true },
        duration: { type: String },
        score: { type: String },
      },
    ],
    coursework: [{ type: String }],
    certifications: [
      {
        name: { type: String, required: true },
        link: { type: String, default: "#" },
      },
    ],
    achievements: [{ type: String }],
    languages: [{ type: String }],
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Profile", profileSchema);
