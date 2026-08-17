import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaJava,
  FaDatabase,
  FaCode,
  FaHtml5,
  FaCss3Alt,
} from "react-icons/fa";
import {
  SiExpo,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiCloudinary,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiPostman,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { Sparkles, Cpu, Layers, ShieldCheck, Wrench, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* Comprehensive Tech Stack for Ayushmaan Ratan */
const SKILLS_DATA = [
  // Mobile Development
  {
    name: "React Native",
    category: "Mobile",
    level: "Expert",
    percent: 92,
    icon: TbBrandReactNative,
    color: "from-sky-400 to-blue-600",
    desc: "Cross-platform mobile apps with native performance & smooth UI.",
  },
  {
    name: "Expo",
    category: "Mobile",
    level: "Advanced",
    percent: 88,
    icon: SiExpo,
    color: "from-indigo-400 to-violet-600",
    desc: "Expo Router, file-based routing & native module integrations.",
  },
  {
    name: "TypeScript",
    category: "Mobile",
    level: "Proficient",
    percent: 82,
    icon: SiTypescript,
    color: "from-blue-400 to-indigo-600",
    desc: "Type-safe mobile architecture & scalable component interfaces.",
  },

  // Frontend
  {
    name: "React.js",
    category: "Frontend",
    level: "Expert",
    percent: 90,
    icon: FaReact,
    color: "from-cyan-400 to-blue-500",
    desc: "Single page apps, custom hooks & responsive component design.",
  },
  {
    name: "JavaScript",
    category: "Frontend",
    level: "Expert",
    percent: 92,
    icon: SiJavascript,
    color: "from-yellow-400 to-amber-500",
    desc: "ES6+ modern syntax, Async/Await & DOM manipulation.",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: "Expert",
    percent: 94,
    icon: SiTailwindcss,
    color: "from-teal-400 to-emerald-500",
    desc: "Custom design systems, dark mode & glassmorphism interfaces.",
  },
  {
    name: "HTML5",
    category: "Frontend",
    level: "Advanced",
    percent: 95,
    icon: FaHtml5,
    color: "from-orange-400 to-red-500",
    desc: "Semantic markup, accessibility & responsive page structure.",
  },
  {
    name: "CSS3",
    category: "Frontend",
    level: "Advanced",
    percent: 90,
    icon: FaCss3Alt,
    color: "from-blue-400 to-indigo-500",
    desc: "Flexbox, CSS Grid, keyframe animations & responsive layouts.",
  },

  // Backend
  {
    name: "Node.js",
    category: "Backend",
    level: "Expert",
    percent: 88,
    icon: FaNodeJs,
    color: "from-emerald-400 to-green-600",
    desc: "Event-driven asynchronous server-side runtime & microservices.",
  },
  {
    name: "Express.js",
    category: "Backend",
    level: "Expert",
    percent: 90,
    icon: SiExpress,
    color: "from-slate-400 to-zinc-600",
    desc: "REST API routing, middleware pipelines & error handling.",
  },
  {
    name: "REST APIs",
    category: "Backend",
    level: "Expert",
    percent: 92,
    icon: FaCode,
    color: "from-violet-400 to-purple-600",
    desc: "Clean endpoints, JSON serialization & HTTP status standards.",
  },
  {
    name: "JWT Auth",
    category: "Backend",
    level: "Advanced",
    percent: 86,
    icon: ShieldCheck,
    color: "from-rose-400 to-pink-600",
    desc: "Token authentication, refresh tokens & role-based authorization.",
  },

  // Database
  {
    name: "MongoDB",
    category: "Database",
    level: "Expert",
    percent: 88,
    icon: SiMongodb,
    color: "from-emerald-500 to-teal-700",
    desc: "Document schemas, Mongoose ORM & aggregation pipelines.",
  },
  {
    name: "MySQL",
    category: "Database",
    level: "Proficient",
    percent: 80,
    icon: SiMysql,
    color: "from-blue-500 to-sky-700",
    desc: "Relational database design, SQL queries & relational joins.",
  },
  {
    name: "Supabase",
    category: "Database",
    level: "Advanced",
    percent: 84,
    icon: SiSupabase,
    color: "from-emerald-400 to-green-500",
    desc: "PostgreSQL backends, instant APIs & real-time subscriptions.",
  },

  // Cloud & Tools
  {
    name: "Firebase",
    category: "Cloud & Tools",
    level: "Advanced",
    percent: 85,
    icon: SiFirebase,
    color: "from-amber-400 to-orange-500",
    desc: "Authentication, Firestore database & push notifications.",
  },
  {
    name: "Cloudinary",
    category: "Cloud & Tools",
    level: "Advanced",
    percent: 88,
    icon: SiCloudinary,
    color: "from-sky-400 to-blue-600",
    desc: "Cloud media uploads, image transformations & CDN delivery.",
  },
  {
    name: "Socket.IO",
    category: "Cloud & Tools",
    level: "Proficient",
    percent: 80,
    icon: SiSocketdotio,
    color: "from-zinc-400 to-slate-700",
    desc: "Real-time WebSocket communication & bi-directional event emission.",
  },
  {
    name: "Git & GitHub",
    category: "Cloud & Tools",
    level: "Advanced",
    percent: 90,
    icon: FaGitAlt,
    color: "from-red-400 to-orange-600",
    desc: "Version control, feature branching, pull requests & code reviews.",
  },
  {
    name: "Postman",
    category: "Cloud & Tools",
    level: "Advanced",
    percent: 88,
    icon: SiPostman,
    color: "from-orange-400 to-amber-600",
    desc: "API testing collections, environment variables & automated scripts.",
  },

  // Languages
  {
    name: "Java",
    category: "Languages",
    level: "Proficient",
    percent: 80,
    icon: FaJava,
    color: "from-red-500 to-rose-700",
    desc: "Object-oriented programming, data structures & algorithm solving.",
  },
  {
    name: "SQL",
    category: "Languages",
    level: "Proficient",
    percent: 82,
    icon: FaDatabase,
    color: "from-sky-500 to-blue-700",
    desc: "Structured query language, complex joins & database indexing.",
  },
];

const CATEGORIES = [
  "All",
  "Mobile",
  "Frontend",
  "Backend",
  "Database",
  "Cloud & Tools",
  "Languages",
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { theme } = useTheme();
  const isLight = theme === "light";

  const filteredSkills =
    activeCategory === "All"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      className={`relative pt-20 pb-24 transition-colors duration-300 ${
        isLight ? "bg-[#F2F3F5] text-[#111827]" : "bg-slate-950/80 text-slate-300"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase mb-4 ${
              isLight
                ? "border-amber-600/30 bg-amber-500/10 text-amber-700"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>TECHNICAL EXPERTISE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
              isLight ? "text-black" : "text-white"
            }`}
          >
            Skills &{" "}
            <span className="bg-gradient-to-r from-amber-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              Technologies
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isLight ? "text-slate-700 font-medium" : "text-slate-400"
            }`}
          >
            A curated stack of tools, frameworks, and programming languages I use to build scalable mobile and web applications.
          </motion.p>
        </div>

        {/* Interactive Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isLight
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 scale-105"
                    : isLight
                    ? "bg-white text-slate-700 border border-slate-300 hover:border-amber-400 hover:text-black"
                    : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Animated Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  layout
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative rounded-2xl p-6 transition-all duration-300 ${
                    isLight
                      ? "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50"
                      : "bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Icon Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white bg-gradient-to-br ${skill.color} shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon />
                    </div>

                    {/* Level Pill */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isLight
                          ? "bg-slate-100 text-slate-800 border border-slate-300"
                          : "bg-slate-800/80 text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>

                  {/* Skill Name */}
                  <h3
                    className={`text-lg font-black tracking-tight mb-1.5 ${
                      isLight ? "text-black" : "text-white"
                    }`}
                  >
                    {skill.name}
                  </h3>

                  {/* Short Description */}
                  <p
                    className={`text-xs leading-relaxed mb-4 min-h-[36px] ${
                      isLight ? "text-slate-700 font-medium" : "text-slate-400"
                    }`}
                  >
                    {skill.desc}
                  </p>

                  {/* Progress Bar Indicator */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800/70 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
