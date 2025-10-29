"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function SocialProof() {
  return (
    <section className="testimonials-section section-padding bg-darker-bg">
      <div className="container-width">
        {/* Section Header - Asymmetrical, Left-Aligned */}
        <div className="section-header mb-12">
          <h2 className="font-headline section-title text-4xl md:text-5xl text-neutral-200">
            What Customers Say
          </h2>
          <p className="section-description text-primary-emerald">
            Real reviews from real people
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          className="testimonials-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-neutral-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Star className="fill-primary-emerald text-primary-emerald" size={18} />
            <span className="text-sm md:text-base font-semibold">4.9/5 Average Rating</span>
          </div>
          <div className="hidden md:block h-6 w-px bg-neutral-600" />
          <div className="text-sm md:text-base font-semibold">
            100+ Happy Customers
          </div>
          <div className="hidden md:block h-6 w-px bg-neutral-600" />
          <div className="text-sm md:text-base font-semibold">
            Locally Owned & Operated
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    company: string;
    role: string;
    rating: number;
    text: string;
    date: string;
    service: string;
  };
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      className="testimonial-card group relative bg-card-bg border border-primary-emerald/20 rounded-lg overflow-hidden transition-all hover:border-primary-emerald hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-emerald/10"
      variants={cardVariants}
    >
      {/* Decorative Accent Line (Top) */}
      <div className="testimonial-accent absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-emerald to-transparent" />

      <div className="p-6 flex flex-col space-y-4">
        {/* Customer Photo Placeholder & Info - Horizontal Layout */}
        <div className="flex items-center gap-4">
          {/* Premium Avatar Placeholder */}
          <div className="testimonial-photo-wrapper relative w-16 h-16 rounded-full bg-gradient-to-br from-primary-purple/30 to-primary-emerald/30 overflow-hidden flex-shrink-0 border-2 border-primary-emerald/40 group-hover:border-primary-emerald transition-all shadow-lg shadow-primary-emerald/10">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-emerald/10 to-primary-purple/10 animate-pulse" />

            {/* Customer initial with enhanced styling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-primary-emerald text-2xl font-bold drop-shadow-lg">
                {testimonial.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="testimonial-meta flex-grow">
            <p className="testimonial-name text-sm font-semibold text-primary-emerald">
              {testimonial.name}
            </p>
            <p className="testimonial-role text-xs text-neutral-600">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>

          {/* Star Rating */}
          <div className="rating flex gap-0.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-primary-emerald text-primary-emerald"
              />
            ))}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="testimonial-quote text-sm text-neutral-200 italic leading-relaxed">
          &ldquo;{testimonial.text}&rdquo;
        </blockquote>

        {/* Optional: Service Mentioned */}
        {testimonial.service && (
          <div className="testimonial-service pt-2 border-t border-primary-emerald/10">
            <span className="text-xs text-neutral-600 font-medium">
              Service: {testimonial.service}
            </span>
          </div>
        )}
      </div>

      {/* Decorative Border Glow (Bottom, on hover) */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-emerald to-transparent opacity-0 transition-opacity group-hover:opacity-50" />
    </motion.div>
  );
}
