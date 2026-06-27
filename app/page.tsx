"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  Variants,
} from "framer-motion";
import {
  Zap,
  ShieldCheck,
  MapPin,
  Star,
  Mail,
  Link2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

/* ----------------------------------------------------------------------- */
/* Data                                                                     */
/* ----------------------------------------------------------------------- */

const features = [
  { title: "Instant Booking", description: "Hire workers in minutes, not days.", icon: Zap },
  { title: "Verified Pros", description: "Background-checked and skilled.", icon: ShieldCheck },
  { title: "Live Tracking", description: "Know exactly when they arrive.", icon: MapPin },
  { title: "Transparent Ratings", description: "Real reviews from real users.", icon: Star },
];

const workerCards = [
  { name: "Raj Kumar", role: "Electrician", tag: "2 mins away", rating: 5 },
  { name: "Amit Singh", role: "Plumber", tag: "Available Now", rating: 5 },
  { name: "Mohit", role: "Carpenter", tag: "4.9 Rating", rating: 5 },
];

const LAUNCH_DATE = new Date("2026-07-05T00:00:00");

/* ----------------------------------------------------------------------- */
/* Hooks                                                                    */
/* ----------------------------------------------------------------------- */

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(target.getTime() - Date.now(), 0);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setTime({ days, hours, mins });
    };
    tick();
    const interval = setInterval(tick, 1000 * 30);
    return () => clearInterval(interval);
  }, [target]);

  return time;
}

/** Tracks normalized mouse position (-0.5 to 0.5) for desktop parallax. */
function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return { x, y };
}

/* ----------------------------------------------------------------------- */
/* Motion variants                                                         */
/* ----------------------------------------------------------------------- */

const revealUp: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98, filter: "blur(6px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/* ----------------------------------------------------------------------- */
/* Logo                                                                     */
/* ----------------------------------------------------------------------- */

