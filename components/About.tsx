"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerFast,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

export function About() {
  return (
    <footer
      id="about"
      className="section-padding relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #2E160F 0%, #1C0F0A 55%, #0D0705 100%)" }}
    >
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(196,113,74,0.10) 0%, rgba(196,113,74,0) 75%)",
            parallax: 16,
          },
          {
            background:
              "radial-gradient(ellipse 60% 50% at 85% 25%, rgba(212,160,48,0.08) 0%, rgba(212,160,48,0) 70%)",
            parallax: 24,
          },
          {
            background:
              "radial-gradient(ellipse 45% 40% at 12% 75%, rgba(91,184,180,0.07) 0%, rgba(91,184,180,0) 70%)",
            parallax: 20,
          },
        ]}
      />

      <div className="container-inner relative">
        {/* Top decorative line */}
        <motion.div
          className="h-px bg-brown/8 mb-16 md:mb-24"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Header — boven alles */}
        <motion.div
          className="mb-10 md:mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.p className="label-text text-terracotta mb-5" variants={fadeIn}>
            09 — Over
          </motion.p>
          <motion.h2
            className="font-playfair text-cream text-display-md font-bold leading-tight mb-2"
            variants={fadeInUp}
          >
            Tibo Choquet
          </motion.h2>
          <motion.p
            className="font-playfair text-terracotta text-xl italic font-light"
            variants={fadeInUp}
          >
            Communicatie- en multimediaontwerper
          </motion.p>
        </motion.div>

        {/* Foto + content naast elkaar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16 items-start">

          {/* Foto — 2/5 */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="relative rounded-2xl overflow-hidden w-full" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/tool/IMG_0213_portrait.jpeg"
                alt="Tibo Choquet"
                fill
                className="object-cover"
                style={{ objectPosition: "center center" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(13,7,5,0.55) 0%, transparent 45%)" }}
              />
            </div>
          </motion.div>

          {/* Content — 3/5 */}
          <motion.div
            className="lg:col-span-3 flex flex-col gap-7"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Bio */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              <p className="font-inter text-cream/60 text-base leading-relaxed">
                Ik ben een ontwerpend onderzoeker, geïnteresseerd in hoe
                opkomende technologieën veranderen hoe mensen cultuur maken,
                ervaren en bespreken. Between Real and Made is mijn
                afstudeerproject voor de opleiding CMD aan Avans Hogeschool.
              </p>
              <p className="font-inter text-cream/60 text-base leading-relaxed">
                Mijn werk bevindt zich op het snijvlak van speculatief ontwerp,
                interactieonderzoek en cultuurkritiek. Ik geloof dat ontwerp de
                verantwoordelijkheid heeft om moeilijke vragen te stellen, niet
                alleen om ze te beantwoorden.
              </p>
            </motion.div>

            {/* Projectmeta */}
            <motion.div className="border-t border-b border-cream/8 py-5" variants={fadeInUp}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3 text-sm font-inter">
                {[
                  { label: "Instelling", value: "Avans Hogeschool" },
                  { label: "Domein", value: "AI · Muziek · Design" },
                  { label: "Opleiding", value: "CMD" },
                  { label: "Methode", value: "Ervaringsonderzoek" },
                  { label: "Jaar", value: "2026" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-cream/40 text-xs uppercase tracking-wider">{label}</span>
                    <span className="text-cream/65">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div className="flex flex-wrap gap-2" variants={staggerFast}>
              {[
                { label: "E-mail", href: "mailto:tibo.choquet@gmail.com", value: "tibo.choquet@gmail.com" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/tibo-choquet-078400279/", value: "linkedin.com/in/tibo-choquet" },
                { label: "Instagram", href: "https://www.instagram.com/tibochoquet/", value: "@tibochoquet" },
              ].map(({ label, href, value }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-cream/15 text-cream/50 hover:text-cream hover:border-cream/30 transition-all duration-300 font-inter text-sm"
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="label-text text-terracotta group-hover:text-terracotta-light transition-colors duration-300">
                    {label}
                  </span>
                  <span>{value}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Tools */}
            <motion.div variants={fadeInUp}>
              <p className="label-text text-cream/40 mb-3">Gebruikte tools</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Nano Banana 2", "Magnific", "Kling", "Suno",
                  "DaVinci Resolve", "InDesign", "Canva", "Claude", "Next.js",
                ].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 rounded-full border border-cream/10 text-cream/45 font-inter text-xs font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-20 md:mt-28 pt-8 border-t border-cream/8 flex flex-col md:flex-row items-center justify-between gap-4"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p className="font-inter text-cream/30 text-xs text-center md:text-left">
            © 2026 Tibo Choquet · CMD Afstudeerproject · Avans Hogeschool
          </p>
          <p className="font-playfair text-cream/20 italic text-sm">
            Between Real and Made.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-inter text-cream/30 hover:text-terracotta text-xs uppercase tracking-wider transition-colors duration-300 focus:outline-none focus:text-terracotta"
            aria-label="Naar boven"
          >
            Naar boven ↑
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
