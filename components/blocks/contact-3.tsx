"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle, Mail, Phone } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Contact3() {
  const reduce = useReducedMotion();

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live chat",
      href: "#",
    },
    {
      icon: Mail,
      title: "Email us",
      href: "#",
    },
    {
      icon: Phone,
      title: "Book a call",
      href: "#",
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
            Get in touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
            className="mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg"
          >
            Select how you would like to contact us.
          </motion.p>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-4 sm:mt-16 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.href}
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                ease: EASE,
                delay: 0.12 + Math.min(index, 6) * 0.06,
              }}
              className="group flex min-h-[220px] w-full shrink-0 cursor-pointer flex-col items-center justify-between rounded-3xl border border-neutral-200 bg-white p-6 transition-colors duration-200 hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950 sm:h-[240px] sm:min-h-0 sm:w-[240px]"
            >
              <div className="mb-6 mt-6 flex items-center justify-center sm:mt-0 sm:flex-1">
                <div className="relative transition-transform duration-500 ease-out group-hover:scale-[1.04]">
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

              <h3 className="text-base font-medium tracking-tight text-neutral-950 dark:text-white">
                {method.title}
              </h3>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
