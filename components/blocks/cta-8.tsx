"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const maskAt = (x: number, y: number) =>
  `radial-gradient(circle 460px at ${x}px ${y}px, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.08) 80%, transparent 100%)`;

export default function Cta8() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const targetRef = useRef({ x: -9999, y: -9999 });
  const currentRef = useRef({ x: -9999, y: -9999 });
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const h = headingRef.current;
      if (!h) return;
      const rect = h.getBoundingClientRect();
      lastMoveRef.current = performance.now();
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      cursorRef.current = null;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 11000;

    const apply = (x: number, y: number) => {
      const h = headingRef.current;
      if (!h) return;
      const value = maskAt(x, y);
      h.style.maskImage = value;
      h.style.webkitMaskImage = value;
    };

    const tick = (t: number) => {
      const h = headingRef.current;
      if (h) {
        const hRect = h.getBoundingClientRect();
        const idle = t - lastMoveRef.current > 700 || !cursorRef.current;

        if (idle) {
          if (reduce) {
            targetRef.current = { x: hRect.width / 2, y: hRect.height / 2 };
          } else {
            const elapsed = (t - start) % duration;
            const progress = elapsed / duration;
            const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
            targetRef.current = { x: eased * hRect.width, y: hRect.height / 2 };
          }
        } else if (cursorRef.current) {
          targetRef.current = cursorRef.current;
        }

        if (currentRef.current.x === -9999 || reduce) {
          currentRef.current = { ...targetRef.current };
        } else {
          const lerp = 0.08;
          currentRef.current = {
            x:
              currentRef.current.x +
              (targetRef.current.x - currentRef.current.x) * lerp,
            y:
              currentRef.current.y +
              (targetRef.current.y - currentRef.current.y) * lerp,
          };
        }
        apply(currentRef.current.x, currentRef.current.y);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const wordmark = {
    initial: { opacity: 0, y: reduce ? 0 : 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, delay: 0.3, ease: EASE },
  };
  const wordmarkClass =
    "pointer-events-none absolute bottom-4 left-0 right-0 select-none text-center font-black leading-[0.85] sm:bottom-5 lg:bottom-6";

  return (
    <section
      ref={sectionRef}
      className="@container relative flex min-h-[var(--rb-section-min-h,100vh)] w-full flex-col items-center justify-start overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 dark:bg-neutral-950"
    >
      <div className="relative z-10 flex flex-col items-center">
        <motion.a
          href="/Ryan_De_Guzman_Insight_Software_Engineer.pdf"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-8 text-base font-medium text-white transition-[background-color,transform] duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
        >
          Download Resume
        </motion.a>
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="mt-5 text-sm text-neutral-500 dark:text-neutral-400"
        ></motion.p>
      </div>

      <motion.p
        aria-hidden="true"
        {...wordmark}
        className={`${wordmarkClass} dark:hidden`}
        style={{
          fontSize: "clamp(64px, 22cqw, 340px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,0,0,0.18)",
        }}
      >
        RYCDGUZMAN
      </motion.p>
      <motion.p
        aria-hidden="true"
        {...wordmark}
        className={`${wordmarkClass} hidden dark:block`}
        style={{
          fontSize: "clamp(64px, 22cqw, 340px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.16)",
        }}
      >
        RYCDGUZMAN
      </motion.p>

      <motion.h2
        ref={headingRef}
        {...wordmark}
        className={`${wordmarkClass} text-neutral-950 dark:text-white`}
        style={{
          fontSize: "clamp(64px, 22cqw, 340px)",
          WebkitMaskImage: maskAt(-9999, -9999),
          maskImage: maskAt(-9999, -9999),
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        RYCDGUZMAN
      </motion.h2>
    </section>
  );
}
