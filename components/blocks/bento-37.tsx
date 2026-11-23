"use client";

import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";

import {
  SiPython,
  SiNodedotjs,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiSqlite,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiMui,
  SiBootstrap,
  SiSupabase,
  SiSwagger,
  SiVercel,
  SiGithub,
  SiJira,
} from "react-icons/si";

type Tech = {
  name: string;
  Icon?: IconType;
  mark?: string;
};

type Cover = {
  title: string;
  kind: string;
  technologies: Tech[];
};

const covers: Cover[] = [
  {
    title: "Frontend Development",
    kind: "UI & Frameworks",
    technologies: [
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "React", Icon: SiReact },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      // { name: "MUI", Icon: SiMui },
      // { name: "Bootstrap", Icon: SiBootstrap },
      // { name: "React Bits", mark: "RB" },
    ],
  },
  {
    title: "Backend Development",
    kind: "Languages & Runtime",
    technologies: [
      { name: "Python", Icon: SiPython },
      { name: "Node.js", Icon: SiNodedotjs },
      { name: "Xano", mark: "X" },
    ],
  },
  {
    title: "Database Technologies",
    kind: "Data & Storage",
    technologies: [
      { name: "SQLite", Icon: SiSqlite },
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "MongoDB", Icon: SiMongodb },
    ],
  },
  {
    title: "Platforms & APIs",
    kind: "Cloud & Integration",
    technologies: [
      { name: "Supabase", Icon: SiSupabase },
      { name: "Swagger", Icon: SiSwagger },
      { name: "Vercel", Icon: SiVercel },
    ],
  },
  {
    title: "Development Tools",
    kind: "Workflow & Automation",
    technologies: [
      { name: "GitHub", Icon: SiGithub },
      { name: "Jira", Icon: SiJira },
      { name: "Unix Scripting", mark: "$_" },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const DRIFT_MS = 2800;

const rack = {
  type: "spring",
  stiffness: 210,
  damping: 28,
  mass: 0.9,
} as const;

function TechLogo({ tech }: { tech: Tech }) {
  const Icon = tech.Icon;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-200/70 text-neutral-800 dark:bg-neutral-800 dark:text-white">
        {Icon ? (
          <Icon size={30} />
        ) : (
          <span className="text-sm font-bold tracking-tight">{tech.mark}</span>
        )}
      </div>

      <span className="text-center text-[10px] font-medium leading-tight">
        {tech.name}
      </span>
    </div>
  );
}

export default function Bento37() {
  const reduce = !!useReducedMotion();

  const [inView, setInView] = useState(false);
  const [focus, setFocus] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!inView || reduce || hovering) return;

    const id = window.setInterval(
      () => setFocus((f) => (f + 1) % covers.length),
      DRIFT_MS,
    );

    return () => window.clearInterval(id);
  }, [inView, reduce, hovering]);

  const scrub = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const t = (event.clientX - rect.left) / rect.width;

    setFocus(
      Math.max(0, Math.min(covers.length - 1, Math.floor(t * covers.length))),
    );
  };

  const active = covers[focus];

  return (
    <article className="group relative flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="@container relative min-h-[220px] flex-1 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          onViewportEnter={() => setInView(true)}
          transition={{ duration: 0.8, ease }}
          role="slider"
          tabIndex={0}
          aria-label="Browse technology stacks"
          aria-valuemin={1}
          aria-valuemax={covers.length}
          aria-valuenow={focus + 1}
          aria-valuetext={`${active.title}, ${active.kind}`}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          onPointerDown={scrub}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? Math.min(covers.length - 1, focus + 1)
                : event.key === "ArrowLeft"
                  ? Math.max(0, focus - 1)
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? covers.length - 1
                      : null;

            if (next !== null) {
              event.preventDefault();
              setFocus(next);
            }
          }}
          onPointerMove={scrub}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          className="absolute inset-0 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400"
        >
          <div className="relative flex-1 [perspective:900px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[70%] h-6 w-[38%] -translate-x-1/2 rounded-[100%] bg-neutral-900/10 blur-md dark:bg-black/50"
            />

            {covers.map((cover, index) => {
              const offset = index - focus;
              const dist = Math.abs(offset);
              const side = Math.sign(offset);
              const x = side * (dist === 0 ? 0 : 58 + (dist - 1) * 30);

              return (
                <motion.div
                  key={cover.title}
                  initial={false}
                  animate={{
                    x: `${x}%`,
                    z: dist === 0 ? 0 : -40 - dist * 30,
                    rotateY: reduce || dist === 0 ? 0 : side * -38,
                    scale: dist === 0 ? 1 : 0.9,
                    opacity: dist > 3 ? 0 : 1,
                    zIndex: 10 - dist,
                  }}
                  transition={reduce ? { duration: 0 } : rack}
                  className="absolute left-1/2 top-1/2 aspect-[3/4] h-[74%] max-h-[260px] [transform-style:preserve-3d]"
                  style={{ translate: "-50% -54%" }}
                >
                  <div
                    className={`flex h-full w-full flex-col justify-between rounded-xl border p-3 transition-[background-color,border-color,color,box-shadow] duration-300 ${
                      offset === 0
                        ? "shadow-[0_24px_48px_-20px_rgba(0,0,0,0.5)]"
                        : "shadow-[0_12px_24px_-16px_rgba(0,0,0,0.35)]"
                    } ${
                      offset === 0
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    }`}
                  >
                    <div className="grid flex-1 grid-cols-2 content-center justify-items-center gap-x-4 gap-y-6 px-2 py-5">
                      {cover.technologies.map((tech) => (
                        <TechLogo key={tech.name} tech={tech} />
                      ))}
                    </div>

                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold">{cover.title}</p>
                      <p className="text-[9px] opacity-60">{cover.kind}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 px-5 pb-3 text-[10px] text-neutral-500">
            <span className="tabular-nums">
              {String(focus + 1).padStart(2, "0")} /{" "}
              {String(covers.length).padStart(2, "0")}
            </span>

            <span className="relative h-4 min-w-0 flex-1 overflow-hidden text-center font-medium text-neutral-700 dark:text-neutral-300">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={active.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                  className="absolute inset-x-0 top-0 truncate"
                >
                  {active.title} · {active.kind}
                </motion.span>
              </AnimatePresence>
            </span>

            <span className="relative h-1 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <motion.span
                initial={false}
                animate={{ left: `${(focus / covers.length) * 100}%` }}
                transition={{ duration: 0.4, ease }}
                className="absolute inset-y-0 rounded-full bg-neutral-900 dark:bg-white"
                style={{ width: `${100 / covers.length}%` }}
              />
            </span>
          </div>
        </motion.div>
      </div>

      {/* <div className="px-6 pb-6 pt-2">
        <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
          Technologies I Work With
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          From full-stack development to databases, cloud platforms, and
          automation, these are the tools and technologies I use to build
          scalable web applications and business solutions.
        </p>
      </div> */}
    </article>
  );
}
