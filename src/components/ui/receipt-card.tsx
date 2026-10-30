"use client";

import React, { useState, useRef } from "react";
import { Stamp } from "./stamp";
import { HashChip } from "./hash-chip";
import { Guilloche } from "./guilloche";
import { StatusRing } from "./status-ring";
import { CheckCircle2, ShieldCheck, Landmark } from "lucide-react";

interface ReceiptCardProps {
  fdrNumber?: string;
  amount?: number;
  bankName?: string;
  branchName?: string;
  maturityDate?: string;
  sha256Hash?: string;
  initialConfirmed?: boolean;
  className?: string;
}

export function ReceiptCard({
  fdrNumber = "FDR-2024-BH-00481920",
  amount = 3500000,
  bankName = "BHARAT NATIONAL MERCANTILE BANK",
  branchName = "Cantonment Branch, Varanasi · IFSC: BNMB0001428",
  maturityDate = "15 MAR 2027",
  sha256Hash = "8f48a1c9e3b7492c60e1d09e74bb7a349071c84b12dfc8369408b1a23805f77a",
  initialConfirmed = false,
  className = "",
}: ReceiptCardProps) {
  const [isConfirmed, setIsConfirmed] = useState(initialConfirmed);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [thud, setThud] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 28);
    setRotateY(x / 28);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const toggleStamp = () => {
    setThud(true);
    setIsConfirmed(!isConfirmed);
    setTimeout(() => setThud(false), 260);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={toggleStamp}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${thud ? 0.98 : 1})`,
        transition: thud ? "transform 0.08s ease-in" : "transform 0.2s ease-out",
      }}
      className={`relative cursor-pointer select-none border-2 border-[#0C1411] bg-[#F6F0E0] text-[#1A1F1B] hard-shadow-lg p-6 md:p-8 max-w-xl mx-auto overflow-hidden ${className}`}
    >
      {/* Background Guilloche Watermark */}
      <div className="absolute -right-20 -bottom-20 pointer-events-none opacity-20">
        <Guilloche size={340} strokeColor="#0C1411" strokeWidth={0.6} />
      </div>

      {/* Top Header Strip with Microtext border */}
      <div className="flex items-start justify-between border-b-2 border-[#0C1411] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#0C1411]" strokeWidth={1.75} />
            <span className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#0C1411]">
              SPECIMEN SECURITY INSTRUMENT
            </span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#1A1F1B]/70 mt-0.5">
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION · FORM STATUTORY-VIII
          </div>
        </div>
        <StatusRing level={isConfirmed ? "L3" : "L1"} size="md" />
      </div>

      {/* Bank & Branch Row */}
      <div className="mb-4">
        <div className="font-display text-2xl font-black uppercase tracking-tight text-[#0C1411] leading-none">
          {bankName}
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-[#1A1F1B]/80 mt-1">
          {branchName}
        </div>
      </div>

      {/* Main FDR Details Grid */}
      <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#1A1F1B]/30 bg-[#EDE4CE]/50 px-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#1A1F1B]/60">
            FDR Number
          </div>
          <div className="font-mono text-base font-bold text-[#0C1411] tracking-tight">
            {fdrNumber}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#1A1F1B]/60">
            Deposit Amount
          </div>
          <div className="font-mono text-xl font-black text-[#0C1411]">
            ₹ {amount.toLocaleString("en-IN")}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#1A1F1B]/60">
            Maturity Date
          </div>
          <div className="font-mono text-xs font-semibold text-[#0C1411]">
            {maturityDate}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#1A1F1B]/60">
            Lien Endorsement
          </div>
          <div className="font-mono text-xs font-semibold text-[#1E8A5A] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#1E8A5A]" />
            DULY MARKED TO AICTE
          </div>
        </div>
      </div>

      {/* Joint Holdership microline */}
      <div className="mt-3 text-[10px] font-mono text-[#1A1F1B]/75 border-b border-[#1A1F1B]/20 pb-2">
        <span className="font-bold">JOINT HOLDERS: </span>
        Regional Officer, AICTE Kanpur &amp; Member Secretary, Aryavarta Trust
      </div>

      {/* Hash Fingerprint Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <HashChip hash={sha256Hash} prefix="PAYLOAD SHA-256" truncateLength={7} />
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#1A1F1B]/60">
          [Click to toggle Stamp]
        </span>
      </div>

      {/* Physical Rubber Stamp Overlay */}
      <div className="absolute right-6 top-24 pointer-events-none">
        {isConfirmed ? (
          <Stamp
            variant="CONFIRMED"
            rotation={-5}
            size="lg"
            subtext="SFMS TELEMETRY · 20 MAR 2024"
          />
        ) : (
          <Stamp
            variant="AWAITING"
            rotation={-7}
            size="lg"
            subtext="BANK INDEPENDENT CONFIRMATION REQ."
          />
        )}
      </div>

      {/* Confirmed scope indicator badge if L3 */}
      {isConfirmed && (
        <div className="mt-3 p-2 bg-[#1E8A5A]/10 border border-[#1E8A5A]/40 text-[#1E8A5A] font-mono text-[10px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            BANK TELEMETRY CONFIRMED: Scope verified across Amount, Maturity, and Lien Endorsement.
          </span>
        </div>
      )}
    </div>
  );
}
