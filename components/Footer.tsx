"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-light-text/10">
      <div className="container-width section-padding py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald to-purple p-2">
                <span className="text-xl font-bold text-white">PH</span>
              </div>
              <span className="text-lg font-bold text-light-text">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-light-text/60">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-light-text">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-light-text/60 transition-colors hover:text-emerald">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-light-text">Contact</h4>
            <ul className="space-y-2 text-light-text/60">
              <li>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`} className="hover:text-emerald transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-emerald transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="pt-2">
                {SITE_CONFIG.address}
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-light-text">Follow Us</h4>
            <div className="flex gap-4">
              <motion.a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald transition-all hover:bg-emerald hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </motion.a>

              <motion.a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald transition-all hover:bg-emerald hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </motion.a>
            </div>

            <p className="mt-6 text-sm text-light-text/60">
              Professional services for businesses
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-light-text/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-light-text/60">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-light-text/60">
              <a href="#" className="hover:text-emerald transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-emerald transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-light-text/40">
            Built by{" "}
            <a
              href="https://intcreative.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline"
            >
              INT Creative
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
