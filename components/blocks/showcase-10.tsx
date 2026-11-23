"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WIDTHS = [480, 800, 1200];

type Photo = { id: string; alt: string };

type Project = {
  name: string;
  place: string;
  type: string;
  year: string;
  summary: string;
  area: string;
  trees: string;
  completed: string;
  photos: [Photo, Photo, Photo];
};

const projects: Project[] = [
  {
    name: "TASA-GemX",
    place: "",
    type: "",
    year: "",
    summary: "	Enterprise travel and event management platform.",
    area: "",
    trees: "",
    completed: "",
    photos: [
      {
        id: "/images/gemx.png",
        alt: "an image from gemx solution the landing page",
      },
      {
        id: "/images/gemx1.png",
        alt: "an image from gemx showing of list of booking",
      },
      {
        id: "/images/gemx2.png",
        alt: "an image from gemx solution showing the detail of a booking",
      },
    ],
  },
  {
    name: "Reliable Services",
    place: "",
    type: "",
    year: "",
    summary: "A website for business, tailored to client specification.",
    area: "",
    trees: "",
    completed: "",
    photos: [
      {
        id: "/images/reliable.png",
        alt: "an image from reliable services website showing events from their page",
      },
      {
        id: "/images/reliable2.png",
        alt: "A gravel path curving through tall grasses and late pink flowers",
      },
      {
        id: "/images/reliable3.png",
        alt: "an image from reliable services website showing its landing page",
      },
    ],
  },
  {
    name: "DXC Technology",
    place: "",
    type: "",
    year: "",
    summary:
      "An old spruce plantation thinned into glades of moss, ferns and stepping stones.",
    area: "4.4 ha",
    trees: "620",
    completed: "October 2023",
    photos: [
      {
        id: "photo-1745387932185-c8aea68dedbc",
        alt: "Flat stepping stones crossing a sunlit lawn of moss under old trees",
      },
      {
        id: "photo-1632037667990-227e49f350c6",
        alt: "A soft woodland path through leaning trees and ferns in morning haze",
      },
      {
        id: "photo-1713299713320-66d2e0abf664",
        alt: "A dirt path bending past ferns and moss-covered trunks",
      },
    ],
  },
  // {
  //   name: "Hove Walled Garden",
  //   place: "Ghent",
  //   type: "Garden restoration",
  //   year: "2022",
  //   summary:
  //     "A walled kitchen garden brought back with deep borders and clipped hedge rooms.",
  //   area: "0.9 ha",
  //   trees: "36",
  //   completed: "May 2022",
  //   photos: [
  //     {
  //       id: "photo-1776757980912-2a92d733809c",
  //       alt: "A narrow path between spring borders inside an old brick wall",
  //     },
  //     {
  //       id: "photo-1782116987482-df05274c10f1",
  //       alt: "Deep flower borders and a tall clipped hedge beside a stone barn",
  //     },
  //     {
  //       id: "photo-1776151243548-43b714bf1273",
  //       alt: "A wooden bench at the end of a lawn framed by low clipped hedges",
  //     },
  //   ],
  // },
  // {
  //   name: "Plane Tree Lawns",
  //   place: "Antwerp",
  //   type: "Public park",
  //   year: "2021",
  //   summary:
  //     "New lawns beneath old plane trees, laced with gravel paths and mounded shrubs.",
  //   area: "3.6 ha",
  //   trees: "210",
  //   completed: "April 2021",
  //   photos: [
  //     {
  //       id: "photo-1778016762007-9b5bb47ef4ee",
  //       alt: "Three tall plane trees on a lawn between long clipped hedges",
  //     },
  //     {
  //       id: "photo-1668120089662-42642838cfef",
  //       alt: "A curved gravel path through a lawn with rounded shrubs",
  //     },
  //     {
  //       id: "photo-1786846435954-4232812ee418",
  //       alt: "Dark leafy trees scattered across a quiet park lawn",
  //     },
  //   ],
  // },
];

