"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerSlow,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

const steps = [
  {
    number: "01",
    title: "De Film",
    description:
      "Deelnemers bekijken een kortfilm van 2:40 minuten, volledig gegenereerd door AI, ontworpen om emotioneel echt aan te voelen.",
    image: "/tool/magnific_KjIOBq8kqp.png",
    anchor: "#film",
    objectPosition: "center",
  },
  {
    number: "02",
    title: "De Tool",
    description:
      "Ze beantwoorden vier vragen over de film en nemen zo zelf positie in over AI in muziek.",
    image: "/tool/magnific_mCWknvBhJQ.png",
    anchor: "#tool",
    objectPosition: "center",
  },
  {
    number: "03",
    title: "Het Profiel",
    description:
      "Op basis van hun antwoorden krijgen deelnemers een van de vijf onderscheidende luisteraarsprofielen.",
    image: "/tool/magnific_EqDsVinuuO.png",
    anchor: "#profiles",
    objectPosition: "center top",
  },
  {
    number: "04",
    title: "Het Gesprek",
    description:
      "Met hun profielkaartje in de hand gaan deelnemers met elkaar in gesprek over wat de film en de tool bij hen opriepen.",
    image: "/tool/magnific_make-a-png-3d-of-img1-mak_y6KYHYTPW9.png",
    anchor: "#proof",
    objectPosition: "center",
  },
];

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M6 13l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TheExperience() {
  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/tool/licht1.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(243,228,205,0.72) 0%, rgba(231,213,187,0.72) 45%, rgba(218,197,168,0.70) 100%)" }} />
      </div>
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 75% 50% at 50% 55%, rgba(196,113,74,0.15) 0%, rgba(196,113,74,0) 70%)",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 md:mb-28">
          <div>
            <motion.p
              className="label-text text-terracotta mb-6"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              02 — De Ervaring
            </motion.p>
            <motion.h2
              className="font-playfair text-brown text-display-md font-bold leading-tight"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              Een reis in vier delen naar perceptie.
            </motion.h2>
          </div>
          <motion.p
            className="font-inter text-brown/60 leading-relaxed text-base md:text-lg self-end"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            We ontwierpen een meeslepende onderzoekservaring die deelnemers
            meeneemt van passief kijken naar actief creëren, en onderzoekt
            vervolgens wat die reis doet met hoe ze over muziek denken.
          </motion.p>
        </div>

        {/* Steps with arrows between */}
        <motion.div
          className="flex flex-col sm:flex-row items-start gap-0"
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col sm:flex-row items-start flex-1 min-w-0">
              {/* Step card */}
              <motion.div
                className="group flex-1 min-w-0"
                variants={scaleIn}
                whileHover={{ y: -6 }}
                whileTap={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.a
                  href={step.anchor}
                  className="relative w-full aspect-[4/3] sm:w-32 sm:h-32 sm:aspect-auto rounded-2xl overflow-hidden block mb-6 cursor-pointer"
                  whileHover={{ rotate: 5, scale: 1.06 }}
                  whileTap={{ rotate: 5, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  aria-label={`Ga naar ${step.title}`}
                >
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) calc(100vw - 2rem), 160px"
                    quality={90}
                  />
                </motion.a>

                <p className="font-inter text-terracotta font-medium text-xs uppercase tracking-widest mb-2">
                  {step.number}
                </p>
                <h3 className="font-playfair text-brown text-xl md:text-2xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="font-inter text-brown/55 text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <motion.div
                  className="text-terracotta/40 my-5 sm:my-0 sm:mx-3 flex-shrink-0 sm:mt-[52px]"
                  variants={fadeIn}
                  aria-hidden="true"
                >
                  <span className="sm:hidden">
                    <ArrowDown />
                  </span>
                  <span className="hidden sm:block">
                    <ArrowRight />
                  </span>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 md:mt-28 p-8 md:p-12 rounded-3xl border border-brown/8 bg-brown/3 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p className="font-playfair text-brown text-xl md:text-2xl lg:text-3xl italic font-light max-w-3xl mx-auto leading-relaxed">
            "De ervaring is het argument. Ze stelt de vraag of wat we voelen
            bij muziek overeind blijft wanneer we weten wie of wat het
            heeft gemaakt."
          </p>
          <p className="label-text text-terracotta mt-6">Ontwerpintentie</p>
        </motion.div>
      </div>
    </section>
  );
}
