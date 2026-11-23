"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
type Mark = {
  name: string;
  className: string;
};

const rowB: Mark[] = [
  { name: "Python", className: "font-bold tracking-tight" },
  { name: "Node.js", className: "font-semibold tracking-tight" },
  { name: "Next.js", className: "font-bold tracking-tight" },
  { name: "React.js", className: "font-bold tracking-tight" },
  { name: "TypeScript", className: "font-semibold tracking-tight" },
  { name: "SQLite", className: "font-semibold tracking-tight" },
  { name: "PostgreSQL", className: "font-semibold tracking-tight" },
];

const rowA: Mark[] = [
  { name: "MongoDB", className: "font-semibold tracking-tight" },
  { name: "Tailwind CSS", className: "font-bold tracking-tight" },
  { name: "MUI", className: "font-black tracking-tight" },
  { name: "React Bits", className: "font-semibold tracking-tight" },
  { name: "Bootstrap", className: "font-semibold tracking-tight" },
  { name: "Supabase", className: "font-bold tracking-tight" },
  { name: "Swagger", className: "font-semibold tracking-tight" },
];

const rowC: Mark[] = [
  { name: "Xano", className: "font-bold tracking-tight" },
  { name: "Vercel", className: "font-bold tracking-tight" },
  { name: "GitHub", className: "font-bold tracking-tight" },
  { name: "Jira", className: "font-bold tracking-tight" },
  { name: "Unix Scripting", className: "font-mono tracking-tight" },
];

const ease = [0.22, 1, 0.36, 1] as const;
function MarqueeRow({
  marks,
  reverse,
  duration,
  reduce,
  focal = false,
}: {
  marks: Mark[];
  reverse?: boolean;
  duration: number;
  reduce: boolean;
  focal?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const doubled = [...marks, ...marks];
  return (
    <div
      className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] ${focal ? "py-3" : "py-2"}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        className="flex w-max items-center gap-12 will-change-transform"
        style={{
          animation: reduce
            ? undefined
            : `${reverse ? "bento33-right" : "bento33-left"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((mark, i) => (
          <span
            key={`${mark.name}-${i}`}
            className={`shrink-0 cursor-default whitespace-nowrap leading-none transition-colors duration-300 hover:text-neutral-900 dark:hover:text-white ${
              focal
                ? "text-[26px] text-neutral-700 dark:text-neutral-200"
                : "text-[18px] text-neutral-400 dark:text-neutral-500"
            } ${mark.className}`}
          >
            {mark.name}
          </span>
        ))}
      </div>
    </div>
  );
}
export default function Bento33() {
  const reduce = !!useReducedMotion();
  return (
    <article className="group relative flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <style>{`
        @keyframes bento33-left { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 24px)); } }
        @keyframes bento33-right { from { transform: translateX(calc(-50% - 24px)); } to { transform: translateX(0); } }
      `}</style>
      <div className="@container relative min-h-[220px] flex-1 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
          className="absolute inset-0 flex flex-col justify-center gap-2 @2xl:gap-4"
        >
          <MarqueeRow marks={rowA} duration={52} reduce={reduce} />
          <MarqueeRow
            marks={rowB}
            duration={40}
            reverse
            reduce={reduce}
            focal
          />
          <MarqueeRow marks={rowC} duration={58} reduce={reduce} />
        </motion.div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
          Technologies I Work With
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          From full-stack development to databases, cloud platforms, and
          automation, these are the tools and technologies I use to build
          scalable web applications and business solutions.
        </p>
      </div>
    </article>
  );
}
