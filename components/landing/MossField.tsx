"use client";

import { useEffect, useRef } from "react";

interface MossPixel {
  x: number;
  y: number;
  size: number;
  growDist: number;
  maxOpacity: number;
}

export default function MossField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = mediaQuery.matches;

    let pixels: MossPixel[] = [];
    let maxGrowDist = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId: number;

    function buildField() {
      if (!canvas || !ctx) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pixels = [];
      maxGrowDist = 0;

      const isMobile = width < 640;
      const cell = isMobile ? 12 : 14;
      const dotSize = 3; // identical crisp dot size on desktop and mobile
      const spread = isMobile ? 0.75 : 1;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const originCol = cols - Math.round(4 * spread);
      const originRow = 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = c - originCol;
          const dy = r - originRow;
          const dist = Math.sqrt(dx * dx * 0.6 + dy * dy * 0.6);
          const reach = (isMobile ? 28 : 48) * spread;
          const prob = Math.max(0, 1 - dist / reach) * (0.55 + 0.45 * Math.random());

          if (Math.random() < prob * 0.85) {
            const growDist = Math.sqrt(dx * dx + dy * dy);
            if (growDist > maxGrowDist) maxGrowDist = growDist;
            const finalOpacity = Math.min(0.8, prob * 0.65 + 0.08);

            pixels.push({
              x: c * cell,
              y: r * cell,
              size: dotSize,
              growDist,
              maxOpacity: finalOpacity,
            });
          }
        }
      }

      draw();
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollMax)) : 1;
      const threshold = progress * maxGrowDist;

      ctx.fillStyle = "#3D7000";

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        if (reduceMotion || p.growDist <= threshold) {
          const alpha = reduceMotion
            ? p.maxOpacity
            : Math.min(p.maxOpacity, Math.max(0, p.maxOpacity * ((threshold - p.growDist) / 4 + 0.4)));
          ctx.globalAlpha = alpha;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
    }

    buildField();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        animationFrameId = requestAnimationFrame(() => {
          draw();
          ticking = false;
        });
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildField, 250);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      draw();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="moss-field fixed top-0 left-0 w-screen h-screen pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
