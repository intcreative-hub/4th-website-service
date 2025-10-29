"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-neutral-200 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-dark-bg border border-primary-emerald/20 rounded-lg text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald transition-colors"
          placeholder="John Doe"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-neutral-200 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-dark-bg border border-primary-emerald/20 rounded-lg text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald transition-colors"
          placeholder="john@example.com"
        />
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-neutral-200 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-dark-bg border border-primary-emerald/20 rounded-lg text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald transition-colors"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Service Selection */}
      <div>
        <label htmlFor="service" className="block text-sm font-semibold text-neutral-200 mb-2">
          Service Interested In *
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-dark-bg border border-primary-emerald/20 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-colors"
        >
          <option value="">Select a service</option>
          <option value="consulting">Business Consulting</option>
          <option value="strategy">Digital Strategy</option>
          <option value="design">Creative Design</option>
          <option value="development">Web Development</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-neutral-200 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-dark-bg border border-primary-emerald/20 rounded-lg text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald transition-colors resize-none"
          placeholder="Tell us about your project..."
        />
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <motion.div
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-green-500 font-semibold">Message sent successfully!</p>
            <p className="text-neutral-300 text-sm mt-1">
              We&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-500 font-semibold">Failed to send message</p>
            <p className="text-neutral-300 text-sm mt-1">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-primary-emerald text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-primary-emerald/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={status !== "loading" ? { scale: 1.02 } : {}}
        whileTap={status !== "loading" ? { scale: 0.98 } : {}}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Sending...
          </>
        ) : (
          <>
            <Send size={20} />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}
