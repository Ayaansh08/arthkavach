"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity, Institution } from "@/lib/types";
import { useDemoStore, getDaysUntilMaturity } from "@/lib/store/demo-store";
import { StatusRing } from "@/components/ui/status-ring";
import { RiskFlag } from "@/components/ui/risk-flag";
import { LedgerTable } from "@/components/ui/ledger-table";
import { ArrowRight } from "lucide-react";

export default function AicteOverviewPage() {
  const { currentDateIso } = useDemoStore();
  const [fdrs, setFdrs] = useState<FDREntity[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    async function loadData() {
      const allFdrs = await repository.getFDRs();
      const allInsts = await repository.getInstitutions();
      setFdrs(allFdrs);
      setInstitutions(allInsts);
    }
    loadData();
  }, [currentDateIso]);

  // KPI Computations
  const totalInstruments = fdrs.length;
  const totalInstitutions = institutions.length;
  const awaitingConfirmationCount = fdrs.filter(
    (f) => f.status === "AWAITING_CONFIRMATION" || f.status === "DOCUMENT_SCREENED"
  ).length;
  const discrepancyCount = fdrs.filter((f) => f.status === "DISCREPANCY_UNDER_REVIEW").length;
  const expiringSoonCount = fdrs.filter((f) => {
    const days = getDaysUntilMaturity(f.maturityDate);
    return days >= 0 && days <= 60;
  }).length;
  const overdueCount = fdrs.filter((f) => {
    const days = getDaysUntilMaturity(f.maturityDate);
    return days < 0 && f.status !== "RELEASED_CLOSED" && f.status !== "RENEWED";
  }).length;
  const releasePendingCount = fdrs.filter((f) => f.status === "RELEASE_REQUESTED").length;

  // Filtered Attention Queue (Priority sorted: CRITICAL -> HIGH -> MEDIUM -> LOW)
  const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  let attentionQueue = [...fdrs].sort(
    (a, b) => priorityOrder[b.riskLevel] - priorityOrder[a.riskLevel]
  );

  if (riskFilter !== "ALL") {
    attentionQueue = attentionQueue.filter((f) => f.riskLevel === riskFilter);
  }
  if (statusFilter !== "ALL") {
    attentionQueue = attentionQueue.filter((f) => f.status === statusFilter);
  }

  // Hand-built SVG Charts: Bank-wise Distribution
  const bankDistribution: Record<string, number> = {};
  fdrs.forEach((f) => {
    bankDistribution[f.bankName] = (bankDistribution[f.bankName] || 0) + 1;
  });
  const maxBankCount = Math.max(...Object.values(bankDistribution), 1);

  const columns = [
    {
      header: "Risk Priority",
      cell: (item: FDREntity) => (
        <RiskFlag level={item.riskLevel} factors={item.riskFactors} />
      ),
    },
    {
      header: "FDR Instrument & Level",
      cell: (item: FDREntity) => (
        <div>
          <div className="flex items-center gap-1.5">
            <StatusRing level={item.evidenceLevel} size="sm" />
            <Link
              href={`/aicte/review/${item.id}`}
              className="font-mono text-xs font-bold text-[#0C1411] hover:text-[#C4301C]"
            >
              {item.fdrNumber}
            </Link>
          </div>
          <div className="text-[10px] text-[#1A1F1B]/70 font-sans mt-0.5">
            {item.bankName}
          </div>
        </div>
      ),
    },
    {
      header: "Institution Name",
      cell: (item: FDREntity) => (
        <div className="font-sans text-xs font-semibold text-[#0C1411]">
          {item.institutionName}
        </div>
      ),
    },
    {
      header: "Principal Amount",
      align: "right" as const,
      cell: (item: FDREntity) => (
        <span className="font-mono text-xs font-bold text-[#0C1411]">
          ₹ {item.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Maturity / Overdue Status",
      cell: (item: FDREntity) => {
        const days = getDaysUntilMaturity(item.maturityDate);
        const isOver = days < 0 && item.status !== "RELEASED_CLOSED";
        return (
          <div className="font-mono text-xs">
            <div>{item.maturityDate}</div>
            <div className="text-[10px] mt-0.5">
              {isOver ? (
                <span className="text-[#C4301C] font-bold">Overdue by {Math.abs(days)}d</span>
              ) : days <= 30 ? (
                <span className="text-[#B5832A] font-bold">Expires in {days}d</span>
              ) : (
                <span className="text-[#1A1F1B]/60">{days}d left</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Scrutiny Action",
      align: "center" as const,
      cell: (item: FDREntity) => (
        <Link
          href={`/aicte/review/${item.id}`}
          className="px-2.5 py-1 bg-[#0C1411] text-[#E9E2CF] font-mono text-[10px] uppercase font-bold hard-shadow-sm hover:bg-[#F2A900] hover:text-[#0C1411] transition-colors inline-flex items-center gap-1"
        >
          <span>Case Review</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C4301C] hard-shadow-sm" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#C4301C] font-bold">
              AICTE REGULATORY SCRUTINY &amp; APPROVAL CELL
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            STATUTORY COMMAND OVERVIEW
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1 max-w-3xl">
            National FDR decision-support queue. Separates document-screened submissions from bank-confirmed telemetry with explainable risk flags.
          </p>
        </div>

        {/* 7-Card KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono">
          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Total Inst.</div>
            <div className="text-xl font-black text-[#0C1411] mt-0.5">{totalInstitutions}</div>
            <div className="text-[8.5px] text-[#1A1F1B]/70">National Reg.</div>
          </div>

          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Instruments</div>
            <div className="text-xl font-black text-[#0C1411] mt-0.5">{totalInstruments}</div>
            <div className="text-[8.5px] text-[#1A1F1B]/70">Active &amp; Matured</div>
          </div>

          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Awaiting Conf.</div>
            <div className="text-xl font-black text-[#B5832A] mt-0.5">{awaitingConfirmationCount}</div>
            <div className="text-[8.5px] text-[#B5832A]">L1 / L2 Screened</div>
          </div>

          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Expiring Soon</div>
            <div className="text-xl font-black text-[#B5832A] mt-0.5">{expiringSoonCount}</div>
            <div className="text-[8.5px] text-[#1A1F1B]/70">&lt; 60 Day Window</div>
          </div>

          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Overdue Action</div>
            <div className="text-xl font-black text-[#C4301C] mt-0.5">{overdueCount}</div>
            <div className="text-[8.5px] text-[#C4301C]">Lien Past Due</div>
          </div>

          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Discrepancy</div>
            <div className="text-xl font-black text-[#C4301C] mt-0.5">{discrepancyCount}</div>
            <div className="text-[8.5px] text-[#C4301C]">Amount / Hash</div>
          </div>

          <div className="p-3 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="text-[9.5px] uppercase text-[#1A1F1B]/60">Release Pend.</div>
            <div className="text-xl font-black text-[#0C1411] mt-0.5">{releasePendingCount}</div>
            <div className="text-[8.5px] text-[#1A1F1B]/70">Maker-Checker</div>
          </div>
        </div>

        {/* Hand-built SVG Charts Strip: Bank-wise & Level-wise Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bank Distribution Ruled Bar Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
              <div>
                <h3 className="font-display text-xl font-black uppercase text-[#0C1411]">
                  Issuing Bank Distribution (Hand-Built Ruled SVG)
                </h3>
                <div className="font-mono text-[10px] text-[#1A1F1B]/60 uppercase">
                  Statutory deposit concentration by banking institution
                </div>
              </div>
              <span className="font-mono text-xs text-[#0C1411] font-bold">TOTAL: {fdrs.length} INSTRUMENTS</span>
            </div>

            {/* Custom Ruled SVG Bar Visualizer */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              {Object.entries(bankDistribution).map(([bank, count], idx) => {
                const pct = (count / maxBankCount) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-[#0C1411] truncate">{bank}</span>
                      <span className="font-bold text-[#0C1411]">{count} FDRs</span>
                    </div>
                    {/* Ruled Bahi-Khata Bar with 0-radius and hatching */}
                    <div className="w-full h-4 bg-[#EDE4CE] border border-[#1A1F1B]/30 relative overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-[#0C1411] border-r border-[#F2A900]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Level Distribution (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4 flex flex-col justify-between">
            <div className="border-b border-[#1A1F1B]/20 pb-2">
              <h3 className="font-display text-xl font-black uppercase text-[#0C1411]">
                Evidence Breakdown
              </h3>
              <div className="font-mono text-[10px] text-[#1A1F1B]/60 uppercase">
                Proportion across 3 levels of truth
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-white border border-[#8C9187] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusRing level="L1" size="sm" />
                  <span className="font-bold text-[#8C9187]">L1 Screened</span>
                </div>
                <span className="text-base font-black text-[#0C1411]">
                  {fdrs.filter((f) => f.evidenceLevel === "L1").length}
                </span>
              </div>

              <div className="p-3 bg-white border border-[#B5832A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusRing level="L2" size="sm" />
                  <span className="font-bold text-[#B5832A]">L2 Evidenced</span>
                </div>
                <span className="text-base font-black text-[#0C1411]">
                  {fdrs.filter((f) => f.evidenceLevel === "L2").length}
                </span>
              </div>

              <div className="p-3 bg-white border border-[#1E8A5A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusRing level="L3" size="sm" />
                  <span className="font-bold text-[#1E8A5A]">L3 Confirmed</span>
                </div>
                <span className="text-base font-black text-[#1E8A5A]">
                  {fdrs.filter((f) => f.evidenceLevel === "L3").length}
                </span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#1A1F1B]/70 border-t border-[#1A1F1B]/20 pt-2">
              * Strict Truthfulness Rule: Level 3 strictly reserved for SFMS direct confirmation.
            </div>
          </div>
        </div>

        {/* Attention Queue Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1A1F1B]/30 pb-3 gap-3">
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
                Scrutiny Attention Queue ({attentionQueue.length})
              </h2>
              <div className="font-mono text-xs text-[#1A1F1B]/70">
                Ranked by explainable risk heuristics (Critical &gt; High &gt; Medium &gt; Low)
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-[#1A1F1B]/60 text-[10px] uppercase">Filter Risk:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#F6F0E0] border border-[#1A1F1B]/30 px-2 py-1 text-xs"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical Discrepancy</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F6F0E0] border border-[#1A1F1B]/30 px-2 py-1 text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="DISCREPANCY_UNDER_REVIEW">Discrepancies</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="MATURED_OVERDUE">Matured / Overdue</option>
                <option value="RELEASE_REQUESTED">Release Requested</option>
                <option value="BANK_CONFIRMED">Bank Confirmed</option>
              </select>
            </div>
          </div>

          <LedgerTable columns={columns} data={attentionQueue} />
        </div>
      </div>
    </AppShell>
  );
}
