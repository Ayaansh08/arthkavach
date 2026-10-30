"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity, AuditEvent } from "@/lib/types";
import { StatusRing } from "@/components/ui/status-ring";
import { Stamp, StampVariant } from "@/components/ui/stamp";
import { HashChip } from "@/components/ui/hash-chip";
import { RiskFlag } from "@/components/ui/risk-flag";
import { EvidenceCompare } from "@/components/ui/evidence-compare";
import { getDaysUntilMaturity } from "@/lib/store/demo-store";
import {
  FileText,
  Download,
  CheckCircle2,
} from "lucide-react";


function FDRDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [fdr, setFdr] = useState<FDREntity | null>(null);
  const [previousFdr, setPreviousFdr] = useState<FDREntity | null>(null);
  const [renewalFdr, setRenewalFdr] = useState<FDREntity | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "EVIDENCE" | "LIFECYCLE" | "DOCUMENTS" | "RENEWAL"
  >("OVERVIEW");
  const [loading, setLoading] = useState(true);

  // Link renewal input
  const [linkInputId, setLinkInputId] = useState("");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    async function loadFDR() {
      if (!id) return;
      setLoading(true);
      const found = await repository.getFDRById(id);
      setFdr(found);

      if (found) {
        if (found.previousFdrId) {
          const prev = await repository.getFDRById(found.previousFdrId);
          setPreviousFdr(prev);
        }
        if (found.renewalFdrId) {
          const ren = await repository.getFDRById(found.renewalFdrId);
          setRenewalFdr(ren);
        }
        const evts = await repository.getAuditEvents(found.fdrNumber);
        setAuditEvents(evts);
      }
      setLoading(false);
    }
    loadFDR();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-[#1A1F1B]/60">
        Loading Statutory Instrument Record...
      </div>
    );
  }

  if (!fdr) {
    return (
      <div className="p-8 text-center font-mono text-xs space-y-3">
        <p className="text-[#C4301C] font-bold">Instrument Record Not Found: {id}</p>
        <Link
          href="/institution/dashboard"
          className="px-4 py-2 bg-[#0C1411] text-[#E9E2CF] uppercase inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const daysUntil = getDaysUntilMaturity(fdr.maturityDate);
  const isOverdue = daysUntil < 0 && fdr.status !== "RELEASED_CLOSED";

  // Derive Stamp Variant
  let stampVariant: StampVariant = "AWAITING";
  if (fdr.status === "BANK_CONFIRMED") stampVariant = "CONFIRMED";
  else if (fdr.status === "DISCREPANCY_UNDER_REVIEW") stampVariant = "DISCREPANCY";
  else if (fdr.status === "MATURED_OVERDUE") stampVariant = "OVERDUE";
  else if (fdr.status === "RELEASED_CLOSED") stampVariant = "RELEASED";
  else if (fdr.evidenceLevel === "L2") stampVariant = "EVIDENCED";

  const handleLinkRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    const target = await repository.getFDRById(linkInputId.trim());
    if (!target) {
      setLinkError("FDR ID or number not found in system repository.");
      return;
    }
    await repository.updateFDR(fdr.id, { renewalFdrId: target.id });
    await repository.updateFDR(target.id, { previousFdrId: fdr.id });
    setRenewalFdr(target);
    setLinkInputId("");
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-[#0C1411] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <StatusRing level={fdr.evidenceLevel} size="md" showLabel />
              <span className="font-mono text-xs text-[#1A1F1B]/60">·</span>
              <span className="font-mono text-xs text-[#1A1F1B]/80 uppercase">
                {fdr.institutionName}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
              {fdr.fdrNumber}
            </h1>
            <div className="font-mono text-xs text-[#1A1F1B]/80 mt-1">
              {fdr.bankName} · {fdr.branchName} · IFSC: {fdr.ifscCode}
            </div>
          </div>

          {/* Rubber Stamp */}
          <div className="self-start md:self-auto">
            <Stamp
              variant={stampVariant}
              rotation={-6}
              size="md"
              subtext={
                fdr.bankVerification
                  ? `CONFIRMED ${new Date(fdr.bankVerification.verifiedAt).toLocaleDateString("en-IN")}`
                  : "DECISION SUPPORT ONLY"
              }
            />
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#1A1F1B]/60 uppercase">Deposit Principal</div>
            <div className="font-mono text-xl font-black text-[#0C1411]">
              ₹ {fdr.amount.toLocaleString("en-IN")}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#1A1F1B]/60 uppercase">Maturity Date</div>
            <div className="font-semibold text-[#0C1411] mt-0.5">
              {fdr.maturityDate}{" "}
              {isOverdue ? (
                <span className="text-[#C4301C] font-bold">({Math.abs(daysUntil)}d Overdue)</span>
              ) : (
                <span className="text-[#1E8A5A]">({daysUntil}d left)</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#1A1F1B]/60 uppercase">Lien Status to AICTE</div>
            <div className="font-semibold text-[#1E8A5A] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {fdr.lienMarkedToAicte ? "Marked & Endorsed" : "Not Marked"}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#1A1F1B]/60 uppercase">Explainable Risk</div>
            <div className="mt-0.5">
              <RiskFlag level={fdr.riskLevel} factors={fdr.riskFactors} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b-2 border-[#0C1411] flex flex-wrap gap-1 font-mono text-xs uppercase font-bold">
        {[
          { id: "OVERVIEW", label: "1. Overview & 3-Way Compare" },
          { id: "EVIDENCE", label: "2. Evidence & Verification" },
          { id: "LIFECYCLE", label: "3. Lifecycle Ledger" },
          { id: "DOCUMENTS", label: "4. Documents & Hash" },
          { id: "RENEWAL", label: "5. Renewal Chain" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "OVERVIEW" | "EVIDENCE" | "LIFECYCLE" | "DOCUMENTS" | "RENEWAL")}
            className={`px-4 py-2.5 transition-all border-t border-x cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#0C1411] text-[#E9E2CF] border-[#0C1411] hard-shadow-sm"
                : "bg-[#F6F0E0] text-[#1A1F1B]/80 border-[#1A1F1B]/25 hover:bg-[#EDE4CE]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          <div className="border border-[#1A1F1B]/25 bg-[#F6F0E0] p-4">
            <h3 className="font-display text-xl font-black uppercase text-[#0C1411] mb-2">
              3-Way Submitted vs OCR vs Bank Comparison
            </h3>
            <p className="font-sans text-xs text-[#1A1F1B]/80 mb-4 leading-relaxed">
              Separates what was self-reported from optical scanner findings and direct SFMS bank telemetry. Discrepancies are highlighted in Stamp Red.
            </p>
            <EvidenceCompare
              fields={fdr.fieldComparisons}
              bankVerification={fdr.bankVerification}
            />
          </div>

          {/* Observations History */}
          {fdr.observations.length > 0 && (
            <div className="p-4 bg-[#F6F0E0] border border-[#1A1F1B]/25 space-y-3">
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#0C1411]">
                Official Scrutiny Observations &amp; Directives:
              </h4>
              <div className="space-y-2">
                {fdr.observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3 bg-[#EDE4CE] border-l-4 border-[#0C1411] text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#1A1F1B]/60 mb-1">
                      <span className="font-bold text-[#0C1411]">{obs.authorName} ({obs.authorRole})</span>
                      <span>{new Date(obs.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="font-sans text-xs text-[#1A1F1B]">{obs.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EVIDENCE & VERIFICATION */}
      {activeTab === "EVIDENCE" && (
        <div className="p-6 bg-[#F6F0E0] border border-[#1A1F1B]/25 space-y-6">
          <h3 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
            Statutory Verification Ladder &amp; Proofs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 border border-[#8C9187] bg-white">
              <div className="flex items-center gap-2 mb-2">
                <StatusRing level="L1" size="sm" />
                <span className="font-bold text-[#8C9187]">01. Document-Screened</span>
              </div>
              <p className="text-[11px] font-sans text-[#1A1F1B]/80 mb-2">
                Completed on intake. PDF SHA-256 binary hash anchored; field positions extracted with OCR confidence.
              </p>
              <div className="text-[10px] text-[#1E8A5A] font-bold">✓ PASSED INTAKE SCREEN</div>
            </div>

            <div className="p-4 border border-[#B5832A] bg-white">
              <div className="flex items-center gap-2 mb-2">
                <StatusRing level="L2" size="sm" />
                <span className="font-bold text-[#B5832A]">02. Digitally Evidenced</span>
              </div>
              <p className="text-[11px] font-sans text-[#1A1F1B]/80 mb-2">
                Digital notary / eSign Class 3 certificate verified against Controller of Certifying Authorities (CCA).
              </p>
              <div className="text-[10px] font-bold">
                {fdr.evidenceLevel === "L2" || fdr.evidenceLevel === "L3" ? (
                  <span className="text-[#1E8A5A]">✓ DIGITAL SIGNATURE VERIFIED</span>
                ) : (
                  <span className="text-[#1A1F1B]/60">PENDING NOTARY ATTESTATION</span>
                )}
              </div>
            </div>

            <div className="p-4 border border-[#1E8A5A] bg-white">
              <div className="flex items-center gap-2 mb-2">
                <StatusRing level="L3" size="sm" />
                <span className="font-bold text-[#1E8A5A]">03. Bank-Confirmed</span>
              </div>
              <p className="text-[11px] font-sans text-[#1A1F1B]/80 mb-2">
                Direct SFMS telemetry from issuing financial institution treasury core confirming active deposit &amp; AICTE lien.
              </p>
              <div className="text-[10px] font-bold">
                {fdr.evidenceLevel === "L3" ? (
                  <span className="text-[#1E8A5A]">✓ SFMS MATCH CONFIRMED</span>
                ) : (
                  <span className="text-[#C4301C]">AWAITING BANK CONFIRMATION</span>
                )}
              </div>
            </div>
          </div>

          {/* Bank Telemetry Details */}
          {fdr.bankVerification && (
            <div className="p-4 bg-white border border-[#0C1411] font-mono text-xs space-y-2">
              <div className="font-bold text-[#0C1411] uppercase tracking-wider">
                Issuing Bank SFMS Telemetry Dossier:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-[#1A1F1B]/15">
                <div>
                  <span className="text-[10px] text-[#1A1F1B]/60 block">RESPONSE CODE:</span>
                  <span className="font-bold text-[#1E8A5A]">{fdr.bankVerification.rawResponseCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#1A1F1B]/60 block">REFERENCE NUMBER:</span>
                  <span>{fdr.bankVerification.referenceNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#1A1F1B]/60 block">TELEMETRY TIMESTAMP:</span>
                  <span>{new Date(fdr.bankVerification.verifiedAt).toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#1A1F1B]/60 block">CONFIRMED FIELDS:</span>
                  <span>{fdr.bankVerification.confirmedFields.join(", ") || "None"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIFECYCLE LEDGER */}
      {activeTab === "LIFECYCLE" && (
        <div className="p-6 bg-[#F6F0E0] border border-[#1A1F1B]/25 space-y-4">
          <h3 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
            Instrument Event Audit History ({auditEvents.length})
          </h3>
          <div className="space-y-3">
            {auditEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 bg-[#EDE4CE] border border-[#1A1F1B]/20 text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between border-b border-[#1A1F1B]/15 pb-1">
                  <span className="font-bold text-[#0C1411] uppercase">
                    #{evt.sequence.toString().padStart(3, "0")} · {evt.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-[#1A1F1B]/60">
                    {new Date(evt.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#1A1F1B]">{evt.details}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-[#1A1F1B]/70">
                  <span>Actor: {evt.actor.name} ({evt.actor.role})</span>
                  <HashChip hash={evt.currentHash} prefix="BLOCK" truncateLength={6} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTS */}
      {activeTab === "DOCUMENTS" && (
        <div className="p-6 bg-[#F6F0E0] border border-[#1A1F1B]/25 space-y-6">
          <h3 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
            Attached Physical Documents &amp; Cryptographic Hashes
          </h3>

          <div className="space-y-4">
            {fdr.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white border border-[#0C1411] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0C1411]" />
                    <span className="font-bold text-[#0C1411]">{doc.fileName}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#EDE4CE] border">
                      {doc.docType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#1A1F1B]/70 mt-1">
                    Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString("en-IN")} · {(doc.fileSize / 1024).toFixed(0)} KB
                  </div>
                  <div className="mt-2">
                    <HashChip hash={doc.sha256Hash} prefix="PAYLOAD SHA-256" truncateLength={14} />
                  </div>
                </div>

                <button
                  onClick={() => alert(`Simulated document download initiated for ${doc.fileName} with verified cryptographic checksum.`)}
                  className="px-3 py-1.5 bg-[#EDE4CE] border border-[#0C1411] hover:bg-[#F2A900] text-[#0C1411] font-bold text-xs uppercase flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Scan</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RENEWAL & REPLACEMENT CHAIN */}
      {activeTab === "RENEWAL" && (
        <div className="p-6 bg-[#F6F0E0] border border-[#1A1F1B]/25 space-y-6">
          <div className="border-b border-[#1A1F1B]/20 pb-2">
            <h3 className="font-display text-2xl font-black uppercase text-[#0C1411]">
              Statutory Renewal &amp; Replacement Chain
            </h3>
            <p className="font-sans text-xs text-[#1A1F1B]/80 mt-0.5">
              Tracks the perpetual lien continuity across successive 3-year or 5-year fixed deposit tenures.
            </p>
          </div>

          {/* Visual Chain Progression */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Predecessor FDR Card */}
            <div className="p-4 border-2 border-[#1A1F1B]/30 bg-white">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#1A1F1B]/60 mb-1">
                PREDECESSOR INSTRUMENT
              </div>
              {previousFdr ? (
                <div>
                  <Link
                    href={`/institution/fdr/${previousFdr.id}`}
                    className="font-mono text-sm font-bold text-[#0C1411] hover:text-[#C4301C]"
                  >
                    {previousFdr.fdrNumber}
                  </Link>
                  <div className="font-mono text-xs text-[#1A1F1B]/80 mt-1">
                    ₹ {previousFdr.amount.toLocaleString("en-IN")} · Matured: {previousFdr.maturityDate}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-[#1E8A5A] font-bold">
                    ✓ CONTINUITY ANCHORED
                  </div>
                </div>
              ) : (
                <div className="font-mono text-xs text-[#1A1F1B]/60 italic">
                  Original Genesis Deposit (No prior predecessor instrument linked).
                </div>
              )}
            </div>

            {/* Renewal Linked Instrument */}
            <div className="p-4 border-2 border-[#0C1411] bg-[#EDE4CE]">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#0C1411] font-bold mb-1">
                SUBSEQUENT RENEWAL INSTRUMENT
              </div>
              {renewalFdr ? (
                <div>
                  <Link
                    href={`/institution/fdr/${renewalFdr.id}`}
                    className="font-mono text-sm font-bold text-[#0C1411] hover:text-[#C4301C]"
                  >
                    {renewalFdr.fdrNumber}
                  </Link>
                  <div className="font-mono text-xs text-[#0C1411] mt-1">
                    ₹ {renewalFdr.amount.toLocaleString("en-IN")} · Matures: {renewalFdr.maturityDate}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-[#1E8A5A] font-bold">
                    ✓ LIEN CARRIED FORWARD
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLinkRenewal} className="space-y-2">
                  <p className="text-xs font-sans text-[#1A1F1B]/80">
                    Link a newly issued FDR as the successor instrument for this deposit:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={linkInputId}
                      onChange={(e) => setLinkInputId(e.target.value)}
                      placeholder="e.g. fdr-005-new or FDR No."
                      className="flex-1 bg-white border border-[#0C1411] p-1.5 font-mono text-xs"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs uppercase font-bold"
                    >
                      Link Chain
                    </button>
                  </div>
                  {linkError && (
                    <p className="text-[10px] font-mono text-[#C4301C]">{linkError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FDRDetailPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="font-mono text-xs p-8">Loading Statutory Instrument...</div>}>
        <FDRDetailContent />
      </Suspense>
    </AppShell>
  );
}
