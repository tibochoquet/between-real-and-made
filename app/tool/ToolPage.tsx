"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/motion";

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
    overlay: "linear-gradient(to bottom, rgba(30,12,2,.2) 0%, rgba(15,5,0,.72) 100%)",
    options: [
      { letter: "A", text: "Muziek zonder menselijke keuzes mist iets fundamenteels, hoe perfect het ook klinkt.", score: 0 },
      { letter: "B", text: "Het probleem zit bij de luisteraar. We zijn niet gewend aan zoveel keuze, niet aan de muziek zelf.", score: 2 },
      { letter: "C", text: "Perfecte muziek is juist saai. AI verwijdert de ruwheid die muziek interessant maakt.", score: 1 },
      { letter: "D", text: "Dit is gewoon een overgangsperiode. Over tien jaar scrollen we net zo makkelijk door AI-muziek als door Spotify.", score: 3 },
    ],
  },
  {
    scene: "Scene 02 — Straatmuzikant",
    short: "Straatmuzikant",
    title: "Gitaar met AI",
    text: "Een gewone muzikant gebruikt AI om gitaar te spelen, voor dingen die hij zelf niet kan. Is dat nog authentiek?",
    img: "/tool/magnific_extreme-closeup-of-a-guit_2797852264.png",
    overlay: "linear-gradient(to bottom, rgba(40,20,5,.2) 0%, rgba(20,10,0,.72) 100%)",
    options: [
      { letter: "A", text: "Ja. Hij maakt de muzikale keuzes, AI voert uit. Dat is niet anders dan een pedaal of een looper.", score: 2 },
      { letter: "B", text: "Nee. Als je iets niet zelf kunt spelen, moet je het ook niet spelen. Dat is de grens van je expressie.", score: 0 },
      { letter: "C", text: "Hangt ervan af. Als het hem verder brengt als artiest is het een tool. Als het hem vervangt, niet.", score: 1 },
      { letter: "D", text: "We accepteren al jaren dat producers dingen maken die ze live niet kunnen spelen. Waarom is dit anders?", score: 3 },
    ],
  },
  {
    scene: "Scene 03 — Dj-set",
    short: "Dj-set",
    title: "De onzichtbare dj",
    text: "De dj staat op het podium maar doet niets. AI regelt alle transitions. Het publiek gaat uit zijn dak. Is er een probleem?",
    img: "/tool/magnific_cinematic-shot-from-behin_2800345015.png",
    overlay: "linear-gradient(to bottom, rgba(35,12,0,.25) 0%, rgba(15,5,0,.72) 100%)",
    options: [
      { letter: "A", text: "Nee. Als het publiek het voelt en beleeft, is het een echte performance. Het resultaat is wat telt.", score: 2 },
      { letter: "B", text: "Ja. Het publiek wordt misleid: ze denken dat iemand iets doet, maar het is een illusie.", score: 0 },
      { letter: "C", text: "De dj heeft de set samengesteld en de sfeer bepaald. Dat hij AI laat uitvoeren maakt hem nog steeds de curator.", score: 1 },
      { letter: "D", text: "Dit is gewoon eerlijk. Veel dj's draaiden al op autopiloot, AI maakt alleen zichtbaar wat er al was.", score: 3 },
    ],
  },
  {
    scene: "Scene 04 — Jazzbar",
    short: "Jazzbar",
    title: "Geen AI, geen perfectie",
    text: "De jazzbar is het enige moment zonder AI. De muziek is ruw, soms vals. Toch voelt het anders. Wat doe je met dat gevoel?",
    img: "/tool/magnific_cinematic-mediumwide-shot_2817411937.png",
    overlay: "linear-gradient(to bottom, rgba(30,15,5,.2) 0%, rgba(15,8,0,.72) 100%)",
    options: [
      { letter: "A", text: "Dat gevoel is nostalgie, geen bewijs. We romantiseren imperfectie omdat het ons vertrouwd voelt.", score: 2 },
      { letter: "B", text: "Dat gevoel is het bewijs. Menselijke kwetsbaarheid in muziek is iets wat AI structureel niet kan nabootsen.", score: 0 },
      { letter: "C", text: "Niet de afwezigheid van AI maakt het bijzonder, het is de context. Een café, echte mensen, live interactie.", score: 1 },
      { letter: "D", text: "Over twintig jaar zal ook deze jazzbar verdwenen zijn. Het is mooi, maar het is niet de toekomst.", score: 3 },
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
    desc: "Je antwoorden gaan alle kanten op. Je ziet sterke argumenten aan beide kanten en wilt je niet vastpinnen op één standpunt. De vraag is: is dat nuance of uitstelgedrag?",
    questions: [
      "Welke scene uit de film vond je het meest impactvol? Waarom die?",
      "Komt je twijfel voort uit nuance, of omdat je nog informatie mist?",
      "Als je morgen moest kiezen: AI-muziek ja of nee, wat kies je en waarom?",
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
    desc: "Voor jou is AI geen bedreiging maar een evolutie. Muziek is altijd veranderd door technologie en dit is de volgende stap. De luisterervaring staat centraal, niet wie of wat het maakt.",
    questions: [
      "Geloof je echt dat de beleving van de luisteraar het enige is dat telt, of is dat ook een aangeleerd standpunt?",
      "Wat verlies je als menselijke muzikanten verdwijnen? Of verlies je eigenlijk niets?",
      "Is muziek zonder menselijk verhaal erachter nog steeds betekenisvol? Waarom?",
    ],
  },
  {
    range: [9, 12],
    chip: "De Cynicus",
    color: "#4A4A6B",
    title: "Dit was al zo",
    desc: "Jij ziet de hypocrisie. De dj draaide al op autopiloot. De producer kon zijn muziek al niet live spelen. AI maakt alleen zichtbaar wat er al was. Je rouwt niet om het verleden.",
    questions: [
      "Als dit al zo was voor AI, maakt het dan iets uit dat AI het nu explicieter maakt?",
      "Als AI echt niks verandert, waarom hebben we het er dan over?",
      "Als authenticiteit er niet toe doet, waarom reageren mensen dan zo sterk als ze erachter komen dat iets nep was?",
    ],
  },
];

function getProfile(score: number): ProfileResult {
  return profileResults.find((p) => score >= p.range[0] && score <= p.range[1]) ?? profileResults[2];
}

type Step = "intro" | 0 | 1 | 2 | 3 | "result";

export function ToolPage() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<(number | undefined)[]>([undefined, undefined, undefined, undefined]);
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
    if (step === 3) { setResultPage(0); setStep("result"); return; }
    setStep((step + 1) as Step);
  };

  const prev = () => {
    if (step === 0) { setStep("intro"); return; }
    if (typeof step === "number") setStep((step - 1) as Step);
  };

  const total = answers.reduce<number>((sum, a, i) => {
    if (a === undefined) return sum;
    return sum + questions[i].options[a].score;
  }, 0);
  const result = getProfile(total);

  return (
    <main
      className="min-h-[100dvh] flex flex-col"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Intro ── */}
        {step === "intro" && (
          <motion.div
            key="intro"
            className="flex-1 flex flex-col items-center justify-center text-center px-7 py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="font-inter text-terracotta text-xs uppercase tracking-[0.2em] mb-6">
              Between Real and Made
            </p>
            <h1 className="font-playfair text-cream text-4xl leading-tight mb-4">
              Wat vind jij van
              <br />
              <em className="italic text-terracotta-light">AI in muziek?</em>
            </h1>
            <p className="font-inter text-cream/55 text-sm leading-relaxed max-w-xs mx-auto mb-10">
              Beantwoord vier vragen over wat je in de film zag. Je krijgt een profiel en vragen om over te praten met je groep.
            </p>
            <button
              type="button"
              onClick={start}
              className="font-inter text-sm font-medium px-10 py-4 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 active:bg-terracotta/25 transition-colors duration-200 outline-none"
            >
              Begin
            </button>
          </motion.div>
        )}

        {/* ── Questions ── */}
        {typeof step === "number" && (
          <motion.div
            key={`q-${step}`}
            className="flex-1 flex flex-col min-h-[100dvh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease }}
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
                  sizes="100vw"
                  className="object-cover"
                  priority={step === 0}
                />
              </motion.div>
              <div className="absolute inset-0" style={{ background: questions[step].overlay }} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between flex-1 p-6 pb-10">
              {/* Topbar */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-inter text-cream/45 text-xs uppercase tracking-[0.18em]">
                  AI &amp; Muziek
                </span>
                <div className="flex items-center gap-2" role="img" aria-label={`Vraag ${step + 1} van 4`}>
                  {questions.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? "w-6 bg-terracotta" : i < step ? "w-2 bg-cream/50" : "w-2 bg-cream/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div className="py-4">
                <p className="font-inter text-cream/45 text-xs uppercase tracking-[0.18em] mb-2">
                  {questions[step].scene}
                </p>
                <h2
                  className="font-playfair text-cream text-3xl leading-tight mb-3"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,.5)" }}
                >
                  {questions[step].title}
                </h2>
                <p className="font-inter text-cream/70 text-sm leading-relaxed" style={{ textShadow: "0 1px 8px rgba(0,0,0,.6)" }}>
                  {questions[step].text}
                </p>
              </div>

              {/* Options + nav */}
              <div>
                <div className="flex flex-col gap-2 mb-5">
                  {questions[step].options.map((opt, i) => {
                    const selected = answers[step] === i;
                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        onClick={() => pick(step, i)}
                        aria-pressed={selected}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left text-sm leading-snug font-inter font-light backdrop-blur-md transition-all duration-200 outline-none ${
                          selected
                            ? "border-terracotta bg-terracotta/15 text-cream"
                            : "border-cream/20 bg-black/35 text-cream/85"
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full text-xs font-medium transition-all duration-200 ${
                            selected ? "bg-terracotta text-[#1C0F0A]" : "bg-white/10 text-cream/70"
                          }`}
                        >
                          {opt.letter}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prev}
                    className="font-inter text-sm px-6 py-3 rounded-full border border-cream/25 bg-black/30 text-cream/70 backdrop-blur-sm transition-all duration-200 outline-none"
                  >
                    {step === 0 ? "Intro" : "Terug"}
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={answers[step] === undefined}
                    className="font-inter text-sm px-6 py-3 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 backdrop-blur-sm transition-all duration-200 outline-none disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {step === 3 ? "Bekijk profiel" : "Volgende"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {step === "result" && (
          <motion.div
            key="result"
            className="flex-1 flex flex-col min-h-[100dvh] p-6 pb-10"
            style={{ backgroundColor: "#0A0A0B" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
          >
            {/* Topbar */}
            <div className="flex items-center justify-between pt-2 mb-6">
              <span className="font-inter text-cream/45 text-xs uppercase tracking-[0.18em]">
                AI &amp; Muziek
              </span>
              <div className="flex items-center gap-2" role="img" aria-label={`Pagina ${resultPage + 1} van 3`}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === resultPage ? "w-6 bg-terracotta" : i < resultPage ? "w-2 bg-cream/50" : "w-2 bg-cream/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Result pages */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>

                {resultPage === 0 && (
                  <motion.div
                    key="rp0"
                    className="absolute inset-0 flex flex-col justify-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <span
                      className="inline-flex items-center self-start font-inter text-xs font-medium uppercase tracking-[0.1em] px-4 py-2 rounded-full border mb-5"
                      style={{ borderColor: result.color, color: result.color }}
                    >
                      {result.chip}
                    </span>
                    <h2 className="font-playfair text-cream text-3xl leading-tight mb-4">
                      {result.title}
                    </h2>
                    <p className="font-inter text-cream/55 text-sm leading-relaxed">
                      {result.desc}
                    </p>
                  </motion.div>
                )}

                {resultPage === 1 && (
                  <motion.div
                    key="rp1"
                    className="absolute inset-0 flex flex-col justify-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <p className="font-inter text-cream/35 text-xs uppercase tracking-[0.15em] mb-4">
                      Bespreek dit met je groep
                    </p>
                    <div className="flex flex-col gap-3">
                      {result.questions.map((q, i) => (
                        <div
                          key={i}
                          className="font-inter text-cream text-sm leading-snug p-4 rounded-xl"
                          style={{ backgroundColor: "#161618", borderLeft: `2px solid ${result.color}` }}
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <p className="font-inter text-cream/35 text-xs uppercase tracking-[0.15em] mb-4">
                      Jouw antwoorden
                    </p>
                    <div className="flex flex-col gap-3 overflow-auto">
                      {answers.map((a, i) => {
                        if (a === undefined) return null;
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <span className="min-w-[72px] text-xs uppercase tracking-wide text-cream/35 mt-0.5 flex-shrink-0">
                              {questions[i].short}
                            </span>
                            <span
                              className="font-inter text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: "rgba(200,184,154,0.12)", color: "#c8b89a" }}
                            >
                              {questions[i].options[a].letter}
                            </span>
                            <span className="font-inter text-cream/50 text-xs leading-snug">
                              {questions[i].options[a].text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-6">
                      <button
                        type="button"
                        onClick={start}
                        className="font-inter text-sm text-center px-6 py-3.5 rounded-full border border-cream/25 text-cream/60 transition-all duration-200 outline-none"
                      >
                        Opnieuw beginnen
                      </button>
                      <Link
                        href="/"
                        className="font-inter text-sm text-center px-6 py-3.5 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 transition-all duration-200 outline-none"
                      >
                        Bekijk het volledige project →
                      </Link>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between gap-3 pt-5">
              <button
                type="button"
                onClick={() => {
                  if (resultPage === 0) { setStep(3); } else { setResultPage((p) => p - 1); }
                }}
                className="font-inter text-sm px-6 py-3 rounded-full border border-cream/25 bg-black/30 text-cream/70 transition-all duration-200 outline-none"
              >
                Terug
              </button>
              {resultPage < 2 && (
                <button
                  type="button"
                  onClick={() => setResultPage((p) => p + 1)}
                  className="font-inter text-sm px-6 py-3 rounded-full border border-terracotta text-terracotta-light bg-terracotta/10 transition-all duration-200 outline-none"
                >
                  Volgende
                </button>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
