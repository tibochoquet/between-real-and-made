"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  slideInLeft,
  slideInRight,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

export function TheQuestion() {
  return (
    <section
      id="question"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/tool/donker1.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(28,15,10,0.58) 0%, rgba(46,22,15,0.58) 45%, rgba(13,7,5,0.58) 100%)" }} />
      </div>
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 60% 50% at 80% 18%, rgba(196,113,74,0.12) 0%, rgba(196,113,74,0) 70%)",
            parallax: 30,
          },
          {
            background:
              "radial-gradient(ellipse 55% 45% at 12% 75%, rgba(212,160,48,0.09) 0%, rgba(212,160,48,0) 70%)",
            parallax: 22,
          },
          {
            background:
              "radial-gradient(ellipse 45% 40% at 50% 50%, rgba(91,184,180,0.07) 0%, rgba(91,184,180,0) 75%)",
            parallax: 18,
          },
        ]}
      />

      <div className="container-inner relative">
        <motion.p
          className="label-text text-terracotta mb-12 md:mb-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          01 — De Vraag
        </motion.p>

        <motion.div
          className="mb-16 md:mb-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.h2
            className="font-playfair text-cream text-display-lg italic font-light leading-tight max-w-4xl"
            variants={fadeInUp}
          >
            Wat gebeurt er als AI onderdeel wordt van de muziekcultuur?
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h3 className="font-playfair text-terracotta text-xl md:text-2xl font-medium mb-5">
              Motivatie
            </h3>
            <p className="font-inter text-cream/65 leading-relaxed text-base md:text-lg mb-5">
              AI-muziekgeneratoren zoals Suno, Udio en Stable Audio maken het
              steeds moeilijker om te horen of muziek door mensen of door een
              machine is gemaakt. Dat verandert iets in hoe mensen naar muziek
              luisteren, wat ze erin waarderen en hoe ze erover praten.
            </p>
            <p className="font-inter text-cream/65 leading-relaxed text-base md:text-lg">
              Dit project vraagt: wat verandert er precies, en voor wie? Het
              gaat niet om de vraag of AI-muziek goed of slecht is, maar om
              hoe mensen die muziek beleven.
            </p>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div
              className="p-7 md:p-10 rounded-2xl border border-terracotta/30 relative overflow-hidden"
              style={{ backgroundColor: "rgba(196,113,74,0.06)" }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full bg-terracotta rounded-l-2xl"
                aria-hidden="true"
              />
              <p className="label-text text-terracotta mb-5">Onderzoeksvraag</p>
              <blockquote className="font-playfair text-cream text-lg md:text-xl lg:text-2xl italic leading-snug font-light">
                "Hoe beïnvloedt de opkomst van generatieve AI de herkenning,
                waardering en structurele positie van muziek en audiovisuele
                makers, en wat betekent dit voor de manier waarop wij beeld en
                geluid als &lsquo;menselijk&rsquo; ervaren?"
              </blockquote>
            </div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {[
                "Authenticiteit",
                "AI-muziek",
                "Culturele perceptie",
                "Designonderzoek",
                "Muzieksociologie",
              ].map((tag) => (
                <motion.span
                  key={tag}
                  className="px-4 py-2 rounded-full border border-cream/15 text-cream/50 font-inter text-xs font-medium uppercase tracking-wider"
                  variants={fadeInUp}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
