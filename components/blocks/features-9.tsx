"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  Plane,
  BrainCircuit,
  Bot,
  Database,
  Landmark,
  type LucideIcon,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Project = {
  key: string;
  label: string;
  Icon: LucideIcon;
  category: string;
  company: string;
  title: string;
  description: string;
  technologies: string[];
  blocks: {
    title: string;
    desc: string;
  }[];
};

const projects: Project[] = [
  {
    key: "gemx",
    label: "GEMX",
    Icon: Plane,
    category: "Full-Stack Development",
    company: "Travel Sports and Australia",
    title: "Modernizing travel management through technology.",
    description:
      "Contributed to GEMX, a cloud-based travel management platform designed to replace legacy business processes with a centralized web application for travel, events, and business operations.",
    technologies: ["Next.js", "Xano", "Supabase", "Swagger", "Vitest"],
    blocks: [
      {
        title: "Built the experience from scratch",
        desc: "Developed a web-based landing page builder from the ground up, alongside frontend features for event management and travel-related workflows, including flight and hotel bookings.",
      },
      {
        title: "Connected business operations",
        desc: "Implemented dashboard, reporting, and role-based functionality while integrating REST APIs. Created Vitest test cases to validate REST functionality.",
      },
    ],
  },
  {
    key: "kendi",
    label: "KENDI",
    Icon: BrainCircuit,
    category: "AI Integration & RAG",
    company: "DXC Technology",
    title: "Turning enterprise documents into actionable intelligence.",
    description:
      "Worked on an enterprise AI application leveraging Large Language Models and Retrieval-Augmented Generation to support automated document analysis and defect detection.",
    technologies: [
      "Google Gemini",
      "LangChain",
      "RASA",
      "RAG",
      "Prompt Engineering",
    ],
    blocks: [
      {
        title: "Integrated enterprise AI capabilities",
        desc: "Designed and deployed AI application functionality using Gemini, LangChain, and RASA to support intelligent document processing.",
      },
      {
        title: "Implemented retrieval-augmented generation",
        desc: "Applied RAG and prompt engineering techniques to improve contextual retrieval and support automated document analysis and defect detection.",
      },
    ],
  },
  {
    key: "agents",
    label: "AI Agents",
    Icon: Bot,
    category: "Agentic AI & Automation",
    company: "DXC Technology",
    title: "Bringing AI-powered assistance into everyday workflows.",
    description:
      "Developed a Microsoft Teams integration powered by cloud-hosted Large Language Models and structured tool calls to assist cross-functional teams with technical troubleshooting.",
    technologies: [
      "LLM Integration",
      "Microsoft Teams",
      "AWS Lambda",
      "Azure Functions",
      "Tool Calling",
    ],
    blocks: [
      {
        title: "Connected AI with business workflows",
        desc: "Integrated cloud-based LLM endpoints into Microsoft Teams to make AI assistance accessible within existing collaboration workflows.",
      },
      {
        title: "Enabled intelligent tool execution",
        desc: "Implemented structured tool-calling capabilities through serverless cloud functions, supporting autonomous AI-assisted troubleshooting workflows.",
      },
    ],
  },
  {
    key: "staph",
    label: "STA-PH",
    Icon: Database,
    category: "Data Engineering & Cloud",
    company: "DXC Technology",
    title: "Engineering data solutions for high-frequency workloads.",
    description:
      "Worked on a data processing platform designed to handle high-frequency time-series data for banking clients, with an emphasis on cloud infrastructure and containerized applications.",
    technologies: [
      "AWS",
      "Node.js",
      "Python",
      "Containerization",
      "Time-Series Data",
    ],
    blocks: [
      {
        title: "Developed data processing solutions",
        desc: "Architected data processing workflows for high-frequency time-series data, supporting demanding enterprise banking use cases.",
      },
      {
        title: "Leveraged cloud and containerization",
        desc: "Developed application components using Node.js and Python, and containerized applications for deployment within AWS cloud infrastructure.",
      },
    ],
  },
  {
    key: "banking",
    label: "Banking",
    Icon: Landmark,
    category: "Enterprise Software Development",
    company: "DXC Technology",
    title: "Building software that drives operational efficiency.",
    description:
      "Developed web-based automation solutions for a North American banking client, focusing on business process optimization, reporting, and operational efficiency.",
    technologies: [
      "Node.js",
      "React.js",
      "EJS",
      "Web Development",
      "Automation",
    ],
    blocks: [
      {
        title: "Developed enterprise web applications",
        desc: "Built frontend and backend components, dashboards, reporting tools, and internal web solutions tailored to banking business requirements.",
      },
      {
        title: "Coordinated solution delivery",
        desc: "As Web Solution Lead, facilitated development activities, tracked project progress, and coordinated with other teams to support solution integration.",
      },
    ],
  },
];

