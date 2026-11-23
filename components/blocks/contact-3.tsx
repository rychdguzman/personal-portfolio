"use client";

import { motion, useReducedMotion } from "motion/react";
import { Mail, Phone, Linkedin, Instagram } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Contact3() {
  const reduce = useReducedMotion();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Me",
      detail: "rychristdguzman@gmail.com",
      href: "mailto:rychristdguzman@gmail.com",
    },
    {
      icon: Phone,
      title: "Call Me",
      detail: "0920-946-3486",
      href: "tel:+639209463486",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      detail: "Let's connect professionally",
      href: "https://www.linkedin.com/in/ryan-christian-de-guzman/",
    },
    {
      icon: Instagram,
      title: "Instagram",
      detail: "Follow my journey",
      href: "https://www.instagram.com/_yanyanaquino___/",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-24 dark:bg-neutral-950 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-4xl font-medium leading-[1.04] tracking-tight text-neutral-950 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Let's Connect
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg"
          >
            Have a project in mind, an opportunity, or just want to connect? I'd
            love to hear from you.
          </motion.p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.href}
              target={
                method.title === "Email Me" || method.title === "Call Me"
                  ? undefined
                  : "_blank"
              }
              rel={
                method.title === "Email Me" || method.title === "Call Me"
                  ? undefined
                  : "noopener noreferrer"
              }
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                ease: EASE,
                delay: 0.12 + index * 0.06,
              }}
              className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-between rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-xl hover:shadow-neutral-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600 dark:hover:shadow-black/20 dark:focus-visible:ring-white"
            >
              <div className="mb-6 mt-6 flex flex-1 items-center justify-center sm:mt-0">
                <div className="relative transition-transform duration-500 ease-out group-hover:scale-110">
                  <div className="absolute inset-0 -m-6 rounded-[36px] bg-neutral-100 dark:bg-neutral-900" />
                  <div className="absolute inset-0 -m-3 rounded-[24px] bg-neutral-200 dark:bg-neutral-800" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[12px] bg-neutral-950 dark:bg-white">
                    <method.icon
                      className="h-8 w-8 text-white dark:text-neutral-950"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-base font-medium tracking-tight text-neutral-950 dark:text-white">
                  {method.title}
                </h3>

                <p className="mt-2 break-all text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {method.detail}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
