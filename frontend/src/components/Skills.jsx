import { useState, useRef, useEffect } from "react";
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
import { Cpu, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* Comprehensive Tech Stack for Ayushmaan Ratan */
const SKILLS_DATA = [
  // Mobile Development
  {
    name: "React Native",
    category: "Mobile",
    icon: TbBrandReactNative,
    color: "from-sky-400 to-blue-600",
  },
  {
    name: "Expo",
    category: "Mobile",
    icon: SiExpo,
    color: "from-indigo-400 to-violet-600",
  },
  {
    name: "TypeScript",
    category: "Mobile",
    icon: SiTypescript,
    color: "from-blue-400 to-indigo-600",
  },

  // Frontend
  {
    name: "React.js",
    category: "Frontend",
    icon: FaReact,
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "JavaScript",
    category: "Frontend",
    icon: SiJavascript,
    color: "from-yellow-400 to-amber-500",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    icon: SiTailwindcss,
    color: "from-teal-400 to-emerald-500",
  },
  {
    name: "HTML5",
    category: "Frontend",
    icon: FaHtml5,
    color: "from-orange-400 to-red-500",
  },
  {
    name: "CSS3",
    category: "Frontend",
    icon: FaCss3Alt,
    color: "from-blue-400 to-indigo-500",
  },

  // Backend
  {
    name: "Node.js",
    category: "Backend",
    icon: FaNodeJs,
    color: "from-emerald-400 to-green-600",
  },
  {
    name: "Express.js",
    category: "Backend",
    icon: SiExpress,
    color: "from-slate-400 to-zinc-600",
  },
  {
    name: "REST APIs",
    category: "Backend",
    icon: FaCode,
    color: "from-violet-400 to-purple-600",
  },
  {
    name: "JWT Auth",
    category: "Backend",
    icon: ShieldCheck,
    color: "from-rose-400 to-pink-600",
  },

  // Database
  {
    name: "MongoDB",
    category: "Database",
    icon: SiMongodb,
    color: "from-emerald-500 to-teal-700",
  },
  {
    name: "MySQL",
    category: "Database",
    icon: SiMysql,
    color: "from-blue-500 to-sky-700",
  },
  {
    name: "Supabase",
    category: "Database",
    icon: SiSupabase,
    color: "from-emerald-400 to-green-500",
  },

  // Cloud & Tools
  {
    name: "Firebase",
    category: "Cloud & Tools",
    icon: SiFirebase,
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Cloudinary",
    category: "Cloud & Tools",
    icon: SiCloudinary,
    color: "from-sky-400 to-blue-600",
  },
  {
    name: "Socket.IO",
    category: "Cloud & Tools",
    icon: SiSocketdotio,
    color: "from-zinc-400 to-slate-700",
  },
  {
    name: "Git & GitHub",
    category: "Cloud & Tools",
    icon: FaGitAlt,
    color: "from-red-400 to-orange-600",
  },
  {
    name: "Postman",
    category: "Cloud & Tools",
    icon: SiPostman,
    color: "from-orange-400 to-amber-600",
  },

  // Languages
  {
    name: "Java",
    category: "Languages",
    icon: FaJava,
    color: "from-red-500 to-rose-700",
  },
  {
    name: "SQL",
    category: "Languages",
    icon: FaDatabase,
    color: "from-sky-500 to-blue-700",
  },
];

export default function Skills() {
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const { theme } = useTheme();
  const isLight = theme === "light";
  const scrollRef = useRef(null);

  // Duplicated list for seamless infinite horizontal loop
  const displayItems = [...SKILLS_DATA, ...SKILLS_DATA];

  // Auto-scroll loop using requestAnimationFrame
  useEffect(() => {
    let animationId;
    const container = scrollRef.current;

    const step = () => {
      if (container && !isAutoScrollPaused && !isMouseDown) {
        container.scrollLeft += 0.8;

        // Loop back seamlessly when reaching half of duplicated list
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isAutoScrollPaused, isMouseDown]);

  // Hold & Drag mouse handlers
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  return (
    <section
      id="skills"
      className={`relative pt-10 pb-12 transition-colors duration-300 ${
        isLight ? "bg-[#F8F9FA] text-[#111827]" : "bg-slate-950/90 text-slate-300"
      }`}
    >
      {/* Premium ambient glow background */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[240px] bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-sky-500/10 blur-[110px] rounded-full" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Ultra-Clean Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-extrabold tracking-wider uppercase mb-2.5 ${
              isLight
                ? "border-amber-600/30 bg-amber-500/10 text-amber-700"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>TECHNICAL EXPERTISE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${
              isLight ? "text-black" : "text-white"
            }`}
          >
            Skills &{" "}
            <span className="bg-gradient-to-r from-amber-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              Technologies
            </span>
          </motion.h2>
        </div>

        {/* Faded Edges Outer Wrapper */}
        <div className="relative">
          {/* Start (Left) Gradient Fade Edge */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-20 transition-colors duration-300 ${
              isLight
                ? "bg-gradient-to-r from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent"
                : "bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent"
            }`}
          />

          {/* End (Right) Gradient Fade Edge */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-20 transition-colors duration-300 ${
              isLight
                ? "bg-gradient-to-l from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent"
                : "bg-gradient-to-l from-[#030712] via-[#030712]/80 to-transparent"
            }`}
          />

          {/* Premium Icon + Name Minimal Cards Container */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseLeave={() => {
              handleMouseLeaveOrUp();
              setIsAutoScrollPaused(false);
            }}
            onMouseEnter={() => setIsAutoScrollPaused(true)}
            onMouseMove={handleMouseMove}
            className={`flex gap-3 overflow-x-auto pb-3 pt-1 select-none no-scrollbar [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] ${
              isMouseDown ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence mode="popLayout">
              {displayItems.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    layout
                    key={`${skill.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`shrink-0 group relative rounded-2xl px-4 py-3 transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                      isLight
                        ? "bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400/60"
                        : "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 shadow-md hover:shadow-amber-500/10"
                    }`}
                  >
                    {/* Icon Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg text-white bg-gradient-to-br ${skill.color} shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}
                    >
                      <Icon />
                    </div>

                    {/* Skill Name Only */}
                    <h3
                      className={`text-sm font-extrabold tracking-tight whitespace-nowrap ${
                        isLight
                          ? "text-black group-hover:text-amber-600"
                          : "text-white group-hover:text-amber-300"
                      } transition-colors`}
                    >
                      {skill.name}
                    </h3>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
