"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ease, fadeIn, fadeInUp, viewportConfig } from "@/lib/motion";
import { EXPLORATION_PDF_URL } from "@/lib/pdf";
import { SectionGlow } from "./SectionGlow";

const ExplorationReader = dynamic(
  () => import("./ExplorationReader").then((mod) => mod.ExplorationReader),
  { ssr: false }
);

const metadata = ["147 pagina's", "Onderzoek", "Ontwerpproces", "Reflectie", "Bijlagen"];

const BOOK_ASPECT = 1131 / 1600;
const SPRING = { type: "spring" as const, stiffness: 130, damping: 20 };

interface BookMockupProps {
  onOpen?: () => void;
}

/** The closed book card shown in the layout — click target for opening the reader. */
function BookMockup({ onOpen }: BookMockupProps) {
  return (
    <div className="relative w-full">
      <div className="relative" style={{ perspective: "1800px" }}>
        <motion.div
          className="relative cursor-pointer"
          style={{
            aspectRatio: "1131 / 1600",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateY: -26, rotateX: 3 }}
          whileHover={{ rotateY: -19, rotateX: 1.5, scale: 1.015 }}
          whileTap={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen?.();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open de exploratie als digitale publicatie"
        >
          {/* Page block — bulk behind the cover */}
          <div
            className="absolute inset-0 rounded-[3px]"
            style={{
              background:
                "linear-gradient(to right, #E4DCCB 0%, #FFFFFF 6%, #FFFFFF 94%, #E4DCCB 100%)",
              transform: "translateZ(-12px)",
            }}
            aria-hidden="true"
          />

          {/* Page edges — right side */}
          <div
            className="absolute top-[1.5%] bottom-[1.5%] right-0 w-3 rounded-r-[3px] overflow-hidden"
            style={{
              transformOrigin: "left center",
              transform: "translateX(12px) rotateY(90deg)",
              background:
                "repeating-linear-gradient(to bottom, #FCFAF5 0px, #FCFAF5 2px, #E6DECD 2px, #E6DECD 3px)",
              boxShadow: "inset -3px 0 8px rgba(28,15,10,0.18)",
            }}
            aria-hidden="true"
          />

          {/* Spine — left side */}
          <div
            className="absolute top-0 bottom-0 left-0 w-3 rounded-l-[3px]"
            style={{
              transformOrigin: "right center",
              transform: "translateX(-12px) rotateY(-90deg)",
              background: "linear-gradient(to left, #1C0F0A, #3D2317)",
            }}
            aria-hidden="true"
          />

          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-[3px] overflow-hidden"
            style={{
              boxShadow:
                "0 1px 1px rgba(28,15,10,0.15), -10px 18px 50px -16px rgba(28,15,10,0.45)",
            }}
          >
            <Image
              src="/exploratie-cover.png"
              alt="Omslag van de exploratie 'Between Real and Made'"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 78vw, 320px"
              priority
            />
            {/* Gloss highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 32%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.10) 100%)",
              }}
            />
            {/* Inner shadow where spine meets cover */}
            <div
              className="absolute inset-y-0 left-0 w-5 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.22), transparent)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Soft ground shadow */}
      <div
        className="mx-auto rounded-full mt-2"
        style={{
          width: "82%",
          height: "28px",
          background:
            "radial-gradient(ellipse, rgba(28,15,10,0.38) 0%, rgba(28,15,10,0) 72%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Geo {
  origin: Rect;
  pageWidth: number;
  pageHeight: number;
  top: number;
  centerLeft: number;
  spineLeft: number;
  isMobile: boolean;
}

interface BookOverlayProps {
  geo: Geo;
  coverOpen: boolean;
}

/**
 * Fixed-position overlay that morphs the closed book from its in-flow
 * position into a centered, gently opening publication. On desktop the
 * book settles so its spine sits on the viewport's vertical center line,
 * with the revealed left page fading in beside it. On mobile it simply
 * centers and the cover opens onto a single page.
 */
function BookOverlay({ geo, coverOpen }: BookOverlayProps) {
  const { origin, pageWidth, pageHeight, top, centerLeft, spineLeft, isMobile } = geo;

  const left = isMobile ? centerLeft : coverOpen ? spineLeft : centerLeft;
  const bookRotateY = coverOpen ? 0 : -10;
  const coverRotateY = coverOpen ? -136 : 0;

  return (
    <motion.div className="contents" exit={{ opacity: 0 }} transition={{ duration: 0.25, ease }}>
      {/* Darkened backdrop */}
      <motion.div
        className="fixed inset-0 z-[85] pointer-events-none"
        style={{ background: "#0D0705" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease }}
      />

      {/* Soft ambient shadow beneath the book */}
      <motion.div
        className="fixed z-[87] rounded-full pointer-events-none"
        style={{
          height: 30,
          background: "radial-gradient(ellipse, rgba(13,7,5,0.45) 0%, rgba(13,7,5,0) 72%)",
        }}
        initial={{
          left: origin.left + origin.width * 0.09,
          top: origin.top + origin.height - 4,
          width: origin.width * 0.82,
          opacity: 0.9,
        }}
        animate={{
          left: isMobile
            ? centerLeft + pageWidth * 0.09
            : coverOpen
              ? spineLeft - pageWidth
              : centerLeft + pageWidth * 0.09,
          top: top + pageHeight - 6,
          width: isMobile ? pageWidth * 0.82 : coverOpen ? pageWidth * 2.04 : pageWidth * 0.82,
          opacity: 0.85,
        }}
        transition={SPRING}
      />

      {/* Revealed left page (desktop spread only) */}
      {!isMobile && (
        <motion.div
          className="fixed z-[88] rounded-sm shadow-2xl bg-[#FCFAF5] pointer-events-none overflow-hidden"
          style={{ top, width: pageWidth, height: pageHeight }}
          initial={{ left: spineLeft - pageWidth, opacity: 0 }}
          animate={{ left: spineLeft - pageWidth, opacity: coverOpen ? 1 : 0 }}
          transition={{ duration: 0.5, delay: coverOpen ? 0.2 : 0, ease }}
        >
          <div
            className="absolute inset-y-0 right-0 w-2"
            style={{ background: "linear-gradient(to left, rgba(28,15,10,0.10), transparent)" }}
            aria-hidden="true"
          />
        </motion.div>
      )}

      {/* Soft shadow in the spine area (desktop spread only) */}
      {!isMobile && (
        <motion.div
          className="fixed z-[91] pointer-events-none"
          style={{
            top,
            height: pageHeight,
            left: spineLeft - 11,
            width: 22,
            background: "linear-gradient(to right, rgba(13,7,5,0) 0%, rgba(13,7,5,0.28) 50%, rgba(13,7,5,0) 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: coverOpen ? 1 : 0 }}
          transition={{ duration: 0.4, delay: coverOpen ? 0.25 : 0, ease }}
        />
      )}

      {/* The book itself */}
      <motion.div
        className="fixed z-[90] pointer-events-none"
        style={{ perspective: "2600px" }}
        initial={{ left: origin.left, top: origin.top, width: origin.width, height: origin.height }}
        animate={{ left, top, width: pageWidth, height: pageHeight }}
        transition={SPRING}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateY: -26, rotateX: 3 }}
          animate={{ rotateY: bookRotateY, rotateX: coverOpen ? 0 : 1 }}
          transition={SPRING}
        >
          {/* Page block */}
          <div
            className="absolute inset-0 rounded-[2px]"
            style={{
              background: "linear-gradient(to right, #E4DCCB 0%, #FFFFFF 8%, #FFFFFF 100%)",
              transform: "translateZ(-6px)",
            }}
            aria-hidden="true"
          />

          {/* Page edges — right side */}
          <div
            className="absolute top-[1.5%] bottom-[1.5%] right-0 w-3 rounded-r-[2px] overflow-hidden"
            style={{
              transformOrigin: "left center",
              transform: "translateX(12px) rotateY(90deg)",
              background:
                "repeating-linear-gradient(to bottom, #FCFAF5 0px, #FCFAF5 2px, #E6DECD 2px, #E6DECD 3px)",
              boxShadow: "inset -3px 0 8px rgba(28,15,10,0.18)",
            }}
            aria-hidden="true"
          />

          {/* Spine — left side */}
          <div
            className="absolute top-0 bottom-0 left-0 w-3 rounded-l-[2px]"
            style={{
              transformOrigin: "right center",
              transform: "translateX(-12px) rotateY(-90deg)",
              background: "linear-gradient(to left, #1C0F0A, #3D2317)",
            }}
            aria-hidden="true"
          />

          {/* Front cover — rotates open around the spine */}
          <motion.div
            className="absolute inset-0 rounded-[2px] overflow-hidden"
            style={{
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
              boxShadow: "0 1px 1px rgba(28,15,10,0.15), -8px 16px 44px -14px rgba(28,15,10,0.5)",
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: coverRotateY }}
            transition={{ duration: 0.6, ease }}
          >
            <Image
              src="/exploratie-cover.png"
              alt="Omslag van de exploratie 'Between Real and Made'"
              fill
              className="object-cover"
              sizes="440px"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 32%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.10) 100%)",
              }}
            />
            <div
              className="absolute inset-y-0 left-0 w-5 pointer-events-none"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.22), transparent)" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Process() {
  const bookSlotRef = useRef<HTMLDivElement>(null);
  const [centering, setCentering] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const openViaBook = () => {
    const el = bookSlotRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 1024;

    const pageWidth = isMobile
      ? Math.min(420, vw * 0.78, (vh - 160) * BOOK_ASPECT)
      : Math.min(420, vw * 0.32, (vh - 140) * BOOK_ASPECT);
    const pageHeight = pageWidth / BOOK_ASPECT;
    const top = (vh - pageHeight) / 2;
    const centerLeft = (vw - pageWidth) / 2;
    const spineLeft = vw / 2;

    setGeo({
      origin: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      pageWidth,
      pageHeight,
      top,
      centerLeft,
      spineLeft,
      isMobile,
    });
    setCentering(true);
    timeoutsRef.current.push(setTimeout(() => setCoverOpen(true), 580));
    timeoutsRef.current.push(setTimeout(() => setReaderOpen(true), 1250));
  };

  const openDirect = () => setReaderOpen(true);

  const closeReader = () => {
    setReaderOpen(false);
    setCoverOpen(false);
    setCentering(false);
  };

  return (
    <section
      id="process"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/tool/donker4.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(28,15,10,0.78) 0%, rgba(46,22,15,0.78) 50%, rgba(13,7,5,0.78) 100%)" }} />
      </div>
      <SectionGlow
        layers={[
          {
            background:
              "radial-gradient(ellipse 65% 55% at 30% 55%, rgba(196,113,74,0.14) 0%, rgba(196,113,74,0) 70%)",
            parallax: 22,
          },
          {
            background:
              "radial-gradient(ellipse 55% 45% at 88% 12%, rgba(212,145,111,0.12) 0%, rgba(212,145,111,0) 70%)",
            parallax: 26,
          },
          {
            background:
              "radial-gradient(ellipse 50% 45% at 8% 85%, rgba(156,122,106,0.10) 0%, rgba(156,122,106,0) 70%)",
            parallax: 18,
          },
          {
            background:
              "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(28,15,10,0.10) 0%, rgba(28,15,10,0) 75%)",
            parallax: 14,
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
          07 — Proces
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 md:mb-20">
          <motion.h2
            className="font-playfair text-cream text-display-md font-bold leading-tight"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            Van onderzoek naar gesprekservaring.
          </motion.h2>
          <motion.p
            className="font-inter text-cream/60 text-base md:text-lg leading-relaxed self-end"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            Van literatuuronderzoek en een enquête, via vijf
            luisteraarsprofielen en een eerste prototype, tot een
            AI-geproduceerde film en een complete gesprekservaring. Bekijk het
            volledige procesdocument als digitale publicatie.
          </motion.p>
        </div>

        {/* Editorial publication showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            className="order-2 lg:order-1"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div
              ref={bookSlotRef}
              className="mx-auto"
              style={{
                width: "min(320px, 78vw)",
                visibility: centering ? "hidden" : "visible",
              }}
            >
              <BookMockup onOpen={openViaBook} />
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h3 className="font-playfair text-cream text-display-sm font-bold leading-tight mb-5">
              Bekijk de volledige exploratie
            </h3>
            <p className="font-inter text-cream/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Een 147 pagina&apos;s tellende documentatie van het volledige
              onderzoeks-, ontwerp- en ontwikkelproces achter Between Real and
              Made.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-10">
              {metadata.map((item) => (
                <span
                  key={item}
                  className="font-inter text-xs font-medium uppercase tracking-wider text-cream/60 border border-cream/15 rounded-full px-4 py-2"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={openDirect}
                className="group inline-flex items-center gap-3 bg-terracotta text-cream px-7 py-3.5 rounded-full font-inter font-medium text-sm uppercase tracking-wider hover:bg-terracotta-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
              >
                Bekijk online
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
              <a
                href={EXPLORATION_PDF_URL}
                download
                className="inline-flex items-center gap-3 border border-cream/20 text-cream px-7 py-3.5 rounded-full font-inter font-medium text-sm uppercase tracking-wider hover:border-cream/40 hover:bg-brown/[0.03] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
              >
                Download PDF
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/*
       * No AnimatePresence/exit fade here: once the reader takes over, it
       * renders the open book at this exact same geo rect, so the overlay
       * can simply disappear in the same frame without a visible cross-fade.
       */}
      {centering && geo && !readerOpen && <BookOverlay geo={geo} coverOpen={coverOpen} />}

      <AnimatePresence>
        {readerOpen && <ExplorationReader onClose={closeReader} geo={geo} />}
      </AnimatePresence>
    </section>
  );
}
