"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS, SITE_CONFIG } from "@/lib/content";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="contact" className="section-padding bg-dark-bg">
      <div className="container-width">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-4xl font-bold text-light-text md:text-5xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-light-text/70">
            Everything you need to know
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              className="overflow-hidden rounded-xl border border-purple/20 bg-dark-card transition-all hover:border-purple/50 hover:shadow-lg hover:shadow-purple/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Active accent line */}
              {openId === item.id && (
                <motion.div
                  className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald to-purple"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ originY: 0 }}
                />
              )}

              <button
                onClick={() => toggleQuestion(item.id)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-dark-bg/50"
                aria-expanded={openId === item.id}
              >
                <h3 className="text-lg font-semibold text-light-text pr-4">
                  {item.question}
                </h3>
                <motion.div
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    size={24}
                    className={`transition-colors ${
                      openId === item.id ? "text-purple" : "text-light-text/60"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      animation: "accordionFold 0.3s ease-out",
                    }}
                  >
                    <div className="border-t border-light-text/10 px-6 py-4">
                      <p className="text-light-text/70">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="mb-6 text-lg text-light-text/70">
            Still have questions? We&apos;re here to help!
          </p>
          <motion.a
            href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald to-purple px-8 py-4 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us Today
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
