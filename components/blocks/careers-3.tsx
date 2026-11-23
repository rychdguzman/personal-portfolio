"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Mail,
  Download,
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Award,
  Code2,
  BrainCircuit,
  Cloud,
  Database,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DRAW = 1.4;

type Experience = {
  period: string;
  company: string;
  role: string;
  detail: string;
  highlights: string[];
};

const experiences: Experience[] = [
  {
    period: "May 2025 – July 2026",
    company: "Reliable Services · Travel Sports and Australia",
    role: "Full Stack Developer",
    detail:
      "Developed GEMX, a cloud-based platform modernizing travel operations and migrating legacy business processes into a scalable web application.",
    highlights: [
      "Built a customizable landing page builder from scratch using Next.js.",
      "Developed flight, hotel, and event booking workflows.",
      "Implemented role-based access control, dashboards, and reporting.",
      "Integrated Xano APIs and Supabase; validated REST functionality with Swagger and Vitest.",
    ],
  },
  {
    period: "March 2022 – May 2025",
    company: "DXC Technology",
    role: "Web Solution Lead · Automation Team",
    detail:
      "Led web development activities for a North American banking client, coordinating deliverables, project dependencies, and cross-team integrations.",
    highlights: [
      "Tracked development milestones and project deliverables.",
      "Coordinated technical requirements and system integrations.",
      "Facilitated collaboration between development and automation teams.",
    ],
  },
  {
    period: "DXC Technology",
    company: "DXC Technology · Automation",
    role: "Solution Developer · Full Stack Developer",
    detail:
      "Developed web applications and automation solutions for a North American banking client.",
    highlights: [
      "Built web applications using Node.js, React.js, and EJS.",
      "Developed dashboards, reporting tools, and internal business applications.",
      "Delivered solutions focused on operational efficiency and business value.",
    ],
  },
  {
    period: "DXC Technology",
    company: "DXC Technology · Cloud / ITO",
    role: "Service Delivery Consultant",
    detail:
      "Supported cloud infrastructure and IT service delivery for a North American banking client.",
    highlights: [
      "Performed infrastructure monitoring and operational maintenance.",
      "Supported troubleshooting and incident resolution.",
      "Collaborated with technical teams to maintain service reliability.",
    ],
  },
  {
    period: "July 2019 – March 2021",
    company: "M Lhuillier Financial Services",
    role: "Regional System Technician",
    detail:
      "Provided technical support and system administration across eight branches in one region.",
    highlights: [
      "Managed systems and database backups.",
      "Provided technical support and installed computer peripherals.",
    ],
  },
];

const projects = [
  {
    name: "GEMX",
    category: "Enterprise Web Platform",
    description:
      "A cloud-based travel management platform with customizable landing pages, event bookings, dashboards, and reporting.",
    stack: ["Next.js", "Xano", "Supabase", "Vitest"],
    icon: Code2,
  },
  {
    name: "KENDI",
    category: "AI Integration & RAG",
    description:
      "An intelligent enterprise application for automated document analysis and defect detection using LLMs and retrieval-augmented generation.",
    stack: ["Gemini", "LangChain", "Rasa", "RAG"],
    icon: BrainCircuit,
  },
  {
    name: "AI Agents",
    category: "Agentic Applications",
    description:
      "Microsoft Teams integration with cloud-hosted LLM endpoints and structured tool calling for AI-assisted technical troubleshooting.",
    stack: ["LLMs", "AWS Lambda", "Azure Functions", "MS Teams"],
    icon: Cloud,
  },
  {
    name: "STA-PH",
    category: "Data Analytics & Cloud",
    description:
      "A data-processing platform for high-frequency time-series data, using containerized applications and secure cloud infrastructure.",
    stack: ["AWS", "Node.js", "Python", "Docker"],
    icon: Database,
  },
];

const skills = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Python",
  "REST APIs",
  "Supabase",
  "Xano",
  "Google Gemini",
  "LangChain",
  "RAG",
  "AWS",
  "Azure Functions",
  "Vitest",
  "Docker",
];

