"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity, Institution } from "@/lib/types";
import { useDemoStore, getDaysUntilMaturity } from "@/lib/store/demo-store";
import { StatusRing } from "@/components/ui/status-ring";
import { LedgerTable } from "@/components/ui/ledger-table";
import { RiskFlag } from "@/components/ui/risk-flag";
import {
  Upload,
  Calendar,
  AlertTriangle,
  Building2,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function InstitutionDashboard() {
  const { currentUserInstitutionId, currentDateIso } = useDemoStore();
  const [fdrs, setFdrs] = useState<FDREntity[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    async function loadData() {
      const instId = currentUserInstitutionId || "inst-001";
      const inst = await repository.getInstitutionById(instId);
      setInstitution(inst);

      // Load FDRs for this institution (or fallback to inst-001)
      const list = await repository.getFDRs({ institutionId: instId });
      // If list is small or empty, show all FDRs for richer demo feel
      const fullList = list.length > 0 ? list : await repository.getFDRs();
      setFdrs(fullList);
    }
    loadData();
  }, [currentUserInstitutionId, currentDateIso]);

  // Derived KPI counts
  const totalAmount = fdrs.reduce((acc, f) => acc + (f.status !== "RELEASED_CLOSED" ? f.amount : 0), 0);
  const bankConfirmedCount = fdrs.filter((f) => f.evidenceLevel === "L3").length;
  const discrepancyCount = fdrs.filter((f) => f.status === "DISCREPANCY_UNDER_REVIEW").length;
  const expiringCount = fdrs.filter((f) => {
    const days = getDaysUntilMaturity(f.maturityDate);
    return days >= 0 && days <= 60;
  }).length;
  const overdueCount = fdrs.filter((f) => {
    const days = getDaysUntilMaturity(f.maturityDate);
    return days < 0 && f.status !== "RELEASED_CLOSED" && f.status !== "RENEWED";
  }).length;

  const columns = [
    {
      header: "Evidence / Status",
      cell: (item: FDREntity) => (
        <div className="flex items-center gap-2">
          <StatusRing level={item.evidenceLevel} size="sm" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
            {item.evidenceLevel}
          </span>
        </div>
      ),
    },
    {
      header: "FDR Number & Bank",
      cell: (item: FDREntity) => (
        <div>
          <Link
            href={`/institution/fdr/${item.id}`}
            className="font-mono text-xs font-bold text-[#0C1411] hover:text-[#C4301C] transition-colors"
          >
            {item.fdrNumber}
          </Link>
          <div className="text-[10px] text-[#1A1F1B]/70 font-sans">{item.bankName}</div>
        </div>
      ),
    },
    {
      header: "Deposit Principal",
      align: "right" as const,
      cell: (item: FDREntity) => (
        <span className="font-mono font-bold text-xs text-[#0C1411]">
          ₹ {item.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Maturity Date & Schedule",
      cell: (item: FDREntity) => {
        const days = getDaysUntilMaturity(item.maturityDate);
        const isOverdue = days < 0 && item.status !== "RELEASED_CLOSED";
        const isExpiring = days >= 0 && days <= 30;

        return (
          <div>
            <div className="font-mono text-xs font-medium text-[#0C1411]">
              {item.maturityDate}
            </div>
            <div className="text-[10px] font-mono mt-0.5">
              {isOverdue ? (
                <span className="text-[#C4301C] font-bold">Overdue by {Math.abs(days)}d</span>
              ) : isExpiring ? (
                <span className="text-[#B5832A] font-bold">Matures in {days}d</span>
              ) : (
                <span className="text-[#1A1F1B]/60">{days}d remaining</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Risk & Flags",
      cell: (item: FDREntity) => (
        <RiskFlag level={item.riskLevel} factors={item.riskFactors} />
      ),
    },
    {
      header: "Action",
      align: "center" as const,
      cell: (item: FDREntity) => (
        <Link
          href={`/institution/fdr/${item.id}`}
          className="px-2.5 py-1 bg-[#EDE4CE] border border-[#0C1411]/40 font-mono text-[10px] uppercase font-bold text-[#0C1411] hover:bg-[#F2A900] transition-colors inline-flex items-center gap-1"
        >
          <span>Ledger Detail</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1F1B]/30 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#B5832A]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
                INSTITUTIONAL DEPOSIT REPOSITORY
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
              {institution ? institution.name : "Aryavarta Institute of Technology & Research"}
            </h1>
            <div className="font-mono text-xs text-[#1A1F1B]/70 mt-1">
              AICTE PERMANENT ID: {institution ? institution.aictePermanentId : "1-492817291"} · {institution?.state}, {institution?.district}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/institution/submit"
              className="px-4 py-2.5 bg-[#F2A900] text-[#0C1411] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-sm hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Submit New FDR</span>
            </Link>

            <Link
              href="/institution/release"
              className="px-4 py-2.5 bg-[#F6F0E0] border border-[#0C1411] text-[#0C1411] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#EDE4CE] transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Request Lien Release</span>
            </Link>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider">
              Total Active Security
            </div>
            <div className="font-mono text-2xl font-black text-[#0C1411] mt-1">
              ₹ {(totalAmount / 100000).toFixed(1)}L
            </div>
            <div className="text-[10px] text-[#1A1F1B]/70 font-mono mt-0.5">
              {fdrs.length} Instruments On Record
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#1E8A5A]" />
              <span>L3 Bank-Confirmed</span>
            </div>
            <div className="font-mono text-2xl font-black text-[#1E8A5A] mt-1">
              {bankConfirmedCount}
            </div>
            <div className="text-[10px] text-[#1E8A5A] font-mono mt-0.5">
              Direct SFMS Telemetry
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#C4301C]" />
              <span>Discrepancies</span>
            </div>
            <div className="font-mono text-2xl font-black text-[#C4301C] mt-1">
              {discrepancyCount}
            </div>
            <div className="text-[10px] text-[#C4301C] font-mono mt-0.5">
              Requires Urgent Review
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#B5832A]" />
              <span>Expiring Soon</span>
            </div>
            <div className="font-mono text-2xl font-black text-[#B5832A] mt-1">
              {expiringCount}
            </div>
            <div className="text-[10px] text-[#1A1F1B]/70 font-mono mt-0.5">
              Within 60-Day Window
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F0E0] border border-[#1A1F1B]/25 hard-shadow-sm">
            <div className="font-mono text-[10px] uppercase text-[#1A1F1B]/60 tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#C4301C]" />
              <span>Overdue</span>
            </div>
            <div className="font-mono text-2xl font-black text-[#C4301C] mt-1">
              {overdueCount}
            </div>
            <div className="text-[10px] text-[#C4301C] font-mono mt-0.5">
              Renewal Overdue
            </div>
          </div>
        </div>

        {/* Maturity Warning Alert Callout if any */}
        {(expiringCount > 0 || overdueCount > 0) && (
          <div className="p-4 bg-[#EDE4CE] border-l-4 border-[#C4301C] text-xs font-mono space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#C4301C] uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>STATUTORY MATURITY NOTICE · DEMO CLOCK TRIGGERED</span>
            </div>
            <p className="text-[#1A1F1B] font-sans">
              One or more security instruments have reached or are approaching their statutory maturity date.
              Per AICTE guidelines, institutions must submit renewed instruments with continued lien endorsement or apply for formal refund release.
            </p>
          </div>
        )}

        {/* Instruments Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              Fixed Deposit Receipts Ledger ({fdrs.length})
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono text-[#1A1F1B]/70">
              <span className="hidden sm:inline">Ruled Bahi-Khata View</span>
            </div>
          </div>

          <LedgerTable columns={columns} data={fdrs} />
        </div>
      </div>
    </AppShell>
  );
}
