import React from "react";
import { EvidenceLevel } from "@/lib/types";

interface StatusRingProps {
  level: EvidenceLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function StatusRing({
  level,
  size = "md",
  showLabel = false,
  className = "",
}: StatusRingProps) {
  const sizePx = size === "sm" ? 16 : size === "md" ? 22 : 32;
  const strokeWidth = size === "sm" ? 2 : 2.5;

  let color = "#8C9187"; // L1 graphite
  let label = "L1 Document-screened";
  let subtext = "Unconfirmed by issuing bank";

  if (level === "L2") {
    color = "#B5832A"; // L2 brass
    label = "L2 Digitally evidenced";
    subtext = "Digital stamp / eSign validated";
  } else if (level === "L3") {
    color = "#1E8A5A"; // L3 green
    label = "L3 Bank-confirmed";
    subtext = "Confirmed via SFMS / Core switch";
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} title={`${label}: ${subtext}`}>
      <svg
        width={sizePx}
        height={sizePx}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        {level === "L1" && (
          // HOLLOW ring glyph
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="#8C9187"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray="1.5 1.5"
          />
        )}

        {level === "L2" && (
          // HALF-FILLED ring glyph
          <g>
            <circle cx="12" cy="12" r="9" stroke="#B5832A" strokeWidth={strokeWidth} fill="none" />
            <path
              d="M 12 3 A 9 9 0 0 1 12 21 Z"
              fill="#B5832A"
              fillOpacity="0.85"
            />
          </g>
        )}

        {level === "L3" && (
          // SOLID ring glyph with check notch
          <g>
            <circle cx="12" cy="12" r="9.5" fill="#1E8A5A" />
            <path
              d="M7.5 12.2L10.5 15.2L16.5 9.2"
              stroke="#F6F0E0"
              strokeWidth="2.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        )}
      </svg>

      {showLabel && (
        <span
          className="font-mono text-xs font-semibold tracking-wider uppercase"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
