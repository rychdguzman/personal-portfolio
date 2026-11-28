
"use client";

import { useId, useMemo, useState } from "react";
import {
  Search,
  X,
  Terminal,
  Workflow,
  Globe,
  Code2,
  Layers,
  Database,
  TestTube2,
  ChartLine,
  FlaskConical,
  BrainCircuit,
  Bot,
  Network,
  MessageSquareText,
  FileSearch,
  Cpu,
  Laptop,
  MonitorCog,
  Sparkles,
  BookOpen,
  GraduationCap,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Skill = {
  name: string;
  purpose: string;
  icon: LucideIcon;
  status?: string;
};

type Category = {
  name: string;
  description: string;
  items: Skill[];
};

const categories: Category[] = [
  {
    name: "Automation & Scripting",
    description: "Automating workflows and connecting systems.",
    items: [
      {
        name: "Python",
        purpose: "Scripting and application development",
        icon: Terminal,
      },
      {
        name: "Node.js",
        purpose: "Server-side development",
        icon: Workflow,
      },
      {
        name: "REST API Integration",
        purpose: "Connecting services and applications",
        icon: Globe,
      },
      {
        name: "Web Scraping",
        purpose: "Extracting structured web data",
        icon: Search,
      },
      {
        name: "Selenium",
        purpose: "Browser automation",
        icon: MonitorCog,
      },
      {
        name: "Beautiful Soup",
        purpose: "HTML parsing and data extraction",
        icon: FileSearch,
      },
      {
        name: "Flask",
        purpose: "Python web applications and APIs",
        icon: FlaskConical,
      },
    ],
  },
  {
    name: "Web Development & Backend",
    description: "Building web applications and digital experiences.",
    items: [
      {
        name: "JavaScript",
        purpose: "Interactive application development",
        icon: Code2,
      },
      {
        name: "React.js",
        purpose: "Component-based user interfaces",
        icon: Layers,
      },
      {
        name: "Next.js",
        purpose: "Full-stack web applications",
        icon: Globe,
      },
      {
        name: "EJS",
        purpose: "Server-side templating",
        icon: Code2,
      },
      {
        name: "Xano",
        purpose: "Backend and API development",
        icon: Database,
      },
      {
        name: "Supabase",
        purpose: "Backend services and database integration",
        icon: Database,
      },
      {
        name: "Swagger",
        purpose: "API documentation and exploration",
        icon: FileSearch,
      },
    ],
  },
  {
    name: "Testing & Data Engineering",
    description: "Validating applications and processing data.",
    items: [
      {
        name: "Vitest",
        purpose: "Automated testing and test cases",
        icon: TestTube2,
      },
      {
        name: "API Testing",
        purpose: "Validating REST API functionality",
        icon: FlaskConical,
      },
      {
        name: "Time-Series Data",
        purpose: "Processing high-frequency data",
        icon: ChartLine,
      },
      {
        name: "Data Extraction",
        purpose: "Collecting and structuring information",
        icon: Search,
      },
      {
        name: "Python Data Processing",
        purpose: "Working with structured datasets",
        icon: Database,
      },
    ],
  },
  {
    name: "AI & LLM Engineering",
    description: "Developing intelligent applications and AI agents.",
    items: [
      {
        name: "LangChain",
        purpose: "Building LLM-powered applications",
        icon: Network,
        // status: "Learning",
      },
      {
        name: "LangGraph",
        purpose: "Orchestrating agent workflows",
        icon: Workflow,
        // status: "Learning",
      },
      {
        name: "Rasa",
        purpose: "Conversational AI development",
        icon: MessageSquareText,
        // status: "Developed",
      },
      {
        name: "RAG",
        purpose: "Retrieval-augmented generation",
        icon: FileSearch,
        // status: "Learning",
      },
      {
        name: "Prompt Engineering",
        purpose: "Designing effective LLM instructions",
        icon: MessageSquareText,
        // status: "Learning",
      },
      {
        name: "Structured Tool Calling",
        purpose: "Connecting LLMs with external tools",
        icon: Workflow,
        // status: "Learning",
      },
      {
        name: "AI Agents",
        purpose: "Building tool-enabled AI systems",
        icon: Bot,
        // status: "Learning",
      },
      {
        name: "QLoRA",
        purpose: "Exploring efficient LLM fine-tuning",
        icon: BrainCircuit,
        // status: "Learning",
      },
    ],
  },
  {
    name: "AI Development & Local LLMs",
    description: "Experimenting with locally hosted models and AI tooling.",
    items: [
      {
        name: "Ollama",
        purpose: "Running language models locally",
        icon: Cpu,
        // status: "Exploring",
      },
      {
        name: "Local LLM Deployment",
        purpose: "Experimenting with local model hosting",
        icon: Laptop,
        // status: "Exploring",
      },
      {
        name: "Model Inference",
        purpose: "Running and testing local models",
        icon: BrainCircuit,
        // status: "Exploring",
      },
      {
        name: "Claude Code",
        purpose: "AI-assisted coding and development",
        icon: Code2,
        // status: "Exploring",
      },
      {
        name: "Local AI Workflows",
        purpose: "Integrating local models into development",
        icon: Workflow,
        // status: "Exploring",
      },
    ],
  },
];

const learning = [
  {
    title: "100 Days of Code: The Complete Python Pro Bootcamp",
    instructor: "Dr. Angela Yu",
    platform: "Udemy",
    description:
      "Python fundamentals, automation, web scraping, Flask, Selenium, Beautiful Soup, APIs, and practical application development.",
    icon: Terminal,
    status: "Python Development",
  },
  {
    title: "AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents",
    instructor: "Edward Donner",
    platform: "Udemy",
    description:
      "Exploring LLM engineering, RAG architectures, model fine-tuning, AI agents, and agentic workflows.",
    icon: BrainCircuit,
    status: "Currently Studying",
    url: "https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/",
  },
];

const total = categories.reduce(
  (sum, group) => sum + group.items.length,
  0
);

function SkillIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white text-neutral-950 transition-colors duration-200 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:group-hover:bg-neutral-700"
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

export default function TechnicalSkills() {
  const headingId = useId();
  const searchId = useId();
  const statusId = useId();

  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();

  const shown =
    query.trim().length > 18
      ? `${query.trim().slice(0, 18)}…`
      : query.trim();

  const matches = useMemo(() => {
    const result = new Set<string>();

    categories.forEach((group) =>
      group.items.forEach((item) => {
        const haystack =
          `${item.name} ${item.purpose} ${group.name} ${item.status ?? ""}`.toLowerCase();

        if (!needle || haystack.includes(needle)) {
          result.add(item.name);
        }
      })
    );

    return result;
  }, [needle]);

  const reveal = (index: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: {
      duration: 0.6,
      ease: EASE,
      delay: Math.min(index, 6) * 0.06,
    },
  });

  return (
    <section
      aria-labelledby={headingId}
      className="relative flex min-h-[var(--rb-section-min-h,100vh)] w-full items-center overflow-hidden bg-white px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32 dark:bg-neutral-950"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Introduction */}
        <motion.div {...reveal(0)} className="max-w-3xl">
          <h2
            id={headingId}
            className="text-balance text-3xl font-medium leading-[1.08] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl dark:text-white"
          >
            Technologies I work with.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            From full-stack development and business process automation
            to AI engineering, I enjoy exploring technologies that solve
            real-world problems. My toolkit continues to evolve as I build,
            experiment, and develop intelligent solutions.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Search technical skills
              </label>

              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                strokeWidth={1.75}
              />

              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search technical skills"
                autoComplete="off"
                aria-describedby={statusId}
                className="h-11 w-full rounded-full border border-neutral-200 bg-white pl-10 pr-11 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors duration-200 focus-visible:border-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white [&::-webkit-search-cancel-button]:hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus-visible:border-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-white"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              )}
            </div>

            <p
              id={statusId}
              aria-live="polite"
              className="mt-3 min-h-5 pl-4 text-sm text-neutral-500 dark:text-neutral-400"
            >
              {!needle &&
                `${total} technologies and tools across 5 categories`}

              {needle && matches.size > 0 &&
                `${matches.size} ${matches.size === 1 ? "match" : "matches"} for “${shown}”`}

              {needle && matches.size === 0 &&
                `No skills found for “${shown}”.`}
            </p>
          </div>
        </motion.div>

        {/* Technical skill categories */}
        <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((group, groupIndex) => {
            const found = group.items.filter((item) =>
              matches.has(item.name)
            ).length;

            return (
              <motion.div
                key={group.name}
                {...reveal(groupIndex + 1)}
                className="rounded-[16px] bg-neutral-50 p-2 dark:bg-neutral-900"
              >
                <div className="px-2 pb-2 pt-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium text-neutral-950 dark:text-white">
                      {group.name}
                    </h3>

                    <span className="shrink-0 text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
                      {needle
                        ? `${found}/${group.items.length}`
                        : group.items.length}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {group.description}
                  </p>
                </div>

                <ul className="mt-2 flex flex-col">
                  {group.items.map((item) => {
                    const hit = matches.has(item.name);

                    return (
                      <li
                        key={item.name}
                        className={`transition-opacity duration-300 ${
                          hit ? "opacity-100" : "opacity-25"
                        }`}
                      >
                        <div
                          className="group flex items-center gap-3 rounded-[8px] p-2"
                        >
                          <SkillIcon icon={item.icon} />

                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm font-medium text-neutral-950 dark:text-white">
                                {item.name}
                              </span>

                              {item.status && (
                                <span className="rounded-full border border-neutral-200 px-1.5 text-[10px] leading-[18px] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                                  {item.status}
                                </span>
                              )}
                            </span>

                            <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                              {item.purpose}
                            </span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Continuous learning */}
        {/* <motion.div
          {...reveal(6)}
          className="mt-20 border-t border-neutral-200 pt-10 dark:border-neutral-800"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs font-medium uppercase tracking-[0.15em]">
                  Continuous Learning
                </span>
              </div>

              <h3 className="text-2xl font-medium tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
                Always learning. Always building.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Investing in continuous learning to strengthen my
                development foundation and explore the possibilities
                of AI engineering.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {learning.map((course, index) => {
              const CourseIcon = course.icon;

              return (
                <motion.div
                  key={course.title}
                  {...reveal(index + 1)}
                  className="rounded-[16px] bg-neutral-50 p-5 dark:bg-neutral-900 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white text-neutral-950 dark:bg-neutral-800 dark:text-white">
                      <CourseIcon
                        className="h-5 w-5"
                        strokeWidth={1.75}
                      />
                    </span>

                    <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                      {course.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-base font-medium leading-snug text-neutral-950 dark:text-white">
                      {course.title}
                    </h4>

                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {course.instructor} · {course.platform}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {course.description}
                    </p>

                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-60 dark:text-white"
                      >
                        Explore course
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
