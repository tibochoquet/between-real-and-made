"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import { PdfPage, preloadPdfPage } from "./PdfPage";
import { EXPLORATION_PDF_URL } from "@/lib/pdf";
import { ease } from "@/lib/motion";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PAGE_RATIO = 595 / 842;

/** Page-turn angle (desktop) — pages lift well off the spread, like a real page being turned. */
const FLIP_ANGLE = 62;
const flipTransition: Transition = { duration: 0.42, ease };
const fadeTransition: Transition = { duration: 0.32, ease };

interface PageState {
  rotateY?: number;
  x?: number;
  opacity: number;
  [key: `--${string}`]: string | number;
}

interface PageMotion {
  style?: CSSProperties;
  initial: PageState;
  animate: PageState;
  exit: PageState;
  transition: Transition;
}

/**
 * Per-slot animation for a desktop spread. The page on the side where new
 * content is revealed "flips" around the spine (hinge); the other side
 * gently fades, so the book always stays open and centered.
 *
 * `speedMs`, when provided, overrides the default duration — used while
 * flipping through several pages quickly during a chapter jump.
 */
function pageMotion(edge: "left" | "right", direction: number, speedMs?: number): PageMotion {
  const isFlipper = (edge === "right" && direction >= 0) || (edge === "left" && direction < 0);
  const flip: Transition = speedMs ? { duration: speedMs / 1000, ease } : flipTransition;
  const fade: Transition = speedMs ? { duration: speedMs / 1000, ease } : fadeTransition;

  if (isFlipper) {
    const sign = edge === "right" ? -1 : 1;
    return {
      style: {
        transformOrigin: edge === "right" ? "0% 50%" : "100% 50%",
        backfaceVisibility: "hidden",
      },
      initial: { rotateY: -sign * FLIP_ANGLE, opacity: 0, "--shade": 0.45 },
      animate: { rotateY: 0, opacity: 1, "--shade": 0 },
      exit: { rotateY: sign * FLIP_ANGLE, opacity: 0, "--shade": 0.45 },
      transition: flip,
    };
  }

  return {
    initial: { opacity: 0, x: direction >= 0 ? 8 : -8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction >= 0 ? -8 : 8 },
    transition: fade,
  };
}

/** Mobile single-page transition — a smooth horizontal slide, no flip. */
function mobileMotion(direction: number, speedMs?: number): PageMotion {
  const fade: Transition = speedMs ? { duration: speedMs / 1000, ease } : fadeTransition;
  return {
    initial: { opacity: 0, x: direction >= 0 ? 28 : -28 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction >= 0 ? -28 : 28 },
    transition: fade,
  };
}

/**
 * Decorative inner layer for a page slot — adds a faint paper-edge strip on
 * the book's outer edge and a soft shadow toward the spine, so pages read as
 * physical sheets rather than a flat document render.
 */
