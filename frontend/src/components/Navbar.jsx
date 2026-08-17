import { Menu, X, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useProfileContext } from "../context/ProfileContext";

const links = ["Home", "About", "Skills", "Projects", "Experience", "Contact"];

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.6 };

export default function FloatingNavbar() {
  const { profile } = useProfileContext();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [hovered, setHovered] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const itemRefs = useRef({});
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const progressWidth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    const key = hovered ?? active;
    const el = itemRefs.current[key];
    const track = trackRef.current;
    if (el && track) {
      const elRect = el.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      setIndicator({
        left: elRect.left - trackRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  }, [hovered, active]);

  return (
    <>
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-8 pointer-events-none">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
            delay: 0.1,
          }}
          className="relative pointer-events-auto flex items-center gap-2 sm:gap-3 rounded-full px-3 py-1.5 bg-slate-950/30 border border-white/10 backdrop-blur-md shadow-lg"
        >
          {/* Scroll progress hairline along bottom */}
          <motion.div
            style={{ scaleX: progressWidth }}
            className="pointer-events-none absolute bottom-0 left-3 right-3 h-[2px] origin-left rounded-full bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400"
          />

          {/* Desktop Nav Track */}
          <div
            ref={trackRef}
            className="relative hidden lg:flex items-center gap-1 z-10"
            onMouseLeave={() => setHovered(null)}
          >
            <motion.span
              animate={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
              }}
              transition={SPRING}
              className="absolute top-0 h-full rounded-full bg-white/10 border border-white/10"
            />
            {links.map((link) => {
              const isActive = active === link;
              return (
                <a
                  key={link}
                  ref={(el) => (itemRefs.current[link] = el)}
                  href={link === "Home" ? "#" : `#${link.toLowerCase()}`}
                  onMouseEnter={() => setHovered(link)}
                  onClick={() => setActive(link)}
                  className={[
                    "relative z-10 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-colors duration-200 flex items-center gap-1.5",
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-400 hover:text-slate-200",
                  ].join(" ")}
                >
                  {link}
                </a>
              );
            })}
          </div>

          <span className="hidden lg:inline-block h-4 w-px bg-white/10 mx-0.5" />

          {/* Right Action Icons & Admin Shortcut */}
          <div className="flex items-center gap-2 z-10">
            <ThemeToggle className="!py-1 !px-2.5 !text-xs" />

            <Link
              to="/admin/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-violet-300 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200"
              title="Admin Dashboard"
            >
              <Shield size={13} className="text-violet-400" />
              <span>Admin</span>
            </Link>

            {/* Mobile menu trigger button */}
            <div className="flex lg:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 text-slate-300 hover:text-white bg-slate-900/60 rounded-full border border-white/10 backdrop-blur-md"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex"
                  >
                    {open ? <X size={18} /> : <Menu size={18} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={SPRING}
            className="fixed right-4 left-4 sm:left-auto sm:w-80 top-20 z-40 lg:hidden rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-5 overflow-hidden"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(160deg, rgba(167,139,250,0.1) 0%, rgba(0,0,0,0) 50%)",
              }}
            />

            <motion.div
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.04, delayChildren: 0.04 },
                },
                closed: {},
              }}
              className="relative grid grid-cols-2 gap-2"
            >
              {links.map((link) => (
                <motion.a
                  key={link}
                  variants={{
                    closed: { opacity: 0, y: -8 },
                    open: { opacity: 1, y: 0 },
                  }}
                  href={link === "Home" ? "#" : `#${link.toLowerCase()}`}
                  onClick={() => {
                    setActive(link);
                    setOpen(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={[
                    "py-2.5 px-4 text-xs rounded-2xl font-semibold transition-colors duration-200 flex items-center justify-between",
                    active === link
                      ? "bg-violet-500/15 border border-violet-500/30 text-violet-300"
                      : "text-slate-300 hover:text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  <span>{link}</span>
                </motion.a>
              ))}
            </motion.div>

            <div className="relative h-px bg-white/10 my-4" />

            <div className="relative flex items-center justify-between px-1">
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold inline-flex items-center gap-2 text-slate-400 hover:text-violet-300 transition-colors"
              >
                <Shield size={14} className="text-violet-400" />
                <span>Admin Login</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
