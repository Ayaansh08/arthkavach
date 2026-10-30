"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { Institution } from "@/lib/types";
import { LedgerTable } from "@/components/ui/ledger-table";
import { Building2, BarChart3 } from "lucide-react";

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);

  useEffect(() => {
    async function loadData() {
      const list = await repository.getInstitutions();
      setInstitutions(list);
      if (list.length > 0) {
        setSelectedInst(list[0]);
      }
    }
    loadData();
  }, []);

  const handleSelectInstitution = (inst: Institution) => {
    setSelectedInst(inst);
  };

  const columns = [
    {
      header: "AICTE Permanent ID",
      accessorKey: "aictePermanentId" as const,
      cell: (item: Institution) => (
        <span className="font-mono text-xs font-bold text-[#0C1411]">
          {item.aictePermanentId}
        </span>
      ),
    },
    {
      header: "Institution Name",
      cell: (item: Institution) => (
        <div>
          <div className="font-sans font-semibold text-xs text-[#0C1411]">{item.name}</div>
          <div className="font-mono text-[10px] text-[#1A1F1B]/60 uppercase">
            {item.state} · {item.category}
          </div>
        </div>
      ),
    },
    {
      header: "Total FDRs",
      accessorKey: "totalFdrCount" as const,
      align: "center" as const,
      cell: (item: Institution) => (
        <span className="font-mono text-xs">{item.totalFdrCount}</span>
      ),
    },
    {
      header: "Total Deposit Principal",
      align: "right" as const,
      cell: (item: Institution) => (
        <span className="font-mono font-bold text-xs text-[#0C1411]">
          ₹ {(item.totalDepositAmount / 100000).toFixed(1)} Lakhs
        </span>
      ),
    },
    {
      header: "IFAS Indicator",
      align: "center" as const,
      cell: (item: Institution) => {
        const score = item.ifasScore.overall;
        const color =
          score >= 85 ? "text-[#1E8A5A]" : score >= 70 ? "text-[#B5832A]" : "text-[#C4301C]";
        return (
          <span className={`font-mono text-xs font-black ${color}`}>
            {score} / 100
          </span>
        );
      },
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#F2A900]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
              TECHNICAL EDUCATION DIRECTORY &amp; ASSURANCE
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            INSTITUTIONS &amp; IFAS DASHBOARD
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1 max-w-3xl">
            Directory of approved institutions with transparent IFAS mathematical formula inputs. Labelled strictly as an internal monitoring indicator, not an official rating.
          </p>
        </div>

        {/* Selected Institution Detail & IFAS Panel */}
        {selectedInst && (
          <div className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between border-b-2 border-[#0C1411] pb-4 gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#0C1411] text-[#E9E2CF] font-bold">
                  {selectedInst.category}
                </span>
                <h2 className="font-display text-2xl md:text-4xl font-black uppercase text-[#0C1411] tracking-tight mt-2">
                  {selectedInst.name}
                </h2>
                <div className="font-mono text-xs text-[#1A1F1B]/80 mt-1">
                  PID: {selectedInst.aictePermanentId} · {selectedInst.district}, {selectedInst.state}
                </div>
              </div>

              {/* Overall IFAS Badge */}
              <div className="p-4 bg-[#EDE4CE] border-2 border-[#0C1411] text-center hard-shadow-sm min-w-[160px]">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#1A1F1B]/70 font-bold">
                  OVERALL IFAS
                </div>
                <div className="font-mono text-4xl font-black text-[#0C1411] mt-0.5">
                  {selectedInst.ifasScore.overall}
                  <span className="text-base text-[#1A1F1B]/60 font-normal">/100</span>
                </div>
                <div className="text-[8.5px] font-mono text-[#1A1F1B]/70 uppercase tracking-wider mt-1">
                  INTERNAL MONITORING AID
                </div>
              </div>
            </div>

            {/* Transparent IFAS Formula Card */}
            <div className="p-4 bg-white border border-[#0C1411] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A1F1B]/15 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0C1411]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#0C1411]">
                    Transparent IFAS Formula Breakdown
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#C4301C] uppercase font-bold">
                  * Prioritization aid; not a credit rating
                </span>
              </div>

              <div className="font-mono text-xs p-2.5 bg-[#EDE4CE] text-[#0C1411] font-semibold border-l-3 border-[#0C1411]">
                Formula: {selectedInst.ifasScore.formulaExplanation}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs pt-1">
                <div className="p-2.5 border border-[#1A1F1B]/20 bg-[#F6F0E0]">
                  <div className="text-[10px] text-[#1A1F1B]/60 uppercase">1. Timely Renewal (35%)</div>
                  <div className="text-lg font-black text-[#0C1411] mt-0.5">
                    {selectedInst.ifasScore.timelyRenewalScore}%
                  </div>
                  <div className="text-[9px] text-[#1A1F1B]/70">Zero overdue lapses</div>
                </div>

                <div className="p-2.5 border border-[#1A1F1B]/20 bg-[#F6F0E0]">
                  <div className="text-[10px] text-[#1A1F1B]/60 uppercase">2. Evidence Quality (25%)</div>
                  <div className="text-lg font-black text-[#0C1411] mt-0.5">
                    {selectedInst.ifasScore.evidenceQualityScore}%
                  </div>
                  <div className="text-[9px] text-[#1E8A5A]">L3 Confirmed ratio</div>
                </div>

                <div className="p-2.5 border border-[#1A1F1B]/20 bg-[#F6F0E0]">
                  <div className="text-[10px] text-[#1A1F1B]/60 uppercase">3. Low Mismatch (25%)</div>
                  <div className="text-lg font-black text-[#0C1411] mt-0.5">
                    {selectedInst.ifasScore.mismatchIncidentScore}%
                  </div>
                  <div className="text-[9px] text-[#1A1F1B]/70">No OCR/bank divergence</div>
                </div>

                <div className="p-2.5 border border-[#1A1F1B]/20 bg-[#F6F0E0]">
                  <div className="text-[10px] text-[#1A1F1B]/60 uppercase">4. Bank Diversity (15%)</div>
                  <div className="text-lg font-black text-[#0C1411] mt-0.5">
                    {selectedInst.ifasScore.bankDiversityScore}%
                  </div>
                  <div className="text-[9px] text-[#1A1F1B]/70">Spread across scheduled banks</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Directory Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h3 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              Registered Technical Institutions ({institutions.length})
            </h3>
            <span className="font-mono text-xs text-[#1A1F1B]/70">
              Click any row to inspect IFAS inputs &amp; active deposits
            </span>
          </div>

          <LedgerTable
            columns={columns}
            data={institutions}
            onRowClick={(inst) => handleSelectInstitution(inst)}
          />
        </div>
      </div>
    </AppShell>
  );
}
