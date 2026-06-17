"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ease,
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerFast,
  viewportConfig,
} from "@/lib/motion";
import { SectionGlow } from "./SectionGlow";

interface Profile {
  id: string;
  title: string;
  tagline: string;
  quote: string;
  description: string;
  traits: string[];
  color: string;
  colorBg: string;
  percentage: string;
  front: string;
  back: string;
}

const profiles: Profile[] = [
  {
    id: "sceptic",
    title: "De Scepticus",
    tagline: "Het gevoel verdween op het moment dat ik de waarheid kende.",
    quote:
      "Het voelde echt voor me, totdat je het me vertelde. Dat is wat me schrok: ik vond het niet prettig dat mijn gevoelens gefabriceerd konden worden.",
    description:
      "De Scepticus is het meest verontrust door de mogelijkheid van emotionele manipulatie. Ze zijn niet principieel tegen AI, maar maken zich grote zorgen over het idee dat hun eigen emotionele reacties ontworpen kunnen worden zonder toestemming of bewustzijn. Transparantie staat bij hen hoog in het vaandel.",
    traits: [
      "Bewust van toestemming",
      "Emotioneel zelfbewust",
      "Privacygericht",
      "Kritisch op manipulatie",
    ],
    color: "#8C4A4A",
    colorBg: "rgba(140, 74, 74, 0.08)",
    percentage: "22%",
    front: "/cards/sceptic-front.png",
    back: "/cards/sceptic-back.png",
  },
  {
    id: "doubter",
    title: "De Twijfelaar",
    tagline: "Ik waardeer het, maar er ontbreekt iets.",
    quote:
      "Het was prachtig. Maar toen je vertelde dat het AI was, voelde ik me bedrogen. Ik weet niet precies waarom.",
    description:
      "De Twijfelaar zit gevangen tussen emotionele betrokkenheid en intellectueel ongemak. Ze reageren oprecht op door AI gegenereerde muziek, maar worstelen met de wetenschap van de herkomst ervan. Menselijke intentie en inzet zijn voor hen essentiële onderdelen van muzikale betekenis.",
    traits: [
      "Emotioneel betrokken",
      "Filosofisch verdeeld",
      "Waardeert vakmanschap",
      "Open voor dialoog",
    ],
    color: "#5A8A86",
    colorBg: "rgba(90, 138, 134, 0.08)",
    percentage: "10%",
    front: "/cards/doubter-front.jpeg",
    back: "/cards/doubter-back.png",
  },
  {
    id: "pragmatist",
    title: "De Pragmaticus",
    tagline: "Een gereedschap is een gereedschap. Het gaat om wat je ermee maakt.",
    quote:
      "Ik gebruik AI in mijn eigen werk. Het is gewoon weer een instrument. De vraag is wat je ermee doet.",
    description:
      "De Pragmaticus kijkt afgewogen en functioneel naar de wereld. Ze accepteren AI als onderdeel van de creatieve gereedschapskist, zonder het te verheerlijken of te betreuren. Ze zijn geïnteresseerd in de output en de bruikbaarheid ervan, niet in het filosofische debat over authenticiteit.",
    traits: [
      "Rationele aanpak",
      "Resultaatgericht",
      "Aanpasbaar",
      "Professioneel afstandelijk",
    ],
    color: "#B87A2E",
    colorBg: "rgba(184, 122, 46, 0.08)",
    percentage: "31%",
    front: "/cards/pragmatist-front.png",
    back: "/cards/pragmatist-back.png",
  },
  {
    id: "optimist",
    title: "De Optimist",
    tagline: "Muziek is muziek. Als het me raakt, raakt het me.",
    quote:
      "Het maakt me niet uit of een machine het gemaakt heeft. Het gevoel was echt, dat is het enige wat voor mij telt.",
    description:
      "De Optimist omarmt door AI gegenereerde muziek zonder voorbehoud. Voor hen is de emotionele reactie de doorslaggevende maatstaf voor waarde. Ze vieren de democratisering van muziekcreatie en zien AI als een uitbreiding van mogelijke menselijke ervaringen, niet als een verarming ervan.",
    traits: [
      "Emotioneel gedreven",
      "Technologie-positief",
      "Toekomstgericht",
      "Niet dogmatisch over herkomst",
    ],
    color: "#C4714A",
    colorBg: "rgba(196, 113, 74, 0.08)",
    percentage: "18%",
    front: "/cards/optimist-front.jpeg",
    back: "/cards/optimist-back.png",
  },
  {
    id: "cynic",
    title: "De Cynicus",
    tagline: "Het is technisch indrukwekkend. En cultureel hol.",
    quote:
      "Indrukwekkend? Ja. Muziek? Nee. Je hebt het deel weggehaald dat het betekenis geeft.",
    description:
      "De Cynicus verwerpt door AI gegenereerde muziek op culturele en filosofische gronden. Voor hen zijn menselijke worsteling, intentie en kwetsbaarheid de onmisbare kern van artistieke betekenis. Ze zien AI als in staat tot nabootsing, maar niet tot expressie: patroon, maar geen waarheid.",
    traits: [
      "Cultureel conservatief",
      "Hecht waarde aan intentie",
      "Filosofisch standvastig",
      "Weerstand tegen verandering",
    ],
    color: "#7A4A2A",
    colorBg: "rgba(122, 74, 42, 0.08)",
    percentage: "19%",
    front: "/cards/cynic-front.jpeg",
    back: "/cards/cynic-back.png",
  },
];

