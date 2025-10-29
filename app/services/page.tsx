"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SERVICES } from "@/lib/content";
import { Briefcase, TrendingUp, Palette, Code, LucideIcon, Check } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  TrendingUp,
  Palette,
  Code,
};

export default function ServicesPage() {
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
                Our <span className="text-primary-emerald">Services</span>
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                Comprehensive business solutions tailored to your needs. From strategy to execution, we deliver results that drive growth.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="section-padding bg-dark-bg">
          <div className="container-width px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {SERVICES.map((service, index) => (
                <ServiceDetailCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-darker-bg">
          <div className="container-width px-6">
            <motion.div
              className="bg-gradient-to-br from-primary-emerald/10 to-primary-purple/10 rounded-2xl p-12 text-center border border-primary-emerald/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-neutral-200 mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                Let&apos;s discuss how we can help your business grow with our professional services.
              </p>
              <motion.a
                href="/contact"
                className="inline-block bg-primary-emerald text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-primary-emerald/90 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us Today
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

interface ServiceDetailCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: string;
    gradient: string;
  };
  index: number;
}

function ServiceDetailCard({ service, index }: ServiceDetailCardProps) {
  const IconComponent = iconMap[service.icon] || Briefcase;

  return (
    <motion.div
      className="bg-card-bg border border-primary-emerald/20 rounded-xl p-8 hover:border-primary-emerald transition-all hover:shadow-xl hover:shadow-primary-emerald/10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Icon */}
      <div className="mb-6">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient}/20`}
        >
          <IconComponent size={32} className="text-primary-emerald" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-2xl font-bold text-neutral-200 mb-4">{service.title}</h3>
      <p className="text-neutral-300 leading-relaxed mb-6">{service.description}</p>

      {/* Features List */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-primary-emerald uppercase tracking-wide mb-3">
          What&apos;s Included:
        </h4>
        {service.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check size={20} className="text-primary-emerald flex-shrink-0 mt-0.5" />
            <span className="text-neutral-300">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
