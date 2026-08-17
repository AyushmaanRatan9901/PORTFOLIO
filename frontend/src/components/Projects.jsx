import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaMobileAlt,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaFire,
  FaCode,
  FaGitAlt,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaCreditCard,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiRedux,
  SiCloudinary,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiExpo,
  SiPostman,
  SiTailwindcss,
  SiSupabase,
  SiSocketdotio,
  SiJsonwebtokens,
} from "react-icons/si";
import { Sparkles, Layers, ArrowUpRight, Globe, Terminal, Radio } from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import Iphone from "./UI/iphone";

/* Fallback projects */
const placeholder = (label, bg = "0f172a", fg = "38bdf8") =>
  `https://placehold.co/390x844/${bg}/${fg}?text=${encodeURIComponent(label)}`;

const fallbackProjects = [
  {
    concept: "Real Estate & Property Verification",
    role: "Full Stack Mobile Developer",
    year: "2025",
    name: "Avorix Realty",
    description:
      "A full-stack React Native platform for verified property listings — featuring agent onboarding, live verification reports, article-based market insights, and a premium multi-step property posting flow with dark/light theming throughout.",
    technologies: ["React Native", "Expo Router", "Redux Toolkit", "Node.js", "MongoDB"],
    github: "https://github.com/AyushmaanRatan9901",
    liveUrl: "#",
    media: [
      { type: "image", src: placeholder("Avorix Home") },
      { type: "image", src: placeholder("Property Details") },
      { type: "image", src: placeholder("Verification Report") },
    ],
  },
];

/* Dynamic project ambient glow colors */
const PROJECT_GLOWS = [
  "from-amber-500/20 via-orange-500/10 to-transparent",
  "from-violet-500/20 via-purple-500/10 to-transparent",
  "from-sky-500/20 via-blue-500/10 to-transparent",
  "from-emerald-500/20 via-teal-500/10 to-transparent",
];