const cardSizes =
  "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw";

function ProfileCard({
  profile,
  onOpen,
}: {
  profile: Profile;
  onOpen: (profile: Profile, trigger: HTMLElement) => void;
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="relative w-full aspect-[18/10]"
        style={{ perspective: "1800px" }}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <motion.button
          type="button"
          onClick={(e) => onOpen(profile, e.currentTarget)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          className={`absolute inset-0 w-full h-full rounded-[20px] transition-shadow duration-500 outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-cream cursor-pointer ${
            isActive ? "shadow-card-hover" : "shadow-card"
          }`}
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateY: 0, scale: 1 }}
          animate={{ rotateY: isActive ? 180 : 0, scale: isActive ? 1.05 : 1 }}
          transition={{ duration: 0.9, ease }}
          aria-label={`Open de kaart van ${profile.title} uitvergroot`}
        >
          {/* Back face — visible by default */}
          <span className="absolute inset-0 block rounded-[20px] overflow-hidden [backface-visibility:hidden]">
            <Image
              src={profile.back}
              alt=""
              fill
              sizes={cardSizes}
              className="object-cover"
            />
          </span>
          {/* Front face — revealed on hover/focus */}
          <span className="absolute inset-0 block rounded-[20px] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={profile.front}
              alt={`Voorkant van de profielkaart: ${profile.title}`}
              fill
              sizes={cardSizes}
              className="object-cover"
            />
          </span>
        </motion.button>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-playfair text-cream text-lg md:text-xl font-semibold">
            {profile.title}
          </h3>
          <p className="font-inter text-cream/55 text-sm italic mt-1 leading-snug">
            {profile.tagline}
          </p>
        </div>
        <span
          className="font-inter text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            backgroundColor: profile.colorBg,
            color: profile.color,
          }}
        >
          {profile.percentage}
        </span>
      </div>
    </motion.div>
  );
}

