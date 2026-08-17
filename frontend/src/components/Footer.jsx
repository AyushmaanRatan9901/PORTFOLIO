import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCopy,
  FaCheck,
  FaArrowUp,
} from "react-icons/fa";
import {
  Sparkles,
  Send,
  FileText,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { profile, downloadResume } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      await downloadResume();
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(
        new Date()
      );
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  const featuredTech = [
    "React Native",
    "Expo",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Supabase",
    "Tailwind CSS",
  ];

  return (
    <footer
      className={`relative overflow-hidden pt-16 pb-12 transition-colors duration-300 ${
        isLight
          ? "bg-[#F2F3F5] text-[#111827]"
          : "bg-slate-950/90 text-slate-300"
      }`}
    >
      {/* Background Ambient Glow Lights (Dark Mode Only) */}
      {!isLight && (
        <>
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-violet-600/15 via-sky-500/15 to-pink-500/10 blur-[120px] rounded-full" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full" />
        </>
      )}

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Pre-Footer Call to Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative mb-16 rounded-3xl p-8 sm:p-12 transition-all duration-300 overflow-hidden shadow-2xl ${
            isLight
              ? "bg-white border border-slate-200 shadow-xl"
              : "bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-sky-950/40 border border-white/10 backdrop-blur-xl"
          }`}
        >
          {/* Subtle Accent Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold uppercase tracking-wider mb-4 ${
                  isLight
                    ? "border-amber-600/30 bg-amber-500/10 text-amber-700"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>LET'S COLLABORATE</span>
              </div>

              <h2
                className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                  isLight ? "text-black" : "text-white"
                }`}
              >
                Ready to build something{" "}
                <span className="bg-gradient-to-r from-amber-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                  extraordinary?
                </span>
              </h2>

              <p
                className={`mt-4 text-sm sm:text-base leading-relaxed max-w-xl ${
                  isLight ? "text-slate-700 font-medium" : "text-slate-400"
                }`}
              >
                Whether you need a high-performance React Native mobile app, a modern web platform, or full-stack engineering, I'm always open to discussing new opportunities and projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-violet-600 to-sky-500 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Get In Touch</span>
              </a>

              <button
                onClick={handleDownloadClick}
                disabled={downloading}
                className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border text-sm font-extrabold transition-all duration-200 cursor-pointer disabled:opacity-75 ${
                  isLight
                    ? "border-slate-300 bg-white text-slate-800 hover:border-amber-500 hover:text-black shadow-sm"
                    : "border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
                }`}
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-violet-500" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer 4-Column Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b ${isLight ? "border-slate-300" : "border-slate-800/80"}`}>
          {/* Column 1: Brand & Status (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <a href="#" className="inline-block group">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-violet-600 to-sky-500 text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                    AR
                  </div>
                  <div>
                    <h3 className={`text-xl font-black tracking-wide transition-colors ${isLight ? "text-black group-hover:text-amber-600" : "text-white group-hover:text-sky-400"}`}>
                      {profile.name}
                    </h3>
                    <p className={`text-xs font-bold ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                      {profile.role}
                    </p>
                  </div>
                </div>
              </a>
              <p className={`mt-4 text-sm leading-relaxed max-w-sm ${isLight ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                Passionate developer crafting fast, scalable React Native mobile apps and full-stack web applications with modern architecture.
              </p>
            </div>

            {/* Live Availability Badge */}
            <div className={`mt-6 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold w-fit ${
              isLight ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-700" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Available for opportunities</span>
            </div>
          </div>

          {/* Column 2: Quick Links (Col Span 2) */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLight ? "text-black" : "text-slate-400"}`}>
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 font-medium transition-all duration-200 ${
                      isLight ? "text-slate-700 hover:text-black hover:translate-x-1" : "text-slate-400 hover:text-sky-400 hover:translate-x-1"
                    }`}
                  >
                    <ChevronRight className={`w-3.5 h-3.5 ${isLight ? "text-slate-400" : "text-slate-600"}`} />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Featured Tech (Col Span 3) */}
          <div className="lg:col-span-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLight ? "text-black" : "text-slate-400"}`}>
              Core Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {featuredTech.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    isLight ? "border-slate-300 bg-white text-slate-800 shadow-sm" : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-violet-500/40 hover:text-violet-300"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Socials (Col Span 3) */}
          <div className="lg:col-span-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLight ? "text-black" : "text-slate-400"}`}>
              Connect With Me
            </h4>

            {/* Email Copy Card */}
            <div className="mb-4">
              <button
                onClick={handleCopyEmail}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all group cursor-pointer ${
                  isLight ? "border-slate-300 bg-white text-slate-800 hover:border-amber-400 shadow-sm" : "border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300"
                }`}
                title="Click to copy email"
              >
                <span className="truncate">{profile.email}</span>
                <span className={`shrink-0 p-1.5 rounded-lg transition-colors ${isLight ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-300"}`}>
                  {copied ? (
                    <FaCheck className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <FaCopy className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-500" />
                  )}
                </span>
              </button>
              {copied && (
                <span className="block mt-1 text-[11px] text-emerald-600 font-bold">
                  ✓ Email copied to clipboard!
                </span>
              )}
            </div>

            {/* Location & Phone */}
            <div className={`space-y-2 text-xs font-medium mb-5 ${isLight ? "text-slate-700" : "text-slate-400"}`}>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-violet-500 shrink-0" />
                <span>{profile.location}</span>
              </p>
              {profile.phone && (
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-sky-500 shrink-0" />
                  <a
                    href={`tel:${profile.phone}`}
                    className="hover:underline transition"
                  >
                    {profile.phone}
                  </a>
                </p>
              )}
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2.5">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                    isLight ? "border-slate-300 bg-white text-slate-700 hover:border-amber-500 hover:text-black shadow-sm" : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                  }`}
                >
                  <FaGithub size={16} />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                    isLight ? "border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:text-black shadow-sm" : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300"
                  }`}
                >
                  <FaLinkedin size={16} />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                    isLight ? "border-slate-300 bg-white text-slate-700 hover:border-pink-500 hover:text-black shadow-sm" : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-300"
                  }`}
                >
                  <FaEnvelope size={15} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom Metadata Bar */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${isLight ? "text-slate-700 font-medium" : "text-slate-500"}`}>
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          </div>

          {/* Time Zone Indicator */}
          {timeString && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
              isLight ? "bg-white border-slate-300 text-slate-800 font-semibold shadow-sm" : "bg-slate-900 border border-slate-800 text-slate-400"
            }`}>
              <Clock className="w-3 h-3 text-amber-500" />
              <span>India (IST) • {timeString}</span>
            </div>
          )}

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
              isLight ? "border-slate-300 bg-white text-slate-800 font-semibold shadow-sm hover:border-amber-500" : "border-slate-800 bg-slate-900/90 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm group-hover:scale-110 transition-transform">
              <FaArrowUp size={10} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

