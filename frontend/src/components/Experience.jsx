import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Code2,
  Calendar,
  MapPin,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";

export default function Experience() {
  const { profile } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const experiences = profile?.experience || [];

  const stats = [
    { label: "Role Experiences", value: `${experiences.length}+`, icon: Briefcase },
    { label: "Companies & Organizations", value: "3+", icon: Building2 },
    { label: "Agile & Development", value: "100%", icon: Code2 },
  ];

  return (
    <section id="experience" className={`relative py-24 overflow-hidden transition-colors duration-300 ${isLight ? "bg-[#F2F3F5] text-[#111827]" : "bg-slate-950/80 text-slate-300"}`}>
      {/* Soft Ambient Background Lighting (Dark Mode Only) */}
      {!isLight && (
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[130px] rounded-full" />
      )}

      <div className="container relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${
              isLight
                ? "border-amber-600/30 bg-amber-500/10 text-amber-700"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>CAREER PATH</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? "text-black" : "text-white"}`}
          >
            Work Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            A timeline of my professional roles, internships, and key achievements.
          </motion.p>
        </div>

        {/* Minimal Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sleek Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Rail Line */}
          <div className="absolute left-4 sm:left-6 top-3 bottom-3 w-px bg-slate-800" />

          <div className="space-y-8 sm:space-y-10">
            {experiences.map((item, index) => {
              const Icon = item.icon || Briefcase;

              return (
                <motion.div
                  key={item.role + index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative pl-10 sm:pl-14"
                >
                  {/* Timeline Dot Node */}
                  <div className="absolute left-4 sm:left-6 top-1.5 -translate-x-1/2 z-20">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-40" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-violet-400 bg-slate-950" />
                    </span>
                  </div>

                  {/* Clean Experience Card */}
                  <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 sm:p-7 backdrop-blur-md hover:border-slate-700 transition-all duration-200 group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                            {item.role}
                          </h3>
                          <p className="text-xs sm:text-sm font-medium text-slate-400">
                            {item.company}
                          </p>
                        </div>
                      </div>

                      {/* Badge & Date */}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.badge && (
                          <span className="px-2.5 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium">
                            {item.badge}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-950 text-slate-400 text-xs font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.date}
                        </span>
                      </div>
                    </div>

                    {/* Highlights list */}
                    <ul className="space-y-2 pt-2 border-t border-slate-800/60">
                      {item.points?.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