const photoUrl = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?w=${width}&h=${Math.round(width * 0.75)}&q=80&auto=format&fit=crop`;

const photoSet = (id: string) =>
  WIDTHS.map((width) => `${photoUrl(id, width)} ${width}w`).join(", ");

const columns =
  "lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.65fr)_40px]";

export default function Showcase10() {
  const id = useId();
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState<number | null>(0);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onHeaderKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = projects.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    headerRefs.current[next]?.focus();
  };

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex min-h-[var(--rb-section-min-h,100vh)] w-full items-start bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-neutral-950"
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto w-full max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-3xl"
          >
            <h2
              id={`${id}-title`}
              className="text-balance text-3xl font-medium leading-[1.08] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl dark:text-white"
            >
              Projects
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
              I have worked with and developed.
            </p>
            {/* <a
              href="#projects"
              className="group mt-5 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] text-sm font-medium text-neutral-950 transition-colors duration-200 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950 dark:text-white dark:hover:text-neutral-300 dark:focus-visible:outline-white"
            >
              See all projects
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </a> */}
          </motion.div>

          <ul className="mt-10 flex flex-col gap-2">
            {projects.map((project, index) => {
              const isOpen = open === index;
              const headerId = `${id}-head-${index}`;
              const panelId = `${id}-panel-${index}`;
              return (
                <motion.li
                  key={project.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: 0.08 + index * 0.05,
                  }}
                  className={`rounded-[24px] transition-colors duration-300 ${
                    isOpen
                      ? "bg-neutral-100 dark:bg-neutral-900"
                      : "bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
                  }`}
                >
                  <h3>
                    <button
                      ref={(node) => {
                        headerRefs.current[index] = node;
                      }}
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : index)}
                      onKeyDown={(event) => onHeaderKey(event, index)}
                      className={`grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_40px] items-center gap-x-6 rounded-[24px] py-3 pl-5 pr-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 sm:pl-6 dark:focus-visible:outline-white ${columns}`}
                    >
                      <span className="flex min-w-0 flex-col gap-0.5 lg:contents">
                        <span className="truncate text-lg font-medium tracking-tight text-neutral-950 sm:text-xl dark:text-white">
                          {project.name}
                        </span>
                        <span className="flex min-w-0 flex-wrap gap-x-1.5 text-sm text-neutral-600 lg:contents lg:text-base dark:text-neutral-400">
                          <span className="lg:truncate">{project.place}</span>
                          <span aria-hidden="true" className="lg:hidden">
                            ·
                          </span>
                          <span className="lg:truncate">{project.type}</span>
                          <span aria-hidden="true" className="lg:hidden">
                            ·
                          </span>
                          <span className="tabular-nums">{project.year}</span>
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="col-start-2 row-start-1 grid h-10 w-10 place-items-center rounded-[12px] bg-white text-neutral-950 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_2px_8px_-2px_rgb(0_0_0/0.08)] lg:col-start-auto lg:row-start-auto dark:bg-neutral-800 dark:text-white dark:shadow-none"
                      >
                        <motion.span
                          initial={false}
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="grid place-items-center"
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.75} />
                        </motion.span>
                      </span>
                    </button>
                  </h3>

                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0 }}
                    transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`grid gap-x-6 gap-y-5 pb-6 pl-5 pr-5 pt-1 sm:pl-6 sm:pr-6 lg:pr-3 ${columns}`}
                    >
                      <motion.p
                        initial={false}
                        animate={{ opacity: isOpen ? 1 : 0 }}
                        transition={
                          isOpen
                            ? { duration: 0.4, ease: "easeOut", delay: 0.12 }
                            : { duration: 0.15 }
                        }
                        className="max-w-md text-pretty text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400"
                      >
                        {project.summary}
                      </motion.p>
                      <dl className="grid grid-cols-3 gap-4 lg:contents">
                        {[
                          ["Area", project.area],
                          ["Trees planted", project.trees],
                          ["Completed", project.completed],
                        ].map(([label, value], fact) => (
                          <motion.div
                            key={label}
                            initial={false}
                            animate={{ opacity: isOpen ? 1 : 0 }}
                            transition={
                              isOpen
                                ? {
                                    duration: 0.4,
                                    ease: "easeOut",
                                    delay: 0.16 + fact * 0.04,
                                  }
                                : { duration: 0.15 }
                            }
                            className={`min-w-0 ${fact === 2 ? "lg:col-span-2" : ""}`}
                          >
                            <dt className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                              {label}
                            </dt>
                            <dd className="mt-1 text-sm font-medium tabular-nums text-neutral-950 sm:text-base dark:text-white">
                              {value}
                            </dd>
                          </motion.div>
                        ))}
                      </dl>
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-2 pb-2">
                      {project.photos.map((photo, shot) => (
                        <div
                          key={photo.id}
                          className="relative aspect-[4/5] overflow-hidden rounded-[16px] sm:aspect-[3/2] xl:aspect-auto xl:h-[272px]"
                        >
                          <motion.img
                            src={photo.id}
                            srcSet={photo.id}
                            sizes="(min-width: 1400px) 440px, 32vw"
                            alt={photo.alt}
                            width={800}
                            height={600}
                            loading="eager"
                            decoding="async"
                            draggable={false}
                            initial={false}
                            animate={{
                              opacity: isOpen ? 1 : 0,
                              scale: isOpen ? 1 : 1.04,
                            }}
                            transition={
                              isOpen
                                ? {
                                    duration: 0.7,
                                    ease: EASE,
                                    delay: 0.14 + shot * 0.07,
                                  }
                                : { duration: 0.2, ease: "easeOut" }
                            }
                            className="absolute inset-0 h-full w-full select-none object-cover saturate-[0.85] dark:brightness-90"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </MotionConfig>
    </section>
  );
}
