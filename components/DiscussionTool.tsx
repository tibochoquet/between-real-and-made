"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ease, fadeIn, fadeInUp, viewportConfig } from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

interface Option {
  letter: string;
  text: string;
  score: number;
}

interface Question {
  scene: string;
  short: string;
  title: string;
  text: string;
  img: string;
  overlay: string;
  options: Option[];
}

interface ProfileResult {
  range: [number, number];
  chip: string;
  color: string;
  title: string;
  desc: string;
  questions: string[];
}

const questions: Question[] = [
  {
    scene: "Scene 01 — Streaming",
    short: "Streaming",
    title: "Eindeloos scrollen",
    text: "Je scrolt door duizenden AI-nummers. Elk nummer klinkt perfect. Toch kies je niets. Wat zegt dat?",
    img: "/tool/magnific_cinematic-overtheshoulder_2789668412.png",
    overlay:
      "linear-gradient(to bottom, rgba(30,12,2,.2) 0%, rgba(15,5,0,.65) 100%)",
    options: [
      {
        letter: "A",
        text: "Muziek zonder menselijke keuzes mist iets fundamenteels, hoe perfect het ook klinkt.",
        score: 0,
      },
      {
        letter: "B",
        text: "Het probleem zit bij de luisteraar. We zijn niet gewend aan zoveel keuze, niet aan de muziek zelf.",
        score: 2,
      },
      {
        letter: "C",
        text: "Perfecte muziek is juist saai. AI verwijdert de ruwheid die muziek interessant maakt.",
        score: 1,
      },
      {
        letter: "D",
        text: "Dit is gewoon een overgangsperiode. Over tien jaar scrollen we net zo makkelijk door AI-muziek als door Spotify.",
        score: 3,
      },
    ],
  },
  {
    scene: "Scene 02 — Straatmuzikant",
    short: "Straatmuzikant",
    title: "Gitaar met AI",
    text: "Een gewone muzikant gebruikt AI om gitaar te spelen, voor dingen die hij zelf niet kan. Is dat nog authentiek?",
    img: "/tool/magnific_extreme-closeup-of-a-guit_2797852264.png",
    overlay:
      "linear-gradient(to bottom, rgba(40,20,5,.2) 0%, rgba(20,10,0,.65) 100%)",
    options: [
      {
        letter: "A",
        text: "Ja. Hij maakt de muzikale keuzes, AI voert uit. Dat is niet anders dan een pedaal of een looper.",
        score: 2,
      },
      {
        letter: "B",
        text: "Nee. Als je iets niet zelf kunt spelen, moet je het ook niet spelen. Dat is de grens van je expressie.",
        score: 0,
      },
      {
        letter: "C",
        text: "Hangt ervan af. Als het hem verder brengt als artiest is het een tool. Als het hem vervangt, niet.",
        score: 1,
      },
      {
        letter: "D",
        text: "We accepteren al jaren dat producers dingen maken die ze live niet kunnen spelen. Waarom is dit anders?",
        score: 3,
      },
    ],
  },
  {
    scene: "Scene 03 — Dj-set",
    short: "Dj-set",
    title: "De onzichtbare dj",
    text: "De dj staat op het podium maar doet niets. AI regelt alle transitions. Het publiek gaat uit zijn dak. Is er een probleem?",
    img: "/tool/magnific_cinematic-shot-from-behin_2800345015.png",
    overlay:
      "linear-gradient(to bottom, rgba(35,12,0,.25) 0%, rgba(15,5,0,.68) 100%)",
    options: [
      {
        letter: "A",
        text: "Nee. Als het publiek het voelt en beleeft, is het een echte performance. Het resultaat is wat telt.",
        score: 2,
      },
      {
        letter: "B",
        text: "Ja. Het publiek wordt misleid: ze denken dat iemand iets doet, maar het is een illusie.",
        score: 0,
      },
      {
        letter: "C",
        text: "De dj heeft de set samengesteld en de sfeer bepaald. Dat hij AI laat uitvoeren maakt hem nog steeds de curator.",
        score: 1,
      },
      {
        letter: "D",
        text: "Dit is gewoon eerlijk. Veel dj's draaiden al op autopiloot, AI maakt alleen zichtbaar wat er al was.",
        score: 3,
      },
    ],
  },
  {
    scene: "Scene 04 — Jazzbar",
    short: "Jazzbar",
    title: "Geen AI, geen perfectie",
    text: "De jazzbar is het enige moment zonder AI. De muziek is ruw, soms vals. Toch voelt het anders. Wat doe je met dat gevoel?",
    img: "/tool/magnific_cinematic-mediumwide-shot_2817411937.png",
    overlay:
      "linear-gradient(to bottom, rgba(30,15,5,.2) 0%, rgba(15,8,0,.65) 100%)",
    options: [
      {
        letter: "A",
        text: "Dat gevoel is nostalgie, geen bewijs. We romantiseren imperfectie omdat het ons vertrouwd voelt.",
        score: 2,
      },
      {
        letter: "B",
        text: "Dat gevoel is het bewijs. Menselijke kwetsbaarheid in muziek is iets wat AI structureel niet kan nabootsen.",
        score: 0,
      },
      {
        letter: "C",
        text: "Niet de afwezigheid van AI maakt het bijzonder, het is de context. Een café, echte mensen, live interactie.",
        score: 1,
      },
      {
        letter: "D",
        text: "Over twintig jaar zal ook deze jazzbar verdwenen zijn. Het is mooi, maar het is niet de toekomst.",
        score: 3,
      },
    ],
  },
];

