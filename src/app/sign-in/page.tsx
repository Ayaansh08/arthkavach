"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoStore } from "@/lib/store/demo-store";
import { UserRole } from "@/lib/types";
import { Guilloche } from "@/components/ui/guilloche";
import { DemoToolbar } from "@/components/ui/demo-toolbar";
import { Landmark, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, verifyMfa } = useDemoStore();

  const queryRole = searchParams?.get("role") as UserRole | null;
  const [selectedRoleState, setSelectedRoleState] = useState<UserRole>("INSTITUTION_ADMIN");
  const selectedRole = queryRole || selectedRoleState;

  const [step, setStep] = useState<"ROLE_CREDS" | "MFA">("ROLE_CREDS");
  const [mfaCode, setMfaCode] = useState("849201");
  const [isVerifying, setIsVerifying] = useState(false);

  const rolesConfig: Record<
    UserRole,
    { title: string; desc: string; redirect: string; badge: string; sampleId: string }
  > = {
    INSTITUTION_ADMIN: {
      title: "Institution Admin (College)",
      desc: "Upload FDR instruments, monitor maturity schedules, and initiate refund / release petitions.",
      redirect: "/institution/dashboard",
      badge: "COLLEGE OPERATOR",
      sampleId: "AICTE-PID-1-492817291 (Aryavarta Tech)",
    },
    AICTE_SCRUTINY_OFFICER: {
      title: "AICTE Scrutiny Officer",
      desc: "Cross-examine OCR extractions, check SFMS bank feeds, record observations and recommend decisions.",
      redirect: "/aicte/overview",
      badge: "REGIONAL SCRUTINY",
      sampleId: "OFFICER-RO-KANPUR-04",
    },
    AICTE_APPROVING_AUTHORITY: {
      title: "AICTE Approving Authority",
      desc: "Final maker-checker sanctioning authority. Approves deposit registrations, extensions and fund releases.",
      redirect: "/aicte/overview",
      badge: "DECISION MAKER",
      sampleId: "DIRECTOR-APPROVALS-HQ",
    },
    SYSTEM_ADMIN: {
      title: "System Administrator",
      desc: "Maintain institutional risk rules, inspection checklists, warning windows, and audit chain verification.",
      redirect: "/admin",
      badge: "LEDGER AUDITOR",
      sampleId: "SYS-ADMIN-SEC-01",
    },
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("MFA");
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      login(selectedRole);
      verifyMfa();
      setIsVerifying(false);
      router.push(rolesConfig[selectedRole].redirect);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow-lg p-6 md:p-10 z-10">
      {/* Header */}
      <div className="border-b-2 border-[#0C1411] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Landmark className="w-6 h-6 text-[#0C1411]" />
          <span className="font-display text-3xl font-black uppercase text-[#0C1411]">
            ARTHKAVACH · ACCESS PORTAL
          </span>
        </div>
        <div className="font-devanagari text-sm font-semibold text-[#B5832A] mt-1">
          सुरक्षा · सतर्कता · सत्यता
        </div>
        <div className="font-mono text-xs text-[#1A1F1B]/70 mt-1 uppercase tracking-wider">
          AICTE FDR &amp; SECURITY DEPOSIT DECISION SUPPORT GATEWAY
        </div>
      </div>

      {step === "ROLE_CREDS" ? (
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0C1411] mb-2">
              Select Authorization Door / Persona:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(rolesConfig) as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;
                const r = rolesConfig[role];
                return (
                  <div
                    key={role}
                    onClick={() => setSelectedRoleState(role)}
                    className={`p-3.5 border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#0C1411] bg-[#EDE4CE] hard-shadow"
                        : "border-[#1A1F1B]/20 bg-[#F6F0E0] hover:border-[#1A1F1B]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-[#0C1411] text-[#E9E2CF] uppercase">
                        {r.badge}
                      </span>
                      {isSelected && <span className="w-2 h-2 bg-[#F2A900]" />}
                    </div>
                    <div className="font-display text-lg font-black uppercase text-[#0C1411] leading-tight">
                      {r.title}
                    </div>
                    <div className="font-sans text-[11px] text-[#1A1F1B]/80 mt-1">
                      {r.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sample pre-filled credentials */}
          <div className="p-4 bg-[#EDE4CE] border border-[#1A1F1B]/20 space-y-3">
            <div className="font-mono text-xs font-bold text-[#0C1411] uppercase tracking-wider">
              Simulated Authorized Credentials:
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#1A1F1B]/70">
                Official Identifier / AICTE PIN:
              </label>
              <input
                type="text"
                disabled
                value={rolesConfig[selectedRole].sampleId}
                className="w-full mt-1 bg-white border border-[#1A1F1B]/30 px-3 py-1.5 font-mono text-xs text-[#0C1411]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#1A1F1B]/70">
                Security Passcode (Demo Auto-filled):
              </label>
              <input
                type="password"
                disabled
                value="••••••••••••••••"
                className="w-full mt-1 bg-white border border-[#1A1F1B]/30 px-3 py-1.5 font-mono text-xs text-[#0C1411]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#F2A900] text-[#0C1411] font-mono text-xs font-bold uppercase tracking-widest hard-shadow hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROCEED TO SECOND FACTOR (MFA)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* MFA Step */
        <form onSubmit={handleMfaSubmit} className="space-y-6">
          <div className="p-4 bg-[#EDE4CE] border-l-4 border-[#F2A900]">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0C1411]" />
              <span className="font-mono text-xs font-bold uppercase text-[#0C1411]">
                Statutory Second-Factor Authentication Required
              </span>
            </div>
            <p className="font-sans text-xs text-[#1A1F1B]/80 mt-1">
              Enter the 6-digit cryptographic TOTP / SMS token issued to your registered security key for{" "}
              <strong>{rolesConfig[selectedRole].title}</strong>.
            </p>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0C1411] mb-2">
              6-Digit Time-Based One-Time Security Token:
            </label>
            <input
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full bg-white border-2 border-[#0C1411] p-3 font-mono text-2xl font-bold tracking-[0.4em] text-center text-[#0C1411] focus:ring-2 focus:ring-[#F2A900] outline-none"
            />
            <div className="font-mono text-[10px] text-[#1A1F1B]/60 text-center mt-1">
              [Demo code pre-filled: 849201 · Click Authorize]
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("ROLE_CREDS")}
              className="px-4 py-3 bg-[#EDE4CE] border border-[#0C1411] font-mono text-xs uppercase tracking-wider hover:bg-[#E4D9C0]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-3 bg-[#0C1411] text-[#E9E2CF] font-mono text-xs font-bold uppercase tracking-widest hard-shadow-marigold hover:bg-[#17231E] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#F2A900]" />
              <span>{isVerifying ? "AUTHENTICATING SESSION..." : "AUTHORIZE & ENTER PORTAL"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EDE4CE] text-[#1A1F1B]">
      <DemoToolbar />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 paper-grain relative overflow-hidden">
        {/* Background Guilloche */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-15">
          <Guilloche size={700} strokeColor="#0C1411" strokeWidth={0.6} />
        </div>

        <Suspense fallback={<div className="font-mono text-xs p-8">Loading Portal Access Gateway...</div>}>
          <SignInContent />
        </Suspense>
      </div>
    </div>
  );
}
