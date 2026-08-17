import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import profileImg from "../assets/ayushmaan.jpeg";
import profileImgLight from "../assets/ayushmaanLight.png";
import MorphText from "./UI/morph_text";
import FlipFadeText from "./UI/flip-fade-text";
import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";

export default function Image({ className = "", alt = "Ayushmaan Ratan" }) {
  const { profile } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const activeAvatar = isLight ? profileImgLight : profileImg;

  const resumeLink =
    typeof profile?.resume === "object"
      ? profile.resume?.url ||
        profile.resume?.src ||
        "/Ayushmaan_Ratan_Resume.pdf"
      : profile?.resume || "/Ayushmaan_Ratan_Resume.pdf";

  const firstName = profile.name?.split(" ")[0] || "Ayushmaan";
  const lastName = profile.name?.split(" ").slice(1).join(" ") || "Ratan";

  return (
    <div
      className={`relative w-full min-h-screen ${isLight ? "bg-[#F2F3F5] text-[#111827]" : "bg-[#06060c] text-white"} overflow-hidden ${className}`}
    >
      <div className="w-full min-h-screen grid lg:grid-cols-12 items-stretch">
        {/* Left Column: Text & Actions (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col justify-center items-start px-6 sm:px-12 lg:px-16 xl:px-20 py-20 z-10 space-y-6">
          {/* Executive Portfolio Capsule Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-[11px] font-bold tracking-widest text-violet-300 uppercase shadow-lg shadow-violet-950/50"
          >
            <span>EXECUTIVE PORTFOLIO</span>
            <Sparkles size={13} className="text-violet-400" />
          </motion.div>

          {/* Giant Red MorphText Display Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full pt-1 pb-2"
          >
            <MorphText
              words={["CODE", "DESIGN", "BUILD"]}
              interval={2500}
              fontSize="clamp(3.5rem, 9vw, 8rem)"
              className="items-start"
              textClassName="text-[#EF4444] font-black uppercase tracking-tighter leading-none"
            />
          </motion.div>

          {/* Developer Name with Red Initials A & R */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight ${isLight ? "text-black" : "text-white"} uppercase leading-none font-sans flex flex-wrap items-center gap-x-3 gap-y-1`}
          >
            <span>
              <span className="text-[#EF4444]">{firstName.charAt(0)}</span>
              {firstName.slice(1).toUpperCase()}
            </span>
            <span>
              <span className="text-[#EF4444]">{lastName.charAt(0)}</span>
              {lastName.slice(1).toUpperCase()}
            </span>
          </motion.h1>

          {/* Role Subtitle with FlipFadeText */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="pt-1"
          >
            <FlipFadeText
              words={[
                "FULL_STACK_DEVELOPER",
                "REACT_NATIVE_DEVELOPER",
                "SOFTWARE_ENGINEER",
              ]}
              className={`text-lg sm:text-2xl font-extrabold tracking-widest ${isLight ? "text-black" : "text-white"} uppercase font-sans`}
              textClassName={isLight ? "text-black" : "text-white"}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-xs sm:text-sm font-bold tracking-widest ${isLight ? "text-slate-800" : "text-slate-300"} uppercase`}
          >
            BUILDING HIGH-PERFORMANCE MOBILE AND WEB SOLUTIONS.
          </motion.p>

          {/* Bio Summary Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className={`text-xs sm:text-sm ${isLight ? "text-slate-800 font-medium" : "text-slate-300"} leading-relaxed max-w-lg font-normal`}
          >
            {profile.summary ||
              "Passionate Full Stack and React Native Developer with hands-on experience building scalable mobile and web applications using React Native, React.js, Node.js, Express.js, MongoDB, MySQL, and Supabase."}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            {/* View Project Button */}
            <a
              href="#projects"
              className={`group flex items-center gap-3.5 text-xs font-extrabold tracking-wider ${isLight ? "text-black hover:text-slate-700" : "text-slate-200 hover:text-white"} transition-colors`}
            >
              <div className={`w-10 h-10 rounded-full ${isLight ? "bg-slate-300 border-slate-400" : "bg-slate-800/80 border-slate-700"} border flex items-center justify-center group-hover:scale-105 transition-all`}>
                <span className={`w-4 h-4 rounded-full ${isLight ? "bg-slate-700" : "bg-slate-600"} transition-colors`} />
              </div>
              <span>VIEW PROJECT</span>
              <ArrowRight
                size={16}
                className={`${isLight ? "text-slate-800" : "text-slate-400"} group-hover:translate-x-1 transition-all`}
              />
            </a>

            {/* Download Resume Button */}
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-indigo-500/50 bg-indigo-950/30 hover:bg-indigo-900/40 text-xs font-bold tracking-wider text-white transition-all shadow-lg shadow-indigo-950/50 group"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Download size={13} />
              </div>
              <span>DOWNLOAD</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Clean Full-Bleed Portrait Photo (6 Cols) */}
        <div className="lg:col-span-6 relative min-h-[500px] lg:min-h-screen overflow-hidden flex items-center justify-center">
          <img
            src={activeAvatar}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />

          {/* Left Edge Overlay Gradient to blend photo into left background */}
          <div
            className={`absolute inset-y-0 ${
              isLight
                ? "-left-6 w-24 from-[#F2F3F5] via-[#F2F3F5]/40"
                : "left-0 w-40 from-[#06060c] via-[#06060c]/60"
            } bg-gradient-to-r to-transparent pointer-events-none hidden lg:block`}
          />

          {/* Top & Bottom Overlay Gradients (Only in Dark Mode) */}
          {!isLight && (
            <>
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#06060c]/80 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06060c] to-transparent pointer-events-none lg:hidden" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
