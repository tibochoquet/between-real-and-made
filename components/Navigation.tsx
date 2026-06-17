"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "De Vraag", href: "#question" },
  { label: "De Ervaring", href: "#experience" },
  { label: "De Film", href: "#film" },
  { label: "De Tool", href: "#tool" },
  { label: "Profielen", href: "#profiles" },
  { label: "Bewijs", href: "#proof" },
  { label: "Proces", href: "#process" },
  { label: "Reflectie", href: "#reflection" },
  { label: "Over", href: "#about" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-beige/[0.96] backdrop-blur-md border-b border-brown/8"
            : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-inner">
          <nav
            className="flex items-center justify-between h-16 md:h-20"
            role="navigation"
            aria-label="Hoofdnavigatie"
          >
            {/* Logo */}
            <button
              onClick={() => handleNavClick("#hero")}
              className={`font-playfair font-bold text-lg italic tracking-tight transition-colors duration-300 ${
                scrolled ? "text-brown" : "text-cream"
              }`}
              aria-label="Terug naar boven"
            >
              B.R.M.
            </button>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-8" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className={`label-text transition-colors duration-300 hover:text-terracotta ${
                      scrolled ? "text-brown/70" : "text-cream/70"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile menu button */}
            <button
              className={`lg:hidden flex flex-col gap-1.5 p-2 transition-colors duration-300 ${
                scrolled ? "text-brown" : "text-cream"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-brown flex flex-col items-center justify-center lg:hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="font-playfair text-2xl italic text-cream hover:text-terracotta transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="absolute bottom-10 label-text text-cream/30">
              CMD Afstuderen 2026
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