export default function Features9() {
  const [active, setActive] = useState("gemx");
  const reduce = useReducedMotion();

  const data = projects.find((project) => project.key === active)!;

  return (
    <section
      id="projects"
      className="relative flex min-h-[var(--rb-section-min-h,100vh)] w-full items-start overflow-hidden bg-white px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32 dark:bg-neutral-950"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            Selected Work
          </p>

          <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl dark:text-white">
            Building solutions that solve real-world problems
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
            A collection of enterprise applications, AI integrations, and
            software solutions I've contributed to throughout my professional
            journey.
          </p>
        </motion.div>

        {/* Project Tabs */}
        <div
          role="tablist"
          aria-label="Featured projects"
          className="mt-12 flex flex-wrap justify-center gap-2 sm:mt-16 sm:grid sm:grid-cols-5 sm:gap-4"
        >
          {projects.map((project) => {
            const isActive = active === project.key;
            const Icon = project.Icon;

            return (
              <button
                key={project.key}
                id={`tab-${project.key}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${project.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(project.key)}
                className={`group flex cursor-pointer items-center justify-start gap-2 rounded-full border px-3 py-2 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:flex-col sm:justify-center sm:gap-5 sm:rounded-2xl sm:px-6 sm:py-8 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950 ${
                  isActive
                    ? "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                    : "border-transparent bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 sm:h-14 sm:w-14 ${
                    isActive
                      ? "bg-neutral-100 dark:bg-neutral-800"
                      : "bg-white dark:bg-neutral-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors duration-200 sm:h-6 sm:w-6 ${
                      isActive
                        ? "text-neutral-950 dark:text-white"
                        : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                    }`}
                    strokeWidth={1.5}
                  />
                </span>

                <span
                  className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 sm:text-base ${
                    isActive
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-500 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                  }`}
                >
                  {project.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Project Content */}
        <motion.div
          key={active}
          id={`panel-${data.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${data.key}`}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-12 grid grid-cols-1 gap-10 border-t border-neutral-200 pt-10 sm:mt-16 sm:pt-14 md:grid-cols-2 md:gap-16 dark:border-neutral-800"
        >
          {/* Project Overview */}
          <div className="flex flex-col items-start gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                {data.category}
              </p>

              <h3 className="mt-5 text-2xl font-medium leading-tight tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl dark:text-white">
                {data.title}
              </h3>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
              {data.description}
            </p>

            <div className="border-l-2 border-neutral-300 py-1 pl-4 dark:border-neutral-700">
              <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Organization
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                {data.company}
              </p>
            </div>

            <div className="w-full">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Technology Stack
              </p>

              <div className="flex flex-wrap gap-2">
                {data.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contributions */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                My Contributions
              </p>

              {data.blocks.map((block, index) => (
                <div
                  key={block.title}
                  className={`${
                    index !== 0
                      ? "mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800"
                      : ""
                  }`}
                >
                  <h4 className="text-base font-medium tracking-tight text-neutral-950 sm:text-lg dark:text-white">
                    {block.title}
                  </h4>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
                    {block.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Confidentiality Note */}
        {/* <p className="mt-12 text-center text-xs leading-relaxed text-neutral-400">
          Project descriptions highlight my individual contributions. Certain
          implementation details are omitted to respect client and company
          confidentiality.
        </p> */}
      </div>
    </section>
  );
}