const profileResults: ProfileResult[] = [
  {
    range: [0, 3],
    chip: "De Scepticus",
    color: "#8C4A4A",
    title: "AI mist iets wat telt",
    desc: "Je gelooft dat muziek meer is dan een perfecte output. Menselijke keuzes, fouten en kwetsbaarheid zijn geen bijzaak, ze zijn de kern. Je ziet AI als een bedreiging voor wat muziek uniek maakt. De jazzbar raakte je waarschijnlijk het meest.",
    questions: [
      "Kun je een moment benoemen waarop muziek je raakte juist omdat het onvolmaakt was?",
      "Wat zou er moeten veranderen aan AI-muziek voordat jij het als echt zou beschouwen?",
      "Is jouw grens een gevoel, of kun je hem ook rationeel verdedigen tegenover iemand die het niet voelt?",
    ],
  },
  {
    range: [4, 5],
    chip: "De Twijfelaar",
    color: "#7A8C6E",
    title: "Ik weet het nog niet",
    desc: "Je antwoorden gaan alle kanten op, en dat is precies het punt. Je laat je niet makkelijk vangen in een standpunt, omdat de werkelijkheid je telkens op andere gedachten brengt. Je zoekt de nuance, maar weet soms ook niet waar je staat.",
    questions: [
      "Welke scène bracht je het meest van je stuk? Waarom precies die?",
      "Is twijfel hier een sterkte, of ontloop je daarmee een keuze?",
      "Als je morgen moest kiezen, AI-muziek ja of nee, wat kies je en waarom?",
    ],
  },
  {
    range: [6, 6],
    chip: "De Pragmaticus",
    color: "#B87A2E",
    title: "Het hangt ervan af",
    desc: "Je beoordeelt situatie per situatie. Je bent niet voor of tegen AI, je kijkt naar context, intentie en resultaat. Pragmatisch, maar daardoor ook moeilijk te vangen in een debat.",
    questions: [
      "Waar ligt voor jou precies de grens tussen AI als tool en AI als vervanger?",
      "Kan die grens opschuiven? Wat zou daarvoor nodig zijn?",
      "Is jouw standpunt nog houdbaar als AI nog beter wordt dan nu?",
    ],
  },
  {
    range: [7, 8],
    chip: "De Optimist",
    color: "#C4714A",
    title: "AI is gewoon de volgende stap",
    desc: "Voor jou is AI geen bedreiging maar een evolutie. Muziek is altijd veranderd door technologie en dit is de volgende stap. De luisterervaring staat centraal, niet wie of wat het maakt. Je romantiseert de jazzbar niet.",
    questions: [
      "Geloof je echt dat de beleving van de luisteraar het enige is dat telt, of is dat ook een aangeleerd standpunt?",
      "Wat verlies je als menselijke muzikanten verdwijnen? Of verlies je eigenlijk niets?",
      "Hoe reageer je op iemand die zegt: maar dan zit er geen verhaal meer achter de muziek?",
    ],
  },
  {
    range: [9, 12],
    chip: "De Cynicus",
    color: "#4A4A6B",
    title: "Dit was al zo",
    desc: "Jij ziet de hypocrisie. De dj draaide al op autopiloot. De producer kon zijn muziek al niet live spelen. AI maakt alleen zichtbaar wat er al was. Je bent niet enthousiast over de toekomst, maar je rouwt ook niet om het verleden.",
    questions: [
      "Als dit al zo was vóór AI, maakt het dan iets uit dat AI het nu explicieter maakt?",
      "Was er iets in de film dat jou verraste, of bevestigde het alleen wat je al dacht?",
      "Heb je ooit iets beleefd als echt, terwijl het dat achteraf niet was? Wat deed dat met je?",
    ],
  },
];

