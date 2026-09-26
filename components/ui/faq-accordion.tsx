"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--moss-mid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--stone)] rounded-sm transition-colors",
          open && "text-[var(--moss-deep)]"
        )}
      >
        <span className="font-fraunces text-[17px] sm:text-[19px] font-medium text-[var(--ink)] leading-snug pr-2">
          {item.q}
        </span>

        {/* Animated +/× indicator */}
        <span
          className={cn(
            "shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300",
            open
              ? "bg-[var(--lime)] border-[var(--lime)] rotate-45"
              : "bg-transparent border-[var(--border)] rotate-0 group-hover:border-[var(--moss-mid)]"
          )}
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1V11M1 6H11"
              stroke={open ? "#1e2417" : "#556036"}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Smooth height transition via CSS grid trick */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm sm:text-base text-[var(--sub)] leading-relaxed max-w-[640px]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items, title, className }: FaqAccordionProps) {
  return (
    <div className={cn("max-w-[760px]", className)}>
      {title && (
        <h2 className="text-[26px] sm:text-[30px] md:text-[34px] mb-8 font-fraunces font-semibold text-[var(--ink)]">
          {title}
        </h2>
      )}
      <div className="border-t border-[var(--border)]">
        {items.map((item, idx) => (
          <FaqRow key={idx} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}

export default FaqAccordion;
