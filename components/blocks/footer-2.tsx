"use client";

import { motion } from "motion/react";
import { Instagram, Linkedin } from "lucide-react";

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

  return (
    <footer className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8">
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
              <motion.div variants={itemVariants} className="text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  frequency
                </h2>
                <p className="mt-2 text-xl font-medium tracking-tight text-neutral-950 dark:text-white sm:text-2xl md:text-3xl">
                  studios
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-neutral-950 dark:text-white sm:gap-4 sm:text-base"
              >
                <a
                  href="#"
                  className="rounded-sm transition-colors duration-200 hover:text-neutral-500 dark:hover:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
                >
                  Book a session
                </a>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700"
                />
                <a
                  href="#"
                  className="rounded-sm transition-colors duration-200 hover:text-neutral-500 dark:hover:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
                >
                  Join the waitlist
                </a>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2"
              >
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-950 transition-colors duration-200 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" strokeWidth={1.75} />
                </a>
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-950 transition-colors duration-200 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-[22px] w-[22px]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-950 transition-colors duration-200 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" strokeWidth={1.75} />
                </a>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex w-full flex-col items-center justify-between gap-6 pt-4 text-center sm:flex-row sm:items-end sm:text-left md:pt-8"
              >
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  <p>© 2026 Frequency Studios. All rights reserved.</p>
                </div>

                <div className="text-sm text-neutral-500 dark:text-neutral-400 sm:text-right">
                  <p>Analog and digital</p>
                  <p>Grammy-winning engineers</p>
                  <p>Est. 2017</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