/* Tech pill styling lookup */
const TECH_MAP = {
  // React & Frontend
  "react": { bg: "border-sky-500/30 bg-sky-500/10 text-sky-300", icon: <FaReact className="text-sky-400 text-sm" /> },
  "react.js": { bg: "border-sky-500/30 bg-sky-500/10 text-sky-300", icon: <FaReact className="text-sky-400 text-sm" /> },
  "react js": { bg: "border-sky-500/30 bg-sky-500/10 text-sky-300", icon: <FaReact className="text-sky-400 text-sm" /> },
  "react native": { bg: "border-sky-500/30 bg-sky-500/10 text-sky-300", icon: <FaReact className="text-sky-400 text-sm" /> },
  "typescript": { bg: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: <SiTypescript className="text-blue-400 text-sm" /> },
  "javascript": { bg: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300", icon: <SiJavascript className="text-yellow-400 text-sm" /> },
  "js": { bg: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300", icon: <SiJavascript className="text-yellow-400 text-sm" /> },
  "html": { bg: "border-orange-500/30 bg-orange-500/10 text-orange-300", icon: <FaHtml5 className="text-orange-400 text-sm" /> },
  "html5": { bg: "border-orange-500/30 bg-orange-500/10 text-orange-300", icon: <FaHtml5 className="text-orange-400 text-sm" /> },
  "css": { bg: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: <FaCss3Alt className="text-blue-400 text-sm" /> },
  "css3": { bg: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: <FaCss3Alt className="text-blue-400 text-sm" /> },
  "tailwind": { bg: "border-teal-500/30 bg-teal-500/10 text-teal-300", icon: <SiTailwindcss className="text-teal-400 text-sm" /> },
  "tailwind css": { bg: "border-teal-500/30 bg-teal-500/10 text-teal-300", icon: <SiTailwindcss className="text-teal-400 text-sm" /> },
  "redux": { bg: "border-purple-500/30 bg-purple-500/10 text-purple-300", icon: <SiRedux className="text-purple-400 text-sm" /> },
  "redux toolkit": { bg: "border-purple-500/30 bg-purple-500/10 text-purple-300", icon: <SiRedux className="text-purple-400 text-sm" /> },

  // Mobile & Expo
  "expo": { bg: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300", icon: <SiExpo className="text-indigo-400 text-sm" /> },
  "expo router": { bg: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300", icon: <FaMobileAlt className="text-indigo-400 text-sm" /> },

  // Backend & APIs
  "node.js": { bg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", icon: <FaNodeJs className="text-emerald-400 text-sm" /> },
  "node": { bg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", icon: <FaNodeJs className="text-emerald-400 text-sm" /> },
  "express.js": { bg: "border-slate-400/30 bg-slate-500/10 text-slate-200", icon: <SiExpress className="text-slate-300 text-sm" /> },
  "express": { bg: "border-slate-400/30 bg-slate-500/10 text-slate-200", icon: <SiExpress className="text-slate-300 text-sm" /> },
  "rest apis": { bg: "border-violet-500/30 bg-violet-500/10 text-violet-300", icon: <Globe className="w-3.5 h-3.5 text-violet-400" /> },
  "rest api": { bg: "border-violet-500/30 bg-violet-500/10 text-violet-300", icon: <Globe className="w-3.5 h-3.5 text-violet-400" /> },
  "jwt authentication": { bg: "border-pink-500/30 bg-pink-500/10 text-pink-300", icon: <SiJsonwebtokens className="text-pink-400 text-sm" /> },
  "jwt auth": { bg: "border-pink-500/30 bg-pink-500/10 text-pink-300", icon: <SiJsonwebtokens className="text-pink-400 text-sm" /> },
  "jwt": { bg: "border-pink-500/30 bg-pink-500/10 text-pink-300", icon: <SiJsonwebtokens className="text-pink-400 text-sm" /> },
  "socket.io": { bg: "border-slate-400/30 bg-slate-500/10 text-slate-200", icon: <SiSocketdotio className="text-slate-300 text-sm" /> },
  "socketio": { bg: "border-slate-400/30 bg-slate-500/10 text-slate-200", icon: <SiSocketdotio className="text-slate-300 text-sm" /> },
  "onesignal": { bg: "border-rose-500/30 bg-rose-500/10 text-rose-300", icon: <Radio className="w-3.5 h-3.5 text-rose-400" /> },

  // Databases & Cloud
  "mongodb": { bg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", icon: <SiMongodb className="text-emerald-400 text-sm" /> },
  "mysql": { bg: "border-sky-500/30 bg-sky-500/10 text-sky-300", icon: <SiMysql className="text-sky-400 text-sm" /> },
  "firebase": { bg: "border-amber-500/30 bg-amber-500/10 text-amber-300", icon: <FaFire className="text-amber-400 text-sm" /> },
  "cloudinary": { bg: "border-sky-500/30 bg-sky-500/10 text-sky-300", icon: <SiCloudinary className="text-sky-400 text-sm" /> },
  "supabase": { bg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", icon: <SiSupabase className="text-emerald-400 text-sm" /> },
  "razorpay": { bg: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: <FaCreditCard className="text-blue-400 text-sm" /> },

  // Tools & Languages
  "git": { bg: "border-red-500/30 bg-red-500/10 text-red-300", icon: <FaGitAlt className="text-red-400 text-sm" /> },
  "github": { bg: "border-slate-400/30 bg-slate-500/10 text-slate-200", icon: <FaGithub className="text-slate-300 text-sm" /> },
  "vs code": { bg: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: <Terminal className="w-3.5 h-3.5 text-blue-400" /> },
  "vscode": { bg: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: <Terminal className="w-3.5 h-3.5 text-blue-400" /> },
  "postman": { bg: "border-orange-500/30 bg-orange-500/10 text-orange-300", icon: <SiPostman className="text-orange-400 text-sm" /> },
  "postman.": { bg: "border-orange-500/30 bg-orange-500/10 text-orange-300", icon: <SiPostman className="text-orange-400 text-sm" /> },
  "java": { bg: "border-red-500/30 bg-red-500/10 text-red-300", icon: <FaJava className="text-red-400 text-sm" /> },
};

const getTechBadge = (name) => {
  if (!name || typeof name !== "string") {
    return {
      bg: "border-slate-700 bg-slate-800/80 text-slate-300",
      icon: <FaCode className="text-amber-400 text-xs" />,
    };
  }

  const cleanName = name.replace(/[.,;]+$/, "").trim().toLowerCase();

  if (TECH_MAP[cleanName]) return TECH_MAP[cleanName];
  if (TECH_MAP[name.trim().toLowerCase()]) return TECH_MAP[name.trim().toLowerCase()];

  for (const [key, badge] of Object.entries(TECH_MAP)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return badge;
    }
  }

  return {
    bg: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
  };
};

const pad2 = (n) => String(n).padStart(2, "0");

const parseMediaItem = (item, defaultName = "Project Preview") => {
  if (!item) return { type: "image", src: placeholder(defaultName) };

  let declaredType = "image";
  let src = "";

  if (typeof item === "string") {
    src = item.trim();
  } else if (typeof item === "object" && item !== null) {
    declaredType = item.type || "image";
    src = item.src || item.url || item.secure_url || item.path || "";
    if (typeof src === "object" && src !== null) {
      src = src.src || src.url || src.secure_url || "";
    }
  }

  if (!src || (typeof src === "string" && !src.trim())) {
    return { type: "image", src: placeholder(defaultName) };
  }

  src = src.trim();

  // Detect Cloudinary video vs image URLs
  const isVideo =
    declaredType === "video" ||
    Boolean(src.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i)) ||
    src.includes("/video/upload/") ||
    src.startsWith("data:video/");

  return { type: isVideo ? "video" : "image", src };
};

export default function Projects() {
  const { profile } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const rawProjects = profile?.projects?.length > 0 ? profile.projects : fallbackProjects;
  const projects = [...rawProjects].sort(
    (a, b) => (Number(a.priority) || 999) - (Number(b.priority) || 999)
  );

  const [projectIndex, setProjectIndex] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);

  // Reset indices safely if project array changes from database updates
  useEffect(() => {
    if (projectIndex >= projects.length) {
      setProjectIndex(0);
      setMediaIndex(0);
    }
  }, [projects.length, projectIndex]);

  const project = projects[projectIndex] || projects[0];
  const rawMedia = project?.media && Array.isArray(project.media) && project.media.length > 0
    ? project.media
    : (project?.image ? [{ type: "image", src: project.image }] : [{ type: "image", src: placeholder(project?.name || "Project Screen") }]);

  const mediaList = rawMedia.map((m) => parseMediaItem(m, project?.name || "Project Screen"));
  const media = mediaList[mediaIndex] || mediaList[0] || { type: "image", src: placeholder(project?.name || "Project Screen") };
  const activeGlow = PROJECT_GLOWS[projectIndex % PROJECT_GLOWS.length];

  // Log project data for debugging & verification
  useEffect(() => {
    console.log("=== [PROJECT DATA FETCH LOG] ===");
    console.log("Projects from ProfileContext:", profile?.projects);
    console.log("Selected Project:", project?.name, project);
    console.log("Project Media List:", mediaList);
    console.log("Current Active Media:", media);
  }, [profile?.projects, project, mediaList, media]);

  // Mouse Drag-to-Scroll & Auto-Scroll States
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-swap media screenshots every 3.5s when not dragging or paused (bypasses timer if video is playing)
  useEffect(() => {
    if (isPaused || isDragging || mediaList.length <= 1) return;
    if (media?.type === "video") return; // Let video play completely!

    const timer = setInterval(() => {
      setMediaIndex((prev) => (prev + 1) % mediaList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, mediaList.length, media?.type]);

  const handleVideoEnded = () => {
    if (mediaList.length > 1) {
      setMediaIndex((prev) => (prev + 1) % mediaList.length);
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.8;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const goToProject = (newIndex) => {
    setProjectIndex(newIndex);
    setMediaIndex(0);
  };

  const handlePrev = () =>
    goToProject(projectIndex === 0 ? projects.length - 1 : projectIndex - 1);

  const handleNext = () =>
    goToProject(projectIndex === projects.length - 1 ? 0 : projectIndex + 1);

  return (
    <section
      id="projects"
      className={`relative py-24 overflow-hidden transition-colors duration-300 ${
        isLight ? "bg-[#F2F3F5] text-[#111827]" : "bg-slate-950/80 text-slate-300"
      }`}
    >
      {/* Background Dynamic Ambient Radial Glow */}
      {!isLight && (
        <div className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r ${activeGlow} blur-[140px] rounded-full transition-all duration-700`} />
      )}

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 mb-4"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>FEATURED WORK</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Crafted with{" "}
            <span className="bg-gradient-to-r from-amber-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
              Precision & Passion
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Explore real-world mobile applications and full-stack platforms engineered for scale and seamless user experience.
          </motion.p>
        </div>

        {/* Project Selector Bar (Quick Switcher Tabs) */}
        <div
          className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto pt-3 pb-4 mb-10 no-scrollbar [::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => goToProject(idx)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                idx === projectIndex
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10"
                  : "border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${idx === projectIndex ? "bg-amber-400 animate-pulse" : "bg-slate-600"}`} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Main Showcase Grid: Left Phone Stage, Right Details */}
        <div className="relative grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Arrow Desktop */}
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="hidden xl:flex absolute -left-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Right Arrow Desktop */}
          <button
            onClick={handleNext}
            aria-label="Next project"
            className="hidden xl:flex absolute -right-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <FaChevronRight size={16} />
          </button>

          {/* iPhone Mockup Stage (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group">
              {/* Pedestal Reflection Glow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-amber-500/20 blur-2xl rounded-full group-hover:bg-amber-400/30 transition-all" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${projectIndex}-${mediaIndex}`}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-20"
                >
                  <Iphone
                    width={310}
                    src={media?.type === "image" ? media.src : undefined}
                    videoSrc={media?.type === "video" ? media.src : undefined}
                    onVideoEnded={handleVideoEnded}
                    className="drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Media Screenshots Thumbnail Selector with Mouse Drag & Auto-Scroll */}
            {mediaList.length > 1 && (
              <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsPaused(true)}
                className={`flex items-center gap-4 mt-6 z-20 max-w-full overflow-x-auto p-3.5 no-scrollbar [::-webkit-scrollbar]:hidden select-none transition-all ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {mediaList.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!isDraggingRef.current) {
                        setMediaIndex(i);
                      }
                    }}
                    className={`relative rounded-[16px] p-1 border transition-all duration-300 cursor-pointer shrink-0 m-1 ${
                      i === mediaIndex
                        ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/40"
                        : "border-slate-800 bg-slate-900/60 opacity-60 hover:opacity-100 hover:border-slate-700"
                    }`}
                  >
                    <Iphone
                      width={48}
                      src={m.type === "image" ? m.src : undefined}
                      videoSrc={m.type === "video" ? m.src : undefined}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details Panel (Col Span 7) */}
          <div className="lg:col-span-7 self-start lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={projectIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
              >
                {/* Subtle Card Accent Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Counter & Concept */}
                  <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                    {project.concept && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-mono font-bold tracking-wide text-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{project.concept}</span>
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500 tracking-wider">
                      PROJECT {pad2(projectIndex + 1)} / {pad2(projects.length)}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
                    {project.name}
                  </h3>

                  {(project.role || project.year) && (
                    <p className="text-xs sm:text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
                      <span className="text-violet-400 font-semibold">{project.role || "Developer"}</span>
                      {project.year && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-slate-500">{project.year}</span>
                        </>
                      )}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Technologies & Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech) => {
                        const badge = getTechBadge(tech);
                        return (
                          <span
                            key={tech}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-transform hover:scale-105 ${badge.bg}`}
                          >
                            {badge.icon}
                            <span>{tech}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/80">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs sm:text-sm font-bold hover:bg-slate-700 hover:border-slate-600 transition-all duration-200"
                      >
                        <FaGithub size={16} />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-violet-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      >
                        <span>Live Preview</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Left/Right Navigation */}
        <div className="flex lg:hidden justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next project"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

