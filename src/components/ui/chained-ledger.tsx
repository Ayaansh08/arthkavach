"use client";

import React, { useState } from "react";
import { AuditEvent } from "@/lib/types";
import { HashChip } from "./hash-chip";
import { ShieldCheck, ArrowDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { repository } from "@/lib/data/repository";

interface ChainedLedgerProps {
  events: AuditEvent[];
  onVerify?: () => void;
  className?: string;
}

export function ChainedLedger({
  events,
  className = "",
}: ChainedLedgerProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    verifiedCount: number;
    errorDetails?: string;
  } | null>(null);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    // Simulate brief sequential hash verification animation
    setTimeout(async () => {
      const res = await repository.verifyAuditChain();
      setVerificationResult(res);
      setIsVerifying(false);
    }, 450);
  };

  return (
    <div className={`border-2 border-[#E9E2CF]/25 bg-[#0C1411] text-[#E9E2CF] p-6 md:p-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E9E2CF]/20 pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#F2A900] font-bold">
            CRYPTOGRAPHIC AUDIT CHAIN
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase text-[#E9E2CF] tracking-tight">
            EVERY EVENT, SIGNED AND IN ORDER
          </h3>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={isVerifying}
          className="px-4 py-2 bg-[#F2A900] text-[#0C1411] font-mono font-bold text-xs uppercase tracking-wider hard-shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isVerifying ? "VERIFYING CRYPTO PROOFS..." : "VERIFY ENTIRE CHAIN"}</span>
        </button>
      </div>

      {verificationResult && (
        <div
          className={`mb-6 p-3 border font-mono text-xs flex items-center justify-between gap-3 ${
            verificationResult.isValid
              ? "bg-[#1E8A5A]/20 border-[#1E8A5A] text-[#E9E2CF]"
              : "bg-[#C4301C]/20 border-[#C4301C] text-[#E9E2CF]"
          }`}
        >
          <div className="flex items-center gap-2">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-[#1E8A5A]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#C4301C]" />
            )}
            <span>
              {verificationResult.isValid
                ? `INTEGRITY CONFIRMED: All ${verificationResult.verifiedCount} sequential block hashes validated against SHA-256 standard.`
                : `CHAIN TAMPERED: ${verificationResult.errorDetails}`}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-black/40">
            {verificationResult.isValid ? "PROOFS INTACT" : "BROKEN"}
          </span>
        </div>
      )}

      {/* Hash chained event list */}
      <div className="space-y-4">
        {events.slice(0, 5).map((evt, idx) => (
          <div key={evt.id} className="relative">
            {idx > 0 && (
              <div className="flex items-center gap-2 my-1.5 pl-6">
                <div className="w-0.5 h-4 bg-[#E9E2CF]/30" />
                <ArrowDown className="w-3 h-3 text-[#F2A900]/70" />
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#E9E2CF]/50">
                  previous hash pointer linked
                </span>
              </div>
            )}

            <div className="p-4 border border-[#E9E2CF]/20 bg-[#17231E]/80 hover:border-[#F2A900]/50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E9E2CF]/15 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#F2A900]">
                    #{evt.sequence.toString().padStart(3, "0")}
                  </span>
                  <span className="font-mono text-xs font-black uppercase text-[#E9E2CF] tracking-wide">
                    {evt.action.replace(/_/g, " ")}
                  </span>
                  {evt.fdrNumber && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#E9E2CF]/10 text-[#E9E2CF]">
                      {evt.fdrNumber}
                    </span>
                  )}
                </div>

                <div className="font-mono text-[10px] text-[#E9E2CF]/60">
                  {new Date(evt.timestamp).toLocaleString("en-IN")}
                </div>
              </div>

              <p className="text-xs font-sans text-[#E9E2CF]/85 mb-3 leading-relaxed">
                {evt.details}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E9E2CF]/10 font-mono text-[10px]">
                <div className="flex items-center gap-2 text-[#E9E2CF]/70">
                  <span className="font-semibold text-[#F2A900]">ACTOR:</span>
                  <span>{evt.actor.name} ({evt.actor.role})</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[#E9E2CF]/50">PREV:</span>
                    <span className="text-[#E9E2CF]/70 font-mono">
                      {evt.previousHash.slice(0, 8)}...
                    </span>
                  </div>
                  <HashChip hash={evt.currentHash} prefix="BLOCK" truncateLength={6} className="bg-[#0C1411] border-[#E9E2CF]/30 text-[#E9E2CF]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
