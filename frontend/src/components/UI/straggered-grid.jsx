"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import imagesLoaded from "imagesloaded";
import { cn } from "../../lib/utils";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaJava,
  FaLinkedin,
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
  SiLeetcode,
  SiHackerrank,
  // SiLinkedin,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

import { useTheme } from "../../context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

// ── Tech stack pulled from Ayushmaan Ratan's resume (Technical Skills) ──
// Used to drive the icons that appear in the rotating grid squares.
const defaultTechStack = [
  { Icon: FaReact, label: "React.js" },
  { Icon: TbBrandReactNative, label: "React Native" },
  { Icon: SiExpo, label: "Expo" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: FaNodeJs, label: "Node.js" },
  { Icon: SiExpress, label: "Express.js" },
  { Icon: SiSocketdotio, label: "Socket.IO" },
  { Icon: SiMongodb, label: "MongoDB" },
  { Icon: SiMysql, label: "MySQL" },
  { Icon: SiFirebase, label: "Firebase" },
  { Icon: SiSupabase, label: "Supabase" },
  { Icon: SiCloudinary, label: "Cloudinary" },
  { Icon: SiTailwindcss, label: "Tailwind CSS" },
  { Icon: FaGitAlt, label: "Git" },
  { Icon: FaGithub, label: "GitHub" },
  { Icon: SiPostman, label: "Postman" },
  { Icon: FaJava, label: "Java" },
];

// ── Profile links shown in the bento group (replaces the old project cards) ──
// Each entry carries its own signature gradient (used for the border glow,
// icon badge, and title treatment) so the three cards read as distinct,
// deliberately-designed pieces. Update the `href` values to your real profile URLs.
const defaultBentoItems = [
  {
    id: "leetcode",
    title: "LeetCode",
    subtitle: "Problem Solving",
    description: "DSA practice and contest problem-solving profile.",
    icon: <SiLeetcode className="w-5 h-5" />,
    gradient: "from-amber-400 via-orange-500 to-yellow-500",
    href: "https://leetcode.com/YOUR_USERNAME",
  },
  {
    id: "hackerrank",
    title: "HackerRank",
    subtitle: "Coding Challenges",
    description: "Coding challenges and skill certifications.",
    icon: <SiHackerrank className="w-5 h-5" />,
    gradient: "from-emerald-400 via-green-500 to-teal-500",
    href: "https://www.hackerrank.com/YOUR_USERNAME",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    subtitle: "Professional Profile",
    description: "Work experience, projects, and professional network.",
    icon: <FaLinkedin className="w-5 h-5" />,
    gradient: "from-sky-400 via-blue-500 to-blue-600",
    href: "https://www.linkedin.com/in/YOUR_USERNAME",
  },
];

/**
 * @param {object} props
 * @param {string[]} [props.images] - Array of image/icon-set entries used to fill the rotating grid squares
 * @param {Array<{id: string|number, title: string, subtitle: string, description: string, icon: React.ReactNode, gradient?: string, href?: string, content?: React.ReactNode, image?: string}>} [props.bentoItems] - Profile links shown in the expandable center bento group
 * @param {string} [props.centerText]
 * @param {{madeBy: {text: string, href: string}, moreDemos: {text: string, href: string}}} [props.credits]
 * @param {string} [props.className]
 * @param {boolean} [props.showFooter]
 * @param {string | Element | Window | null} [props.scroller]
 */
