"use client";

import { motion } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useRef } from "react";
import { Award, ShieldCheck, HeadphonesIcon, Target } from "lucide-react";
import { VALUE_PROPS } from "@/lib/content";

const iconMap = {
  Award: Award,
  ShieldCheck: ShieldCheck,
  HeadphonesIcon: HeadphonesIcon,
  Target: Target,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section id="about" className="section-padding bg-dark-card">
      <div className="container-width">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-4xl font-bold text-light-text md:text-5xl">
            Why Choose <span className="gradient-text">Us</span>?
          </h2>
          <p className="text-lg text-light-text/70">
            We deliver exceptional results for your business
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {VALUE_PROPS.map((prop) => (
            <TiltValueCard key={prop.id} prop={prop} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface TiltValueCardProps {
  prop: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

function TiltValueCard({ prop }: TiltValueCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[prop.icon as keyof typeof iconMap];

  const bind = useGesture({
    onHover: ({ hovering }) => {
      if (!cardRef.current) return;
      if (!hovering) {
        cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      }
    },
    onMove: ({ xy: [x, y], hovering }) => {
      if (!cardRef.current || !hovering) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = -(x - centerX) / 20;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gestureHandlers = bind() as any;

  return (
    <motion.div
      ref={cardRef}
      {...gestureHandlers}
      className="card-3d group relative overflow-hidden rounded-xl border border-purple/20 bg-dark-bg p-6 transition-all hover:border-purple/50 hover:shadow-xl hover:shadow-purple-500/30"
      variants={itemVariants}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease",
      }}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple/5 blur-2xl transition-all group-hover:bg-purple/10" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-purple/10 text-purple transition-all group-hover:bg-purple group-hover:text-white">
          <Icon size={28} />
        </div>

        <div>
          <h3 className="mb-2 text-xl font-bold text-light-text">
            {prop.title}
          </h3>
          <p className="text-light-text/70">{prop.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