function AnimatedLogo({ width = 150, height = 38 }: { width?: number; height?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.04 }}
      className="inline-block"
    >
      <motion.div
        animate={{
          y: [0, -3, 0],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
      >
        <Image
          src="/logo.svg"
          alt="LabourBaba"
          width={width}
          height={height}
          priority
          className="h-9 w-auto select-none"
        />
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* Premium Button                                                          */
/* ----------------------------------------------------------------------- */

function PremiumButton({
  children,
  variant = "solid",
  className = "",
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    onClick?.();
  };

  const base =
    variant === "solid"
      ? "bg-[#FF5404] text-white"
      : "bg-white text-[#FF5404] border border-[#FF5404]/40";

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      whileHover={{ y: -3, boxShadow: "0 14px 28px rgba(255,84,4,0.32)" }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative overflow-hidden font-semibold rounded-full shadow-sm group ${base} ${className}`}
    >
      {/* idle glow pulse */}
      <motion.span
        animate={{ opacity: [0, 0.3, 0], scale: [1, 1.7, 1.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", repeatDelay: 1.4 }}
        className={`absolute inset-0 rounded-full ${
          variant === "solid" ? "bg-white" : "bg-[#FF5404]"
        }`}
      />

      {/* shimmer sweep on hover */}
      <motion.span
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 w-1/3 bg-white/30 skew-x-[-20deg] pointer-events-none"
        style={{ mixBlendMode: variant === "solid" ? "overlay" : "multiply" }}
      />

      {/* click ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.45, scale: 0 }}
          animate={{ opacity: 0, scale: 4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-white pointer-events-none"
        />
      ))}

      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {children}
      </span>
    </motion.button>
  );
}

/* ----------------------------------------------------------------------- */
/* Odometer-style countdown digit                                          */
/* ----------------------------------------------------------------------- */

function OdometerDigit({ digit }: { digit: number }) {
  return (
    <span className="relative inline-block h-[1.5em] w-[0.62em] overflow-hidden align-bottom">
      <motion.span
        animate={{ y: `-${digit * 1.5}em` }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="absolute left-0 top-0 flex flex-col items-center"
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="h-[1.5em] leading-[1.5em]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function OdometerNumber({ value }: { value: number }) {
  const str = String(value).padStart(2, "0");
  return (
    <span className="inline-flex tabular-nums">
      {str.split("").map((d, i) => (
        <OdometerDigit key={i} digit={Number(d)} />
      ))}
    </span>
  );
}

/* ----------------------------------------------------------------------- */
/* Animated count-up with milestone steps                                  */
/* ----------------------------------------------------------------------- */

function MilestoneCounter({ milestones, suffix = "" }: { milestones: number[]; suffix?: string }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!started) return;
    let stepIndex = 0;
    let frame: number;

    const runStep = () => {
      const from = stepIndex === 0 ? 0 : milestones[stepIndex - 1];
      const to = milestones[stepIndex];
      const duration = 380;
      const start = performance.now();

      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(from + (to - from) * eased));
        if (progress < 1) {
          frame = requestAnimationFrame(animate);
        } else if (stepIndex < milestones.length - 1) {
          stepIndex += 1;
          frame = requestAnimationFrame(runStep);
        }
      };
      frame = requestAnimationFrame(animate);
    };

    runStep();
    return () => cancelAnimationFrame(frame);
  }, [started, milestones]);

  return (
    <motion.p
      ref={ref}
      onViewportEnter={() => setStarted(true)}
      className="text-3xl font-extrabold text-[#FF5404] tabular-nums"
    >
      {value.toLocaleString()}
      {suffix}
    </motion.p>
  );
}

/* ----------------------------------------------------------------------- */
/* Floating particle field                                                 */
/* ----------------------------------------------------------------------- */

function ParticleField() {
  const [particles, setParticles] = useState<
    {
      id: number;
      size: number;
      left: number;
      top: number;
      duration: number;
      delay: number;
      drift: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    const colors = ["#FF5404", "#10B981", "#38BDF8", "#FFB088"];

    setParticles(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 3,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 40,
        color: colors[i % colors.length],
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.35,
          }}
          animate={{
            y: [0, -28, 0],
            x: [0, p.drift, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Animated grid background                                                */
/* ----------------------------------------------------------------------- */

function AnimatedGrid() {
  return (
    <motion.div
      animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 pointer-events-none opacity-[0.05]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #1F2937 1px, transparent 1px), linear-gradient(to bottom, #1F2937 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} 
    />
  );
}

/* ----------------------------------------------------------------------- */
/* Floating worker card                                                    */
/* ----------------------------------------------------------------------- */

function FloatingWorkerCard({
  name,
  role,
  tag,
  rating,
  className,
  floatDelay = 0,
  rotateBase = -4,
  mouseX,
  mouseY,
  strength = 10,
}: {
  name: string;
  role: string;
  tag: string;
  rating: number;
  className?: string;
  floatDelay?: number;
  rotateBase?: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  strength?: number;
}) {
  const tiltX = useTransform(mouseY, [-0.5, 0.5], [strength, -strength]);
  const tiltY = useTransform(mouseX, [-0.5, 0.5], [-strength, strength]);
  const springTiltX = useSpring(tiltX, { stiffness: 80, damping: 14 });
  const springTiltY = useSpring(tiltY, { stiffness: 80, damping: 14 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: floatDelay * 0.15, duration: 0.5 }}
      style={{ rotateX: springTiltX, rotateY: springTiltY }}
      className={`absolute select-none ${className ?? ""}`}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [rotateBase, rotateBase + 3, rotateBase],
        }}
        transition={{
          duration: 5 + floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay * 0.4,
        }}
        whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
        className="bg-white/90 backdrop-blur-md border border-[#EFE2DC] rounded-2xl shadow-lg px-3.5 py-3 w-37.5"
      >
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={10} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <p className="mt-1.5 text-[12.5px] font-bold text-[#1F2937] leading-tight">{name}</p>
        <p className="text-[11px] text-[#6B7280]">{role}</p>
        <span className="mt-1.5 inline-block text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {tag}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* Phone mockup                                                            */
/* ----------------------------------------------------------------------- */

function PhoneMockup({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const tiltX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const springTiltX = useSpring(tiltX, { stiffness: 60, damping: 16 });
  const springTiltY = useSpring(tiltY, { stiffness: 60, damping: 16 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: springTiltX, rotateY: springTiltY }}
      className="relative mx-auto mt-10 w-57.5"
    >
      {/* moving shadow */}
      <motion.div
        animate={{ x: [0, 10, 0], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/30 rounded-full blur-xl"
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-[#15171C] rounded-[28px] p-2 shadow-2xl"
      >
        {/* reflection sweep */}
        <motion.div
          animate={{ x: ["-120%", "140%"] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none z-20"
        >
          <div className="w-1/3 h-full bg-white/10 skew-x-[-20deg]" />
        </motion.div>

        <div className="bg-[#F8F9FB] rounded-[20px] overflow-hidden">
          {/* status bar */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-1 text-[10px] font-medium text-[#1F2937]">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal size={10} />
              <Wifi size={10} />
              <Battery size={11} />
            </div>
          </div>

          {/* mini app content */}
          <div className="px-3 pb-3 pt-1">
            <p className="text-[11px] font-bold text-[#1F2937]">Live Booking</p>

            <div className="mt-2 rounded-xl bg-linear-to-br from-[#E9F1FF] to-[#F2F8FF] h-20 relative overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FF5404]"
              />
              <MapPin
                size={14}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-180%] text-[#FF5404]"
              />
            </div>

            <div className="mt-2 flex items-center gap-2 bg-white rounded-xl border border-[#EFE2DC] p-2">
              <div className="w-7 h-7 rounded-full bg-[#FFF1EA] flex items-center justify-center text-[#FF5404] text-[9px] font-bold">
                RK
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-[#1F2937]">Raj Kumar</p>
                <p className="text-[8.5px] text-[#FF5404] font-medium">ETA 4 mins</p>
              </div>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* Page                                                                     */
/* ----------------------------------------------------------------------- */

export default function ComingSoonPage() {
  const { days, hours, mins } = useCountdown(LAUNCH_DATE);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: mouseX, y: mouseY } = useMouseParallax();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const glowY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const glowY3 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Parallax for hero glows driven by mouse as well
  const heroGlowX = useTransform(mouseX, [-0.5, 0.5], [-18, 18]);
  const heroGlowY = useTransform(mouseY, [-0.5, 0.5], [-18, 18]);
  const heroGlowXSpring = useSpring(heroGlowX, { stiffness: 40, damping: 14 });
  const heroGlowYSpring = useSpring(heroGlowY, { stiffness: 40, damping: 14 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <motion.main
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8F9FB] relative overflow-hidden"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-0.75 bg-[#FF5404] origin-left z-50"
      />

      {/* Animated grid */}
      <AnimatedGrid />

      {/* Particle field */}
      <ParticleField />

      {/* Background glows — parallax on scroll */}
      <motion.div
        style={{ y: glowY1, x: heroGlowXSpring }}
        className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 blur-[130px] rounded-full"
      />
      <motion.div
        style={{ y: glowY2, x: heroGlowYSpring }}
        className="absolute top-105 left-0 w-72 h-72 bg-cyan-400/10 blur-[120px] rounded-full"
      />
      <motion.div
        style={{ y: glowY3 }}
        className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-400/10 blur-[120px] rounded-full"
      />

      {/* Header — glass on scroll */}
      <motion.header
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.8)",
          boxShadow: scrolled ? "0 8px 24px rgba(20,30,60,0.08)" : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-20 backdrop-blur-md border-b ${
          scrolled ? "border-[#EFE2DC]" : "border-transparent"
        }`}
      >
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <AnimatedLogo />

          <PremiumButton className="px-4 py-2 text-sm">Join Waitlist</PremiumButton>
        </div>
      </motion.header>

      <section className="max-w-md mx-auto px-5 pt-12 pb-16 relative z-10 text-center">
        {/* Floating worker cards around hero */}
        <div className="relative h-0">
          <FloatingWorkerCard
            {...workerCards[0]}
            className="-left-6 top-6 hidden sm:block"
            floatDelay={0}
            rotateBase={-6}
            mouseX={mouseX}
            mouseY={mouseY}
          />
          <FloatingWorkerCard
            {...workerCards[1]}
            className="-right-8 top-44 hidden sm:block"
            floatDelay={1}
            rotateBase={5}
            mouseX={mouseX}
            mouseY={mouseY}
          />
          <FloatingWorkerCard
            {...workerCards[2]}
            className="-left-4 top-112 hidden sm:block"
            floatDelay={2}
            rotateBase={-3}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </div>

        {/* Badge */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          animate="show"
          custom={0}
          whileHover={{ scale: 1.04 }}
          className="relative inline-flex items-center gap-2 bg-white border border-[#EFE2DC] rounded-full px-3.5 py-1.5 shadow-sm cursor-default"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          />
          <span className="text-xs font-semibold text-emerald-700">Coming  2026</span>

          <motion.span
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
            className="absolute -right-2 -top-2 text-amber-400"
          >
            <Sparkles size={14} />
          </motion.span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={revealUp}
          initial="hidden"
          animate="show"
          custom={0.08}
          className="mt-5 text-[2.15rem] leading-[1.15] font-extrabold text-[#1F2937] tracking-tight relative z-10"
        >
          India&apos;s{" "}
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: "linear-gradient(90deg, #FF5404, #FF8A4C, #FF5404)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            className="inline-block"
          >
            Smartest
          </motion.span>
          <br />
          Way to Hire
          <br />
          Skilled Workers
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={revealUp}
          initial="hidden"
          animate="show"
          custom={0.16}
          className="mt-4 text-[15px] text-[#6B7280] leading-relaxed max-w-85 mx-auto relative z-10"
        >
          Verified professionals, transparent pricing, and instant booking. Join the future
          of workforce management.
        </motion.p>

        {/* Countdown — odometer roll */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          animate="show"
          custom={0.24}
          className="mt-7 flex justify-center gap-3 relative z-10"
        >
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Mins", value: mins },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-[#EFE2DC] rounded-2xl shadow-sm w-[5.2rem] py-3 overflow-hidden"
            >
              <p className="text-2xl font-extrabold text-[#FF5404]">
                <OdometerNumber value={item.value} />
              </p>
              <p className="text-[11px] font-medium text-[#9AA1AC] mt-0.5">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Email form */}
        <motion.form
          onSubmit={handleSubmit}
          variants={revealUp}
          initial="hidden"
          animate="show"
          custom={0.32}
          className="mt-7 relative z-10"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 overflow-visible"
              >
                {/* Confetti burst */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  const distance = 46 + (i % 3) * 12;
                  const colors = ["#FF5404", "#10B981", "#FF8A4C", "#34D399", "#FBBF24"];
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                      animate={{
                        opacity: [1, 1, 0],
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        scale: [0, 1, 0.6],
                        rotate: 180,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: colors[i % colors.length] }}
                    />
                  );
                })}

                {/* floating stars */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={`star-${i}`}
                    initial={{ opacity: 0, y: 0, x: (i - 2) * 18 }}
                    animate={{ opacity: [0, 1, 0], y: -34 }}
                    transition={{ duration: 1.3, delay: 0.1 * i, ease: "easeOut" }}
                    className="absolute left-1/2 bottom-1/2 text-amber-400"
                  >
                    <Sparkles size={12} />
                  </motion.span>
                ))}

                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 14 }}
                >
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </motion.span>
                You&apos;re on the list! We&apos;ll notify you at launch 🎉
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-white border border-[#FF5404]/40 rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5404]/20 transition-shadow"
              >
                <Mail size={16} className="text-gray-400 ml-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 min-w-0 bg-transparent text-sm text-[#1F2937] placeholder:text-gray-400 outline-none py-2"
                />
                <PremiumButton type="submit" className="px-4 py-2.5 text-sm">
                  Join Now
                </PremiumButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Phone mockup */}
        <PhoneMockup mouseX={mouseX} mouseY={mouseY} />

        {/* Why Choose */}
        <motion.h2
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-[1.65rem] font-extrabold text-[#1F2937] leading-tight"
        >
          Why Choose
          <br />
          LabourBaba?
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-7 grid grid-cols-2 gap-3.5 text-left"
        >
          {features.map((item, i) => {
            const Icon = item.icon;
            const animProps =
              item.icon === Zap
                ? { rotate: [0, -10, 10, 0] }
                : item.icon === ShieldCheck
                ? { filter: ["drop-shadow(0 0 0px rgba(255,84,4,0))", "drop-shadow(0 0 6px rgba(255,84,4,0.55))", "drop-shadow(0 0 0px rgba(255,84,4,0))"] }
                : item.icon === MapPin
                ? { scale: [1, 1.18, 1] }
                : { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] };

            return (
              <motion.div
                key={item.title}
                variants={revealUp}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(20,30,60,0.08)" }}
                className="bg-white border border-[#EFE2DC] rounded-2xl shadow-sm p-4"
              >
                <motion.div
                  animate={animProps}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatDelay: 1.6,
                    delay: i * 0.3,
                  }}
                  whileHover={{ scale: 1.15 }}
                  className="w-10 h-10 rounded-full bg-[#FFF1EA] flex items-center justify-center"
                >
                  <Icon size={18} className="text-[#FF5404]" />
                </motion.div>
                <h3 className="mt-3 text-[14px] font-bold text-[#1F2937] leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1 text-[12.5px] text-[#6B7280] leading-snug">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.015 }}
          className="mt-10 relative bg-white border border-[#EFE2DC] rounded-3xl shadow-sm py-8 px-6 overflow-hidden"
        >
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-10 w-32 h-32 bg-emerald-100 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-100 rounded-full"
          />

          <div className="relative">
            <MilestoneCounter milestones={[1,23, 45,72, 80, 92]} suffix="+" />
            <p className="mt-1 text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
              Workers Ready
            </p>
          </div>

          <div className="relative h-px bg-[#EFE2DC] my-6" />

          <div className="relative">
            <MilestoneCounter milestones={[10, 18,96,109,198, 253]} suffix="+" />
            <p className="mt-1 text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
              Waitlist Signups
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#FF5404]/20 bg-white/60">
        <div className="max-w-md mx-auto px-5 py-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center"
          >
            <AnimatedLogo width={140} height={34} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.06, rotate: 12 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-full bg-white border border-[#EFE2DC] flex items-center justify-center text-[#6B7280] hover:text-[#FF5404] hover:border-[#FF5404]/40 transition-colors"
            >
              <Link2 size={15} />
            </motion.button>
            <motion.button
              whileHover={{ y: -2, scale: 1.06, rotate: -12 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-full bg-white border border-[#EFE2DC] flex items-center justify-center text-[#6B7280] hover:text-[#FF5404] hover:border-[#FF5404]/40 transition-colors"
            >
              <Mail size={15} />
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mt-5 text-xs text-[#9AA1AC] leading-relaxed"
          >
            © 2026 LabourBaba. India&apos;s Smartest Workforce Platform.
          </motion.p>
        </div>
      </footer>
    </motion.main>
  );
}