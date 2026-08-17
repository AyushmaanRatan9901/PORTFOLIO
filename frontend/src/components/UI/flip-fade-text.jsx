"use client";

import { useEffect, useState, useMemo, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const defaultWords = [
  "LOADING",
  "COMPUTING",
  "SEARCHING",
  "RETRIEVING",
  "ASSEMBLING",
];

// Memoized Letter component for performance
const Letter = memo(function Letter({ char, letterDuration }) {
  return (
    <motion.span
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        initial: {
          rotateX: 90,
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -20,
          opacity: 0,
          filter: "blur(8px)",
          transition: {
            duration: letterDuration * 0.67,
            ease: "easeIn",
          },
        },
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  );
});

// Memoized Word component for performance
const Word = memo(function Word({
  text,
  staggerDelay,
  exitStaggerDelay,
  letterDuration,
  textClassName,
  onAnimationComplete,
}) {
  const letters = useMemo(() => text.split(""), [text]);

  return (
    <motion.div
      className={cn(
        "flex gap-[0.1em] text-2xl md:text-3xl font-bold uppercase tracking-wider",
        textClassName,
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      // "definition" tells us which variant just finished — we only care
      // about "animate" (the word fully appeared), not "exit".
      onAnimationComplete={onAnimationComplete}
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          opacity: 1,
          transition: {
            staggerChildren: exitStaggerDelay,
          },
        },
      }}
    >
      {letters.map((char, i) => (
        <Letter
          key={`${char}-${i}`}
          char={char}
          letterDuration={letterDuration}
        />
      ))}
    </motion.div>
  );
});

/**
 * @param {object} props
 * @param {string[]} [props.words] - Array of words to cycle through. Default: ["LOADING", "COMPUTING", "SEARCHING", "RETRIEVING", "ASSEMBLING"]
 * @param {number} [props.interval] - How long (ms) a word stays fully visible AFTER it finishes appearing, before the next one starts. Default: 2500
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {string} [props.textClassName] - Additional CSS classes for the text
 * @param {number} [props.letterDuration] - Animation duration for each letter in seconds. Default: 0.6
 * @param {number} [props.staggerDelay] - Stagger delay between letters on enter in seconds. Default: 0.1
 * @param {number} [props.exitStaggerDelay] - Stagger delay between letters on exit in seconds. Default: 0.05
 */
export function FlipFadeText({
  words = defaultWords,
  interval = 2500,
  className,
  textClassName,
  letterDuration = 0.6,
  staggerDelay = 0.1,
  exitStaggerDelay = 0.05,
}) {
  const [index, setIndex] = useState(0);
  const holdTimeoutRef = useRef(null);

  const currentWord = useMemo(() => words[index], [words, index]);

  // Called only when the word's "animate" (enter) variant finishes —
  // i.e. every letter has fully flipped in. Only then do we start the
  // hold timer, and only after that timer fires do we advance to the
  // next word (which triggers this word's exit). This guarantees the
  // next word can never start appearing until the current one has
  // completely finished appearing (and then exited).
  const handleWordAnimationComplete = useCallback(
    (definition) => {
      if (definition !== "animate") return;

      holdTimeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
      }, interval);
    },
    [interval, words.length],
  );

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[40px] mb-[-15]",
        className,
      )}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <AnimatePresence mode="wait">
          <Word
            key={currentWord}
            text={currentWord}
            staggerDelay={staggerDelay}
            exitStaggerDelay={exitStaggerDelay}
            letterDuration={letterDuration}
            textClassName={textClassName}
            onAnimationComplete={handleWordAnimationComplete}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FlipFadeText;
