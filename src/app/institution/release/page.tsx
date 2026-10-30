"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity, ReleaseRequest } from "@/lib/types";
import { ArrowRight, ShieldAlert } from "lucide-react";

export default function ReleaseRequestPage() {
  const [fdrs, setFdrs] = useState<FDREntity[]>([]);
  const [existingRequests, setExistingRequests] = useState<ReleaseRequest[]>([]);
  const [selectedFdrId, setSelectedFdrId] = useState("");
  const [reason, setReason] = useState<
    "COURSE_CLOSURE" | "INTAKE_REDUCTION" | "TENURE_COMPLETED_RENEWAL_WAIVED" | "TRUST_DISSOLUTION"
  >("TENURE_COMPLETED_RENEWAL_WAIVED");

  // Mandatory checklist items
  const [checklist, setChecklist] = useState([
    { item: "AICTE Regional Office Inspection Clearance Letter", status: "VERIFIED" as const, notes: "RO Inspection Certificate attached" },
    { item: "Trustees Board Resolution for Course Closure / Amalgamation", status: "VERIFIED" as const, notes: "Resolution #44 dated 20 Jul 2026" },
    { item: "No Dues & Salary Disbursement Certificate to Faculty/Staff", status: "VERIFIED" as const, notes: "Chartered Accountant certified" },
    { item: "Student Transfer & Degree Completion Compliance Report", status: "VERIFIED" as const, notes: "Affiliating University endorsement enclosed" },
    { item: "Lien-Release Consent Letter from Financing / Deposit Bank", status: "PENDING" as const, notes: "Bank branch manager signature in transit" },
  ]);

  useEffect(() => {
    async function loadData() {
      const all = await repository.getFDRs();
      setFdrs(all.filter((f) => f.status !== "RELEASED_CLOSED"));
      if (all.length > 0) setSelectedFdrId(all[0].id);

      const rels = await repository.getReleaseRequests();
      setExistingRequests(rels);
    }
    loadData();
  }, []);

  const selectedFdr = fdrs.find((f) => f.id === selectedFdrId);
  const pendingChecklistCount = checklist.filter((c) => c.status === "PENDING").length;

  const toggleChecklistItem = (idx: number) => {
    const updated = [...checklist];
    updated[idx].status = updated[idx].status === "VERIFIED" ? "PENDING" : "VERIFIED";
    setChecklist(updated);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFdr) return;

    await repository.createReleaseRequest({
      fdrId: selectedFdr.id,
      fdrNumber: selectedFdr.fdrNumber,
      institutionId: selectedFdr.institutionId,
      institutionName: selectedFdr.institutionName,
      amount: selectedFdr.amount,
      reason,
      requiredChecklist: checklist,
      stage: "SUBMITTED",
    });

    const rels = await repository.getReleaseRequests();
    setExistingRequests(rels);
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
            STATUTORY RELEASE &amp; REFUND PROTOCOL
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            REQUEST DEPOSIT LIEN RELEASE
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1">
            Mandatory maker-checker release workflow. Release requires documentary clearance across five statutory checkpoints.
          </p>
        </div>

        {/* Existing Requests Tracker */}
        {existingRequests.length > 0 && (
          <div className="p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
              Active Release Petitions ({existingRequests.length})
            </h2>

            <div className="space-y-3">
              {existingRequests.map((req) => (
                <div key={req.id} className="p-4 bg-white border border-[#0C1411] text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between border-b border-[#1A1F1B]/15 pb-1">
                    <span className="font-bold text-[#0C1411]">
                      {req.fdrNumber} · ₹ {req.amount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#B5832A] text-[#0C1411]">
                      STAGE: {req.stage.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 font-bold">
                    <div className="p-1 bg-[#1E8A5A] text-white">1. Submitted</div>
                    <div className={`p-1 ${req.stage === "SCRUTINY_REVIEW" || req.stage === "AUTHORITY_APPROVAL" || req.stage === "COMPLETED" ? "bg-[#1E8A5A] text-white" : "bg-[#EDE4CE] text-[#1A1F1B]/50"}`}>
                      2. Scrutiny Review
                    </div>
                    <div className={`p-1 ${req.stage === "AUTHORITY_APPROVAL" || req.stage === "COMPLETED" ? "bg-[#1E8A5A] text-white" : "bg-[#EDE4CE] text-[#1A1F1B]/50"}`}>
                      3. Authority Sanction
                    </div>
                    <div className={`p-1 ${req.stage === "COMPLETED" ? "bg-[#1E8A5A] text-white" : "bg-[#EDE4CE] text-[#1A1F1B]/50"}`}>
                      4. Lien Released
                    </div>
                  </div>

                  {req.scrutinyRecommendation && (
                    <div className="p-2 bg-[#EDE4CE] text-[11px] font-sans border-l-2 border-[#B5832A]">
                      <strong>Scrutiny Recommendation:</strong> {req.scrutinyNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Release Form */}
        <form onSubmit={handleSubmitRequest} className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
          <h2 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
            Initiate New Lien Revocation Petition
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Select Qualifying FDR Instrument:
              </label>
              <select
                value={selectedFdrId}
                onChange={(e) => setSelectedFdrId(e.target.value)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs text-[#0C1411]"
              >
                {fdrs.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fdrNumber} (₹ {f.amount.toLocaleString("en-IN")}) · {f.bankName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Statutory Grounds for Release:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as typeof reason)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs text-[#0C1411]"
              >
                <option value="TENURE_COMPLETED_RENEWAL_WAIVED">Tenure Completed (AICTE Waiver)</option>
                <option value="COURSE_CLOSURE">Program / Course Closure Approved</option>
                <option value="INTAKE_REDUCTION">Statutory Intake Reduction</option>
                <option value="TRUST_DISSOLUTION">Trust Amalgamation / Relocation</option>
              </select>
            </div>
          </div>

          {/* Statutory Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-1">
              <span className="font-mono text-xs font-bold uppercase text-[#0C1411]">
                Statutory Mandatory Checklist:
              </span>
              <span className={`font-mono text-xs font-bold ${pendingChecklistCount > 0 ? "text-[#C4301C]" : "text-[#1E8A5A]"}`}>
                {pendingChecklistCount === 0 ? "✓ ALL ATTESTATIONS COMPLETE" : `${pendingChecklistCount} PENDING ITEMS`}
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistItem(idx)}
                  className={`p-3 border cursor-pointer flex items-center justify-between transition-colors ${
                    item.status === "VERIFIED"
                      ? "bg-white border-[#1E8A5A]/50"
                      : "bg-[#C4301C]/10 border-[#C4301C]/50"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={item.status === "VERIFIED"}
                      readOnly
                      className="w-4 h-4 accent-[#0C1411]"
                    />
                    <div>
                      <div className="font-semibold text-[#0C1411]">{item.item}</div>
                      <div className="text-[10px] font-mono text-[#1A1F1B]/70">{item.notes}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                    item.status === "VERIFIED"
                      ? "bg-[#1E8A5A]/20 text-[#1E8A5A] border-[#1E8A5A]"
                      : "bg-[#C4301C]/20 text-[#C4301C] border-[#C4301C]"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Readiness Summary */}
          {pendingChecklistCount > 0 && (
            <div className="p-3 bg-[#C4301C]/10 border border-[#C4301C] text-xs font-mono text-[#C4301C] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                READINESS DEFICIENCY: Missing items must be satisfied before Approving Authority can sanction disbursement.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-widest hard-shadow-marigold hover:bg-[#17231E] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>SUBMIT PETITION TO SCRUTINY QUEUE</span>
            <ArrowRight className="w-4 h-4 text-[#F2A900]" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
