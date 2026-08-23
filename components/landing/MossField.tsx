"use client";

import { useEffect, useRef } from "react";

export default function MossField() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ns = "http://www.w3.org/2000/svg";
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = mediaQuery.matches;

    let pixels: { el: SVGElement; growDist: number; opacity: number; shown: boolean }[] = [];
    let maxGrowDist = 0;
    let ticking = false;

    function buildField() {
      if (!svg) return;
      svg.innerHTML = "";
      pixels = [];
      maxGrowDist = 0;

      const w = window.innerWidth;
      const h = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const isMobile = w < 640;
      const cell = isMobile ? 12 : 14; // refined grid spacing
      const dotSize = isMobile ? 3 : 4.5; // smaller, crisper pixel dots on mobile
      const spread = isMobile ? 0.75 : 1; // gentle organic falloff
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
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
            const rect = document.createElementNS(ns, "rect");
            rect.setAttribute("x", String(c * cell));
            rect.setAttribute("y", String(r * cell));
            rect.setAttribute("width", String(dotSize));
            rect.setAttribute("height", String(dotSize));
            rect.setAttribute("fill", "#C8F55A");

            const finalOpacity = Math.min(0.8, prob * 0.65 + 0.08);
            const growDist = Math.sqrt(dx * dx + dy * dy);
            if (growDist > maxGrowDist) maxGrowDist = growDist;

            rect.setAttribute("opacity", reduceMotion ? finalOpacity.toFixed(2) : "0");
            rect.style.transition = "opacity 0.4s ease-out";
            svg.appendChild(rect);
            pixels.push({ el: rect, growDist, opacity: finalOpacity, shown: reduceMotion });
          }
        }
      }
      updateField();
    }

    function updateField() {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollMax)) : 1;
      const threshold = progress * maxGrowDist;
      pixels.forEach((p) => {
        const shouldShow = reduceMotion || p.growDist <= threshold;
        if (shouldShow !== p.shown) {
          p.el.setAttribute("opacity", shouldShow ? p.opacity.toFixed(2) : "0");
          p.shown = shouldShow;
        }
      });
      ticking = false;
    }

    buildField();

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateField);
        ticking = true;
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildField, 250);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      buildField();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="moss-field fixed top-0 left-0 w-screen h-screen pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
