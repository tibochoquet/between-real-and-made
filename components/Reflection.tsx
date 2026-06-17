"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerFast,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

const insights = [
  {
    num: "01",
    heading: "Authenticiteit is relationeel",
    body: "Authenticiteit in muziek is geen eigenschap van het geluid zelf — het is een eigenschap van de relatie tussen luisteraar, maker en context.",
  },
  {
    num: "02",
    heading: "Vormgeving stuurt perceptie",
    body: "Hoe een ervaring wordt geframed is belangrijker dan de inhoud ervan. Framing bepaalt wat mensen voelen, nog voor ze nadenken.",
  },
  {
    num: "03",
    heading: "Profielen zijn posities",
    body: "De vijf profielen zijn geen vaste persoonlijkheidstypen, maar posities op een spectrum die dezelfde persoon anders kan innemen.",
  },
];

const secondary = [
  {
    category: "Ontwerpkeuzes",
    items: [
      { heading: "Geen voorafgaande onthulling", body: "Deelnemers kregen pas na afloop te horen dat de film door AI was gegenereerd — een ethische keuze die zorgvuldige debriefing vereiste." },
      { heading: "Film vóór tool", body: "De volgorde was bewust: emotionele betrokkenheid eerst, rationeel oordeel daarna." },
      { heading: "Profielen, geen oordelen", body: "Elk profiel wordt met gelijke geldigheid gepresenteerd, om sturing richting een 'juist' antwoord te vermijden." },
    ],
  },
  {
    category: "Toekomstig werk",
    items: [
      { heading: "Longitudinale opvolging", body: "Een vervolgsessie 4 weken later zou tonen of profielposities stabiel blijven of verschuiven." },
      { heading: "Bredere demografie", body: "De huidige steekproef bestaat vooral uit 18–30-jarigen met interesse in design en muziek." },
      { heading: "Zelfidentificatie met profiel", body: "Toekomstige iteraties zouden deelnemers kunnen laten aangeven met welk profiel ze zich identificeren." },
    ],
  },
];

export function Reflection() {
  return (
    <section
      id="reflection"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/tool/licht4.png" alt="" fill className="object-cover" />
      </div>
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(196,113,74,0.08) 0%, rgba(196,113,74,0) 75%)",
            parallax: 16,
          },
          {
            background:
              "radial-gradient(ellipse 60% 50% at 85% 30%, rgba(196,113,74,0.10) 0%, rgba(196,113,74,0) 70%)",
            parallax: 22,
          },
        ]}
      />

      <div className="container-inner relative">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 md:mb-20">
          <div>
            <motion.p
              className="label-text text-terracotta mb-6"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              08 — Reflectie
            </motion.p>
            <motion.h2
              className="font-playfair text-brown text-display-md font-bold leading-tight"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              Wat dit project<br />me heeft geleerd.
            </motion.h2>
          </div>
          <motion.p
            className="font-inter text-brown/55 text-base md:text-lg leading-relaxed self-end"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            Reflectie is geen epiloog — het is een wezenlijk onderdeel van
            het onderzoek. Dit zijn geen conclusies, maar aanzetten voor het
            volgende gesprek.
          </motion.p>
        </div>

        {/* Dark insight cards — contrast against the light background */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-16 md:mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {insights.map((item) => (
            <motion.div
              key={item.num}
              className="rounded-2xl p-7 md:p-8 flex flex-col justify-between gap-10"
              style={{ minHeight: "260px", background: "linear-gradient(145deg, #4A2B1A 0%, #1C0F0A 100%)" }}
              variants={scaleIn}
              whileHover={{ y: -5 }}
              whileTap={{ y: -3 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <span className="font-inter text-terracotta font-semibold text-sm">
                {item.num}
              </span>
              <div>
                <h3 className="font-playfair text-cream text-xl md:text-2xl font-semibold leading-snug mb-3">
                  {item.heading}
                </h3>
                <p className="font-inter text-cream/50 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary content — two columns */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-10 border-t border-brown/12"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {secondary.map((group) => (
            <motion.div key={group.category} variants={fadeInUp}>
              <p className="label-text text-terracotta mb-6">{group.category}</p>
              <div className="space-y-6">
                {group.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-px bg-terracotta/25 flex-shrink-0 mt-1.5" />
                    <div>
                      <p className="font-inter text-brown font-medium text-sm mb-1">
                        {item.heading}
                      </p>
                      <p className="font-inter text-brown/50 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing quote */}
        <motion.div
          className="mt-20 md:mt-28 text-center max-w-3xl mx-auto"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div
            className="w-12 h-px bg-terracotta mx-auto mb-10"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          />
          <p className="font-playfair text-brown text-display-sm italic font-light leading-snug">
            "Het belangrijkste dat ik heb geleerd, is dat de vraag zelf het
            ontwerp is. Die luid, zorgvuldig en ervaringsgericht stellen is
            op zichzelf al een daad."
          </p>
          <p className="label-text text-terracotta mt-6">
            Tibo Choquet · 2026
          </p>
        </motion.div>

      </div>
    </section>
  );
}