function getProfile(score: number): ProfileResult {
  return (
    profileResults.find((p) => score >= p.range[0] && score <= p.range[1]) ??
    profileResults[2]
  );
}

const cardSizes = "(max-width: 480px) 100vw, 380px";

type Step = "intro" | 0 | 1 | 2 | 3 | "result";

export function DiscussionTool() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<(number | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  const [resultPage, setResultPage] = useState(0);

  const start = () => {
    setAnswers([undefined, undefined, undefined, undefined]);
    setResultPage(0);
    setStep(0);
  };

  const pick = (qIndex: number, optIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  };

  const next = () => {
    if (typeof step !== "number" || answers[step] === undefined) return;
    if (step === 3) {
      setResultPage(0);
      setStep("result");
      return;
    }
    setStep((step + 1) as Step);
  };

  const prev = () => {
    if (step === 0) {
      setStep("intro");
      return;
    }
    if (typeof step === "number") setStep((step - 1) as Step);
  };

  const resultPrev = () => {
    if (resultPage === 0) {
      setStep(3);
      return;
    }
    setResultPage((p) => p - 1);
  };

  const resultNext = () => {
    setResultPage((p) => Math.min(p + 1, 2));
  };

  const total = answers.reduce<number>((sum, a, i) => {
    if (a === undefined) return sum;
    return sum + questions[i].options[a].score;
  }, 0);
  const result = getProfile(total);

  return (
    <section
      id="tool"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/tool/2donker.png" alt="" fill className="object-cover" />
      </div>
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(237,231,217,0.06) 0%, rgba(237,231,217,0) 75%)",
            parallax: 16,
          },
          {
            background:
              "radial-gradient(ellipse 60% 55% at 26% 42%, rgba(196,113,74,0.30) 0%, rgba(196,113,74,0) 70%)",
            parallax: 26,
          },
          {
            background:
              "radial-gradient(ellipse 50% 45% at 88% 85%, rgba(212,145,111,0.10) 0%, rgba(212,145,111,0) 70%)",
            parallax: 22,
          },
          {
            background:
              "radial-gradient(ellipse 75% 40% at 50% 100%, rgba(247,243,236,0.06) 0%, rgba(247,243,236,0) 75%)",
            parallax: 18,
          },
        ]}
      />

      <div className="container-inner relative">
        {/* Header */}
        <motion.p
          className="label-text text-terracotta mb-6"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          04 — De Tool
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Phone mockup */}
          <motion.div
            className="group relative mx-auto"
            style={{ width: "min(100%, 380px)" }}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            whileHover={{ scale: 1.035 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Spotlight pool beneath the phone */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-12 rounded-full opacity-70 blur-2xl transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-110"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(196,113,74,0.45) 0%, rgba(196,113,74,0) 75%)",
              }}
              aria-hidden="true"
            />

            {/* Side buttons */}
            <div
              className="absolute -left-[2px] top-[22%] w-[3px] h-9 rounded-l-sm bg-brown/15"
              aria-hidden="true"
            />
            <div
              className="absolute -left-[2px] top-[30%] w-[3px] h-14 rounded-l-sm bg-brown/15"
              aria-hidden="true"
            />
            <div
              className="absolute -right-[2px] top-[25%] w-[3px] h-20 rounded-r-sm bg-brown/15"
              aria-hidden="true"
            />

            {/* Phone frame */}
            <div className="relative rounded-[2.6rem] sm:rounded-[3rem] p-2.5 sm:p-3 bg-brown shadow-[0_1px_2px_rgba(28,15,10,0.05),0_30px_70px_-18px_rgba(28,15,10,0.45),0_14px_28px_-8px_rgba(196,113,74,0.25),0_80px_140px_-50px_rgba(28,15,10,0.4)] transition-shadow duration-500 group-hover:shadow-[0_1px_2px_rgba(28,15,10,0.06),0_40px_90px_-18px_rgba(28,15,10,0.55),0_18px_36px_-8px_rgba(196,113,74,0.3),0_100px_170px_-50px_rgba(28,15,10,0.45)]">
              {/* Dynamic island */}
              <div
                className="absolute top-3 sm:top-3.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-full z-20"
                aria-hidden="true"
              />

              {/* Screen */}
              <div
                className="relative rounded-[2.1rem] sm:rounded-[2.5rem] overflow-hidden aspect-[9/19.5]"
                style={{ backgroundColor: "#0A0A0B" }}
              >
                {/* Preload all scene images in background */}
                <div className="absolute inset-0 opacity-0 pointer-events-none" aria-hidden="true">
                  {questions.map((q, i) => (
                    <div key={i} className="absolute inset-0">
                      <Image src={q.img} alt="" fill sizes={cardSizes} className="object-cover" />
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {step === "intro" && (
                    <motion.div
                      key="intro"
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-12"
                      style={{ backgroundColor: "#0A0A0B" }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <p className="label-text text-terracotta mb-5">
                        Discussietool na de film
                      </p>
                      <h3 className="font-playfair text-cream text-3xl md:text-5xl leading-tight mb-4">
                        Wat vind jij van
                        <br />
                        <em className="italic text-terracotta-light">
                          AI in muziek?
                        </em>
                      </h3>
                      <p className="font-inter text-cream/55 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-9">
                        Beantwoord vier vragen over wat je in de film zag. Je
                        krijgt een profiel en vragen om over te praten met je
                        groep.
                      </p>
                      <button
                        type="button"
                        onClick={start}
                        className="font-inter text-sm md:text-base font-medium px-8 py-3.5 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 hover:bg-terracotta/20 hover:scale-[1.02] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]"
                      >
                        Begin
                      </button>
                    </motion.div>
                  )}

                  {typeof step === "number" && (
                    <motion.div
                      key={`q-${step}`}
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      {/* Background image */}
                      <div className="absolute inset-0">
                        <motion.div
                          className="absolute inset-0"
                          initial={{ scale: 1.06 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 6, ease: "easeOut" }}
                        >
                          <Image
                            src={questions[step].img}
                            alt=""
                            fill
                            sizes={cardSizes}
                            className="object-cover"
                            priority={step === 0}
                          />
                        </motion.div>
                        <div
                          className="absolute inset-0"
                          style={{ background: questions[step].overlay }}
                        />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6">
                        {/* Topbar */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="font-inter text-cream/50 text-[11px] uppercase tracking-[0.2em]">
                            AI &amp; Muziek
                          </span>
                          <div
                            className="flex items-center gap-1.5"
                            role="img"
                            aria-label={`Vraag ${step + 1} van 4`}
                          >
                            {questions.map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  i === step
                                    ? "w-5 bg-terracotta"
                                    : i < step
                                      ? "w-1.5 bg-cream/50"
                                      : "w-1.5 bg-cream/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Question area */}
                        <div className="relative pb-2">
                          <div
                            className="font-playfair text-cream/10 leading-none absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                            style={{ fontSize: "clamp(2.5rem, 18vw, 4.5rem)" }}
                            aria-hidden="true"
                          >
                            {String(step + 1).padStart(2, "0")}
                          </div>
                          <p className="font-inter text-cream/50 text-[11px] uppercase tracking-[0.2em] mb-1.5">
                            {questions[step].scene}
                          </p>
                          <h3
                            className="font-playfair text-cream font-normal mb-1.5 leading-tight"
                            style={{
                              fontSize: "clamp(1.4rem, 5.5vw, 2rem)",
                              textShadow: "0 2px 20px rgba(0,0,0,.4)",
                            }}
                          >
                            {questions[step].title}
                          </h3>
                          <p
                            className="font-inter text-cream/70 text-[13px] sm:text-sm leading-snug max-w-md"
                            style={{ textShadow: "0 1px 8px rgba(0,0,0,.5)" }}
                          >
                            {questions[step].text}
                          </p>
                        </div>

                        {/* Options */}
                        <div>
                          <div className="flex flex-col gap-1.5 sm:gap-2">
                            {questions[step].options.map((opt, i) => {
                              const selected = answers[step] === i;
                              return (
                                <button
                                  key={opt.letter}
                                  type="button"
                                  onClick={() => pick(step, i)}
                                  aria-pressed={selected}
                                  className={`flex items-center gap-2.5 px-3.5 py-2 sm:py-2.5 rounded-2xl border text-left text-[12.5px] sm:text-[13px] leading-snug font-inter font-light backdrop-blur-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                                    selected
                                      ? "border-terracotta bg-terracotta/15 text-cream"
                                      : "border-cream/20 bg-black/30 text-cream/85 hover:border-cream/45 hover:bg-black/45"
                                  }`}
                                >
                                  <span
                                    className={`flex items-center justify-center flex-shrink-0 w-[20px] h-[20px] rounded-full text-[10px] font-medium transition-all duration-200 ${
                                      selected
                                        ? "bg-terracotta text-[#1C0F0A]"
                                        : "bg-brown/15 text-cream/75"
                                    }`}
                                  >
                                    {opt.letter}
                                  </span>
                                  <span>{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Nav */}
                          <div className="flex items-center justify-between gap-3 pt-3 sm:pt-4">
                            <button
                              type="button"
                              onClick={prev}
                              className="font-inter text-[13px] px-5 py-2 rounded-full border border-cream/25 bg-black/25 text-cream/70 backdrop-blur-sm hover:text-cream hover:border-cream/50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                            >
                              {step === 0 ? "Intro" : "Terug"}
                            </button>
                            <button
                              type="button"
                              onClick={next}
                              disabled={answers[step] === undefined}
                              className="font-inter text-[13px] px-5 py-2 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 backdrop-blur-sm hover:bg-terracotta/20 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:opacity-30 disabled:pointer-events-none"
                            >
                              {step === 3 ? "Bekijk profiel" : "Volgende"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === "result" && (
                    <motion.div
                      key="result"
                      className="absolute inset-0 overflow-hidden"
                      style={{ backgroundColor: "#0A0A0B" }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6">
                        {/* Topbar */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="font-inter text-cream/50 text-[11px] uppercase tracking-[0.2em]">
                            AI &amp; Muziek
                          </span>
                          <div
                            className="flex items-center gap-1.5"
                            role="img"
                            aria-label={`Pagina ${resultPage + 1} van 3`}
                          >
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  i === resultPage
                                    ? "w-5 bg-terracotta"
                                    : i < resultPage
                                      ? "w-1.5 bg-cream/50"
                                      : "w-1.5 bg-cream/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Page content */}
                        <div className="relative flex-1 overflow-hidden">
                          <AnimatePresence mode="wait" initial={false}>
                            {resultPage === 0 && (
                              <motion.div
                                key="rp0"
                                className="absolute inset-0 flex flex-col justify-center"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.35, ease }}
                              >
                                <span
                                  className="inline-flex items-center self-start font-inter text-[11px] font-medium uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full border mb-4"
                                  style={{
                                    borderColor: result.color,
                                    color: result.color,
                                  }}
                                >
                                  {result.chip}
                                </span>
                                <h3 className="font-playfair text-cream font-normal mb-3 leading-tight text-2xl sm:text-3xl">
                                  {result.title}
                                </h3>
                                <p className="font-inter text-cream/55 text-[13px] sm:text-sm leading-relaxed">
                                  {result.desc}
                                </p>
                              </motion.div>
                            )}

                            {resultPage === 1 && (
                              <motion.div
                                key="rp1"
                                className="absolute inset-0 flex flex-col justify-center"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.35, ease }}
                              >
                                <p className="font-inter text-[#7b6f5e] text-[11px] uppercase tracking-[0.15em] mb-3">
                                  Bespreek dit met je groep
                                </p>
                                <div className="flex flex-col gap-2.5">
                                  {result.questions.map((q, i) => (
                                    <div
                                      key={i}
                                      className="font-inter text-cream text-[12.5px] sm:text-[13px] leading-snug p-3 rounded-xl"
                                      style={{
                                        backgroundColor: "#161618",
                                        borderLeft: `2px solid ${result.color}`,
                                      }}
                                    >
                                      {q}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {resultPage === 2 && (
                              <motion.div
                                key="rp2"
                                className="absolute inset-0 flex flex-col"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.35, ease }}
                              >
                                <p className="font-inter text-[#7b6f5e] text-[11px] uppercase tracking-[0.15em] mb-3">
                                  Jouw antwoorden
                                </p>
                                <div className="flex flex-col gap-2 overflow-hidden">
                                  {answers.map((a, i) => {
                                    if (a === undefined) return null;
                                    return (
                                      <div
                                        key={i}
                                        className="flex items-start gap-2.5 text-xs"
                                      >
                                        <span className="min-w-[68px] text-[10px] uppercase tracking-wide text-[#7b6f5e] mt-0.5">
                                          {questions[i].short}
                                        </span>
                                        <span className="font-inter text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#c8b89a]/10 text-[#c8b89a] flex-shrink-0">
                                          {questions[i].options[a].letter}
                                        </span>
                                        <span className="font-inter text-cream/50 text-[11px] leading-snug">
                                          {questions[i].options[a].text}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="mt-auto flex flex-col gap-2 pt-4">
                                  <button
                                    type="button"
                                    onClick={start}
                                    className="font-inter text-[13px] text-center px-5 py-2.5 rounded-full border border-[#c8b89a]/40 text-[#c8b89a] hover:bg-[#c8b89a]/8 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                                  >
                                    Opnieuw beginnen
                                  </button>
                                  <a
                                    href="#profiles"
                                    className="font-inter text-[13px] text-center px-5 py-2.5 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 hover:bg-terracotta/20 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                                  >
                                    Bekijk alle profielen
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Nav */}
                        <div className="flex items-center justify-between gap-3 pt-3 sm:pt-4">
                          <button
                            type="button"
                            onClick={resultPrev}
                            className="font-inter text-[13px] px-5 py-2 rounded-full border border-cream/25 bg-black/25 text-cream/70 backdrop-blur-sm hover:text-cream hover:border-cream/50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                          >
                            Terug
                          </button>
                          {resultPage < 2 && (
                            <button
                              type="button"
                              onClick={resultNext}
                              className="font-inter text-[13px] px-5 py-2 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 backdrop-blur-sm hover:bg-terracotta/20 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                            >
                              Volgende
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h2 className="font-playfair text-brown text-display-md font-bold leading-tight mb-5">
              Probeer de discussietool zelf.
            </h2>
            <p className="font-inter text-brown/55 text-base md:text-lg leading-relaxed mb-8">
              Dit is de daadwerkelijke tool die deelnemers na de film invulden.
              Vier scènes, vier vragen: beantwoord ze zoals jij zou reageren en
              ontdek welk profiel het beste bij jou past.
            </p>

            {/* Interaction hint */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="block rounded-full bg-terracotta/50"
                    style={{ width: i === 0 ? 20 : 6, height: 6 }}
                  />
                ))}
              </div>
              <p className="font-inter text-brown/35 text-xs uppercase tracking-widest">
                Swipe door de vier scènes
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
