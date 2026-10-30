"use client";

import React from "react";
import { AppShell } from "@/components/ui/app-shell";
import { StatusRing } from "@/components/ui/status-ring";
import { Stamp } from "@/components/ui/stamp";
import { EvidenceCompare } from "@/components/ui/evidence-compare";
import { ReceiptCard } from "@/components/ui/receipt-card";
import { VerificationLadder } from "@/components/ui/verification-ladder";
import { FDRFieldComparison } from "@/lib/types";

export default function DesignSystemPage() {
  const sampleFields: FDRFieldComparison[] = [
    {
      field: "fdrNumber",
      label: "FDR / Receipt No.",
      submittedValue: "FDR-2024-BH-00481920",
      ocrValue: "FDR-2024-BH-00481920",
      ocrConfidence: 99,
      bankConfirmedValue: "FDR-2024-BH-00481920",
      bankConfirmedScope: true,
      isMismatch: false,
    },
    {
      field: "amount",
      label: "Deposit Principal (INR)",
      submittedValue: "₹ 35,00,000",
      ocrValue: "₹ 30,00,000",
      ocrConfidence: 96,
      bankConfirmedValue: null,
      isMismatch: true,
    },
    {
      field: "maturityDate",
      label: "Maturity Date",
      submittedValue: "15 Mar 2027",
      ocrValue: "15 Mar 2027",
      ocrConfidence: 74,
      isCorrected: true,
      correctedBy: "Officer Saxena",
      correctionReason: "Faint matrix print clarified",
      bankConfirmedValue: "15 Mar 2027",
      isMismatch: false,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-12">
        {/* Page Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#F2A900] hard-shadow-sm" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
              SPECIFICATION COMPLIANCE · TOKENS &amp; PRIMITIVES
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-[#0C1411] tracking-tight mt-1">
            SECURITY-PRINT LEDGER DESIGN SYSTEM
          </h1>
          <p className="font-sans text-sm text-[#1A1F1B]/80 max-w-3xl mt-2 leading-relaxed">
            Standardized components engineered for AICTE Fixed Deposit statutory decision support.
            All components follow strict zero-radius hairline security press aesthetics with hard offset shadows.
          </p>
        </div>

        {/* 1. COLOR TOKENS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              1. Color Tokens (Exact)
            </h2>
            <span className="font-mono text-xs text-[#1A1F1B]/60">NO VIOLET · NO GRADIENTS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Vault Ink", hex: "#0C1411", text: "text-[#E9E2CF]", bg: "bg-[#0C1411]" },
              { name: "Ledger Paper", hex: "#EDE4CE", text: "text-[#1A1F1B]", bg: "bg-[#EDE4CE]" },
              { name: "Paper Lift", hex: "#F6F0E0", text: "text-[#1A1F1B]", bg: "bg-[#F6F0E0]" },
              { name: "Seal Marigold", hex: "#F2A900", text: "text-[#0C1411]", bg: "bg-[#F2A900]" },
              { name: "Stamp Red", hex: "#C4301C", text: "text-[#F6F0E0]", bg: "bg-[#C4301C]" },
              { name: "L3 Bank Green", hex: "#1E8A5A", text: "text-[#F6F0E0]", bg: "bg-[#1E8A5A]" },
              { name: "L2 Evidenced Brass", hex: "#B5832A", text: "text-[#0C1411]", bg: "bg-[#B5832A]" },
              { name: "L1 Screened Graphite", hex: "#8C9187", text: "text-[#0C1411]", bg: "bg-[#8C9187]" },
            ].map((c, i) => (
              <div key={i} className={`p-4 border border-[#0C1411]/30 hard-shadow-sm ${c.bg} ${c.text}`}>
                <div className="font-display text-lg font-black uppercase leading-tight">{c.name}</div>
                <div className="font-mono text-xs mt-2 font-bold tracking-wider">{c.hex}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. TYPOGRAPHY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              2. Typography System
            </h2>
            <span className="font-mono text-xs text-[#1A1F1B]/60">BIG SHOULDERS + IBM PLEX + DEVANAGARI</span>
          </div>

          <div className="space-y-4 p-6 bg-[#F6F0E0] border border-[#1A1F1B]/30">
            <div>
              <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider">
                Display · Big Shoulders Display 800 uppercase
              </div>
              <div className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#0C1411]">
                EVERY DEPOSIT, ON THE RECORD.
              </div>
            </div>

            <div className="border-t border-[#1A1F1B]/15 pt-3">
              <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider">
                Devanagari Tagline · Noto / Tiro Serif Devanagari
              </div>
              <div className="font-devanagari text-2xl font-bold text-[#0C1411]">
                सुरक्षा · सतर्कता · सत्यता
              </div>
            </div>

            <div className="border-t border-[#1A1F1B]/15 pt-3">
              <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider">
                Data &amp; Numerics · IBM Plex Mono tabular-nums
              </div>
              <div className="font-mono text-base font-bold text-[#0C1411] tracking-wide">
                FDR-2024-BH-00481920 · ₹ 35,00,000 · SHA-256: 8f48a1c9e3b7492c60e1d09e74bb7a34
              </div>
            </div>
          </div>
        </section>

        {/* 3. STATUS RINGS (EVIDENCE SCALE) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              3. Evidence Scale Glyphs
            </h2>
            <span className="font-mono text-xs text-[#1A1F1B]/60">NEVER CLAIM VERIFIED FOR &lt; L3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F6F0E0] border border-[#1A1F1B]/30 flex items-center gap-3">
              <StatusRing level="L1" size="lg" />
              <div>
                <div className="font-mono text-xs font-bold text-[#8C9187] uppercase">L1 Document-Screened</div>
                <div className="text-xs text-[#1A1F1B]/70">Hollow ring. Proves OCR integrity only.</div>
              </div>
            </div>

            <div className="p-4 bg-[#F6F0E0] border border-[#1A1F1B]/30 flex items-center gap-3">
              <StatusRing level="L2" size="lg" />
              <div>
                <div className="font-mono text-xs font-bold text-[#B5832A] uppercase">L2 Digitally Evidenced</div>
                <div className="text-xs text-[#1A1F1B]/70">Half-filled ring. Digital signature / eSign valid.</div>
              </div>
            </div>

            <div className="p-4 bg-[#F6F0E0] border border-[#1A1F1B]/30 flex items-center gap-3">
              <StatusRing level="L3" size="lg" />
              <div>
                <div className="font-mono text-xs font-bold text-[#1E8A5A] uppercase">L3 Bank-Confirmed</div>
                <div className="text-xs text-[#1A1F1B]/70">Solid ring with check notch. Direct SFMS match.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. RUBBER STAMPS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              4. Physical Security Stamps
            </h2>
            <span className="font-mono text-xs text-[#1A1F1B]/60">-4 TO -8 DEGREE MISREGISTRATION</span>
          </div>

          <div className="flex flex-wrap items-center gap-8 p-6 bg-[#F6F0E0] border border-[#1A1F1B]/30">
            <Stamp variant="AWAITING" rotation={-6} />
            <Stamp variant="CONFIRMED" rotation={-5} subtext="SFMS 20 MAR 2024" />
            <Stamp variant="DISCREPANCY" rotation={-7} subtext="AMOUNT MISMATCH" />
            <Stamp variant="OVERDUE" rotation={-4} subtext="ACTION MANDATORY" />
            <Stamp variant="RELEASED" rotation={-6} subtext="LIEN REVOKED" />
          </div>
        </section>

        {/* 5. SPECIMEN RECEIPT */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              5. Interactive Specimen Receipt
            </h2>
            <span className="font-mono text-xs text-[#1A1F1B]/60">POINTER 3D TILT · STAMP SWAP ON CLICK</span>
          </div>

          <ReceiptCard />
        </section>

        {/* 6. EVIDENCE COMPARISON */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              6. Evidence 3-Way Comparison
            </h2>
            <span className="font-mono text-xs text-[#1A1F1B]/60">SUBMITTED VS OCR VS BANK DIRECT</span>
          </div>

          <EvidenceCompare fields={sampleFields} />
        </section>

        {/* 7. VERIFICATION LADDER */}
        <section className="space-y-4">
          <VerificationLadder />
        </section>
      </div>
    </AppShell>
  );
}
