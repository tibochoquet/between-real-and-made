"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const AUDIO_SRC = "/tool/Late%20Night%20Checkout.mp3";

// Pre-shaped waveform — quiet intro → building verse → big chorus → outro
const BASE_WAVEFORM = [
  0.18, 0.24, 0.32, 0.40, 0.46, 0.42, 0.50, 0.58, 0.54, 0.62,
  0.66, 0.62, 0.70, 0.76, 0.72, 0.66, 0.73, 0.79, 0.74, 0.70,
  0.78, 0.84, 0.80, 0.76, 0.83, 0.88, 0.83, 0.79, 0.74, 0.68,
  0.66, 0.72, 0.76, 0.80, 0.84, 0.88, 0.85, 0.82, 0.78, 0.74,
  0.70, 0.66, 0.62, 0.58, 0.53, 0.58, 0.64, 0.70, 0.76, 0.81,
  0.84, 0.79, 0.73, 0.68, 0.62, 0.55, 0.47, 0.39, 0.30, 0.22,
];
const BAR_COUNT = BASE_WAVEFORM.length;

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  if (h < 1) return;
  const r = Math.min(2, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

export function AudioLandingPage() {
  const audioRef      = useRef<HTMLAudioElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const rafRef        = useRef<number>(0);
  const ctxRef        = useRef<AudioContext | null>(null);
  const analyserRef   = useRef<AnalyserNode | null>(null);
  const progressRef   = useRef(0);
  const playingRef    = useRef(false);

  const [playing,     setPlaying]     = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [loaded,      setLoaded]      = useState(false);
  const [answer,      setAnswer]      = useState<null | "ai" | "mens">(null);

  const progress = duration > 0 ? currentTime / duration : 0;

  /* ── Seek — always reads live audio element duration ── */
  const seekToRatio = (ratio: number) => {
    const a = audioRef.current;
    if (!a) return;
    const dur = a.duration;
    if (!dur || !Number.isFinite(dur)) return;
    const clamped = Math.min(Math.max(ratio, 0), 1);
    a.currentTime = clamped * dur;
    // Update refs immediately so waveform redraws before next timeupdate
    progressRef.current = clamped;
    setCurrentTime(clamped * dur);
  };

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    const dur = a.duration;
    if (!dur || !Number.isFinite(dur)) return;
    const next = Math.min(Math.max(a.currentTime + delta, 0), dur);
    a.currentTime = next;
    progressRef.current = next / dur;
    setCurrentTime(next);
  };

  /* ── Canvas draw loop (stable — reads refs only) ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d)  { rafRef.current = requestAnimationFrame(draw); return; }

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width  / dpr;
    const H = canvas.height / dpr;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    ctx2d.save();
    ctx2d.scale(dpr, dpr);

    const GAP  = 3;
    const barW = (W - GAP * (BAR_COUNT - 1)) / BAR_COUNT;
    const prog = progressRef.current;

    let freqData: Uint8Array | null = null;
    if (analyserRef.current && playingRef.current) {
      freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(freqData as Uint8Array<ArrayBuffer>);
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const ratio    = i / BAR_COUNT;
      const base     = BASE_WAVEFORM[i];
      const isPlayed = ratio < prog;
      const atHead   = Math.abs(ratio - prog) < 1.5 / BAR_COUNT;

      let h: number;
      if (freqData) {
        const bin  = Math.floor((i / BAR_COUNT) * freqData.length * 0.55);
        const live = freqData[bin] / 255;
        h = (base * 0.35 + live * 0.65) * H * 0.90;
      } else {
        h = base * H * (isPlayed ? 0.80 : 0.72);
      }
      h = Math.max(3, h);

      if (atHead) {
        ctx2d.fillStyle = "#FFFFFF";
        h = Math.min(h * 1.25, H * 0.92);
      } else if (isPlayed) {
        ctx2d.fillStyle = "#C4714A";
      } else {
        ctx2d.fillStyle = "rgba(255,248,240,0.18)";
      }

      drawBar(ctx2d, i * (barW + GAP), H - h, barW, h);
    }

    ctx2d.restore();
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  /* ── Resize canvas to display size × DPR ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  /* ── Audio element events ── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime  = () => {
      const t = a.currentTime;
      const d = a.duration || 0;
      setCurrentTime(t);
      progressRef.current = d ? t / d : 0;
    };
    const onMeta  = () => { setDuration(a.duration); setLoaded(true); };
    const onEnded = () => {
      setPlaying(false);
      playingRef.current = false;
      setCurrentTime(0);
      progressRef.current = 0;
    };
    a.addEventListener("timeupdate",     onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended",          onEnded);
    return () => {
      a.removeEventListener("timeupdate",     onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended",          onEnded);
    };
  }, []);

  /* ── Web Audio — only created on first play ── */
  const initCtx = () => {
    if (ctxRef.current) return;
    const a = audioRef.current;
    if (!a) return;
    const ac       = new AudioContext();
    const analyser = ac.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;
    const src = ac.createMediaElementSource(a);
    src.connect(analyser);
    analyser.connect(ac.destination);
    ctxRef.current      = ac;
    analyserRef.current = analyser;
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    initCtx();
    if (playing) {
      a.pause();
      setPlaying(false);
      playingRef.current = false;
    } else {
      ctxRef.current?.resume();
      a.play().then(() => { setPlaying(true); playingRef.current = true; }).catch(() => {});
    }
  };

  /* ── Pointer-based seek on canvas (works for mouse + touch) ── */
  const seekFromCanvas = (clientX: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    seekToRatio((clientX - r.left) / r.width);
  };

  /* ── Pointer-based seek on progress bar ── */
  const seekFromBar = (clientX: number) => {
    const b = progressBarRef.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    seekToRatio((clientX - r.left) / r.width);
  };

  /* ── Animations ── */
  const fadeUp = {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  };
  const stagger = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16 overflow-hidden"
      style={{ background: "linear-gradient(175deg, #100A05 0%, #1C0F0A 40%, #100A05 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 44%, rgba(196,113,74,0.14) 0%, rgba(196,113,74,0) 70%)",
        }}
      />

      {/* Drag pill */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-cream/20"
        aria-hidden="true"
      />

      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Label */}
        <motion.p className="label-text text-terracotta text-center mb-7" variants={fadeUp}>
          Between Real and Made · Luistertest
        </motion.p>

        {/* Question */}
        <motion.h1
          className="font-playfair text-cream font-bold text-center leading-tight mb-9"
          style={{ fontSize: "clamp(1.35rem, 5vw, 1.9rem)" }}
          variants={fadeUp}
        >
          Kun jij horen of dit door een mens of AI is gemaakt?
        </motion.h1>

        {/* ── Player card ── */}
        <motion.div
          className="rounded-2xl mb-8"
          style={{
            background: "rgba(255,248,240,0.04)",
            border: "1px solid rgba(255,248,240,0.07)",
          }}
          variants={fadeUp}
        >
          {/* Waveform */}
          <div className="px-5 pt-6">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: 88, display: "block", cursor: "pointer", touchAction: "none" }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromCanvas(e.clientX);
              }}
              onPointerMove={(e) => {
                if (e.buttons > 0) seekFromCanvas(e.clientX);
              }}
              aria-label="Audiovortgang – sleep om te spoelen"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") skip(5);
                if (e.key === "ArrowLeft")  skip(-5);
              }}
            />

            {/* Progress bar with thumb */}
            <div
              ref={progressBarRef}
              className="relative py-3 cursor-pointer mt-3"
              style={{ touchAction: "none" }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromBar(e.clientX);
              }}
              onPointerMove={(e) => {
                if (e.buttons > 0) seekFromBar(e.clientX);
              }}
            >
              {/* Track */}
              <div className="relative h-[3px] rounded-full bg-cream/15">
                {/* Fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-terracotta rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cream rounded-full shadow-md"
                  style={{ left: `calc(${progress * 100}% - 7px)` }}
                />
              </div>
            </div>

            {/* Times */}
            <div className="flex justify-between -mt-1 mb-2">
              <span className="label-text text-cream/30">{formatTime(currentTime)}</span>
              <span className="label-text text-cream/30">{loaded ? formatTime(duration) : ""}</span>
            </div>
          </div>

          {/* Track info */}
          <div className="px-5 py-4 border-t border-cream/[0.05]">
            <p className="font-inter text-cream font-semibold text-base leading-tight">
              Late Night Checkout
            </p>
            <p className="font-inter text-cream/40 text-xs mt-3 uppercase tracking-widest">
              Between Real and Made
            </p>
          </div>

          {/* Controls — skip back / play-pause / skip forward */}
          <div className="px-5 pb-7 flex items-center justify-between gap-3">
            {/* −15 s */}
            <button
              type="button"
              aria-label="15 seconden terug"
              onClick={() => skip(-15)}
              className="flex-1 flex justify-end focus:outline-none"
            >
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream/[0.06] hover:bg-cream/[0.12] text-cream/55 hover:text-cream transition-all duration-200">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                  <path d="M3 8a5 5 0 1 0 1.5-3.5" />
                  <polyline points="1 3 3 5.5 5.5 4" />
                </svg>
                <span className="font-inter text-sm font-medium">15 sec</span>
              </span>
            </button>

            {/* Play / pause */}
            <motion.button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pauzeer" : "Afspelen"}
              className="w-14 h-14 flex-shrink-0 rounded-full bg-cream flex items-center justify-center text-brown hover:bg-cream/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cream/50"
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>

            {/* +15 s */}
            <button
              type="button"
              aria-label="15 seconden vooruit"
              onClick={() => skip(15)}
              className="flex-1 flex justify-start focus:outline-none"
            >
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream/[0.06] hover:bg-cream/[0.12] text-cream/55 hover:text-cream transition-all duration-200">
                <span className="font-inter text-sm font-medium">15 sec</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                  <path d="M13 8a5 5 0 1 1-1.5-3.5" />
                  <polyline points="15 3 13 5.5 10.5 4" />
                </svg>
              </span>
            </button>
          </div>
        </motion.div>

        {/* Choice / result */}
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {answer === null && (
              <motion.div
                key="choice"
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-inter text-cream/50 text-sm mb-6">
                  Wat is jouw keuze?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAnswer("ai")}
                    className="flex-1 py-4 rounded-2xl border border-cream/15 text-cream/65 font-inter font-semibold text-lg hover:border-terracotta hover:text-cream hover:bg-terracotta/10 active:scale-95 transition-all duration-200 focus:outline-none"
                  >
                    AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswer("mens")}
                    className="flex-1 py-4 rounded-2xl border border-cream/15 text-cream/65 font-inter font-semibold text-lg hover:border-cream/45 hover:text-cream hover:bg-cream/5 active:scale-95 transition-all duration-200 focus:outline-none"
                  >
                    Mens
                  </button>
                </div>
              </motion.div>
            )}

            {answer === "ai" && (
              <motion.div
                key="correct"
                className="text-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C4714A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="font-playfair text-cream font-bold text-xl mb-2">Goed gedaan!</p>
                <p className="font-inter text-cream/50 text-sm leading-relaxed mb-8 px-2">
                  Dit fragment is inderdaad door AI gegenereerd. Lastig te horen, toch?
                </p>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 bg-terracotta text-cream px-8 py-4 rounded-full font-inter font-medium text-sm uppercase tracking-wider hover:bg-terracotta-dark transition-colors duration-300 focus:outline-none"
                >
                  Ontdek het volledige project
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </motion.div>
            )}

            {answer === "mens" && (
              <motion.div
                key="wrong"
                className="text-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-12 h-12 rounded-full bg-cream/8 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,248,240,0.55)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <p className="font-playfair text-cream font-bold text-xl mb-2">Bijna!</p>
                <p className="font-inter text-cream/50 text-sm leading-relaxed mb-8 px-2">
                  Dit fragment is juist door AI gemaakt. Heel goed te begrijpen dat je het niet hoorde.
                </p>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 bg-terracotta text-cream px-8 py-4 rounded-full font-inter font-medium text-sm uppercase tracking-wider hover:bg-terracotta-dark transition-colors duration-300 focus:outline-none"
                >
                  Ontdek het volledige project
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
