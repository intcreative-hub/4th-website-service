"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { SITE_CONFIG, BUSINESS_HOURS } from "@/lib/content";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-dark-bg via-card-bg to-darker-bg py-20">
          <div className="container-width px-6">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-200 mb-6">
                Get <span className="text-primary-emerald">In Touch</span>
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-dark-bg">
          <div className="container-width px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-neutral-200 mb-6">
                    Contact Information
                  </h2>

                  {/* Contact Cards */}
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="bg-card-bg border border-primary-emerald/20 rounded-lg p-5 hover:border-primary-emerald transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-emerald/10 flex items-center justify-center">
                          <Mail size={24} className="text-primary-emerald" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-400 font-medium">Email</p>
                          <a
                            href={`mailto:${SITE_CONFIG.email}`}
                            className="text-neutral-200 hover:text-primary-emerald transition-colors font-semibold"
                          >
                            {SITE_CONFIG.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-card-bg border border-primary-emerald/20 rounded-lg p-5 hover:border-primary-emerald transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-emerald/10 flex items-center justify-center">
                          <Phone size={24} className="text-primary-emerald" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-400 font-medium">Phone</p>
                          <a
                            href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                            className="text-neutral-200 hover:text-primary-emerald transition-colors font-semibold"
                          >
                            {SITE_CONFIG.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-card-bg border border-primary-emerald/20 rounded-lg p-5 hover:border-primary-emerald transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-emerald/10 flex items-center justify-center">
                          <MapPin size={24} className="text-primary-emerald" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-400 font-medium">Address</p>
                          <p className="text-neutral-200 font-semibold">{SITE_CONFIG.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="bg-card-bg border border-primary-emerald/20 rounded-lg p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-emerald/10 flex items-center justify-center">
                          <Clock size={24} className="text-primary-emerald" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-400 font-medium mb-2">Business Hours</p>
                          <p className="text-neutral-200 text-sm">{BUSINESS_HOURS.weekday}</p>
                          <p className="text-neutral-200 text-sm mt-1">{BUSINESS_HOURS.weekend}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-card-bg border border-primary-emerald/20 rounded-xl p-8"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-neutral-200 mb-6">Send us a message</h3>
                  <ContactForm />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
