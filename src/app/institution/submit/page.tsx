"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { hashFile } from "@/lib/data/crypto";
import { FDRFieldComparison, FDREntity } from "@/lib/types";
import { useDemoStore } from "@/lib/store/demo-store";
import { HashChip } from "@/components/ui/hash-chip";
import { StatusRing } from "@/components/ui/status-ring";
import {
  Upload,
  Check,
  ScanLine,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function SubmitFdrPage() {
  const router = useRouter();
  const { currentUserName } = useDemoStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    fdrNumber: "FDR-2026-BN-881920",
    bankName: "Bharat National Mercantile Bank",
    branchName: "Civil Lines Branch, Kanpur",
    ifscCode: "BNMB0001099",
    amount: "2500000",
    depositDate: "2026-10-15",
    maturityDate: "2029-10-15",
    tenureMonths: 36,
    interestRate: 7.25,
    jointHolders: "Regional Officer, AICTE & Member Secretary, Trust",
    lienMarkedToAicte: true,
    autoRenew: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // File & Cryptographic Hash State
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>("");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // OCR Scan Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [ocrFields, setOcrFields] = useState<FDRFieldComparison[]>([]);
  const [overallConfidence, setOverallConfidence] = useState<number>(0);

  // Human Correction Modal State
  const [editingFieldIdx, setEditingFieldIdx] = useState<number | null>(null);
  const [correctionValue, setCorrectionValue] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fdrNumber.trim()) errs.fdrNumber = "FDR number is mandatory";
    if (!formData.bankName.trim()) errs.bankName = "Issuing bank is mandatory";
    if (!formData.branchName.trim()) errs.branchName = "Branch name is mandatory";
    if (!formData.amount || Number(formData.amount) <= 0)
      errs.amount = "Valid deposit principal is required";
    if (!formData.depositDate) errs.depositDate = "Deposit date is required";
    if (!formData.maturityDate) errs.maturityDate = "Maturity date is required";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // File Upload & SHA-256 calculation
  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setDuplicateWarning(null);

    // Compute real cryptographic SHA-256 hash
    const computedHash = await hashFile(selectedFile);
    setFileHash(computedHash);

    // Run duplicate check against stored database
    const dupCheck = await repository.checkDuplicateHash(computedHash);
    if (dupCheck.isDuplicate && dupCheck.existingFdr) {
      setDuplicateWarning(
        `COLLUSION / DUPLICATE DETECTED: This identical file binary was previously registered under FDR #${dupCheck.existingFdr.fdrNumber} for ${dupCheck.existingFdr.institutionName}.`
      );
    }
  };

  const handleSimulateOCR = async () => {
    setIsScanning(true);
    // Simulate OCR scanning line animation
    setTimeout(async () => {
      const mockFile = file || new File(["sample binary"], "fdr_scan.pdf", { type: "application/pdf" });
      const ocrRes = await repository.simulateOCR(mockFile);
      setOcrFields(ocrRes.fields);
      setOverallConfidence(ocrRes.overallConfidence);
      setIsScanning(false);
      setStep(3);
    }, 1200);
  };

  const handleSaveCorrection = () => {
    if (editingFieldIdx === null) return;
    const updated = [...ocrFields];
    const target = updated[editingFieldIdx];
    target.isCorrected = true;
    target.ocrValue = correctionValue;
    target.correctionReason = correctionReason;
    target.correctedBy = currentUserName;
    setOcrFields(updated);
    setEditingFieldIdx(null);
    setCorrectionValue("");
    setCorrectionReason("");
  };

  const handleFinalSubmit = async () => {
    const newFdr: Partial<FDREntity> = {
      fdrNumber: formData.fdrNumber,
      institutionId: "inst-001",
      institutionName: "Aryavarta Institute of Technology & Research",
      bankName: formData.bankName,
      branchName: formData.branchName,
      ifscCode: formData.ifscCode,
      amount: Number(formData.amount),
      depositDate: formData.depositDate,
      maturityDate: formData.maturityDate,
      tenureMonths: Number(formData.tenureMonths),
      interestRate: Number(formData.interestRate),
      jointHolders: formData.jointHolders,
      lienMarkedToAicte: formData.lienMarkedToAicte,
      autoRenew: formData.autoRenew,
      evidenceLevel: "L1", // New submissions strictly start at L1 Document-Screened
      status: duplicateWarning ? "DISCREPANCY_UNDER_REVIEW" : "DOCUMENT_SCREENED",
      riskLevel: duplicateWarning ? "CRITICAL" : "LOW",
      riskFactors: duplicateWarning
        ? [
            {
              code: "DUPLICATE_SHA256",
              label: "Duplicate File Binary",
              severity: "alert",
              description: duplicateWarning,
            },
          ]
        : [],
      documents: file
        ? [
            {
              id: `doc-${Date.now()}`,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type || "application/pdf",
              sha256Hash: fileHash,
              uploadedAt: new Date().toISOString(),
              uploadedBy: currentUserName,
              docType: "FDR_CERTIFICATE",
            },
          ]
        : [],
      fieldComparisons: ocrFields,
      observations: [
        {
          id: `obs-init-${Date.now()}`,
          createdAt: new Date().toISOString(),
          authorRole: "INSTITUTION_ADMIN",
          authorName: currentUserName,
          text: "Instrument submitted via institution portal. Document-screened badge issued pending AICTE scrutiny.",
          type: "OBSERVATION",
        },
      ],
    };

    const created = await repository.createFDR(newFdr);
    router.push(`/institution/fdr/${created.id}`);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
            STATUTORY DEPOSIT REGISTRATION
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            SUBMIT FIXED DEPOSIT RECEIPT
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1">
            4-stage evidence intake pipeline with client-side SHA-256 fingerprinting and optical character screening.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-4 gap-2 border border-[#1A1F1B]/30 bg-[#F6F0E0] p-2 text-xs font-mono">
          {[
            { num: 1, label: "1. Metadata" },
            { num: 2, label: "2. Upload & Hash" },
            { num: 3, label: "3. OCR Review" },
            { num: 4, label: "4. Final Commit" },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 text-center border font-bold uppercase transition-colors ${
                step === s.num
                  ? "bg-[#0C1411] text-[#E9E2CF] border-[#0C1411]"
                  : step > s.num
                  ? "bg-[#1E8A5A]/20 text-[#1E8A5A] border-[#1E8A5A]"
                  : "bg-transparent text-[#1A1F1B]/50 border-transparent"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* STEP 1: Metadata Form */}
        {step === 1 && (
          <div className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
              Stage 1: Deposit Metadata &amp; Bank Particulars
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Fixed Deposit / Receipt Number *
                </label>
                <input
                  type="text"
                  value={formData.fdrNumber}
                  onChange={(e) => setFormData({ ...formData, fdrNumber: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
                />
                {formErrors.fdrNumber && (
                  <p className="text-[10px] text-[#C4301C] font-mono mt-0.5">{formErrors.fdrNumber}</p>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Issuing Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-sans text-xs"
                />
                {formErrors.bankName && (
                  <p className="text-[10px] text-[#C4301C] font-mono mt-0.5">{formErrors.bankName}</p>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Branch Name &amp; Location *
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Branch IFSC Code
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Principal Amount (INR) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Annual Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Deposit Effective Date *
                </label>
                <input
                  type="date"
                  value={formData.depositDate}
                  onChange={(e) => setFormData({ ...formData, depositDate: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#0C1411] mb-1">
                  Maturity Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.maturityDate}
                  onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
                  className="w-full bg-white border border-[#1A1F1B]/30 p-2 font-mono text-xs"
                />
              </div>
            </div>

            <div className="border-t border-[#1A1F1B]/20 pt-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.lienMarkedToAicte}
                  onChange={(e) => setFormData({ ...formData, lienMarkedToAicte: e.target.checked })}
                  className="w-4 h-4 accent-[#0C1411]"
                />
                <span className="font-mono text-xs text-[#0C1411]">
                  Lien Clause explicitly marked in favor of Member Secretary, AICTE (Statutory Requirement)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoRenew}
                  onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  className="w-4 h-4 accent-[#0C1411]"
                />
                <span className="font-mono text-xs text-[#0C1411]">
                  Enable Bank Auto-Renewal instructions on maturity date
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-6 py-2.5 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-marigold flex items-center gap-2 cursor-pointer hover:bg-[#17231E]"
              >
                <span>Continue to Upload &amp; Hash</span>
                <ArrowRight className="w-4 h-4 text-[#F2A900]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Upload & Client-Side SHA-256 Hashing */}
        {step === 2 && (
          <div className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
              Stage 2: Document Ingestion &amp; Cryptographic Fingerprint
            </h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-[#0C1411]/40 bg-[#EDE4CE]/60 p-8 text-center space-y-3 cursor-pointer hover:border-[#0C1411] transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-[#0C1411]/70" />
              <div className="font-display text-xl font-bold uppercase text-[#0C1411]">
                {file ? file.name : "Drag & Drop Scanned FDR Certificate (PDF or Image)"}
              </div>
              <p className="font-mono text-xs text-[#1A1F1B]/60">
                Client-side Web Crypto calculates SHA-256 in memory before upload.
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Test quick demo upload buttons */}
            <div className="p-3 bg-[#EDE4CE] border border-[#1A1F1B]/20 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-[#0C1411]">DEMO PRESETS:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const dummy = new File(["Clean Genuine FDR Binary Payload"], "Genuine_FDR_2026.pdf", { type: "application/pdf" });
                    handleFileChange(dummy);
                  }}
                  className="px-2.5 py-1 bg-[#1E8A5A] text-white font-mono text-[10px] uppercase font-bold"
                >
                  Load Clean FDR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Triggers exact duplicate hash by injecting existing hash
                    const dummy = new File(["Collision payload"], "Duplicated_FDR_Scan.pdf", { type: "application/pdf" });
                    setFile(dummy);
                    setFileHash("8f48a1c9e3b7492c60e1d09e74bb7a349071c84b12dfc8369408b1a23805f77a");
                    setDuplicateWarning(
                      "COLLUSION / DUPLICATE DETECTED: This identical file binary was previously registered under FDR #FDR-2024-BH-00481920 for Aryavarta Institute of Technology & Research."
                    );
                  }}
                  className="px-2.5 py-1 bg-[#C4301C] text-white font-mono text-[10px] uppercase font-bold"
                >
                  Simulate Duplicate Hash Collision
                </button>
              </div>
            </div>

            {/* SHA-256 Fingerprint Display */}
            {fileHash && (
              <div className="p-4 bg-white border border-[#0C1411] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-[#0C1411]">
                    Cryptographic Payload Fingerprint:
                  </span>
                  <span className="text-[10px] font-mono text-[#1E8A5A] font-bold">
                    ✓ COMPUTED VIA WEB CRYPTO
                  </span>
                </div>
                <HashChip hash={fileHash} prefix="SHA-256" truncateLength={16} />
                <p className="font-mono text-[10px] text-[#1A1F1B]/70">
                  * Note: Hash guarantees file integrity and unalterability; it does not substitute for bank confirmation.
                </p>
              </div>
            )}

            {/* Duplicate File Alert if collision detected */}
            {duplicateWarning && (
              <div className="p-4 bg-[#C4301C]/15 border-2 border-[#C4301C] text-[#C4301C] font-mono text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold uppercase">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>CRITICAL ANOMALY: DUPLICATE HASH MATCH FOUND</span>
                </div>
                <p className="text-xs">{duplicateWarning}</p>
                <div className="text-[10px] text-[#0C1411] font-bold">
                  Instrument will be flagged for Scrutiny Discrepancy Investigation upon submission.
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-[#0C1411] font-mono text-xs uppercase"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSimulateOCR}
                disabled={!fileHash || isScanning}
                className="px-6 py-2.5 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-marigold flex items-center gap-2 cursor-pointer hover:bg-[#17231E] disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <ScanLine className="w-4 h-4 animate-spin text-[#F2A900]" />
                    <span>Optical Extraction in Progress...</span>
                  </>
                ) : (
                  <>
                    <span>Extract with Optical OCR Engine</span>
                    <ArrowRight className="w-4 h-4 text-[#F2A900]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OCR Review & Human Corrections */}
        {step === 3 && (
          <div className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1F1B]/20 pb-2">
              <div>
                <h2 className="font-display text-2xl font-black uppercase text-[#0C1411]">
                  Stage 3: Optical Character Screening &amp; Corrections
                </h2>
                <div className="font-mono text-xs text-[#1A1F1B]/70 mt-0.5">
                  Mean Extraction Confidence: <strong>{overallConfidence}%</strong> · Status: Document-Screened (L1)
                </div>
              </div>
              <StatusRing level="L1" size="md" showLabel />
            </div>

            <div className="p-3 bg-[#EDE4CE] border-l-4 border-[#B5832A] text-xs font-mono">
              <span className="font-bold text-[#0C1411]">OPERATOR AUDIT RULE: </span>
              Low confidence extractions are highlighted below in yellow/brass. Any manual correction is immutably recorded in the audit trail with original value, revised value, reason, and your user signature.
            </div>

            {/* Extracted Fields Table */}
            <div className="border border-[#1A1F1B]/30 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EDE4CE] border-b border-[#1A1F1B]/30 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20">Field</th>
                    <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20">Submitted Form Value</th>
                    <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20">OCR Machine Read</th>
                    <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20 text-center">Confidence</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1F1B]/15">
                  {ocrFields.map((f, i) => (
                    <tr
                      key={i}
                      className={f.ocrConfidence < 80 ? "bg-[#F2A900]/15" : "hover:bg-[#EDE4CE]/50"}
                    >
                      <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20 font-mono font-medium">
                        {f.label}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20 font-mono font-semibold">
                        {f.submittedValue}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20 font-mono">
                        {f.ocrValue}
                        {f.isCorrected && (
                          <span className="ml-1 text-[9px] uppercase px-1 bg-[#B5832A]/20 text-[#B5832A] font-bold">
                            Corrected
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20 text-center font-mono font-bold">
                        <span
                          className={`px-1.5 py-0.5 border ${
                            f.ocrConfidence < 80
                              ? "border-[#C4301C] bg-[#C4301C]/10 text-[#C4301C]"
                              : "border-[#1E8A5A] bg-[#1E8A5A]/10 text-[#1E8A5A]"
                          }`}
                        >
                          {f.ocrConfidence}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFieldIdx(i);
                            setCorrectionValue(f.ocrValue);
                            setCorrectionReason("Correction due to faint printer output on scanned FDR");
                          }}
                          className="px-2 py-0.5 bg-[#EDE4CE] border border-[#0C1411] font-mono text-[10px] uppercase font-bold hover:bg-[#F2A900]"
                        >
                          Correct
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inline Human Correction Modal */}
            {editingFieldIdx !== null && (
              <div className="p-4 bg-white border-2 border-[#0C1411] hard-shadow space-y-3">
                <div className="flex items-center justify-between border-b border-[#0C1411] pb-1.5">
                  <span className="font-mono text-xs font-bold uppercase text-[#0C1411]">
                    Document Correction Audit Record: {ocrFields[editingFieldIdx]?.label}
                  </span>
                  <button
                    onClick={() => setEditingFieldIdx(null)}
                    className="font-mono text-xs hover:text-[#C4301C]"
                  >
                    ✕ Close
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-[#1A1F1B]/70 uppercase">Original OCR Machine Read:</label>
                    <input
                      type="text"
                      disabled
                      value={ocrFields[editingFieldIdx]?.ocrValue}
                      className="w-full bg-[#EDE4CE] p-1.5 border border-[#1A1F1B]/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#0C1411] font-bold uppercase">Revised Accurate Value:</label>
                    <input
                      type="text"
                      value={correctionValue}
                      onChange={(e) => setCorrectionValue(e.target.value)}
                      className="w-full bg-white p-1.5 border border-[#0C1411] font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#0C1411] font-bold uppercase mb-1">
                    Documented Reason for Correction (Stored in Audit Hash Chain):
                  </label>
                  <input
                    type="text"
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    className="w-full bg-white p-1.5 border border-[#0C1411] text-xs font-sans"
                    placeholder="e.g. Scanned instrument clearly reads 15 Mar 2029 in physical watermark"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingFieldIdx(null)}
                    className="px-3 py-1 bg-[#EDE4CE] border border-[#0C1411] font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCorrection}
                    className="px-4 py-1 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs uppercase font-bold hard-shadow-sm"
                  >
                    Commit Correction
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-[#0C1411] font-mono text-xs uppercase"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-wider hard-shadow-marigold flex items-center gap-2 cursor-pointer hover:bg-[#17231E]"
              >
                <span>Proceed to Final Verification</span>
                <ArrowRight className="w-4 h-4 text-[#F2A900]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Commit to Ledger */}
        {step === 4 && (
          <div className="p-6 md:p-8 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-6">
            <h2 className="font-display text-2xl font-black uppercase text-[#0C1411] border-b border-[#1A1F1B]/20 pb-2">
              Stage 4: Summary Verification &amp; Cryptographic Anchorage
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs p-4 bg-[#EDE4CE] border border-[#1A1F1B]/30">
              <div>
                <div className="text-[10px] text-[#1A1F1B]/60 uppercase">FDR NUMBER</div>
                <div className="font-bold text-[#0C1411]">{formData.fdrNumber}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#1A1F1B]/60 uppercase">PRINCIPAL AMOUNT</div>
                <div className="font-bold text-[#0C1411]">₹ {Number(formData.amount).toLocaleString("en-IN")}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#1A1F1B]/60 uppercase">MATURITY DATE</div>
                <div className="font-bold text-[#0C1411]">{formData.maturityDate}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#1A1F1B]/60 uppercase">ISSUING BANK</div>
                <div className="font-bold text-[#0C1411]">{formData.bankName}</div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#0C1411] space-y-2 text-xs font-mono">
              <div className="font-bold text-[#0C1411] uppercase tracking-wider flex items-center gap-2">
                <StatusRing level="L1" size="sm" />
                <span>Statutory Level Attribution Notice:</span>
              </div>
              <p className="text-[#1A1F1B] font-sans">
                Upon submission, this instrument will be immutably catalogued at <strong>Level 1 (Document-Screened)</strong>. It will be assigned to the AICTE Scrutiny Officer queue. Direct bank confirmation telemetry will be independently queried via SFMS. Per ARTHKAVACH integrity rules, no automated status elevation occurs.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-[#0C1411] font-mono text-xs uppercase"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-3 bg-[#1E8A5A] text-white font-mono text-xs font-bold uppercase tracking-widest hard-shadow hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Commit Instrument to Public Ledger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
