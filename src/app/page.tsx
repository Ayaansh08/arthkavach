"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DemoToolbar } from "@/components/ui/demo-toolbar";
import { Guilloche } from "@/components/ui/guilloche";
import { ReceiptCard } from "@/components/ui/receipt-card";
import { VerificationLadder } from "@/components/ui/verification-ladder";
import { ChainedLedger } from "@/components/ui/chained-ledger";
import { repository } from "@/lib/data/repository";
import { AuditEvent } from "@/lib/types";
import {
  ArrowRight,
  Building2,
  Users,
  Lock,
  ArrowUpRight,
} from "lucide-react";

export default function LandingPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [activeDoor, setActiveDoor] = useState<number | null>(null);

  useEffect(() => {
    repository.getAuditEvents().then((evts) => setEvents(evts));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE4CE] text-[#1A1F1B] selection:bg-[#F2A900] selection:text-[#0C1411]">
      {/* 0. Demo Injectable Control Bar */}
      <DemoToolbar />

      {/* 1. Thin full-width mono marquee ledger tape */}
      <div className="w-full bg-[#0C1411] text-[#E9E2CF] border-b border-[#E9E2CF]/20 overflow-hidden py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] flex items-center select-none">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-8">
          <span>27 OCT 26 · SUBMITTED · FDR 00481920 · BHARAT NATIONAL MERCANTILE BANK · ₹ 35,00,000 · LIEN DULY MARKED TO AICTE</span>
          <span className="text-[#F2A900]">◆</span>
          <span>28 OCT 26 · SFMS TELEMETRY MATCH · CONFIRMED · SCOPE: AMOUNT + MATURITY · LEVEL 3 ISSUED</span>
          <span className="text-[#F2A900]">◆</span>
          <span className="text-[#C4301C] font-bold">29 OCT 26 · DISCREPANCY FLAGGED · FDR 00918231 · DEPOSIT AMOUNT SHORTFALL ₹ 5,00,000</span>
          <span className="text-[#F2A900]">◆</span>
          <span>30 OCT 26 · CRYPTOGRAPHIC AUDIT BLOCK #010 HASH-CHAINED · INTEGRITY 100% INTACT</span>
          <span className="text-[#F2A900]">◆</span>
          <span>30 OCT 26 · RELEASE REQUEST PENDING APPROVAL · CHOLA SCHOOL OF ARCHITECTURE</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <header className="w-full bg-[#0C1411] text-[#E9E2CF] border-b border-[#E9E2CF]/20 px-4 md:px-8 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-[#F2A900] hard-shadow-sm shrink-0" />
            <div>
              <div className="font-display text-2xl md:text-3xl font-black uppercase tracking-wider text-[#E9E2CF] leading-none">
                ARTHKAVACH
              </div>
              <div className="font-devanagari text-xs text-[#F2A900] tracking-wider font-semibold">
                सुरक्षा · सतर्कता · सत्यता
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-4 md:gap-8 font-mono text-xs uppercase tracking-wider">
            <Link
              href="#verification"
              className="hidden sm:inline hover:text-[#F2A900] transition-colors"
            >
              Verification Ladder
            </Link>
            <Link
              href="#ledger"
              className="hidden sm:inline hover:text-[#F2A900] transition-colors"
            >
              Chained Ledger
            </Link>
            <Link
              href="/design-system"
              className="hidden md:inline hover:text-[#F2A900] transition-colors text-[11px] text-[#E9E2CF]/70"
            >
              Design Tokens
            </Link>
            <Link
              href="/sign-in"
              className="px-4 py-2 bg-[#F2A900] text-[#0C1411] font-bold hard-shadow-sm hover:opacity-95 transition-opacity"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section (Vault Ink with Guilloche Rosette) */}
      <section className="relative w-full bg-[#0C1411] text-[#E9E2CF] border-b-2 border-[#0C1411] pt-12 md:pt-20 pb-28 md:pb-36 overflow-hidden">
        {/* Procedural Guilloche Rosette - Off canvas right */}
        <div className="absolute -right-36 -top-20 pointer-events-none opacity-20">
          <Guilloche size={750} strokeColor="#E9E2CF" strokeWidth={0.65} />
        </div>

        {/* 12-Column Grid Container with 1px Left Ledger Margin Rule */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-l border-[#E9E2CF]/20 pl-4 md:pl-8">
            {/* Left 7 Columns: Hero Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#17231E] border border-[#E9E2CF]/20 font-mono text-[11px] uppercase tracking-widest text-[#F2A900]">
                <span>AICTE DECISION-SUPPORT INSTRUMENT</span>
                <span>·</span>
                <span>STATUTORY FDR AUDIT</span>
              </div>

              {/* Stacked 3-Line Headline with "RECORD" underlined in stamp red */}
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-[#E9E2CF] tracking-[-0.02em] leading-[0.88] select-none">
                <div>EVERY</div>
                <div>DEPOSIT,</div>
                <div>
                  ON THE{" "}
                  <span className="relative inline-block text-[#EDE4CE]">
                    RECORD.
                    <span className="absolute left-0 -bottom-1.5 w-full h-[6px] bg-[#C4301C] -rotate-1" />
                  </span>
                </div>
              </h1>

              <p className="font-sans text-base md:text-lg text-[#E9E2CF]/80 max-w-xl leading-relaxed pt-2">
                An evidence-backed public ledger for technical institutions&apos; Fixed Deposit
                Receipts. ARTHKAVACH separates what a college <em>submitted</em> from what a
                bank <em>confirmed</em>—never upgrading an unverified document.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/sign-in"
                  className="px-6 py-3.5 bg-[#F2A900] text-[#0C1411] font-mono text-xs md:text-sm font-bold uppercase tracking-wider hard-shadow hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter the portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#verification"
                  className="px-6 py-3.5 border border-[#E9E2CF]/40 text-[#E9E2CF] font-mono text-xs md:text-sm uppercase tracking-wider hover:bg-[#E9E2CF]/10 transition-colors"
                >
                  How verification works
                </Link>
              </div>

              {/* Security Print Feature Strip */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E9E2CF]/15 font-mono text-xs">
                <div>
                  <div className="text-[10px] uppercase text-[#E9E2CF]/60">L3 Confirmation</div>
                  <div className="font-bold text-[#1E8A5A] mt-0.5">Direct SFMS Stream</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#E9E2CF]/60">File Tamper-Check</div>
                  <div className="font-bold text-[#E9E2CF] mt-0.5">Client SHA-256</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#E9E2CF]/60">Maker-Checker</div>
                  <div className="font-bold text-[#F2A900] mt-0.5">No Auto-Approve</div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Oversized Tilted Specimen FDR Receipt overlapping */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative lg:-mt-6 lg:-mb-24 lg:translate-x-4">
                <ReceiptCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three levels of truth (Paper Surface) */}
      <section id="verification" className="w-full bg-[#EDE4CE] paper-grain py-16 md:py-24 border-b-2 border-[#0C1411]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 border-l border-[#1A1F1B]/25 pl-4 md:pl-8">
          <VerificationLadder />
        </div>
      </section>

      {/* 4. Every event, signed and in order (Vault Ink Event Ledger) */}
      <section id="ledger" className="w-full bg-[#0C1411] py-16 md:py-24 border-b-2 border-[#0C1411]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 border-l border-[#E9E2CF]/20 pl-4 md:pl-8">
          <ChainedLedger events={events} />
        </div>
      </section>

      {/* 5. Enter as: Three doors of UNEQUAL width (5 / 4 / 3 cols) */}
      <section className="w-full bg-[#EDE4CE] paper-grain py-16 md:py-24 border-b-2 border-[#0C1411]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 border-l border-[#1A1F1B]/25 pl-4 md:pl-8">
          <div className="border-b-2 border-[#1A1F1B]/30 pb-4 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
              ROLE-BASED GOVERNANCE DOORS
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-[#0C1411] tracking-tight">
              ENTER AS
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 max-w-2xl mt-1">
              Distinct institutional roles with strictly separated maker-checker duties. Choose your door to inspect simulated operations.
            </p>
          </div>

          {/* Unequal width doors (5 / 4 / 3 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Door 1: Institution (5 columns) */}
            <div
              onMouseEnter={() => setActiveDoor(1)}
              onMouseLeave={() => setActiveDoor(null)}
              className={`lg:col-span-5 bg-[#F6F0E0] border-2 ${
                activeDoor === 1 ? "border-[#F2A900] bg-[#EDE4CE] scale-[1.01]" : "border-[#0C1411]"
              } hard-shadow p-6 md:p-8 flex flex-col justify-between transition-all group cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#0C1411] text-[#E9E2CF] uppercase">
                    COLLEGE OPERATOR
                  </span>
                  <Building2 className="w-6 h-6 text-[#0C1411]" />
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-[#0C1411] group-hover:text-[#F2A900] transition-colors">
                  Institution Admin
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-2 leading-relaxed">
                  Submit newly issued fixed deposit instruments, view OCR extracted confidence, track maturity alerts under sample warning windows, and submit release petitions.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1A1F1B]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase font-bold text-[#0C1411]">
                  Door 01 · College Portal
                </span>
                <Link
                  href="/sign-in?role=INSTITUTION_ADMIN"
                  className="px-4 py-2 bg-[#F2A900] text-[#0C1411] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-sm flex items-center gap-1.5"
                >
                  <span>Enter</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Door 2: AICTE Scrutiny Officer & Approving Authority (4 columns) */}
            <div
              onMouseEnter={() => setActiveDoor(2)}
              onMouseLeave={() => setActiveDoor(null)}
              className={`lg:col-span-4 bg-[#F6F0E0] border-2 ${
                activeDoor === 2 ? "border-[#B5832A] bg-[#EDE4CE] scale-[1.01]" : "border-[#0C1411]"
              } hard-shadow p-6 md:p-8 flex flex-col justify-between transition-all group cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#B5832A] text-[#0C1411] uppercase">
                    REGULATORY CELL
                  </span>
                  <Users className="w-6 h-6 text-[#0C1411]" />
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-[#0C1411] group-hover:text-[#B5832A] transition-colors">
                  AICTE Officer
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-2 leading-relaxed">
                  Scrutiny officer recommends; Approving authority sanctions. Side-by-side evidence inspection, maturity warning calendar, IFAS indicators, and risk queues.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1A1F1B]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase font-bold text-[#0C1411]">
                  Door 02 · Command Centre
                </span>
                <Link
                  href="/sign-in?role=AICTE_SCRUTINY_OFFICER"
                  className="px-4 py-2 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-sm flex items-center gap-1.5"
                >
                  <span>Enter</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Door 3: System Administrator (3 columns) */}
            <div
              onMouseEnter={() => setActiveDoor(3)}
              onMouseLeave={() => setActiveDoor(null)}
              className={`lg:col-span-3 bg-[#F6F0E0] border-2 ${
                activeDoor === 3 ? "border-[#C4301C] bg-[#EDE4CE] scale-[1.01]" : "border-[#0C1411]"
              } hard-shadow p-6 md:p-8 flex flex-col justify-between transition-all group cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#8C9187] text-[#0C1411] uppercase">
                    GOVERNANCE
                  </span>
                  <Lock className="w-6 h-6 text-[#0C1411]" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-black uppercase text-[#0C1411] group-hover:text-[#C4301C] transition-colors">
                  Administrator
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-2 leading-relaxed">
                  Configurable maturity notification intervals, statutory release checklist enforcement, and cryptographic hash-chain integrity verification.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1A1F1B]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase font-bold text-[#0C1411]">
                  Door 03 · Config
                </span>
                <Link
                  href="/sign-in?role=SYSTEM_ADMIN"
                  className="px-4 py-2 bg-[#8C9187] text-[#0C1411] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-sm flex items-center gap-1.5"
                >
                  <span>Enter</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer strip */}
      <footer className="w-full bg-[#0C1411] text-[#E9E2CF] border-t border-[#E9E2CF]/20 px-4 md:px-8 py-6 font-mono text-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F2A900]" />
            <span className="uppercase tracking-widest text-[#E9E2CF]">
              SYNTHETIC DEMO DATA · CONCEPT PROTOTYPE · DECISION SUPPORT ONLY
            </span>
          </div>

          <div className="flex items-center gap-6 text-[#E9E2CF]/60 text-[11px]">
            <span>SMART INDIA HACKATHON</span>
            <span>·</span>
            <span>AICTE (GOVT. OF INDIA)</span>
            <span>·</span>
            <Link href="/design-system" className="hover:text-[#F2A900]">
              Design System
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