export default function Careers3() {
  const id = useId();
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [inView, setInView] = useState(false);

  const [rail, setRail] = useState({
    top: 0,
    height: 0,
    stops: experiences.map((_, i) =>
      experiences.length > 1 ? i / (experiences.length - 1) : 0,
    ),
  });

  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (!list || dots.length < 2) return;

      const listRect = list.getBoundingClientRect();

      const centers = dots.map((dot) => {
        const rect = dot.getBoundingClientRect();
        return rect.top - listRect.top + rect.height / 2;
      });

      const top = centers[0];
      const height = centers[centers.length - 1] - top;

      setRail({
        top,
        height,
        stops: centers.map((center) => (height ? (center - top) / height : 0)),
      });
    };

    measure();

    const observer = new ResizeObserver(measure);

    if (listRef.current) observer.observe(listRef.current);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const drawn = inView || reduce;

  return (
    <section
      aria-labelledby={id}
      className="relative w-full overflow-hidden bg-white px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32 dark:bg-neutral-950"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Professional Journey
          </p>

          <h2
            id={id}
            className="text-balance text-3xl font-medium leading-[1.08] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl dark:text-white"
          >
            Building software, solving problems, and exploring what's next.
          </h2>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
            A journey through full-stack development, enterprise solutions,
            automation, and AI-powered applications.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-16 sm:mt-16 lg:grid-cols-12 lg:items-start lg:gap-x-6">
          {/* LEFT: EXPERIENCE TIMELINE */}
          <div className="lg:col-span-7">
            <div className="mb-8 flex items-center gap-3">
              <BriefcaseBusiness
                className="h-4 w-4 text-neutral-500"
                strokeWidth={1.7}
              />
              <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Professional Experience
              </h3>
            </div>

            <motion.ol
              ref={listRef}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              onViewportEnter={() => setInView(true)}
              className="relative"
            >
              {/* TIMELINE RAIL */}
              <span
                aria-hidden="true"
                className="absolute left-[7px] w-px bg-neutral-200 dark:bg-neutral-800"
                style={{ top: rail.top, height: rail.height }}
              />

              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: drawn ? 1 : 0 }}
                transition={{
                  duration: reduce ? 0 : DRAW,
                  ease: "linear",
                  delay: 0.2,
                }}
                className="absolute left-[7px] w-px origin-top bg-neutral-950 dark:bg-white"
                style={{ top: rail.top, height: rail.height }}
              />

              {experiences.map((experience, index) => (
                <motion.li
                  key={`${experience.role}-${index}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: Math.min(index, 6) * 0.06,
                  }}
                  className="relative grid grid-cols-[15px_minmax(0,1fr)] gap-x-6 pb-12 last:pb-0 sm:gap-x-8 sm:pb-14"
                >
                  {/* DOT */}
                  <span
                    ref={(node) => {
                      dotRefs.current[index] = node;
                    }}
                    aria-hidden="true"
                    className="relative mt-[7px] h-[15px] w-[15px] rounded-full border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <motion.span
                      initial={false}
                      animate={{ scale: drawn ? 1 : 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.3,
                        ease: EASE,
                        delay: reduce ? 0 : 0.2 + rail.stops[index] * DRAW,
                      }}
                      className="absolute -inset-px rounded-full bg-neutral-950 dark:bg-white"
                    />
                  </span>

                  {/* EXPERIENCE CONTENT */}
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {experience.period}
                    </p>

                    <h4 className="mt-2 text-xl font-medium tracking-tight text-neutral-950 sm:text-2xl dark:text-white">
                      {experience.role}
                    </h4>

                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {experience.company}
                    </p>

                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
                      {experience.detail}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {experience.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                          <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            {/* EDUCATION */}
            {/* <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-neutral-500" />
                <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Education & Certifications
                </h3>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-neutral-950 dark:text-white">
                  Bachelor of Science in Information Technology
                </h4>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Saint Louis University · Baguio City, Philippines
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Microsoft Azure Fundamentals (AZ-900) · April 2022",
                  "ITIL 4 Foundation · April 2024",
                  "Diamond Excellence Award · October 2024",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <Award className="h-4 w-4 shrink-0 text-neutral-400" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div> */}
          </div>

          {/* RIGHT: PROFILE CARD */}
          <motion.aside
            aria-label="Professional profile"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            className="space-y-5 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9"
          >
            {/* PROFILE */}
            <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="aspect-[4/3] overflow-hidden rounded-[8px] bg-neutral-100 dark:bg-neutral-800">
                <img
                  src="/images/rycdguzman-profile-pic.jpg"
                  alt="Ryan Christian De Guzman"
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_22%]"
                />
              </div>

              <div className="px-4 pb-4 pt-5 sm:px-5 sm:pb-5">
                <p className="text-xl font-medium tracking-tight text-neutral-950 sm:text-2xl dark:text-white">
                  Ryan Christian De Guzman
                </p>

                <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  Full-Stack Software Developer
                </p>

                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  AI Integration · Cloud Solutions
                </p>

                <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Building enterprise applications, automation solutions, and
                  AI-powered workflows. Passionate about turning complex
                  business requirements into practical software solutions.
                </p>

                <a
                  href="mailto:rychristdguzman@gmail.com"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.75} />
                  Get in touch
                </a>

                <a
                  href="/Ryan_De_Guzman_Insight_Software_Engineer.pdf"
                  download="Ryan_De_Guzman_Resume.pdf"
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>

                <a
                  href="https://www.linkedin.com/in/ryan-christian-de-guzman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-between text-sm text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white"
                >
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* TECHNICAL SKILLS */}
            {/* <div className="rounded-[16px] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <Code2 className="h-4 w-4 text-neutral-500" />
                <h3 className="text-sm font-medium text-neutral-950 dark:text-white">
                  Technical Toolkit
                </h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div> */}
          </motion.aside>
        </div>

        {/* SELECTED PROJECTS */}
        {/* <div className="mt-28 border-t border-neutral-200 pt-12 dark:border-neutral-800">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Beyond the job title
            </p>

            <h3 className="mt-4 text-2xl font-medium tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              Selected Projects & Solutions
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
              A closer look at the platforms, AI integrations, and engineering
              solutions I've contributed to.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {projects.map((project, index) => {
              const Icon = project.icon;

              return (
                <motion.article
                  key={project.name}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    ease: EASE,
                    delay: index * 0.08,
                  }}
                  className="group rounded-[16px] border border-neutral-200 bg-white p-6 transition-colors duration-300 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>

                  <p className="mt-7 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {project.category}
                  </p>

                  <h4 className="mt-2 text-xl font-medium tracking-tight text-neutral-950 dark:text-white">
                    {project.name}
                  </h4>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div> */}
      </div>
    </section>
  );
}
