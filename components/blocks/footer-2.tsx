"use client";

import { motion } from "motion/react";
import { Instagram, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer2() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/_yanyanaquino___/",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ryan-christian-de-guzman/",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:rychristdguzman@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background image */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1616144058124-979005390426?w=1744&q=80&auto=format&fit=crop"
          alt=""
          width={1744}
          height={1163}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative">
        <div className="h-32 sm:h-40 md:h-48" />

        <div className="relative bg-white dark:bg-neutral-950">
          {/* Decorative top corners */}
          <div className="absolute left-0 top-0 z-10 -translate-y-full">
            <svg
              width="614"
              height="153"
              viewBox="0 0 614 153"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative top-px h-auto w-[112px] sm:w-[180px] lg:w-[250px]"
            >
              <path
                d="M0 0H451.601C467.78 0 483.071 7.75893 491.954 21.2815C558.518 122.612 538.359 153.074 614 153H0V0Z"
                className="fill-white dark:fill-neutral-950"
              />
            </svg>
          </div>

          <div className="absolute right-0 top-0 z-10 -translate-y-full">
            <svg
              width="614"
              height="153"
              viewBox="0 0 614 153"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative top-px h-auto w-[112px] scale-x-[-1] sm:w-[180px] lg:w-[250px]"
            >
              <path
                d="M0 0H451.601C467.78 0 483.071 7.75893 491.954 21.2815C558.518 122.612 538.359 153.074 614 153H0V0Z"
                className="fill-white dark:fill-neutral-950"
              />
            </svg>
          </div>

          <div className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:px-10 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center space-y-8 sm:space-y-10 md:space-y-12"
            >
              {/* Identity */}
              <motion.div variants={itemVariants} className="text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  Ryan Chirstian De Guzman
                </h2>

                <p className="mt-3 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 sm:text-base">
                  Full-Stack Software Developer
                </p>
              </motion.div>

              {/* Navigation */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-neutral-950 dark:text-white sm:gap-5 sm:text-base"
              >
                <a
                  href="#aboutme"
                  className="transition-colors hover:text-neutral-500 dark:hover:text-neutral-400"
                >
                  About Me
                </a>

                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />

                <a
                  href="#projects"
                  className="transition-colors hover:text-neutral-500 dark:hover:text-neutral-400"
                >
                  Projects
                </a>

                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />

                <a
                  href="#contact"
                  className="transition-colors hover:text-neutral-500 dark:hover:text-neutral-400"
                >
                  Get in Touch
                </a>
              </motion.div>

              {/* Social links */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target={social.name === "Email" ? undefined : "_blank"}
                      rel={
                        social.name === "Email"
                          ? undefined
                          : "noopener noreferrer"
                      }
                      aria-label={social.name}
                      className="group flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 text-neutral-950 transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-950 hover:text-white dark:border-neutral-800 dark:text-white dark:hover:bg-white dark:hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-white"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </a>
                  );
                })}
              </motion.div>

              {/* Email CTA */}
              <motion.div variants={itemVariants} className="text-center">
                <a
                  href="mailto:rychristdguzman@gmail.com"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-400 sm:text-base"
                >
                  rychristdguzman@gmail.com
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </motion.div>

              {/* Copyright and closing statement */}
              <motion.div
                variants={itemVariants}
                className="flex w-full flex-col items-center justify-between gap-5 border-t border-neutral-200 pt-8 text-center dark:border-neutral-800 sm:flex-row sm:text-left"
              >
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  <p>
                    © {new Date().getFullYear()} Ryan Christian De Guzman. All
                    rights reserved.
                  </p>
                </div>

                <div className="text-sm text-neutral-500 dark:text-neutral-400 sm:text-right">
                  <p>Building meaningful digital experiences.</p>
                  <p>Designed & developed with passion.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
