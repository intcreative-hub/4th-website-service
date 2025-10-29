"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Navigation } from "lucide-react";
import { SITE_CONFIG, BUSINESS_HOURS } from "@/lib/content";

export default function HoursLocation() {
  return (
    <section id="hours" className="section-padding bg-dark-bg">
      <div className="container-width">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-4xl font-bold text-light-text md:text-5xl">
            Get <span className="gradient-text">In Touch</span>
          </h2>
          <p className="text-lg text-light-text/70">
            Let&apos;s discuss your project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Map Section */}
          <motion.div
            className="overflow-hidden rounded-2xl border border-emerald/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-video w-full">
              <iframe
                src={SITE_CONFIG.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Purple Haze Smoke Shop Location"
              />
            </div>
          </motion.div>

          {/* Hours & Contact Section */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Business Hours */}
            <div className="rounded-xl border border-purple/20 bg-dark-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple/10 text-purple">
                  <Clock size={24} />
                </div>
                <h3 className="text-2xl font-bold text-light-text">Store Hours</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between border-b border-light-text/10 pb-3">
                  <span className="text-light-text/70">Weekdays</span>
                  <span className="font-semibold text-emerald text-right text-sm">{BUSINESS_HOURS.weekday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-text/70">Weekend</span>
                  <span className="font-semibold text-emerald text-right text-sm">{BUSINESS_HOURS.weekend}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-emerald/20 bg-dark-card p-4 transition-all hover:border-emerald/50">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-light-text/60">Address</p>
                  <p className="font-semibold text-light-text">{SITE_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-emerald/20 bg-dark-card p-4 transition-all hover:border-emerald/50">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-light-text/60">Phone</p>
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                    className="font-semibold text-emerald hover:underline"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.a
                href={SITE_CONFIG.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald px-6 py-4 font-semibold text-dark-bg transition-all hover:bg-emerald-light hover:shadow-lg hover:shadow-emerald/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Navigation size={20} />
                Get Directions
              </motion.a>

              <motion.a
                href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-purple bg-transparent px-6 py-4 font-semibold text-light-text transition-all hover:bg-purple hover:shadow-lg hover:shadow-purple/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={20} />
                Call Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
