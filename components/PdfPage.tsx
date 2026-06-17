"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  width: number;
  className?: string;
}

/** Rendered-page cache shared across all <PdfPage> instances, so a page that
 * was already rendered (or pre-rendered) appears instantly, with no fade. */
const renderCache = new Map<string, ImageBitmap>();
const pendingRenders = new Map<string, Promise<ImageBitmap>>();

function cacheKey(pageNumber: number, width: number): string {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return `${pageNumber}:${Math.round(width * dpr)}`;
}

function renderPageBitmap(pdf: PDFDocumentProxy, pageNumber: number, width: number): Promise<ImageBitmap> {
  const key = cacheKey(pageNumber, width);
  const cached = renderCache.get(key);
  if (cached) return Promise.resolve(cached);

  const pending = pendingRenders.get(key);
  if (pending) return pending;

  const task = (async () => {
    const page = await pdf.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    // Render at 2× above screen DPR so the bitmap stays sharp at moderate browser zoom.
    const scale = (width * dpr * 2) / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const bitmap = await createImageBitmap(canvas);
    renderCache.set(key, bitmap);
    return bitmap;
  })();

  pendingRenders.set(key, task);
  task.finally(() => pendingRenders.delete(key));
  return task;
}

/** Render a page into the cache ahead of time, so it's instant once shown. */
export function preloadPdfPage(pdf: PDFDocumentProxy, pageNumber: number, width: number) {
  renderPageBitmap(pdf, pageNumber, width).catch(() => {});
}

export function PdfPage({ pdf, pageNumber, width, className }: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(() => renderCache.has(cacheKey(pageNumber, width)));

  useEffect(() => {
    let cancelled = false;

    const draw = (bitmap: ImageBitmap) => {
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${(width * bitmap.height) / bitmap.width}px`;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0);
      setReady(true);
    };

    const cached = renderCache.get(cacheKey(pageNumber, width));
    if (cached) {
      draw(cached);
    } else {
      setReady(false);
      renderPageBitmap(pdf, pageNumber, width).then((bitmap) => {
        if (!cancelled) draw(bitmap);
      }).catch(() => {
        // render cancelled or failed — ignore
      });
    }

    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, width]);

  return (
    <canvas
      ref={canvasRef}
      className={`bg-white transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    />
  );
}
