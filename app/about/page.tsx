"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_CONFIG, VALUE_PROPS } from "@/lib/content";
import { Award, ShieldCheck, HeadphonesIcon, Target, LucideIcon } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Award,
  ShieldCheck,
  HeadphonesIcon,
  Target,
};

export default function AboutPage() {
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
                About <span className="text-primary-emerald">Us</span>
              </h1>
              <p className="text-xl text-neutral-300 leading-relaxed">
                {SITE_CONFIG.tagline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-dark-bg">
          <div className="container-width px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-neutral-200 mb-8">Our Story</h2>
                <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
                  <p>
                    We are a team of dedicated professionals committed to helping businesses succeed in today&apos;s competitive landscape. Our approach combines strategic thinking with hands-on execution to deliver measurable results.
                  </p>
                  <p>
                    What sets us apart is our commitment to understanding each client&apos;s unique challenges and opportunities. We don&apos;t believe in one-size-fits-all solutions. Instead, we craft customized strategies that align with your specific goals and market position.
                  </p>
                  <p>
                    Our diverse team brings expertise across consulting, strategy, design, and development. This multidisciplinary approach allows us to tackle complex business challenges from multiple angles, ensuring comprehensive solutions that drive real growth.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-darker-bg">
          <div className="container-width px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-neutral-200 mb-4">
                Our <span className="text-primary-emerald">Values</span>
              </h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                These core principles guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {VALUE_PROPS.map((value, index) => (
                <ValueCard key={value.id} value={value} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-dark-bg">
          <div className="container-width px-6">
            <motion.div
              className="bg-gradient-to-br from-primary-emerald/10 to-primary-purple/10 rounded-2xl p-12 text-center border border-primary-emerald/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-neutral-200 mb-4">
                Let&apos;s work together
              </h2>
              <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                Ready to take your business to the next level? We&apos;re here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="/contact"
                  className="bg-primary-emerald text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-primary-emerald/90 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.a>
                <motion.a
                  href="/services"
                  className="bg-transparent text-primary-emerald border-2 border-primary-emerald px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-primary-emerald hover:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Our Services
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

interface ValueCardProps {
  value: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

function ValueCard({ value, index }: ValueCardProps) {
  const IconComponent = iconMap[value.icon] || Award;

  return (
    <motion.div
      className="bg-card-bg border border-primary-emerald/20 rounded-xl p-8 hover:border-primary-emerald transition-all hover:shadow-xl hover:shadow-primary-emerald/10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-lg bg-primary-emerald/10 flex items-center justify-center">
            <IconComponent size={28} className="text-primary-emerald" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-200 mb-2">{value.title}</h3>
          <p className="text-neutral-300 leading-relaxed">{value.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
