"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/config";
import CartDropdown from "@/components/CartDropdown";
import AccountDropdown from "@/components/AccountDropdown";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
      setActiveSection(href);
    }
  };

  return (
    <motion.header
      className={`header-premium fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-dark-bg/95 to-darker-bg/95 backdrop-blur-lg py-4 shadow-xl shadow-primary-emerald/5"
          : "bg-gradient-to-r from-dark-bg/90 to-darker-bg/90 backdrop-blur-md py-5"
      }`}
      style={{
        borderBottom: isScrolled
          ? "1px solid rgba(16, 185, 129, 0.1)"
          : "1px solid transparent",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-inner">
        <nav className="container-width px-6 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section - BOLD & ICONIC */}
            <motion.div
              className="logo-section flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="logo-text font-headline text-2xl md:text-3xl font-extrabold tracking-tight"
                style={{
                  textShadow: "0 2px 10px rgba(16, 185, 129, 0.3)",
                }}
              >
                <span className="text-primary-emerald">{SITE_CONFIG.name}</span>
              </span>
            </motion.div>

            {/* Desktop Navigation - VISIBLE & BALANCED */}
            <div className="nav-links hidden items-center space-x-6 md:flex">
              {NAV_LINKS.map((link) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-base font-medium tracking-wide transition-all duration-300 ${
                    activeSection === link.href
                      ? "text-primary-emerald"
                      : "text-neutral-200 hover:text-primary-emerald hover:scale-105"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.button>
              ))}

              {/* Phone CTA Button - SLEEK & ACTIONABLE */}
              <motion.a
                href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary-emerald text-primary-emerald font-semibold text-sm transition-all duration-300 hover:bg-primary-emerald hover:text-white hover:shadow-lg hover:shadow-primary-emerald/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={14} />
                <span className="hidden lg:inline">{SITE_CONFIG.phone}</span>
                <span className="lg:hidden">Call</span>
              </motion.a>

              {/* Cart Dropdown */}
              <CartDropdown />

              {/* Account Dropdown */}
              <AccountDropdown />
            </div>

            {/* Mobile Menu Button & Cart */}
            <div className="flex items-center gap-2 md:hidden">
              <AccountDropdown />
              <CartDropdown />
              <button
                className="text-neutral-200 p-2 hover:text-primary-emerald transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - ENHANCED */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="absolute left-0 right-0 top-full bg-gradient-to-br from-dark-bg/98 to-darker-bg/98 backdrop-blur-lg md:hidden border-b border-primary-emerald/20 shadow-2xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col px-6 py-6 space-y-2">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => scrollToSection(link.href)}
                      className="text-left text-lg font-medium text-neutral-200 py-4 px-3 rounded-lg transition-all hover:bg-primary-emerald/10 hover:text-primary-emerald hover:pl-6"
                    >
                      {link.label}
                    </button>
                  ))}

                  {/* Mobile Phone CTA */}
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                    className="flex items-center justify-center gap-2 mt-4 px-6 py-4 rounded-full bg-primary-emerald text-white font-bold text-base transition-all hover:bg-primary-emerald/90 shadow-lg shadow-primary-emerald/30"
                  >
                    <Phone size={18} />
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
}