function ProfileModal({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-brown/80 backdrop-blur-md"
        aria-hidden="true"
      />

      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="fixed top-5 right-5 md:top-8 md:right-8 z-[110] flex items-center justify-center w-11 h-11 rounded-full bg-cream/10 border border-cream/20 text-cream hover:bg-cream/20 hover:border-cream/40 hover:scale-105 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-terracotta backdrop-blur-sm"
        aria-label="Sluiten"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <motion.div
        className="relative w-full max-w-3xl max-h-full overflow-y-auto"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.45, ease }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`profile-modal-title-${profile.id}`}
      >
        <div className="relative w-full aspect-[18/10] rounded-[20px] overflow-hidden shadow-card-hover">
          <Image
            src={profile.front}
            alt={`Voorkant van de profielkaart: ${profile.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-5 md:mt-6 rounded-2xl bg-cream p-6 md:p-8 shadow-card">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3
              id={`profile-modal-title-${profile.id}`}
              className="font-playfair text-brown text-2xl md:text-3xl font-bold"
            >
              {profile.title}
            </h3>
            <span
              className="font-inter text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 mt-1"
              style={{
                backgroundColor: profile.colorBg,
                color: profile.color,
              }}
            >
              {profile.percentage} van de deelnemers
            </span>
          </div>

          <blockquote
            className="font-playfair italic text-base md:text-lg leading-snug mb-4"
            style={{ color: profile.color }}
          >
            &ldquo;{profile.quote}&rdquo;
          </blockquote>

          <p className="font-inter text-brown/65 text-sm md:text-base leading-relaxed mb-5">
            {profile.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <span
                key={trait}
                className="font-inter text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  backgroundColor: profile.colorBg,
                  color: profile.color,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TheProfiles() {
  const [openProfile, setOpenProfile] = useState<Profile | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleOpen = (profile: Profile, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenProfile(profile);
  };

  const handleClose = () => {
    setOpenProfile(null);
    triggerRef.current?.focus();
  };

  return (
    <section
      id="profiles"
      className="section-padding relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #2E160F 0%, #1C0F0A 55%, #0D0705 100%)" }}
    >
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(212,168,138,0.20) 0%, rgba(212,168,138,0) 70%)",
            parallax: 22,
          },
          {
            background:
              "radial-gradient(ellipse 50% 45% at 90% 10%, rgba(196,113,74,0.14) 0%, rgba(196,113,74,0) 70%)",
            parallax: 28,
          },
          {
            background:
              "radial-gradient(ellipse 48% 42% at 6% 20%, rgba(91,184,180,0.12) 0%, rgba(91,184,180,0) 70%)",
            parallax: 32,
          },
          {
            background:
              "radial-gradient(ellipse 45% 40% at 88% 80%, rgba(212,160,48,0.10) 0%, rgba(212,160,48,0) 70%)",
            parallax: 26,
          },
          {
            background:
              "radial-gradient(ellipse 55% 50% at 5% 90%, rgba(156,122,106,0.12) 0%, rgba(156,122,106,0) 70%)",
            parallax: 24,
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
          05 — De Profielen
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 md:mb-20">
          <motion.h2
            className="font-playfair text-cream text-display-md font-bold leading-tight"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            Vijf gezichten van de AI-muziekluisteraar.
          </motion.h2>
          <motion.p
            className="font-inter text-cream/60 text-base md:text-lg leading-relaxed self-end"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            Uit onderzoek kwamen vijf verschillende luisteraarsprofielen naar
            voren, elk met een eigen verhouding tot authenticiteit,
            technologie en muzikale betekenis. Beweeg over een kaart om de
            voorkant te onthullen, en klik om hem volledig te bekijken.
          </motion.p>
        </div>

        {/* Profile cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {profiles.map((profile, i) => (
            <div
              key={profile.id}
              className={`sm:col-span-3 xl:col-span-2 ${
                i === 3
                  ? "xl:col-start-2"
                  : i === 4
                  ? "sm:col-span-6 sm:max-w-[calc(50%-12px)] sm:mx-auto md:max-w-[calc(50%-16px)] xl:col-span-2 xl:max-w-none xl:mx-0"
                  : ""
              }`}
            >
              <ProfileCard profile={profile} onOpen={handleOpen} />
            </div>
          ))}
        </motion.div>

        {/* Distribution note */}
        <motion.p
          className="mt-12 md:mt-16 font-inter text-cream/40 text-sm text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          Gebaseerd op de enquête, gesprekken en reacties uit het onderzoek.
          Percentages zijn bij benadering.
        </motion.p>
      </div>

      {/* Fullscreen card lightbox */}
      <AnimatePresence>
        {openProfile && (
          <ProfileModal profile={openProfile} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
