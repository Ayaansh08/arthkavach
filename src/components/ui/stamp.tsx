import React from "react";

export type StampVariant =
  | "AWAITING"
  | "CONFIRMED"
  | "DISCREPANCY"
  | "OVERDUE"
  | "RELEASED"
  | "EVIDENCED"
  | "GENUINE_HOLD";

interface StampProps {
  text?: string;
  variant?: StampVariant;
  rotation?: number; // e.g. -6
  size?: "sm" | "md" | "lg";
  subtext?: string;
  className?: string;
}

export function Stamp({
  text,
  variant = "AWAITING",
  rotation = -6,
  size = "md",
  subtext,
  className = "",
}: StampProps) {
  let defaultText = "AWAITING CONFIRMATION";
  let colorClass = "border-[#C4301C] text-[#C4301C]"; // Stamp Red default

  switch (variant) {
    case "AWAITING":
      defaultText = "AWAITING CONFIRMATION";
      colorClass = "border-[#C4301C] text-[#C4301C]";
      break;
    case "CONFIRMED":
      defaultText = "BANK-CONFIRMED";
      colorClass = "border-[#1E8A5A] text-[#1E8A5A]";
      break;
    case "DISCREPANCY":
      defaultText = "DISCREPANCY FLAGGED";
      colorClass = "border-[#C4301C] text-[#C4301C]";
      break;
    case "OVERDUE":
      defaultText = "OVERDUE · ACTION REQ.";
      colorClass = "border-[#C4301C] text-[#C4301C]";
      break;
    case "RELEASED":
      defaultText = "LIEN RELEASED";
      colorClass = "border-[#0C1411] text-[#0C1411]";
      break;
    case "EVIDENCED":
      defaultText = "DIGITALLY EVIDENCED";
      colorClass = "border-[#B5832A] text-[#B5832A]";
      break;
    case "GENUINE_HOLD":
      defaultText = "CAUTION HOLD";
      colorClass = "border-[#F2A900] text-[#F2A900]";
      break;
  }

  const displayText = text || defaultText;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] border-2",
    md: "px-3 py-1 text-xs border-[2.5px]",
    lg: "px-4 py-2 text-sm md:text-base border-3",
  }[size];

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`inline-block select-none transition-all duration-300 ${className}`}
    >
      <div
        className={`font-mono font-black uppercase tracking-[0.14em] text-center border-dashed ${colorClass} ${sizeClasses} shadow-[1px_1px_0px_currentColor] bg-transparent backdrop-blur-[0.5px]`}
      >
        <div className="flex items-center justify-center gap-1.5 leading-tight">
          <span>{displayText}</span>
        </div>
        {subtext && (
          <div className="text-[8.5px] tracking-[0.18em] font-medium opacity-85 mt-0.5 border-t border-current pt-0.5">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
