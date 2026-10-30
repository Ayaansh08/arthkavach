"use client";

import React, { useState } from "react";
import { AlertTriangle, AlertCircle, Info, ChevronDown } from "lucide-react";
import { RiskLevel, RiskFactor } from "@/lib/types";

interface RiskFlagProps {
  level: RiskLevel;
  factors?: RiskFactor[];
  interactive?: boolean;
  className?: string;
}

export function RiskFlag({
  level,
  factors = [],
  interactive = true,
  className = "",
}: RiskFlagProps) {
  const [isOpen, setIsOpen] = useState(false);

  const config = {
    LOW: {
      label: "Low Risk",
      border: "border-[#8C9187]",
      bg: "bg-[#8C9187]/10",
      text: "text-[#1A1F1B]",
      dot: "bg-[#8C9187]",
      icon: Info,
    },
    MEDIUM: {
      label: "Medium Risk",
      border: "border-[#F2A900]",
      bg: "bg-[#F2A900]/15",
      text: "text-[#0C1411]",
      dot: "bg-[#F2A900]",
      icon: AlertCircle,
    },
    HIGH: {
      label: "High Risk",
      border: "border-[#C4301C]",
      bg: "bg-[#C4301C]/15",
      text: "text-[#C4301C]",
      dot: "bg-[#C4301C]",
      icon: AlertTriangle,
    },
    CRITICAL: {
      label: "Critical Discrepancy",
      border: "border-[#C4301C] border-2",
      bg: "bg-[#C4301C]/20",
      text: "text-[#C4301C]",
      dot: "bg-[#C4301C] animate-pulse",
      icon: AlertTriangle,
    },
  }[level];

  const Icon = config.icon;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => interactive && setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider transition-all ${config.border} ${config.bg} ${config.text} hover:opacity-90`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        <span>{config.label}</span>
        {factors.length > 0 && interactive && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && factors.length > 0 && (
        <div className="absolute z-40 left-0 mt-1.5 w-80 p-3 bg-[#F6F0E0] border border-[#0C1411] hard-shadow text-[#1A1F1B] text-left">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-1.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-[#0C1411]">
              Explainable Risk Factors ({factors.length})
            </span>
            <span className="text-[9px] font-mono text-[#1A1F1B]/60">
              Decision Aid Only
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {factors.map((f, i) => (
              <div key={i} className="text-xs border-l-2 border-[#C4301C] pl-2 py-0.5">
                <div className="font-semibold text-[#0C1411]">{f.label}</div>
                <div className="text-[11px] text-[#1A1F1B]/80 font-sans mt-0.5">
                  {f.description}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-1.5 border-t border-[#1A1F1B]/15 text-[9.5px] font-mono text-[#1A1F1B]/70 italic">
            * Prioritization indicator based on heuristic policy rules; not a formal legal finding.
          </div>
        </div>
      )}
    </div>
  );
}
