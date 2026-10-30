"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity, Institution } from "@/lib/types";
import { LedgerTable } from "@/components/ui/ledger-table";
import { StatusRing } from "@/components/ui/status-ring";
import { Download, Filter, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
  const [fdrs, setFdrs] = useState<FDREntity[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  // Filter States
  const [selectedInstId, setSelectedInstId] = useState("ALL");
  const [selectedBank, setSelectedBank] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [amountBand, setAmountBand] = useState("ALL");
  const [reportType, setReportType] = useState<"ALL" | "PENDING" | "EXPIRING" | "DISCREPANCY">("ALL");

  useEffect(() => {
    async function loadData() {
      const all = await repository.getFDRs();
      const insts = await repository.getInstitutions();
      setFdrs(all);
      setInstitutions(insts);
    }
    loadData();
  }, []);

  // Filter pipeline
  let filtered = [...fdrs];

  if (reportType === "PENDING") {
    filtered = filtered.filter((f) => f.status === "AWAITING_CONFIRMATION" || f.status === "DOCUMENT_SCREENED");
  } else if (reportType === "EXPIRING") {
    filtered = filtered.filter((f) => f.status === "EXPIRING_SOON" || f.status === "MATURED_OVERDUE");
  } else if (reportType === "DISCREPANCY") {
    filtered = filtered.filter((f) => f.status === "DISCREPANCY_UNDER_REVIEW");
  }

  if (selectedInstId !== "ALL") {
    filtered = filtered.filter((f) => f.institutionId === selectedInstId);
  }
  if (selectedBank !== "ALL") {
    filtered = filtered.filter((f) => f.bankName === selectedBank);
  }
  if (selectedStatus !== "ALL") {
    filtered = filtered.filter((f) => f.status === selectedStatus);
  }
  if (amountBand === "UNDER_25L") {
    filtered = filtered.filter((f) => f.amount < 2500000);
  } else if (amountBand === "25L_TO_50L") {
    filtered = filtered.filter((f) => f.amount >= 2500000 && f.amount <= 5000000);
  } else if (amountBand === "OVER_50L") {
    filtered = filtered.filter((f) => f.amount > 5000000);
  }

  // Unique bank list
  const banks = Array.from(new Set(fdrs.map((f) => f.bankName)));

  // Real CSV Export
  const handleExportCsv = () => {
    const headers = [
      "FDR Number",
      "Institution Name",
      "Issuing Bank",
      "Branch",
      "IFSC Code",
      "Principal Amount (INR)",
      "Deposit Date",
      "Maturity Date",
      "Evidence Level",
      "Status",
      "Risk Level",
    ];

    const rows = filtered.map((f) => [
      `"${f.fdrNumber}"`,
      `"${f.institutionName}"`,
      `"${f.bankName}"`,
      `"${f.branchName}"`,
      `"${f.ifscCode}"`,
      f.amount,
      `"${f.depositDate}"`,
      `"${f.maturityDate}"`,
      `"${f.evidenceLevel}"`,
      `"${f.status}"`,
      `"${f.riskLevel}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ARTHKAVACH_Audit_Report_${reportType}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: "Level / Status",
      cell: (item: FDREntity) => (
        <div className="flex items-center gap-1.5">
          <StatusRing level={item.evidenceLevel} size="sm" />
          <span className="font-mono text-[10px] font-bold uppercase">
            {item.status.replace(/_/g, " ")}
          </span>
        </div>
      ),
    },
    {
      header: "FDR Number",
      accessorKey: "fdrNumber" as const,
      cell: (item: FDREntity) => (
        <span className="font-mono text-xs font-bold text-[#0C1411]">
          {item.fdrNumber}
        </span>
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
      header: "Issuing Bank",
      cell: (item: FDREntity) => (
        <div className="text-xs text-[#1A1F1B]/80 font-sans">{item.bankName}</div>
      ),
    },
    {
      header: "Amount (INR)",
      align: "right" as const,
      cell: (item: FDREntity) => (
        <span className="font-mono font-bold text-xs text-[#0C1411]">
          ₹ {item.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Maturity Date",
      accessorKey: "maturityDate" as const,
      cell: (item: FDREntity) => (
        <span className="font-mono text-xs">{item.maturityDate}</span>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#1A1F1B]/30 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#F2A900]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
                DATA EXTRACTION &amp; REPORTING CELL
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
              STATUTORY REPORTS &amp; EXPORT
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1">
              Multi-dimensional filter matrix across banking issuers, statutory statuses, and maturity windows.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-5 py-2.5 bg-[#1E8A5A] text-white font-mono text-xs font-bold uppercase tracking-wider hard-shadow-sm hover:opacity-95 transition-opacity flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset ({filtered.length})</span>
          </button>
        </div>

        {/* Quick Report Type Filter Strip */}
        <div className="flex flex-wrap gap-2 font-mono text-xs uppercase font-bold">
          {[
            { id: "ALL", label: "All Instruments" },
            { id: "PENDING", label: "Pending Verification" },
            { id: "EXPIRING", label: "Expiring & Overdue" },
            { id: "DISCREPANCY", label: "Flagged Discrepancies" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id as "ALL" | "PENDING" | "EXPIRING" | "DISCREPANCY")}
              className={`px-4 py-2 border transition-all ${
                reportType === t.id
                  ? "bg-[#0C1411] text-[#E9E2CF] border-[#0C1411] hard-shadow-sm"
                  : "bg-[#F6F0E0] text-[#1A1F1B]/70 border-[#1A1F1B]/20 hover:bg-[#EDE4CE]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Comprehensive Filters Bar */}
        <div className="p-4 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#0C1411] font-bold uppercase">
            <Filter className="w-3.5 h-3.5" />
            <span>Granular Filter Matrix:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#1A1F1B]/60 mb-1">
                Institution:
              </label>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-1.5 text-xs"
              >
                <option value="ALL">All Technical Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#1A1F1B]/60 mb-1">
                Issuing Bank:
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-1.5 text-xs"
              >
                <option value="ALL">All Banking Institutions</option>
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#1A1F1B]/60 mb-1">
                Statutory Status:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-1.5 text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="BANK_CONFIRMED">Bank Confirmed (L3)</option>
                <option value="DIGITALLY_EVIDENCED">Digitally Evidenced (L2)</option>
                <option value="DOCUMENT_SCREENED">Document Screened (L1)</option>
                <option value="DISCREPANCY_UNDER_REVIEW">Discrepancy Under Review</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="MATURED_OVERDUE">Matured Overdue</option>
                <option value="RELEASE_REQUESTED">Release Requested</option>
                <option value="RELEASED_CLOSED">Released / Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#1A1F1B]/60 mb-1">
                Principal Amount Band:
              </label>
              <select
                value={amountBand}
                onChange={(e) => setAmountBand(e.target.value)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-1.5 text-xs"
              >
                <option value="ALL">All Amount Bands</option>
                <option value="UNDER_25L">Under ₹ 25 Lakhs</option>
                <option value="25L_TO_50L">₹ 25 Lakhs to ₹ 50 Lakhs</option>
                <option value="OVER_50L">Above ₹ 50 Lakhs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h3 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              Filtered Result Set ({filtered.length})
            </h3>
            <span className="font-mono text-xs text-[#1A1F1B]/70">
              CSV Ready · Tabular Numerals
            </span>
          </div>

          <LedgerTable columns={columns} data={filtered} />
        </div>
      </div>
    </AppShell>
  );
}
