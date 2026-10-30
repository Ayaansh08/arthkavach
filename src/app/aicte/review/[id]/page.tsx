"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity } from "@/lib/types";
import { useDemoStore } from "@/lib/store/demo-store";
import { StatusRing } from "@/components/ui/status-ring";
import { RiskFlag } from "@/components/ui/risk-flag";
import { EvidenceCompare } from "@/components/ui/evidence-compare";
import {
  ShieldAlert,
  Send,
  ArrowLeft,
  Zap,
} from "lucide-react";


function CaseReviewContent() {
  const params = useParams();
  const id = params?.id as string;
  const { currentUserRole, currentUserName } = useDemoStore();

  const [fdr, setFdr] = useState<FDREntity | null>(null);
  const [loading, setLoading] = useState(true);

  // Observation form state
  const [observationText, setObservationText] = useState("");
  const [observationType, setObservationType] = useState<
    "OBSERVATION" | "CLARIFICATION_REQUEST" | "RECOMMENDATION" | "DECISION"
  >("OBSERVATION");

  // Bank telemetry simulation control state
  const [isQueryingBank, setIsQueryingBank] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<
    "MATCH" | "MISMATCH" | "PENDING" | "UNAVAILABLE"
  >("MATCH");

  // Reviewer override modal state
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideLevel, setOverrideLevel] = useState<"L1" | "L2" | "L3">("L2");
  const [overrideReason, setOverrideReason] = useState("");

  useEffect(() => {
    async function loadFDR() {
      if (!id) return;
      setLoading(true);
      const found = await repository.getFDRById(id);
      setFdr(found);
      setLoading(false);
    }
    loadFDR();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-[#1A1F1B]/60">
        Loading Case Review Dossier...
      </div>
    );
  }

  if (!fdr) {
    return (
      <div className="p-8 text-center font-mono text-xs space-y-3">
        <p className="text-[#C4301C] font-bold">Instrument Dossier Not Found: {id}</p>
        <Link
          href="/aicte/overview"
          className="px-4 py-2 bg-[#0C1411] text-[#E9E2CF] uppercase inline-block"
        >
          Back to Overview
        </Link>
      </div>
    );
  }

  // Handle adding observation / clarification request
  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;

    const newObs = {
      id: `obs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      authorRole: currentUserRole,
      authorName: currentUserName,
      text: observationText,
      type: observationType,
    };

    const updated = await repository.updateFDR(fdr.id, {
      observations: [newObs, ...fdr.observations],
      status: observationType === "CLARIFICATION_REQUEST" ? "DISCREPANCY_UNDER_REVIEW" : fdr.status,
    });

    await repository.addAuditEvent({
      actor: { name: currentUserName, role: currentUserRole },
      action: observationType === "CLARIFICATION_REQUEST" ? "CLARIFICATION_DISPATCHED" : "OFFICER_OBSERVATION_RECORDED",
      entityType: "FDR",
      entityId: fdr.id,
      fdrNumber: fdr.fdrNumber,
      evidenceRef: `OBS:${newObs.id}`,
      details: `${currentUserName} recorded ${observationType}: ${observationText}`,
    });

    setFdr(updated);
    setObservationText("");
  };

  // Trigger live bank verification simulation
  const handleTriggerBankVerify = async () => {
    setIsQueryingBank(true);
    setTimeout(async () => {
      await repository.simulateBankVerification(fdr.id, selectedOutcome);
      const reloaded = await repository.getFDRById(fdr.id);
      setFdr(reloaded);
      setIsQueryingBank(false);
    }, 850);
  };

  // Reviewer Override Handler
  const handleReviewerOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;

    const updated = await repository.updateFDR(fdr.id, {
      evidenceLevel: overrideLevel,
      status: overrideLevel === "L3" ? "BANK_CONFIRMED" : fdr.status,
      observations: [
        {
          id: `obs-ovr-${Date.now()}`,
          createdAt: new Date().toISOString(),
          authorRole: currentUserRole,
          authorName: currentUserName,
          text: `STATUTORY OVERRIDE TO ${overrideLevel}: ${overrideReason}`,
          type: "DECISION",
        },
        ...fdr.observations,
      ],
    });

    await repository.addAuditEvent({
      actor: { name: currentUserName, role: currentUserRole },
      action: "REVIEWER_STATUTORY_OVERRIDE",
      entityType: "FDR",
      entityId: fdr.id,
      fdrNumber: fdr.fdrNumber,
      evidenceRef: `OVR:${overrideLevel}`,
      details: `Manual status elevation to ${overrideLevel} sanctioned by ${currentUserName}. Reason: ${overrideReason}`,
    });

    setFdr(updated);
    setIsOverrideOpen(false);
    setOverrideReason("");
  };

  return (
    <div className="space-y-8">
      {/* Header Strip with Back Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-[#1A1F1B]/30 pb-4 gap-4">
        <div>
          <Link
            href="/aicte/overview"
            className="font-mono text-xs text-[#0C1411] hover:text-[#C4301C] inline-flex items-center gap-1 mb-1 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Attention Queue</span>
          </Link>
          <div className="flex items-center gap-2">
            <StatusRing level={fdr.evidenceLevel} size="md" showLabel />
            <span className="font-mono text-xs text-[#1A1F1B]/60">·</span>
            <span className="font-mono text-xs text-[#1A1F1B]/80 font-bold uppercase">
              {fdr.institutionName}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            CASE REVIEW: {fdr.fdrNumber}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <RiskFlag level={fdr.riskLevel} factors={fdr.riskFactors} />
          <button
            onClick={() => setIsOverrideOpen(true)}
            className="px-3 py-1.5 bg-[#EDE4CE] border border-[#0C1411] font-mono text-xs uppercase font-bold text-[#0C1411] hover:bg-[#F2A900] transition-colors"
          >
            Reviewer Override
          </button>
        </div>
      </div>

      {/* Override Modal */}
      {isOverrideOpen && (
        <div className="p-6 bg-white border-2 border-[#C4301C] hard-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-[#0C1411] pb-2">
            <div className="flex items-center gap-2 text-[#C4301C]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-display text-xl font-black uppercase">
                Reviewer Override Protocol
              </h3>
            </div>
            <button
              onClick={() => setIsOverrideOpen(false)}
              className="font-mono text-xs hover:text-[#C4301C]"
            >
              ✕ Close
            </button>
          </div>
          <p className="font-sans text-xs text-[#1A1F1B]">
            Per AICTE truthfulness regulations, any manual elevation requires an explicit statutory justification that is permanently linked to the immutable SHA-256 audit chain.
          </p>
          <form onSubmit={handleReviewerOverride} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Target Statutory Evidence Level:
              </label>
              <select
                value={overrideLevel}
                onChange={(e) => setOverrideLevel(e.target.value as "L1" | "L2" | "L3")}
                className="w-full bg-[#EDE4CE] p-2 border border-[#0C1411]"
              >
                <option value="L1">L1 Document-Screened</option>
                <option value="L2">L2 Digitally Evidenced</option>
                <option value="L3">L3 Bank-Confirmed (Physical Notarized Branch Attestation)</option>
              </select>
            </div>
            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Mandatory Statutory Justification (Recorded in Audit Trail):
              </label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Received hard-copy branch manager affidavit via registered speed post under seal..."
                className="w-full bg-white p-2 border border-[#0C1411] font-sans text-xs"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOverrideOpen(false)}
                className="px-3 py-1.5 bg-[#EDE4CE] border border-[#0C1411] uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#C4301C] text-white font-bold uppercase hard-shadow-sm"
              >
                Commit Override To Audit Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3-Way Field Comparison Section */}
      <div className="p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
          <div>
            <h3 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              Side-by-Side Evidence Cross-Examination
            </h3>
            <div className="font-mono text-xs text-[#1A1F1B]/70">
              Self-Reported Data vs OCR Scan Machine Read vs Direct Issuing Bank Telemetry
            </div>
          </div>
        </div>
        <EvidenceCompare
          fields={fdr.fieldComparisons}
          bankVerification={fdr.bankVerification}
        />
      </div>

      {/* Interactive Mock Bank Telemetry Trigger */}
      <div className="p-6 bg-[#0C1411] text-[#E9E2CF] border-2 border-[#0C1411] hard-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9E2CF]/20 pb-3 gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#F2A900] font-bold">
              SIMULATED INTER-BANK TELEMETRY SWITCH
            </span>
            <h3 className="font-display text-2xl font-black uppercase text-[#E9E2CF]">
              Trigger Bank SFMS Verification
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#E9E2CF]/60 uppercase">
            DEMO SIMULATION CONTROL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs items-center">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase text-[#E9E2CF]/70 mb-1">
              Select Simulated SFMS Gateway Outcome to test:
            </label>
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value as "MATCH" | "MISMATCH" | "PENDING" | "UNAVAILABLE")}
              className="w-full bg-[#17231E] border border-[#E9E2CF]/30 text-[#E9E2CF] p-2 text-xs"
            >
              <option value="MATCH">MATCH: SFMS Telemetry matches 100% (Promotes to L3 Bank-Confirmed)</option>
              <option value="MISMATCH">MISMATCH: Issuing Bank reports amount discrepancy (Flags Critical Discrepancy)</option>
              <option value="UNAVAILABLE">UNAVAILABLE: Issuing Bank gateway offline (Never upgrades to verified)</option>
              <option value="PENDING">PENDING: Transmission queued in settlement batch</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#E9E2CF]/70 mb-1 opacity-0">Action</label>
            <button
              type="button"
              onClick={handleTriggerBankVerify}
              disabled={isQueryingBank}
              className="w-full py-2.5 bg-[#F2A900] text-[#0C1411] font-bold uppercase tracking-wider hard-shadow-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isQueryingBank ? "QUERYING GATEWAY..." : "EXECUTE SFMS PING"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Maker-Checker Workflow Action: Observations & Clarifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Scrutiny Directives Form */}
        <div className="lg:col-span-7 p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
            <h3 className="font-display text-xl font-black uppercase text-[#0C1411]">
              Maker-Checker Regulatory Directives
            </h3>
            <span className="font-mono text-xs text-[#0C1411] font-bold">
              ROLE: {currentUserRole.replace(/_/g, " ")}
            </span>
          </div>

          <form onSubmit={handleAddObservation} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Directive Classification:
              </label>
              <select
                value={observationType}
                onChange={(e) => setObservationType(e.target.value as "OBSERVATION" | "CLARIFICATION_REQUEST" | "RECOMMENDATION" | "DECISION")}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2"
              >
                <option value="OBSERVATION">Standard Officer Observation</option>
                <option value="CLARIFICATION_REQUEST">Seek Institutional Clarification (Discrepancy)</option>
                <option value="RECOMMENDATION">Maker Recommendation (To Approving Authority)</option>
                <option value="DECISION">Checker Final Sanction Decision (Authority Only)</option>
              </select>
            </div>

            <div>
              <label className="block uppercase font-bold text-[#0C1411] mb-1">
                Official Directive Notes / Observations:
              </label>
              <textarea
                rows={4}
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Record formal scrutiny notes, findings, or required evidence clarifications..."
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-sans text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-marigold flex items-center justify-center gap-2 hover:bg-[#17231E] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#F2A900]" />
              <span>Record Directive to Dossier</span>
            </button>
          </form>
        </div>

        {/* Right 5 cols: Observations Timeline */}
        <div className="lg:col-span-5 p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-3">
          <h3 className="font-display text-xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
            Dossier History ({fdr.observations.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {fdr.observations.map((obs) => (
              <div
                key={obs.id}
                className="p-3 bg-[#EDE4CE] border-l-4 border-[#0C1411] text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-[#1A1F1B]/60">
                  <span className="font-bold text-[#0C1411]">{obs.authorName}</span>
                  <span>{new Date(obs.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="font-bold text-[10px] uppercase text-[#B5832A]">
                  {obs.type}
                </div>
                <p className="font-sans text-xs text-[#1A1F1B] leading-relaxed">
                  {obs.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AicteCaseReviewPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="font-mono text-xs p-8">Loading Case Dossier...</div>}>
        <CaseReviewContent />
      </Suspense>
    </AppShell>
  );
}
