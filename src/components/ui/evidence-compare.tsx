import React from "react";
import { FDRFieldComparison, BankVerificationRecord } from "@/lib/types";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

interface EvidenceCompareProps {
  fields: FDRFieldComparison[];
  bankVerification?: BankVerificationRecord | null;
  className?: string;
}

export function EvidenceCompare({
  fields,
  bankVerification,
  className = "",
}: EvidenceCompareProps) {
  return (
    <div className={`overflow-x-auto border border-[#1A1F1B]/25 bg-[#F6F0E0] ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b-2 border-[#1A1F1B]/30 bg-[#EDE4CE] text-[#0C1411] font-mono text-[11px] uppercase tracking-wider">
            <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20 w-1/4">Ledger Field</th>
            <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20 w-1/4">
              Institution Submitted
            </th>
            <th className="py-2.5 px-3 border-r border-[#1A1F1B]/20 w-1/4">
              OCR Screened &amp; Conf.
            </th>
            <th className="py-2.5 px-3 w-1/4">
              Bank Direct Confirmation
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A1F1B]/15 font-sans">
          {fields.map((f, idx) => {
            const hasMismatch = f.isMismatch || (f.bankConfirmedValue && f.bankConfirmedValue !== f.submittedValue);
            const isLowConfidence = f.ocrConfidence < 80;

            return (
              <tr
                key={idx}
                className={`transition-colors ${
                  hasMismatch
                    ? "bg-[#C4301C]/10 text-[#0C1411]"
                    : "hover:bg-[#EDE4CE]/60"
                }`}
              >
                {/* Field Label */}
                <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20 font-medium">
                  <div className="flex items-center gap-1.5">
                    {hasMismatch && (
                      <AlertCircle className="w-3.5 h-3.5 text-[#C4301C] shrink-0" />
                    )}
                    <span className="font-mono text-xs">{f.label}</span>
                  </div>
                </td>

                {/* Submitted Value */}
                <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20 font-mono tabular-nums font-semibold">
                  {f.submittedValue}
                </td>

                {/* OCR Screened Value + Confidence */}
                <td className="py-2.5 px-3 border-r border-[#1A1F1B]/20">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono tabular-nums ${
                        hasMismatch ? "text-[#C4301C] font-bold" : ""
                      }`}
                    >
                      {f.ocrValue}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-mono px-1 py-0.2 border ${
                          isLowConfidence
                            ? "border-[#F2A900] bg-[#F2A900]/20 text-[#0C1411] font-bold"
                            : "border-[#1A1F1B]/20 text-[#1A1F1B]/70"
                        }`}
                        title={`OCR Machine Confidence: ${f.ocrConfidence}%`}
                      >
                        {f.ocrConfidence}%
                      </span>
                      {f.isCorrected && (
                        <span
                          className="text-[9px] uppercase px-1 bg-[#B5832A]/20 text-[#B5832A] font-mono border border-[#B5832A]/40"
                          title={`Corrected by ${f.correctedBy || "Scrutiny Officer"}: ${f.correctionReason || ""}`}
                        >
                          Manual Rev.
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Bank Confirmed Value */}
                <td className="py-2.5 px-3">
                  {f.bankConfirmedValue ? (
                    <div className="flex items-center justify-between">
                      <span className="font-mono tabular-nums text-[#1E8A5A] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        {f.bankConfirmedValue}
                      </span>
                      <span className="text-[9.5px] font-mono text-[#1E8A5A] uppercase tracking-wider">
                        Scope Match
                      </span>
                    </div>
                  ) : bankVerification?.status === "UNAVAILABLE" ? (
                    <div className="flex items-center gap-1.5 text-[#C4301C] font-mono text-xs">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Telemetry Offline (Unconfirmed)</span>
                    </div>
                  ) : bankVerification?.status === "MISMATCH" ? (
                    <div className="flex items-center gap-1.5 text-[#C4301C] font-mono text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Discrepancy Reported by Bank</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#1A1F1B]/60 font-mono text-xs italic">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Awaiting Independent Confirmation</span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {bankVerification && (
        <div className="p-2.5 bg-[#EDE4CE] border-t border-[#1A1F1B]/20 text-[11px] font-mono text-[#1A1F1B]/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0C1411]">Telemetry Source:</span>
            <span>{bankVerification.source}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0C1411]">Ref #:</span>
            <span>{bankVerification.referenceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0C1411]">Confirmed Timestamp:</span>
            <span>{new Date(bankVerification.verifiedAt).toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
