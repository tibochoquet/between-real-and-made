"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerFast,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

const stills = [
  {
    id: 1,
    label: "De scrollscène",
    img: "/tool/scene1.jpg",
    description:
      "Eindeloos scrollen door AI-gegenereerde muziek, op weg naar huis.",
  },
  {
    id: 2,
    label: "De straatmuzikant",
    img: "/tool/scene2.jpg",
    description:
      "Een muzikant breidt zijn spel uit met AI. Is dat nog authentiek?",
  },
  {
    id: 3,
    label: "De dj-set",
    img: "/tool/scene3.jpg",
    description: "Het publiek gaat uit zijn dak. AI regelt de transities.",
  },
  {
    id: 4,
    label: "De jazzbar",
    img: "/tool/scene4.jpg",
    description: "Het enige moment zonder AI: ruw, levend, onvolmaakt.",
  },
];

const FILM_YOUTUBE_ID = "NxNQTP4U_nM";

export function TheFilm() {
  const [playActive, setPlayActive] = useState(false);
  const [activeStill, setActiveStill] = useState<number | null>(null);

  const handlePlay = () => {
    setPlayActive(true);
  };

  return (
    <section
      id="film"
      className="section-padding relative overflow-hidden"
      style={{ background: "linear-gradient(175deg, #1C0F0A 0%, #2E160F 45%, #1C0F0A 100%)" }}
    >
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 70% 40% at 50% 15%, rgba(196,113,74,0.12) 0%, rgba(196,113,74,0) 70%)",
            parallax: 22,
          },
          {
            background:
              "radial-gradient(ellipse 50% 45% at 85% 30%, rgba(212,160,48,0.10) 0%, rgba(212,160,48,0) 65%)",
            parallax: 28,
          },
          {
            background:
              "radial-gradient(ellipse 45% 40% at 10% 70%, rgba(91,184,180,0.08) 0%, rgba(91,184,180,0) 70%)",
            parallax: 24,
          },
        ]}
      />

      <div className="container-inner relative">
        {/* Header */}
        <motion.p
          className="label-text text-terracotta mb-12 md:mb-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          03 — De Film
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 md:mb-24">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h2 className="font-playfair text-cream text-display-md font-bold leading-tight mb-6">
              Een film die om geloof vraagt.
            </h2>
            <p className="font-inter text-cream/65 text-base md:text-lg leading-relaxed mb-5">
              Een kortfilm van 2:40 minuten, volledig gegenereerd door AI: beeld,
              verhaal, geluid. Ontworpen om emotioneel waar aan te voelen, met
              opzet zonder enig signaal van de kunstmatige herkomst.
            </p>
            <p className="font-inter text-cream/65 text-base md:text-lg leading-relaxed">
              De film is de eerste akte van de ervaring. Hij bouwt emotionele
              betrokkenheid op nog voordat de vraag naar authenticiteit wordt
              gesteld.
            </p>

            {/* Film stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { value: "2:40", label: "Duur" },
                { value: "1080p", label: "Resolutie" },
                { value: "Nano Banana 2 + Kling 3.0", label: "Tools" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-playfair text-terracotta text-2xl font-bold">
                    {value}
                  </p>
                  <p className="label-text text-cream/40 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Video placeholder */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden group bg-black"
              style={{ aspectRatio: "16/9" }}
            >
              {playActive ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${FILM_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="Between Real and Made"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src="/tool/filmcover.jpg"
                    alt=""
                    fill
                    className="object-cover"
                  />
                  {/* Corner frame marks */}
                  {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
                    (pos, i) => (
                      <div
                        key={i}
                        className={`absolute ${pos} w-4 h-4 border-terracotta/30 pointer-events-none`}
                        style={{
                          borderTop: i < 2 ? "1px solid" : "none",
                          borderBottom: i >= 2 ? "1px solid" : "none",
                          borderLeft: i % 2 === 0 ? "1px solid" : "none",
                          borderRight: i % 2 !== 0 ? "1px solid" : "none",
                        }}
                        aria-hidden="true"
                      />
                    )
                  )}
                  <AnimatePresence>
                    <motion.button
                      type="button"
                      onClick={handlePlay}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer outline-none"
                      aria-label="Speel de film af"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
                      <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)" }}
                        aria-hidden="true"
                      />
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-terracotta/20 border border-terracotta/40 flex items-center justify-center group-hover:bg-terracotta/30 transition-all duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-terracotta ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="relative label-text text-cream/80">Bekijk de film</p>
                    </motion.button>
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Film stills */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.p
            className="label-text text-cream/40 mb-6"
            variants={fadeIn}
          >
            Filmstills
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stills.map((still) => (
              <motion.button
                key={still.id}
                className="relative rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-terracotta"
                style={{ aspectRatio: "4/3" }}
                variants={scaleIn}
                onClick={() =>
                  setActiveStill(activeStill === still.id ? null : still.id)
                }
                aria-label={`Bekijk still: ${still.label}`}
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <Image
                    src={still.img}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-inter text-cream/80 text-xs font-medium">
                    {still.label}
                  </p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 border border-terracotta/0 group-hover:border-terracotta/50 rounded-xl transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Expanded still description */}
          <AnimatePresence>
            {activeStill && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-5 rounded-xl border border-cream/10 bg-cream/5">
                  <p className="font-playfair text-cream italic text-lg">
                    {stills.find((s) => s.id === activeStill)?.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
