import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  Cpu,
  Database,
  Layers,
  Globe,
  Terminal,
  Activity,
  Play,
  Pause,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Currency Symbol Formatter
 */
function formatCurrency(amount, currencyCode = "USD") {
  const symbolMap = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    EUR: "€",
  };
  const symbol = symbolMap[currencyCode.toUpperCase()] || "$";
  return `${symbol}${amount.toLocaleString()}`;
}

/**
 * BentoGrid Container Component
 */
export function BentoGrid({ children, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * BentoCard Component with 3D Spotlight & Micro-Interactions
 */
export function BentoCard({
  className,
  title,
  subtitle,
  description,
  header,
  icon: Icon,
  badge,
  badgeColor = "violet",
  ctaText,
  ctaLink = "#",
  onClick,
  children,
  colSpan = "col-span-1",
  rowSpan = "row-span-1",
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-4, 4]), {
    stiffness: 200,
    damping: 25,
  });

  const spotlightX = useTransform(mx, (v) => `${v * 100}%`);
  const spotlightY = useTransform(my, (v) => `${v * 100}%`);

  const spotlightBg = useMotionTemplate`radial-gradient(400px circle at ${spotlightX} ${spotlightY}, rgba(139, 92, 246, 0.15), transparent 80%)`;

  function handleMouseMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const badgeStyles = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300",
        "border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl hover:border-slate-700/80 hover:shadow-2xl hover:shadow-violet-500/10",
        colSpan,
        rowSpan,
        className
      )}
    >
      {/* Dynamic Cursor Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{ background: spotlightBg }}
      />

      {/* Header Visual element / Custom graphic slot */}
      {header && <div className="mb-4 w-full overflow-hidden rounded-2xl">{header}</div>}

      <div className="relative z-20 flex flex-col flex-1 justify-between space-y-4">
        {/* Top Badges & Icon */}
        <div className="flex items-center justify-between">
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-violet-400 shadow-inner group-hover:scale-110 group-hover:border-violet-500/30 transition-transform duration-300">
              <Icon className="h-6 w-6" />
            </div>
          )}

          {badge && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md",
                badgeStyles[badgeColor] || badgeStyles.violet
              )}
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              {badge}
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div>
          {subtitle && (
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
              {subtitle}
            </p>
          )}

          {title && (
            <h3 className="text-xl font-black tracking-tight text-white group-hover:text-violet-200 transition-colors">
              {title}
            </h3>
          )}

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-400 font-normal">
              {description}
            </p>
          )}
        </div>

        {/* Custom Body Children */}
        {children && <div className="pt-2">{children}</div>}

        {/* CTA Link / Button */}
        {ctaText && (
          <div className="pt-4 flex items-center justify-between border-t border-slate-800/60 mt-auto">
            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors flex items-center gap-1">
              {ctaText}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-500 group-hover:translate-x-1 transition-all duration-300">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const BRANDS = [
  {
    name: "Avorix Reality ERP",
    category: "Real Estate ERP Platform",
    tagline: "Multi-dashboard enterprise system for buyers, sellers, brokers, and admins.",
    metrics: "6 Role Dashboards",
    accent: "violet",
    tech: ["React Native", "Node.js", "Express", "MongoDB", "JWT Auth"],
  },
  {
    name: "AI Generative Engine",
    category: "Cloud Media & Synthesis",
    tagline: "High-throughput image generation with Cloudinary media pipelines.",
    metrics: "Sub-second Generation",
    accent: "amber",
    tech: ["Cloudinary API", "JWT", "Express.js", "React Native", "REST"],
  },
  {
    name: "React Native Mobile Suite",
    category: "Cross-Platform Ecosystem",
    tagline: "Native 60 FPS mobile performance with modular UI architecture.",
    metrics: "Native Performance",
    accent: "emerald",
    tech: ["React Native", "Expo", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "Realtime Data Engine",
    category: "Socket.IO & Database Architecture",
    tagline: "Persistent data synchronization with real-time socket connections.",
    metrics: "99.99% Availability",
    accent: "sky",
    tech: ["MongoDB", "Supabase", "MySQL", "Socket.IO", "Node.js"],
  },
];

/**
 * Main ResearchBentoGrid Component
 */
export default function ResearchBentoGrid({
  monthlyPrice = 1990,
  previousPrice = 32000,
  currency = "USD",
  defaultSelectedBrand = 0,
  onPausedChange,
  onSelectedBrandChange,
  className,
}) {
  const [selectedBrand, setSelectedBrand] = useState(defaultSelectedBrand);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setSelectedBrand(defaultSelectedBrand);
  }, [defaultSelectedBrand]);

  const handleBrandClick = (index) => {
    setSelectedBrand(index);
    if (onSelectedBrandChange) {
      onSelectedBrandChange(index);
    }
  };

  const handlePauseToggle = () => {
    const nextState = !isPaused;
    setIsPaused(nextState);
    if (onPausedChange) {
      onPausedChange(nextState);
    }
  };

  const currentBrand = BRANDS[selectedBrand] || BRANDS[0];

  const savingsValue = previousPrice > monthlyPrice ? previousPrice - monthlyPrice : 0;
  const savingsPercent =
    previousPrice > 0 ? Math.round(((previousPrice - monthlyPrice) / previousPrice) * 100) : 0;

  return (
    <section className={cn("py-12 relative overflow-hidden", className)}>
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/10 blur-[130px] rounded-full" />

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-12 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-extrabold text-violet-300 uppercase tracking-wider mb-4">
          <Activity className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span>RESEARCH BENTO ARCHITECTURE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          System Benchmarks &{" "}
          <span className="bg-gradient-to-r from-violet-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
            Research Portfolio
          </span>
        </h2>

        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore benchmark metrics, system architecture, enterprise pricing ROI, and active technology stacks.
        </p>
      </div>

      {/* Bento Grid layout */}
      <BentoGrid>
        {/* Card 1: Interactive Brand & Research Hub (2 Columns) */}
        <BentoCard
          colSpan="col-span-1 md:col-span-2 lg:col-span-2"
          icon={Layers}
          badge="Brand Selector"
          badgeColor={currentBrand.accent}
          subtitle="Research Hub"
          title={currentBrand.name}
          description={currentBrand.tagline}
        >
          <div className="space-y-4">
            {/* Brand Switcher Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {BRANDS.map((brand, idx) => {
                const isSelected = selectedBrand === idx;
                return (
                  <button
                    key={brand.name}
                    onClick={() => handleBrandClick(idx)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border",
                      isSelected
                        ? "bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30 scale-105"
                        : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    )}
                  >
                    <span>{brand.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Play/Pause Control Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-950/80 mt-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75",
                      isPaused ? "bg-amber-400" : "bg-emerald-400 animate-ping"
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex rounded-full h-2.5 w-2.5",
                      isPaused ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Animation State: <strong className={isPaused ? "text-amber-400" : "text-emerald-400"}>{isPaused ? "PAUSED" : "ACTIVE TICKER"}</strong>
                </span>
              </div>

              <button
                onClick={handlePauseToggle}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPaused ? <Play size={13} className="text-emerald-400" /> : <Pause size={13} className="text-amber-400" />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Enterprise Pricing & ROI Card */}
        <BentoCard
          colSpan="col-span-1 md:col-span-1 lg:col-span-2"
          icon={TrendingUp}
          badge={`${savingsPercent}% Cost Savings`}
          badgeColor="emerald"
          subtitle="Value & Pricing Analysis"
          title="Enterprise Value Metric"
          description="Quantified cost optimization against traditional agency implementation estimates."
        >
          <div className="space-y-4 pt-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formatCurrency(monthlyPrice, currency)}
              </span>
              <span className="text-sm font-bold text-slate-400">/ month</span>

              {previousPrice > monthlyPrice && (
                <span className="text-base font-bold text-slate-500 line-through decoration-rose-500/80">
                  {formatCurrency(previousPrice, currency)}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Estimated Value Saved:</span>
              </span>
              <span className="text-sm font-black">{formatCurrency(savingsValue, currency)}</span>
            </div>
          </div>
        </BentoCard>

        {/* Card 3: Live System Performance Ticker */}
        <BentoCard
          colSpan="col-span-1 md:col-span-1 lg:col-span-1"
          icon={Cpu}
          badge="Live State"
          badgeColor="sky"
          subtitle="System Performance"
          title="60 FPS Native UI"
          description="Optimized frame execution and low-latency state mutations."
        >
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Frame Rate</span>
              <span className="text-sky-400">60 FPS</span>
            </div>
            <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <motion.div
                animate={{ width: isPaused ? "40%" : "95%" }}
                transition={{ duration: 1, repeat: isPaused ? 0 : Infinity, repeatType: "reverse" }}
                className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full"
              />
            </div>
          </div>
        </BentoCard>

        {/* Card 4: Active Tech Stack Card (2 Columns) */}
        <BentoCard
          colSpan="col-span-1 md:col-span-2 lg:col-span-2"
          icon={Terminal}
          badge="Tech Stack"
          badgeColor="amber"
          subtitle="Architecture Engine"
          title={`${currentBrand.name} Stack`}
          description="Core technologies and frameworks integrated into this system module."
        >
          <div className="flex flex-wrap gap-2 pt-2">
            {currentBrand.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-200 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{t}</span>
              </span>
            ))}
          </div>
        </BentoCard>

        {/* Card 5: Security & Deployment Readiness */}
        <BentoCard
          colSpan="col-span-1 md:col-span-1 lg:col-span-1"
          icon={ShieldCheck}
          badge="Production Ready"
          badgeColor="violet"
          subtitle="Security Standard"
          title="JWT & Cloud Auth"
          description="Bank-grade encryption, secure session tokens, and route protection."
        >
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted & Verified</span>
          </div>
        </BentoCard>
      </BentoGrid>
    </section>
  );
}
