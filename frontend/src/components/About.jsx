import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  Code2,
  CheckCircle2,
  User,
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";

/* ---------- 3D Tilt Card Component ---------- */
function TiltCard({ children, className = "", glowColor = "rgba(167, 139, 250, 0.15)" }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const spotlightX = useTransform(mx, (v) => `${v * 100}%`);
  const spotlightY = useTransform(my, (v) => `${v * 100}%`);
  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${spotlightX} ${spotlightY}, ${glowColor}, transparent 75%)`;

  function handleMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl overflow-hidden group ${className}`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />
        <div style={{ transform: "translateZ(20px)" }}>{children}</div>
      </motion.div>
    </div>
  );
}

/* ---------- macOS Window Chrome Header ---------- */
function WindowChrome({ title, tag }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/80">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        <span className="ml-2 text-xs font-mono text-slate-400 font-medium">{title}</span>
      </div>
      {tag && (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
          {tag}
        </span>
      )}
    </div>
  );
}

export default function About() {
  const { profile } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const languages = profile?.languages || ["English", "Hindi"];
  const coursework = profile?.coursework || [];
  const education = profile?.education || [];
  const certifications = profile?.certifications || [];
  const achievements = profile?.achievements || [];

  const STAT_ICON_MAP = {
    experiences: { icon: Briefcase, color: "from-violet-500 to-indigo-500" },
    internships: { icon: Briefcase, color: "from-violet-500 to-indigo-500" },
    companies: { icon: Building2, color: "from-amber-500 to-orange-500" },
    "years journey": { icon: Calendar, color: "from-emerald-500 to-teal-500" },
    years: { icon: Calendar, color: "from-emerald-500 to-teal-500" },
    "projects delivered": { icon: Code2, color: "from-sky-500 to-blue-500" },
    projects: { icon: Code2, color: "from-sky-500 to-blue-500" },
  };

  const getStatMeta = (label, colorName) => {
    const key = label?.toLowerCase().trim() || "";
    for (const [k, v] of Object.entries(STAT_ICON_MAP)) {
      if (key.includes(k)) return v;
    }
    const colorGrad =
      colorName === "violet"
        ? "from-violet-500 to-indigo-500"
        : colorName === "amber"
        ? "from-amber-500 to-orange-500"
        : colorName === "emerald"
        ? "from-emerald-500 to-teal-500"
        : "from-sky-500 to-blue-500";
    return { icon: Briefcase, color: colorGrad };
  };

  const stats = profile?.stats?.length > 0
    ? profile.stats.map((s) => {
        const meta = getStatMeta(s.label, s.color);
        return {
          label: s.label,
          value: s.value,
          icon: meta.icon,
          color: meta.color,
        };
      })
    : [
        { label: "Experiences", value: "5+", icon: Briefcase, color: "from-violet-500 to-indigo-500" },
        { label: "Companies", value: "5+", icon: Building2, color: "from-amber-500 to-orange-500" },
        { label: "Years Journey", value: "2+", icon: Calendar, color: "from-emerald-500 to-teal-500" },
        { label: "Projects Delivered", value: "10+", icon: Code2, color: "from-sky-500 to-blue-500" },
      ];

  return (
    <section
      id="about"
      className={`relative py-24 overflow-hidden transition-colors duration-300 ${
        isLight ? "bg-[#F2F3F5] text-[#111827]" : "bg-slate-950/80 text-slate-300"
      }`}
    >
      {/* Background Glow Elements (Dark Mode Only) */}
      {!isLight && (
        <>
          <div className="pointer-events-none absolute top-1/4 left-0 w-96 h-96 bg-violet-600/10 blur-[130px] rounded-full" />
          <div className="pointer-events-none absolute bottom-1/4 right-0 w-96 h-96 bg-sky-500/10 blur-[130px] rounded-full" />
        </>
      )}

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300 mb-4"
          >
            <User className="w-3.5 h-3.5 text-violet-400" />
            <span>ABOUT ME</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Engineering Mobile & Web{" "}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Excellence
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Full Stack & React Native Developer with a passion for building performant, user-centric mobile apps and modern web solutions.
          </motion.p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6 backdrop-blur-xl hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white">{stat.value}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main 2-Column Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio & Dev Spec Console (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Bio Card */}
            <TiltCard glowColor="rgba(167, 139, 250, 0.12)">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Who I Am</h3>
                    <p className="text-xs text-violet-400">{profile.role}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {profile.summary}
                </p>

                {/* Key Focus Pills */}
                <div className="flex flex-wrap gap-2">
                  {["React Native", "Full-Stack", "Mobile Architecture", "REST APIs", "Supabase"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Developer Spec Console Card */}
            <TiltCard glowColor="rgba(56, 189, 248, 0.12)">
              <WindowChrome title="developer.config.ts" tag="TypeScript" />
              <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed bg-slate-950/70 overflow-x-auto">
                <div>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-sky-300">developer</span>{" "}
                  <span className="text-slate-400">:</span>{" "}
                  <span className="text-emerald-300">DeveloperProfile</span>{" "}
                  <span className="text-slate-400">=</span>{" "}
                  <span className="text-amber-300">{"{"}</span>
                </div>
                <div className="pl-4 space-y-1.5 py-1">
                  <div>
                    <span className="text-rose-400">name</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-emerald-300">"{profile.name}"</span>
                    <span className="text-slate-500">,</span>
                  </div>
                  <div>
                    <span className="text-rose-400">location</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-emerald-300">"{profile.location}"</span>
                    <span className="text-slate-500">,</span>
                  </div>
                  <div>
                    <span className="text-rose-400">email</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-emerald-300">"{profile.email}"</span>
                    <span className="text-slate-500">,</span>
                  </div>
                  <div>
                    <span className="text-rose-400">phone</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-emerald-300">"{profile.phone}"</span>
                    <span className="text-slate-500">,</span>
                  </div>
                  <div>
                    <span className="text-rose-400">languages</span>
                    <span className="text-slate-400">: </span>
                    <span className="text-amber-300">[</span>
                    <span className="text-emerald-300">{languages.map(l => `"${l}"`).join(", ")}</span>
                    <span className="text-amber-300">]</span>
                  </div>
                </div>
                <div>
                  <span className="text-amber-300">{"}"}</span>
                  <span className="text-slate-500">;</span>
                </div>
              </div>
            </TiltCard>

            {/* Coursework Card */}
            <TiltCard glowColor="rgba(52, 211, 153, 0.12)">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Core CS Coursework
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coursework.map((course) => (
                    <span
                      key={course}
                      className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-mono text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                    >
                      import {"{"} <span className="text-emerald-400">{course}</span> {"}"}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column: Education & Achievements / Certifications (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Education Timeline */}
            <TiltCard glowColor="rgba(251, 191, 36, 0.12)">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Education</h3>
                    <p className="text-xs text-amber-400">Academic Background</p>
                  </div>
                </div>

                <div className="relative space-y-6 pl-4 sm:pl-6 border-l border-slate-800">
                  {education.map((edu, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-4"
                    >
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] sm:-left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-amber-400 bg-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />

                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <h4 className="text-sm font-bold text-white leading-snug">{edu.degree}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-slate-700 bg-slate-800 text-slate-300">
                          {edu.duration}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 font-medium mb-1.5">{edu.college}</p>
                      
                      <div className="inline-block px-2.5 py-0.5 rounded-md text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        Score: {edu.score}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Certifications & Achievements */}
            <TiltCard glowColor="rgba(167, 139, 250, 0.12)">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Certifications & Achievements</h3>
                      <p className="text-xs text-violet-400">Verified Credentials</p>
                    </div>
                  </div>
                </div>

                {/* Certifications List */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Certifications
                  </h4>
                  {certifications.map((cert, i) => {
                    const name = typeof cert === "string" ? cert : cert.name;
                    const link = typeof cert === "string" ? "#" : cert.link || "#";
                    const hasLink = link && link !== "#";
                    return (
                      <a
                        key={i}
                        href={hasLink ? link : undefined}
                        target={hasLink ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/50 hover:border-violet-500/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs sm:text-sm text-slate-200 font-medium group-hover:text-violet-300 transition-colors">
                            {name}
                          </span>
                        </div>
                        {hasLink && (
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
                        )}
                      </a>
                    );
                  })}
                </div>

                {/* Key Achievements */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Highlights
                  </h4>
                  <div className="space-y-2">
                    {achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

