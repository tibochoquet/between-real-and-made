"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], ["0%", "8%"]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen min-h-[700px] max-h-[1200px] flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        {/* Setting photo */}
        <Image
          src="/tool/magnific_replace-the-poster-on-the_iALVNPC3uK.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark espresso / burgundy overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(13,7,5,0.78) 0%, rgba(61,35,23,0.62) 48%, rgba(13,7,5,0.82) 100%)",
          }}
        />

        {/* Subtle diagonal texture */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,248,240,0.5) 0px, rgba(255,248,240,0.5) 1px, transparent 1px, transparent 36px)",
          }}
        />

        {/* Warm amber glow behind the title */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 42%, #D4916F 0%, rgba(212,145,111,0) 70%)",
          }}
          animate={{ opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Warm light accent — top right */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 75% 20%, #C4714A 0%, rgba(196,113,74,0) 70%)",
          }}
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Deep shadow — bottom left */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 85%, #0D0705 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Bottom bleed — eases into De Vraag's dark espresso tone */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #1C0F0A 0%, rgba(28,15,10,0) 100%)",
        }}
        aria-hidden="true"
      />
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 65% 40% at 50% 100%, rgba(196,113,74,0.18) 0%, rgba(196,113,74,0) 70%)",
            parallax: 24,
          },
        ]}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full"
        style={{ opacity: contentOpacity, y: contentY }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="label-text text-terracotta mb-8 md:mb-12"
          variants={fadeInUp}
        >
          CMD Afstudeerproject · 2026
        </motion.p>

        <motion.h1
          className="mb-6 md:mb-10 flex justify-center"
          variants={fadeInUp}
        >
          <Image
            src="/tool/logobetweenrealandmade1.png"
            alt="Between Real and Made"
            width={6336}
            height={2688}
            priority
            className="w-full"
            style={{
              maxWidth: "min(880px, 92vw)",
              filter:
                "drop-shadow(0 2px 12px rgba(0,0,0,0.55)) drop-shadow(0 8px 40px rgba(0,0,0,0.40))",
            }}
          />
        </motion.h1>

        <motion.p
          className="font-inter text-base md:text-lg lg:text-xl text-cream/65 max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed"
          variants={fadeInUp}
        >
          Een onderzoek naar hoe kunstmatige intelligentie verandert hoe mensen
          muziek ervaren, waarderen en bespreken.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <a
            href="#question"
            className="group inline-flex items-center gap-3 bg-terracotta text-cream px-7 py-3.5 md:px-9 md:py-4 rounded-full font-inter font-medium text-sm uppercase tracking-wider hover:bg-terracotta-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Ontdek de ervaring
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        aria-hidden="true"
      >
        <span className="label-text text-cream/35">Scroll</span>
        <div className="w-px h-10 bg-cream/20 overflow-hidden rounded-full">
          <motion.div
            className="w-full h-full bg-terracotta/60 rounded-full"
            animate={{ y: ["-100%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
