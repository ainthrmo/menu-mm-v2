"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface MenuItemRow {
  en: string;
  my: string;
  price: string;
}

const MENU_ITEMS: MenuItemRow[] = [
  {
    en: "Fried Noodles (Chicken)",
    my: "ခေါက်ဆွဲကြော်",
    price: "4,500K",
  },
  {
    en: "Traditional Mohinga",
    my: "မုန့်ဟင်းခါး",
    price: "3,000K",
  },
  {
    en: "Burmese Chicken Curry",
    my: "ကြက်သားဟင်း",
    price: "5,000K",
  },
];

export default function Hero() {
  const { language } = useLanguage();
  const trailSvgRef = useRef<SVGSVGElement | null>(null);
  const trailWrapRef = useRef<HTMLDivElement | null>(null);
  const [shownRows, setShownRows] = useState<boolean[]>([false, false, false]);

  // Precomputed deterministic QR pattern matching the reference
  const qrPattern = useMemo(() => {
    const grid = 21;
    const cell = 100 / grid;
    const rects: { x: number; y: number; w: number; h: number; fill: string; key: string }[] = [];

    const addFinder = (cx: number, cy: number, keyPrefix: string) => {
      rects.push({ x: cx * cell, y: cy * cell, w: 7 * cell, h: 7 * cell, fill: "#0F1410", key: `${keyPrefix}-out` });
      rects.push({ x: (cx + 1) * cell, y: (cy + 1) * cell, w: 5 * cell, h: 5 * cell, fill: "#F4F6F1", key: `${keyPrefix}-mid` });
      rects.push({ x: (cx + 2) * cell, y: (cy + 2) * cell, w: 3 * cell, h: 3 * cell, fill: "#0F1410", key: `${keyPrefix}-in` });
    };

    addFinder(0, 0, "tl");
    addFinder(grid - 7, 0, "tr");
    addFinder(0, grid - 7, "bl");

    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const inFinder = (r < 8 && c < 8) || (r < 8 && c > grid - 9) || (r > grid - 9 && c < 8);
        if (!inFinder && rand() > 0.58) {
          rects.push({ x: c * cell, y: r * cell, w: cell, h: cell, fill: "#0F1410", key: `mod-${r}-${c}` });
        }
      }
    }

    return rects;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = mediaQuery.matches;

    if (reduceMotion) {
      setShownRows([true, true, true]);
      return;
    }

    const trailSvg = trailSvgRef.current;
    const trailWrap = trailWrapRef.current;
    if (!trailSvg || !trailWrap) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      const isVertical = window.innerWidth <= 640;
      const w = trailWrap.clientWidth || (isVertical ? 6 : 100);
      const h = trailWrap.clientHeight || (isVertical ? 60 : 6);

      trailSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      trailSvg.innerHTML = "";

      const ns = "http://www.w3.org/2000/svg";
      const steps = 7;
      const dots: SVGCircleElement[] = [];

      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const dot = document.createElementNS(ns, "circle");
        const cx = isVertical ? w / 2 : t * w;
        const cy = isVertical ? t * h : h / 2;
        dot.setAttribute("cx", String(cx));
        dot.setAttribute("cy", String(cy));
        dot.setAttribute("r", "3");
        dot.setAttribute("fill", "#C8F55A");
        dot.setAttribute("opacity", "0");
        dot.style.transition = "opacity 0.3s ease-out";
        trailSvg.appendChild(dot);
        dots.push(dot);
      }

      dots.forEach((d, i) => {
        const timer = setTimeout(() => {
          d.setAttribute("opacity", "0.9");
        }, 200 + i * 90);
        timers.push(timer);
      });

      MENU_ITEMS.forEach((_, i) => {
        const timer = setTimeout(() => {
          setShownRows((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 200 + steps * 90 + i * 140);
        timers.push(timer);
      });
    };

    run();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isVertical = window.innerWidth <= 640;
        const w = trailWrap.clientWidth || (isVertical ? 6 : 100);
        const h = trailWrap.clientHeight || (isVertical ? 60 : 6);
        trailSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-scene">
        {/* QR Block */}
        <div className="qr-block">
          <svg className="qr-code" viewBox="0 0 100 100" aria-label="QR code graphic">
            {qrPattern.map((r) => (
              <rect
                key={r.key}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={r.fill}
              />
            ))}
          </svg>
          <div className="qr-caption">
            {language === "my" ? "စကင်ဖတ်ပါ — ချက်ချင်း နားလည်နိုင်သည်" : "scan — understood, instantly"}
          </div>
        </div>

        {/* Animated Trail */}
        <div className="trail-wrap" ref={trailWrapRef}>
          <svg
            className="trail"
            ref={trailSvgRef}
            preserveAspectRatio="none"
            aria-hidden="true"
          />
        </div>

        {/* Content Panel */}
        <div className="content-panel" id="contentPanel">
          {MENU_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`panel-row ${shownRows[idx] ? "shown" : ""}`}
              data-index={idx}
            >
              <div className="item-name">
                {item.en}
                <span className="mm">{item.my}</span>
              </div>
              <div className="item-price">{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Value line */}
      <div className="value-line">
        {language === "my" ? (
          <>စကင်တစ်ခုတည်းဖြင့် <b>—</b> ဘာသာစကားအားလုံး</>
        ) : (
          <>one scan <b>—</b> every language</>
        )}
      </div>
    </section>
  );
}
