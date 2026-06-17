"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerFast,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

function AnimatedNumber({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {current}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 12, suffix: "", label: "Deelnemers", sub: "in een informele testsetting" },
  { value: 100, suffix: "%", label: "Ervaarde een gesprek", sub: "kwam op gang na de film en tool" },
  { value: 5, suffix: "", label: "Onderscheidende profielen", sub: "kwamen consistent naar voren" },
  { value: 40, suffix: "+", label: "Prompts geïtereerd", sub: "voor het genereren van de film" },
];

const findings = [
  "Context bepaalt de perceptie sterker dan de inhoud zelf.",
  "Emotionele reactie gaat consequent vooraf aan rationeel oordeel.",
  "De profielkaartjes werden door deelnemers genoemd als het sterkste onderdeel van de ervaring.",
  "Het moment van onthulling beïnvloedt het verhaal na afloop aanzienlijk.",
  "De jazzbar-scène riep de meeste emotie en de meest productieve gesprekken op.",
];

const quotes = [
  {
    text: "Het voelde echt voor me, totdat je het me vertelde. Dat is wat me schrok: ik vond het niet prettig dat mijn gevoelens gefabriceerd konden worden.",
    profile: "De Scepticus",
  },
  {
    text: "Muziek is muziek. Als het me raakt, raakt het me. De machine is gewoon het nieuwste instrument.",
    profile: "De Optimist",
  },
  {
    text: "Ik waardeer het vakmanschap, maar dit doet me afvragen wat we verliezen wanneer intentie verdwijnt.",
    profile: "De Twijfelaar",
  },
];

const PROOF_YOUTUBE_ID = "2t5L6nZ_XaY";

export function ProofOfConcept() {
  const [activeQuote, setActiveQuote] = useState(0);
  const [playActive, setPlayActive] = useState(false);

  const handlePlay = () => {
    setPlayActive(true);
  };

  return (
    <section
      id="proof"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/tool/licht3.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, rgba(243,228,205,0.90) 0%, rgba(231,213,187,0.90) 45%, rgba(218,197,168,0.89) 100%)" }} />
      </div>
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 75% 50% at 50% 55%, rgba(196,113,74,0.14) 0%, rgba(196,113,74,0) 70%)",
            parallax: 22,
          },
          {
            background:
              "radial-gradient(ellipse 50% 45% at 88% 12%, rgba(247,243,236,0.06) 0%, rgba(247,243,236,0) 70%)",
            parallax: 30,
          },
          {
            background:
              "radial-gradient(ellipse 45% 40% at 8% 75%, rgba(247,243,236,0.04) 0%, rgba(247,243,236,0) 70%)",
            parallax: 26,
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
          06 — Bewijs van Concept
        </motion.p>

        <motion.h2
          className="font-playfair text-brown text-display-md font-bold leading-tight mb-16 md:mb-20 max-w-3xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          Het onderzoek spreekt voor zich.
        </motion.h2>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20 md:mb-28"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {stats.map(({ value, suffix, label, sub }) => (
            <motion.div
              key={label}
              className="text-center p-6 md:p-8 rounded-2xl bg-brown/5 border border-brown/10"
              variants={scaleIn}
              whileHover={{ y: -6 }}
              whileTap={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="font-playfair text-terracotta text-display-sm font-bold mb-2">
                <AnimatedNumber target={value} suffix={suffix} />
              </p>
              <p className="font-inter text-brown font-semibold text-sm md:text-base mb-1">
                {label}
              </p>
              <p className="font-inter text-brown/50 text-xs leading-snug">{sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Two columns — findings + quotes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Key findings */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <motion.h3
              className="font-playfair text-brown text-2xl md:text-3xl font-semibold mb-8"
              variants={fadeInUp}
            >
              Belangrijkste bevindingen
            </motion.h3>
            <ul className="space-y-4" role="list">
              {findings.map((finding, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-terracotta/15 border border-terracotta/30 flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                  </span>
                  <p className="font-inter text-brown/70 text-sm md:text-base leading-relaxed">
                    {finding}
                  </p>
                </motion.li>
              ))}
            </ul>

            {/* Proof of concept video */}
            <motion.div
              className="mt-10"
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <motion.p className="label-text text-brown/40 mb-3" variants={fadeIn}>
                Sessiedocumentatie
              </motion.p>
              <motion.div
                className="rounded-xl overflow-hidden relative group bg-black"
                style={{ aspectRatio: "16/9" }}
                variants={scaleIn}
              >
                {playActive ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${PROOF_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="Proof of Concept"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src="/proof-cover.jpg"
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <AnimatePresence>
                      <motion.button
                        type="button"
                        onClick={handlePlay}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer outline-none"
                        aria-label="Speel de bewijs-van-concept video af"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-terracotta/20 border border-terracotta/40 flex items-center justify-center group-hover:bg-terracotta/30 transition-all duration-300 group-hover:scale-110">
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-terracotta ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="relative label-text text-cream/80">Bekijk de proefsessie</p>
                      </motion.button>
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quotes */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <motion.h3
              className="font-playfair text-brown text-2xl md:text-3xl font-semibold mb-8"
              variants={fadeInUp}
            >
              Stemmen van deelnemers
            </motion.h3>

            <div className="space-y-4">
              {quotes.map((quote, i) => (
                <motion.button
                  key={i}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-terracotta ${
                    activeQuote === i
                      ? "bg-brown border-brown/0 shadow-lg"
                      : "bg-beige/50 border-brown/10 hover:border-brown/20 hover:bg-beige"
                  }`}
                  onClick={() => setActiveQuote(i)}
                  aria-pressed={activeQuote === i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <blockquote
                    className={`font-playfair italic text-base md:text-lg leading-snug mb-4 transition-colors duration-300 ${
                      activeQuote === i ? "text-cream" : "text-brown/80"
                    }`}
                  >
                    "{quote.text}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <span
                      className={`label-text transition-colors duration-300 ${
                        activeQuote === i
                          ? "text-terracotta-light"
                          : "text-terracotta"
                      }`}
                    >
                      {quote.profile}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
