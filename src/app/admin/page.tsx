"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { SystemRulesConfig, UserRole } from "@/lib/types";
import { LedgerTable } from "@/components/ui/ledger-table";
import { Sliders, Plus, Trash2, Check } from "lucide-react";

interface AdminUserItem {
  name: string;
  role: UserRole;
  org: string;
  email: string;
  status: string;
}

export default function AdminConfigPage() {
  const [rules, setRules] = useState<SystemRulesConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  useEffect(() => {
    async function loadRules() {
      const conf = await repository.getSystemRules();
      setRules(conf);
    }
    loadRules();
  }, []);

  const usersList: AdminUserItem[] = [
    { name: "Dr. Suresh Chandra Trivedi", role: "INSTITUTION_ADMIN", org: "Aryavarta Institute of Technology", email: "registrar@aryavarta-tech.edu.in", status: "ACTIVE" },
    { name: "Prof. Anjali Deshmukh", role: "INSTITUTION_ADMIN", org: "Sahyadri Academy of Pharmacy", email: "accounts@sahyadri-pharma.ac.in", status: "ACTIVE" },
    { name: "R. K. Saxena", role: "AICTE_SCRUTINY_OFFICER", org: "AICTE Northern Regional Office", email: "rk.saxena@aicte-india.org", status: "ACTIVE" },
    { name: "P. V. Patil", role: "AICTE_SCRUTINY_OFFICER", org: "AICTE Western Regional Office", email: "pv.patil@aicte-india.org", status: "ACTIVE" },
    { name: "Dr. Anupam Shrivastava", role: "AICTE_APPROVING_AUTHORITY", org: "AICTE Headquarters, New Delhi", email: "dir.approvals@aicte-india.org", status: "ACTIVE" },
    { name: "S. K. Verma", role: "SYSTEM_ADMIN", org: "National Informatics / NIC AICTE", email: "sk.verma@nic.in", status: "ACTIVE" },
  ];

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rules) return;

    await repository.updateSystemRules(rules);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddChecklist = () => {
    if (!newChecklistItem.trim() || !rules) return;
    setRules({
      ...rules,
      requiredReleaseChecklist: [...rules.requiredReleaseChecklist, newChecklistItem.trim()],
    });
    setNewChecklistItem("");
  };

  const handleRemoveChecklist = (idx: number) => {
    if (!rules) return;
    const updated = [...rules.requiredReleaseChecklist];
    updated.splice(idx, 1);
    setRules({ ...rules, requiredReleaseChecklist: updated });
  };

  const userColumns = [
    {
      header: "Operator Name",
      accessorKey: "name" as const,
      cell: (item: AdminUserItem) => (
        <span className="font-mono text-xs font-bold text-[#0C1411]">{item.name}</span>
      ),
    },
    {
      header: "Assigned Statutory Role",
      cell: (item: AdminUserItem) => (
        <span className="font-mono text-[11px] uppercase font-bold text-[#B5832A]">
          {item.role.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Organization / Regional Node",
      accessorKey: "org" as const,
      cell: (item: AdminUserItem) => <div className="text-xs text-[#1A1F1B] font-sans">{item.org}</div>,
    },
    {
      header: "Official Email",
      accessorKey: "email" as const,
      cell: (item: AdminUserItem) => (
        <span className="font-mono text-xs text-[#1A1F1B]/80">{item.email}</span>
      ),
    },
    {
      header: "Status",
      align: "center" as const,
      cell: (item: AdminUserItem) => (
        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#1E8A5A]/20 text-[#1E8A5A] border border-[#1E8A5A]/40">
          {item.status}
        </span>
      ),
    },
  ];

  if (!rules) return null;

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#F2A900]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
              SYSTEM ADMINISTRATION &amp; GOVERNANCE
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            STATUTORY RULES &amp; ROLES
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1 max-w-3xl">
            Configure national surveillance warning windows, statutory release checklists, and review active operator permissions. All rule modifications generate hash-chained audit blocks.
          </p>
        </div>

        {/* Configurable Rules Form */}
        <form onSubmit={handleSaveRules} className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
                Configurable Surveillance Parameters (Sample Policy)
              </h2>
              <div className="font-mono text-xs text-[#1A1F1B]/60">
                Version: {rules.version} · Effective: {rules.effectiveDate}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-marigold hover:bg-[#17231E] flex items-center gap-2 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1E8A5A]" />
                  <span>Rules Saved</span>
                </>
              ) : (
                <span>Save Policy Version</span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Policy Document Identifier:
              </label>
              <input
                type="text"
                value={rules.version}
                onChange={(e) => setRules({ ...rules, version: e.target.value })}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs font-bold"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Policy Effective Date:
              </label>
              <input
                type="date"
                value={rules.effectiveDate}
                onChange={(e) => setRules({ ...rules, effectiveDate: e.target.value })}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Warning Windows (Days before maturity, comma-separated):
              </label>
              <input
                type="text"
                value={rules.warningWindows.join(", ")}
                onChange={(e) => {
                  const parsed = e.target.value
                    .split(",")
                    .map((s) => parseInt(s.trim()))
                    .filter((n) => !isNaN(n));
                  setRules({ ...rules, warningWindows: parsed });
                }}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs font-bold"
              />
              <span className="text-[10px] text-[#1A1F1B]/60 mt-0.5 block">
                Triggers notification in institution portal &amp; maturity calendar
              </span>
            </div>

            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Overdue Action Trigger Grace Period (Days):
              </label>
              <input
                type="number"
                value={rules.autoFlagOverdueDays}
                onChange={(e) => setRules({ ...rules, autoFlagOverdueDays: Number(e.target.value) })}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
              />
            </div>
          </div>

          {/* Statutory Release Checklist Configuration */}
          <div className="space-y-3 pt-3 border-t border-[#1A1F1B]/20">
            <label className="block font-mono text-xs font-bold uppercase text-[#0C1411]">
              Mandatory Release &amp; Refund Checklist Items:
            </label>

            <div className="space-y-2">
              {rules.requiredReleaseChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white border border-[#1A1F1B]/25 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0C1411]">#{idx + 1}</span>
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(idx)}
                    className="p-1 hover:text-[#C4301C] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add new required statutory clearance certificate..."
                className="flex-1 bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-4 py-2 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs uppercase font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </form>

        {/* Users & Roles Directory Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h3 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              Authorized Personas &amp; Directory ({usersList.length})
            </h3>
            <span className="font-mono text-xs text-[#1A1F1B]/70">
              Role-Based Access Control (RBAC)
            </span>
          </div>

          <LedgerTable columns={userColumns} data={usersList} />
        </div>
      </div>
    </AppShell>
  );
}