function PageFrame({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return (
    <div className="absolute inset-0">
      {children}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className={`absolute inset-y-0 ${side === "left" ? "right-0" : "left-0"} w-3`}
          style={{
            background:
              side === "left"
                ? "linear-gradient(to left, rgba(28,15,10,0.10), transparent)"
                : "linear-gradient(to right, rgba(28,15,10,0.10), transparent)",
          }}
        />
      </div>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

/** The seven main chapters, matching the book's own table of contents. */
const NAV_SECTIONS: { title: string; page: number }[] = [
  { title: "01 · Introductie", page: 4 },
  { title: "02 · Deskresearch", page: 6 },
  { title: "03 · Onderzoek", page: 9 },
  { title: "04 · Ontwerpproces", page: 15 },
  { title: "05 · Ontwerpsysteem", page: 29 },
  { title: "06 · Reflectie", page: 43 },
  { title: "07 · Conclusie", page: 49 },
];

/** Appendices A–I, matching the book's own table of contents. */
const NAV_APPENDICES: { title: string; page: number }[] = [
  { title: "A · Filmscript P1", page: 54 },
  { title: "B · Prompts P1", page: 61 },
  { title: "C · Filmscript P2", page: 79 },
  { title: "D · Prompts P2", page: 89 },
  { title: "E · Suno Prompts", page: 123 },
  { title: "F · Broncode Tool", page: 125 },
  { title: "G · Enquête 1", page: 131 },
  { title: "H · Enquête 2", page: 139 },
  { title: "I · Enquête 3", page: 142 },
];

function NavHubRow({
  title,
  page,
  pageWidth,
  onNavigate,
}: {
  title: string;
  page: number;
  pageWidth: number;
  onNavigate: (page: number) => void;
}) {
  return (
    <li className="border-b border-[#1C0F0A]/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={() => onNavigate(page)}
        className="group flex w-full items-center justify-between gap-3 text-left"
        style={{ paddingTop: pageWidth * 0.015, paddingBottom: pageWidth * 0.015 }}
      >
        <span
          className="font-playfair leading-tight text-[#1C0F0A] group-hover:text-terracotta transition-colors duration-300"
          style={{ fontSize: pageWidth * 0.038 }}
        >
          {title}
        </span>
        <span
          className="text-terracotta/40 group-hover:text-terracotta group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
          style={{ fontSize: pageWidth * 0.042 }}
          aria-hidden="true"
        >
          →
        </span>
      </button>
    </li>
  );
}

function NavHubChip({
  title,
  page,
  pageWidth,
  onNavigate,
}: {
  title: string;
  page: number;
  pageWidth: number;
  onNavigate: (page: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(page)}
      className="group rounded-full border border-[#1C0F0A]/10 hover:border-terracotta/40 hover:bg-terracotta/[0.05] transition-all duration-300 text-left"
      style={{
        paddingTop: pageWidth * 0.012,
        paddingBottom: pageWidth * 0.012,
        paddingLeft: pageWidth * 0.034,
        paddingRight: pageWidth * 0.034,
      }}
    >
      <span
        className="font-inter leading-tight text-[#1C0F0A]/70 group-hover:text-terracotta transition-colors duration-300"
        style={{ fontSize: pageWidth * 0.024 }}
      >
        {title}
      </span>
    </button>
  );
}

/**
 * The opening spread's left page: a premium navigation hub — elegant rows
 * and chips linking straight to each section, with no page numbers or
 * dotted leaders, so it reads as a hub rather than a printed contents page.
 */
function NavHub({ pageWidth, onNavigate }: { pageWidth: number; onNavigate: (page: number) => void }) {
  return (
    <div
      className="absolute inset-0 rounded-sm shadow-2xl bg-[#FCFAF5] flex flex-col"
      style={{ padding: pageWidth * 0.045 }}
    >
      <p className="label-text text-terracotta" style={{ fontSize: pageWidth * 0.018, marginBottom: pageWidth * 0.01 }}>
        Between Real and Made
      </p>
      <h2
        className="font-playfair font-bold text-[#1C0F0A] leading-[1.05]"
        style={{ fontSize: pageWidth * 0.058, marginBottom: pageWidth * 0.025 }}
      >
        Ga direct naar
      </h2>

      <ol className="list-none m-0 p-0">
        {NAV_SECTIONS.map((item) => (
          <NavHubRow key={item.title} title={item.title} page={item.page} pageWidth={pageWidth} onNavigate={onNavigate} />
        ))}
      </ol>

      <div
        className="border-t border-[#1C0F0A]/[0.06]"
        style={{ marginTop: pageWidth * 0.025, paddingTop: pageWidth * 0.02 }}
      >
        <p
          className="label-text text-[#1C0F0A]/35"
          style={{ fontSize: pageWidth * 0.016, marginBottom: pageWidth * 0.014 }}
        >
          Bijlagen
        </p>
        <div className="flex flex-wrap" style={{ gap: pageWidth * 0.014 }}>
          {NAV_APPENDICES.map((item) => (
            <NavHubChip key={item.title} title={item.title} page={item.page} pageWidth={pageWidth} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Geometry handed over from the closed-book overlay so the reader can take its place without a jump. */
interface ReaderGeo {
  pageWidth: number;
  pageHeight: number;
  top: number;
  centerLeft: number;
  spineLeft: number;
  isMobile: boolean;
}

interface ExplorationReaderProps {
  onClose: () => void;
  /** When provided, the open book is positioned to match the handoff overlay exactly — no fade, no jump. */
  geo?: ReaderGeo | null;
}

/**
 * Reading positions are 1-indexed and run 1..numPages.
 * Position 1 is the blank flyleaf behind the cover (the cover itself,
 * PDF page 1, is shown closed via the BookMockup and never appears here).
 * Position k (k >= 2) corresponds directly to PDF page k.
 * On desktop, positions are paired into spreads: (1,2), (3,4), (5,6), ...
 */
export function ExplorationReader({ onClose, geo }: ExplorationReaderProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [position, setPosition] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() => (geo ? !geo.isMobile : true));
  const [pageWidth, setPageWidth] = useState(() => (geo ? Math.round(geo.pageWidth) : 420));
  const [flutterSpeed, setFlutterSpeed] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flutterTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Load the document
  useEffect(() => {
    let cancelled = false;
    getDocument({ url: EXPLORATION_PDF_URL }).promise.then((doc) => {
      if (cancelled) return;
      setPdf(doc);
      setNumPages(doc.numPages);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Lock background scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Desktop vs mobile layout
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Snap to a valid spread start when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setPosition((p) => Math.floor((p - 1) / 2) * 2 + 1);
    }
  }, [isDesktop]);

  // Measure available space for pages
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const availW = isDesktop ? (rect.width - 24) / 2 : rect.width;
      const availH = rect.height;
      const widthFromHeight = availH * PAGE_RATIO;
      const w = Math.min(availW, widthFromHeight, 480);
      setPageWidth(Math.max(160, Math.floor(w)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  const totalSpreads = numPages > 0 ? Math.ceil(numPages / 2) : 1;
  const lastSpreadStart = (totalSpreads - 1) * 2 + 1;

  const isAtStart = position <= 1;
  const isAtEnd = isDesktop ? position >= lastSpreadStart : position >= (numPages || 1);

  const goNext = useCallback(() => {
    setDirection(1);
    setPosition((p) => {
      if (!isDesktop) return Math.min(p + 1, numPages || p);
      const spreadIndex = Math.floor((p - 1) / 2);
      const nextSpreadIndex = Math.min(spreadIndex + 1, totalSpreads - 1);
      return nextSpreadIndex * 2 + 1;
    });
  }, [isDesktop, numPages, totalSpreads]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setPosition((p) => {
      if (!isDesktop) return Math.max(p - 1, 1);
      const spreadIndex = Math.floor((p - 1) / 2);
      const prevSpreadIndex = Math.max(spreadIndex - 1, 0);
      return prevSpreadIndex * 2 + 1;
    });
  }, [isDesktop]);

  const clearFlutter = useCallback(() => {
    flutterTimeoutsRef.current.forEach(clearTimeout);
    flutterTimeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearFlutter(), [clearFlutter]);

  /**
   * Jump to a target page. Short hops land directly; longer jumps "flutter"
   * through a handful of intermediate spreads first — like quickly fanning
   * through a physical book — with more, faster flips for bigger jumps.
   */
  const jumpToPosition = useCallback(
    (target: number) => {
      if (!Number.isFinite(target)) return;
      let p = Math.min(Math.max(Math.round(target), 1), numPages || 1);
      const step = isDesktop ? 2 : 1;
      if (isDesktop) {
        p = Math.floor((p - 1) / 2) * 2 + 1;
      }

      clearFlutter();
      setFlutterSpeed(null);

      const dir = p > position ? 1 : p < position ? -1 : 0;
      const spreadDistance = Math.abs(p - position) / step;

      if (dir === 0 || spreadDistance <= 1) {
        setDirection(dir || 1);
        setPosition(p);
        return;
      }

      // More flips and a faster pace for longer jumps.
      const flips = Math.min(Math.max(Math.round(spreadDistance / 5), 2), 8);
      const interval = Math.max(150 - spreadDistance * 3, 55);
      const speed = Math.min(interval * 0.85, 380);

      let elapsed = 0;
      for (let i = 1; i <= flips; i++) {
        const isLast = i === flips;
        let pos = isLast ? p : Math.round(position + dir * spreadDistance * step * (i / flips));
        if (isDesktop) pos = Math.floor((pos - 1) / 2) * 2 + 1;
        pos = Math.min(Math.max(pos, 1), numPages || 1);

        elapsed += interval;
        flutterTimeoutsRef.current.push(
          setTimeout(() => {
            setFlutterSpeed(speed);
            setDirection(dir);
            setPosition(pos);
          }, elapsed)
        );
      }

      flutterTimeoutsRef.current.push(setTimeout(() => setFlutterSpeed(null), elapsed + speed));
    },
    [isDesktop, numPages, position, clearFlutter]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  // Pre-render neighbouring pages so flipping to them shows up instantly, with no fade.
  useEffect(() => {
    if (!pdf) return;
    const neighbours = isDesktop
      ? [position - 1, position, position + 1, position + 2, position + 3]
      : [position, position + 1]; // mobile: only next page to save memory
    neighbours.forEach((n) => {
      if (n >= 2 && n <= numPages) preloadPdfPage(pdf, n, pageWidth);
    });
  }, [pdf, position, numPages, pageWidth, isDesktop]);

  // Touch swipe navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) {
        if (dx < 0) goNext();
        else goPrev();
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev]);

  // Desktop spread positions; mobile uses `position` directly for the single page.
  const spreadIndex = Math.floor((position - 1) / 2);
  const leftPos = isDesktop ? spreadIndex * 2 + 1 : position;
  const rightPos = isDesktop ? spreadIndex * 2 + 2 : null;

  const leftContent = leftPos === 1 ? null : leftPos;
  const rightContent = rightPos === null ? null : rightPos <= numPages ? rightPos : null;

  const indicator =
    numPages === 0
      ? ""
      : isDesktop
        ? leftContent && rightContent
          ? `${leftContent}–${rightContent} / ${numPages}`
          : `${leftContent ?? rightContent} / ${numPages}`
        : `${leftContent ?? "–"} / ${numPages}`;

  const progress = numPages > 0 ? (position / numPages) * 100 : 0;

  const isFlyleafActive = isDesktop ? leftPos === 1 : position === 1;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      initial={geo ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[#0D0705]" aria-hidden="true" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-5 md:px-8 py-4 md:py-5 flex-shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <AnimatePresence initial={false}>
            {!isFlyleafActive && (
              <motion.button
                type="button"
                onClick={() => jumpToPosition(1)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25, ease }}
                className="flex items-center gap-2 font-inter text-xs uppercase tracking-wider text-cream/80 hover:text-terracotta border border-cream/20 hover:border-terracotta/50 bg-cream/5 hover:bg-terracotta/10 rounded-full px-3.5 py-1.5 transition-all duration-300 flex-shrink-0"
              >
                <span aria-hidden="true">←</span>
                Terug naar overzicht
              </motion.button>
            )}
          </AnimatePresence>
          <span className="label-text text-cream/35 hidden sm:inline truncate">
            Between Real and Made — Exploratie
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
          <span className="font-inter text-xs text-cream/45 tabular-nums hidden sm:inline">
            {indicator}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="text-cream/60 hover:text-cream transition-colors duration-300 p-1"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Reading area */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-1 items-center justify-center min-h-0 px-3 md:px-10"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={isAtStart}
          aria-label="Vorige pagina"
          className="absolute left-1 md:left-4 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-cream/15 text-cream/70 flex items-center justify-center hover:border-cream/35 hover:text-cream transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronIcon direction="left" />
        </button>

        {pdf ? (
          <div className="relative flex items-center justify-center gap-2 md:gap-3">
            {/* Spine shadow — stays put, the book never closes between pages */}
            {isDesktop && (
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, rgba(13,7,5,0) 0%, rgba(13,7,5,0.18) 50%, rgba(13,7,5,0) 100%)",
                }}
                aria-hidden="true"
              />
            )}

            {/* Left page */}
            <div
              className="relative"
              style={{ width: pageWidth, aspectRatio: `${PAGE_RATIO}`, perspective: "1800px" }}
            >
              <AnimatePresence initial={false}>
                {(() => {
                  const m = isDesktop
                    ? pageMotion("left", direction, flutterSpeed ?? undefined)
                    : mobileMotion(direction, flutterSpeed ?? undefined);
                  return leftContent === null ? (
                    <motion.div
                      key="nav-hub-left"
                      className="absolute inset-0"
                      style={m.style}
                      initial={m.initial}
                      animate={m.animate}
                      exit={m.exit}
                      transition={m.transition}
                    >
                      {isDesktop ? (
                        <PageFrame side="left">
                          <NavHub pageWidth={pageWidth} onNavigate={jumpToPosition} />
                        </PageFrame>
                      ) : (
                        <NavHub pageWidth={pageWidth} onNavigate={jumpToPosition} />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`left-${leftContent}`}
                      className="absolute inset-0"
                      style={m.style}
                      initial={m.initial}
                      animate={m.animate}
                      exit={m.exit}
                      transition={m.transition}
                    >
                      {isDesktop ? (
                        <PageFrame side="left">
                          <PdfPage pdf={pdf} pageNumber={leftContent} width={pageWidth} className="rounded-sm shadow-2xl" />
                        </PageFrame>
                      ) : (
                        <PdfPage pdf={pdf} pageNumber={leftContent} width={pageWidth} className="rounded-sm shadow-2xl" />
                      )}
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Right page — desktop spread only */}
            {isDesktop && (
              <div
                className="relative"
                style={{ width: pageWidth, aspectRatio: `${PAGE_RATIO}`, perspective: "1800px" }}
              >
                <AnimatePresence initial={false}>
                  {(() => {
                    const m = pageMotion("right", direction, flutterSpeed ?? undefined);
                    return rightContent === null ? (
                      <motion.div
                        key="blank-right"
                        className="absolute inset-0"
                        style={m.style}
                        initial={m.initial}
                        animate={m.animate}
                        exit={m.exit}
                        transition={m.transition}
                        aria-hidden="true"
                      >
                        <PageFrame side="right">
                          <div className="absolute inset-0 rounded-sm shadow-2xl bg-[#FCFAF5]" />
                        </PageFrame>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`right-${rightContent}`}
                        className="absolute inset-0"
                        style={m.style}
                        initial={m.initial}
                        animate={m.animate}
                        exit={m.exit}
                        transition={m.transition}
                      >
                        <PageFrame side="right">
                          <PdfPage pdf={pdf} pageNumber={rightContent} width={pageWidth} className="rounded-sm shadow-2xl" />
                        </PageFrame>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <span className="label-text text-cream/30">Laden…</span>
        )}

        <button
          type="button"
          onClick={goNext}
          disabled={isAtEnd}
          aria-label="Volgende pagina"
          className="absolute right-1 md:right-4 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-cream/15 text-cream/70 flex items-center justify-center hover:border-cream/35 hover:text-cream transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-[2px] bg-cream/10 mx-5 md:mx-8 mb-5 md:mb-6 rounded-full overflow-hidden flex-shrink-0">
        <motion.div
          className="h-full bg-terracotta"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}