export function StaggeredGrid({
  images,
  bentoItems = defaultBentoItems,
  centerText = "Technologies",
  credits = {
    madeBy: { text: "Ayushmaan Ratan", href: "https://github.com" },
    moreDemos: { text: "View projects", href: "#projects" },
  },
  className,
  showFooter = true,
  scroller,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isLoaded, setIsLoaded] = useState(false);
  const gridFullRef = useRef(null);
  const textRef = useRef(null);

  // Bento Grid State
  const [activeBento, setActiveBento] = useState(0);

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={`char inline-block ${isLight ? "text-black" : "text-white"}`}
        style={{ willChange: "transform" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useEffect(() => {
    const handleLoad = () => {
      document.body.classList.remove("loading");
      setIsLoaded(true);
    };

    // Wait for background images to load
    const imgLoad = imagesLoaded(
      document.querySelectorAll(".grid__item-img"),
      { background: true },
      handleLoad,
    );

    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Animate Text Element
    if (textRef.current) {
      const chars = textRef.current.querySelectorAll(".char");
      gsap
        .timeline({
          scrollTrigger: {
            trigger: textRef.current,
            scroller: scroller || undefined,
            start: "top bottom",
            end: "center center-=25%",
            scrub: 1,
          },
        })
        .from(chars, {
          ease: "sine.out",
          yPercent: 300,
          autoAlpha: 0,
          stagger: {
            each: 0.05,
            from: "center",
          },
        });
    }

    // Animate Full Grid
    if (gridFullRef.current) {
      const gridFullItems = gridFullRef.current.querySelectorAll(".grid__item");
      const numColumns = getComputedStyle(gridFullRef.current)
        .getPropertyValue("grid-template-columns")
        .split(" ").length;
      const middleColumnIndex = Math.floor(numColumns / 2);

      const columns = Array.from({ length: numColumns }, () => []);
      gridFullItems.forEach((item) => {
        const colAttr = item.getAttribute("data-col");
        // Use data-col if available, fallback to a safe index calculation
        const columnIndex = colAttr !== null ? parseInt(colAttr, 10) : 0;
        if (columns[columnIndex]) {
          columns[columnIndex].push(item);
        }
      });

      columns.forEach((columnItems, columnIndex) => {
        const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: gridFullRef.current,
              scroller: scroller || undefined,
              start: "top bottom",
              end: "center center",
              scrub: 1.5,
            },
          })
          .from(columnItems, {
            yPercent: 450,
            autoAlpha: 0,
            delay: delayFactor,
            ease: "sine.out",
          })
          .from(
            columnItems.map((item) => item.querySelector(".grid__item-img")),
            {
              transformOrigin: "50% 0%",
              ease: "sine.out",
            },
            0,
          );
      });

      // Specific animation for Bento Container
      const bentoContainer =
        gridFullRef.current.querySelector(".bento-container");

      if (bentoContainer) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            scroller: scroller || undefined,
            start: "top top+=15%",
            end: "bottom center",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Animate Bento Container to move down and scale
        tl.to(
          bentoContainer,
          {
            y: window.innerHeight * 0.1, // Move down relative to grid
            scale: 1.5, // Scale up the whole group
            zIndex: 1000,
            ease: "power2.out", // Smooth easing
            duration: 1,
            force3D: true, // Force hardware acceleration
          },
          0,
        );
      }
    }
  }, [isLoaded]);

  // Fall back to the resume-derived tech stack if no images/icons were passed in
  const gridFillItems =
    images && images.length > 0 ? images : defaultTechStack.map((t) => t.label);

  // Prepare grid items: fill up to the end of Row 3 (21 slots)
  const mixedGridItems = Array.from(
    { length: 21 },
    (_, i) => gridFillItems[i % gridFillItems.length],
  );

  // Replace the slot where we want the bento group
  // Position at index 16 = Row 3 (middle row), spanning columns 3-5 (center)
  mixedGridItems[16] = "BENTO_GROUP";

  const handleBentoClick = (index, href) => {
    if (activeBento === index && href) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      setActiveBento(index);
    }
  };

  return (
    <div
      className={cn("relative overflow-hidden w-full border-none shadow-none", className)}
      style={{
        "--grid-item-translate": "0px",
      }}
    >
      {/* gradient-border animation keyframes, scoped once for this component */}
      <style>{`
        @keyframes bento-gradient-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bento-gradient-border {
          background-size: 200% 200%;
          animation: bento-gradient-pan 6s ease infinite;
        }
      `}</style>

      <section className="grid place-items-center w-full relative mt-[10vh]">
        <div
          ref={textRef}
          className={`text font-alt uppercase flex content-center text-[clamp(3rem,14vw,10rem)] leading-[0.7] ${isLight ? "text-black" : "text-white"}`}
        >
          {splitText(centerText)}
        </div>
      </section>

      <section className="grid place-items-center w-full relative">
        <div
          ref={gridFullRef}
          className="grid--full relative w-full my-[10vh] h-auto aspect-[1.1] max-w-none p-4 grid gap-4 grid-cols-7 grid-rows-5"
        >
          <div className="grid-overlay absolute inset-0 z-[15] pointer-events-none opacity-0 bg-white/80 dark:bg-black/80 rounded-lg transition-opacity duration-500" />
          {mixedGridItems.map((item, i) => {
            if (item === "BENTO_GROUP") {
              // Render the HoverExpand Group using passed bentoItems
              if (!bentoItems || bentoItems.length === 0) return null;

              return (
                <div
                  key="bento-group"
                  data-col={2}
                  className="grid__item bento-container col-span-3 row-span-1 relative z-20 flex items-center justify-center gap-2 h-full w-full will-change-transform"
                >
                  {bentoItems.map((bentoItem, index) => {
                    const isActive = activeBento === index;
                    const gradient =
                      bentoItem.gradient ||
                      "from-zinc-500 via-zinc-400 to-zinc-600";

                    return (
                      <div
                        key={bentoItem.id}
                        title={
                          isActive ? `Open ${bentoItem.title}` : bentoItem.title
                        }
                        className={cn(
                          "group relative cursor-pointer overflow-hidden rounded-2xl h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] p-[1.5px]",
                          isActive
                            ? `bg-gradient-to-br ${gradient} bento-gradient-border shadow-2xl`
                            : isLight
                            ? "bg-slate-200 hover:bg-gradient-to-br hover:bento-gradient-border"
                            : "bg-zinc-800/60 hover:bg-gradient-to-br hover:bento-gradient-border",
                          !isActive && `hover:${gradient}`,
                        )}
                        style={{ width: isActive ? "60%" : "20%" }}
                        onMouseEnter={() => setActiveBento(index)}
                        onClick={() => handleBentoClick(index, bentoItem.href)}
                      >
                        {/* inner surface sits 1.5px inset from the gradient border above */}
                        <div
                          className={cn(
                            "relative w-full h-full rounded-[15px] overflow-hidden transition-colors duration-700",
                            isActive
                              ? isLight
                                ? "bg-white"
                                : "bg-zinc-950/40"
                              : isLight
                              ? "bg-white"
                              : "bg-zinc-950",
                          )}
                        >
                          {/* soft gradient wash behind content */}
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700",
                              gradient,
                              isActive
                                ? "opacity-25"
                                : "group-hover:opacity-15",
                            )}
                          />

                          {/* Content Container */}
                          <div className="relative z-10 w-full h-full flex flex-col p-0">
                            {/* Active State Content */}
                            <div
                              className={cn(
                                "absolute inset-0 flex flex-col transition-all duration-500 ease-in-out",
                                isActive
                                  ? "opacity-100 translate-y-0"
                                  : "opacity-0 translate-y-4 pointer-events-none",
                              )}
                            >
                              <div className="absolute inset-0 overflow-hidden z-0 group/img">
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                                  <div
                                    className={cn(
                                      "flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br text-white shadow-lg",
                                      gradient,
                                    )}
                                  >
                                    {bentoItem.icon}
                                  </div>
                                  <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-700 font-medium" : "text-zinc-300")}>
                                    {bentoItem.description}
                                  </p>
                                  <span className={cn("text-[9px] uppercase tracking-wider mt-1", isLight ? "text-slate-500" : "text-zinc-500")}>
                                    Click again to open ↗
                                  </span>
                                </div>
                              </div>

                              {/* Footer Row - Full Width with Shadow */}
                              <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-between px-5 z-20">
                                <div className="flex flex-col relative z-10">
                                  <h3
                                    className={cn(
                                      "text-sm font-bold leading-none tracking-tight bg-gradient-to-r bg-clip-text text-transparent drop-shadow-md",
                                      gradient,
                                    )}
                                  >
                                    {bentoItem.title}
                                  </h3>
                                  <span className={cn("text-[10px] mt-1", isLight ? "text-slate-600 font-medium" : "text-zinc-400")}>
                                    {bentoItem.subtitle}
                                  </span>
                                </div>
                                <div
                                  className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br text-white shadow-md relative z-10",
                                    gradient,
                                  )}
                                >
                                  {bentoItem.icon}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Inactive State - Icon + Title - Centered */}
                          <div
                            className={cn(
                              "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-500",
                              isActive
                                ? "opacity-0 scale-90 pointer-events-none"
                                : "opacity-100 scale-100",
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br text-white/80 group-hover:text-white transition-colors shadow-md",
                                gradient,
                              )}
                            >
                              {bentoItem.icon}
                            </div>
                            <span className={cn("text-[10px] font-semibold transition-colors uppercase tracking-wider", isLight ? "text-slate-700 group-hover:text-slate-900" : "text-zinc-500 group-hover:text-zinc-200")}>
                              {bentoItem.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            // Skip rendering for the slots that the group takes up
            if (i === 17 || i === 18) return null;

            // Cycle through the resume tech stack for each grid square
            const { Icon, label } =
              defaultTechStack[i % defaultTechStack.length];

            return (
              <figure
                key={`img-${i}`}
                data-col={i % 7}
                className="grid__item m-0 relative z-10 [perspective:800px] will-change-[transform,opacity] group cursor-pointer"
              >
                <div className={cn(
                  "grid__item-img w-full h-full [backface-visibility:hidden] will-change-transform rounded-xl overflow-hidden shadow-sm border-none flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-xl group-hover:border-transparent",
                  isLight ? "bg-white" : "bg-zinc-950"
                )}>
                  {/* Gradient Overlay for Hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Content Container */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                    {/* Icon */}
                    <Icon className={cn("w-8 h-8 transition-all duration-300 group-hover:text-white group-hover:scale-110", isLight ? "text-slate-700" : "text-zinc-500")} />

                    {/* Text Reveal */}
                    <div className="text-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      <span className="block text-[10px] font-medium text-white/90 uppercase tracking-wider mb-0.5">
                        Built with
                      </span>
                      <span className="block text-sm font-bold text-white tracking-tight">
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </section>

      {/* {showFooter && (
        <footer className="frame__footer w-full p-8 flex justify-between items-center relative z-50 text-neutral-900 dark:text-white uppercase font-medium text-xs tracking-wider">
          <a
            href={credits.madeBy.href}
            className="hover:opacity-60 transition-opacity"
          >
            {credits.madeBy.text}
          </a>
          <a
            href={credits.moreDemos.href}
            className="hover:opacity-60 transition-opacity"
          >
            {credits.moreDemos.text}
          </a>
        </footer>
      )} */}
    </div>
  );
}

export default StaggeredGrid;
