"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple" | "lime" | "moss";
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  colorTheme = "lime",
  className = "",
  rotate = "",
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-orange-50 dark:bg-orange-500/10",
    blue: "bg-blue-50 dark:bg-blue-500/10",
    purple: "bg-purple-50 dark:bg-purple-500/10",
    lime: "bg-[#f4fadc] dark:bg-[#c8f04a]/10",
    moss: "bg-[#1b2414] dark:bg-[#1b2414]",
  };
  const defaultTextColors = {
    orange: "text-orange-500 dark:text-orange-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    lime: "text-[#556036] dark:text-[#c8f04a]",
    moss: "text-[#c8f04a] dark:text-[#c8f04a]",
  };
  const defaultBorderColors = {
    orange: "border-orange-100 dark:border-orange-500/20",
    blue: "border-blue-100 dark:border-blue-500/20",
    purple: "border-purple-100 dark:border-purple-500/20",
    lime: "border-[#d9ed92] dark:border-[#c8f04a]/20",
    moss: "border-[#2d3a20] dark:border-white/10",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative w-full md:w-[280px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
    >
      <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-[25px] shadow-[0px_10px_24px_0px_rgba(30,36,23,0.08)] dark:shadow-none border border-neutral-200/80 dark:border-neutral-800">
        <Pin className={`w-8 h-8 ${textColor} z-20 mb-4 mx-auto`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[15px] p-5 h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-4xl font-bold mb-4`}
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight mb-2 font-fraunces">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm/relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple" | "lime" | "moss";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  x: number;
  y: number;
  rotate?: string;
  className?: string;
}

export interface HowItWorksProps {
  data?: Step[];
  className?: string;
  positions?: StepPosition[];
}

const defaultSteps: Step[] = [
  {
    title: "Create Your Menu",
    description: "Type dishes, set prices, and upload photos directly from your phone in minutes.",
    colorTheme: "lime",
  },
  {
    title: "Place QR Stands",
    description: "Print or display your branded QR codes on tables, bar counters, or takeaway cards.",
    colorTheme: "moss",
  },
  {
    title: "Update Anytime",
    description: "Mark dishes sold out or tweak prices in real time without ever reprinting.",
    colorTheme: "lime",
  },
];

const defaultPositions: StepPosition[] = [
  { x: 120, y: 80, rotate: "-rotate-2", className: "md:absolute md:left-[5%] md:top-[40px]" },
  { x: 500, y: 280, rotate: "rotate-3", className: "md:absolute md:left-[38%] md:top-[220px]" },
  { x: 860, y: 480, rotate: "-rotate-2", className: "md:absolute md:right-[5%] md:top-[420px]" },
];

export function HowItWorks({
  data = defaultSteps,
  className = "",
  positions = defaultPositions,
}: HowItWorksProps) {
  let height = 720;
  if (data.length <= 1) height = 400;
  else if (data.length === 2) height = 480;
  else if (data.length === 3) height = 740;
  else if (data.length === 4) height = 920;
  else height = 1130;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`w-full max-md:py-8 md:py-12 relative overflow-hidden ${className}`}
      >
        {/* Subtle lined pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(var(--ink, #1e2417) 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 px-4">
          <div
            className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto"
            style={{ minHeight: `${height}px` }}
          >
            {/* Animated dashed curved path connector on desktop */}
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const points = data.map((_, i) => positions[i] ?? {
                    x: 200 + (i * 300),
                    y: 100 + (i * 200),
                  });

                  let pathD = "";
                  for (let i = 0; i < points.length - 1; i++) {
                    const curr = points[i];
                    const next = points[i + 1];
                    const startX = curr.x + 80;
                    const startY = curr.y + 140;
                    const endX = next.x + 80;
                    const endY = next.y + 20;
                    const midY = (startY + endY) / 2;

                    if (i === 0) {
                      pathD += `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                    } else {
                      pathD += ` C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                    }
                  }

                  return (
                    <>
                      {/* Base shadow path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="rgba(30, 36, 23, 0.15)"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                      />
                      {/* Animated crawling glowing stroke */}
                      <m.path
                        d={pathD}
                        fill="none"
                        stroke="#c8f04a"
                        strokeWidth="3.5"
                        strokeDasharray="10 14"
                        animate={{
                          strokeDashoffset: [0, -48],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </>
                  );
                })()}
              </svg>
            )}

            {/* Cards */}
            {data.map((step, index) => {
              const position = positions[index] ?? {
                className: "md:relative",
                rotate: "",
              };
              const padNum = (index + 1).toString().padStart(2, "0");

              return (
                <Card
                  key={index}
                  number={padNum}
                  title={step.title}
                  description={step.description}
                  colorTheme={step.colorTheme ?? (index % 2 === 0 ? "lime" : "moss")}
                  rotate={position.rotate}
                  className={position.className}
                  colors={step.colors}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

export default HowItWorks;
