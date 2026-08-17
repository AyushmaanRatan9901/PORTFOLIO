import { useState } from "react";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useProfileContext } from "../context/ProfileContext";
import profileImg from "../assets/WhatsApp Image 2023-10-03 at 19.59.46.jpg";

export default function Hero() {
  const { profile, downloadResume } = useProfileContext();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      await downloadResume();
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  const stats = [
    { value: `${profile.projects?.length || 0}+`, label: "Projects" },
    { value: `${profile.experience?.length || 0}`, label: "Internships" },
    { value: `${profile.achievements?.length || 0}`, label: "Certifications" },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center overflow-hidden pt-24 pb-12 sm:pt-28 lg:pt-24"
    >
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            Hi, I'm <span className="gradient-text">{profile.name}</span>
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl mt-4 font-bold text-slate-200">
            {profile.role}
          </h2>

          <p className="text-slate-400 mt-6 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
            {profile.summary}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
            <a href="#projects" className="btn btn-primary">
              View Projects <ArrowRight size={18} />
            </a>

            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="btn btn-outline cursor-pointer disabled:opacity-75"
            >
              {downloading ? (
                <>
                  Downloading... <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                <>
                  Download Resume <Download size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center lg:items-end"
        >
          <div className="absolute top-8 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-sky-500/20 blur-3xl rounded-full"></div>

          <img
            src={profileImg}
            alt={profile.name}
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] object-cover rounded-full border-4 border-sky-500 shadow-2xl"
          />

          <div className="relative grid grid-cols-3 gap-3 mt-6 w-full max-w-sm sm:max-w-md">
            {stats.map((s) => (
              <div key={s.label} className="card p-3 sm:p-4 text-center">
                <b className="text-lg sm:text-xl text-white">{s.value}</b>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
