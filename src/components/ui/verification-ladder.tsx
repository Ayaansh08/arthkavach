"use client";

import React, { useState } from "react";
import { StatusRing } from "./status-ring";
import { Shield, FileCheck, Landmark, CheckCircle } from "lucide-react";

export function VerificationLadder() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(3);

  const steps = [
    {
      num: "01",
      level: "L1" as const,
      title: "Document-Screened",
      badgeColor: "#8C9187",
      icon: FileCheck,
      source: "Uploaded PDF / Image OCR",
      tagline: "SHA-256 fingerprint anchored; text extracted with per-field confidence.",
      rule: "Proves file integrity and OCR parsing only. Never treated as bank issuance.",
      sampleFields: ["File hash verified", "OCR confidence 98%", "Bank uncontacted"],
    },
    {
      num: "02",
      level: "L2" as const,
      title: "Digitally Evidenced",
      badgeColor: "#B5832A",
      icon: Shield,
      source: "Class-3 eSign / Digital Notary / CCA CRL",
      tagline: "Third-party digital cryptographic signature verified against revocation lists.",
      rule: "Validates authorized signer identity, but awaiting issuing bank core confirmation.",
      sampleFields: ["eMudhra Token valid", "CRL check clean", "SFMS queued"],
    },
    {
      num: "03",
      level: "L3" as const,
      title: "Bank-Confirmed",
      badgeColor: "#1E8A5A",
      icon: Landmark,
      source: "Direct SFMS / Core Banking Telemetry",
      tagline: "Issuing bank treasury gateway confirms deposit balance, maturity, and AICTE lien.",
      rule: "The gold standard of statutory assurance. Sealed on irrevocable public audit chain.",
      sampleFields: ["SFMS match 100%", "Lien endorsed", "Scope confirmed"],
    },
  ];

  return (
    <div className="border-2 border-[#1A1F1B]/30 bg-[#F6F0E0] p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1F1B]/30 pb-4 mb-6 gap-2">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
            STATUTORY EVIDENCE SCALE
          </span>
          <h3 className="font-display text-3xl md:text-4xl font-extrabold uppercase text-[#0C1411] tracking-tight">
            THREE LEVELS OF TRUTH
          </h3>
        </div>
        <div className="font-mono text-xs uppercase tracking-wider text-[#C4301C] font-black border border-[#C4301C] px-3 py-1">
          NEVER FAKED · NEVER UPGRADED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const isSelected = activeStep === (idx + 1);
          const Icon = step.icon;

          return (
            <div
              key={step.num}
              onClick={() => setActiveStep((idx + 1) as 1 | 2 | 3)}
              className={`p-5 cursor-pointer transition-all border ${
                isSelected
                  ? "border-[#0C1411] bg-[#EDE4CE] hard-shadow"
                  : "border-[#1A1F1B]/20 bg-[#F6F0E0] hover:border-[#1A1F1B]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-black text-[#0C1411]">
                  {step.num}
                </span>
                <StatusRing level={step.level} size="md" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-[#0C1411]" />
                <h4 className="font-display text-xl font-black uppercase text-[#0C1411]">
                  {step.title}
                </h4>
              </div>

              <div className="font-mono text-[10px] uppercase tracking-wider text-[#1A1F1B]/70 mb-3 border-b border-[#1A1F1B]/15 pb-2">
                SOURCE: {step.source}
              </div>

              <p className="text-xs text-[#1A1F1B] leading-relaxed mb-4">
                {step.tagline}
              </p>

              <div className="p-2.5 bg-[#F6F0E0] border-l-2 border-[#0C1411] text-[11px] font-mono text-[#1A1F1B]/90 mb-4">
                <span className="font-bold uppercase text-[9px] block text-[#0C1411]">Strict Protocol:</span>
                {step.rule}
              </div>

              <div className="space-y-1 pt-2 border-t border-[#1A1F1B]/15">
                {step.sampleFields.map((field, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-[#0C1411]">
                    <CheckCircle className="w-3 h-3 text-[#1E8A5A]" />
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
