"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/store/demo-store";
import { repository } from "@/lib/data/repository";
import { UserRole } from "@/lib/types";
import { Calendar, FastForward, RotateCcw, User, Check, RefreshCw } from "lucide-react";

export function DemoToolbar() {
  const {
    currentDateIso,
    setDemoDate,
    advanceDays,
    resetDemoDate,
    currentUserRole,
    setRole,
  } = useDemoStore();

  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const formattedDate = currentDateIso.split("T")[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDemoDate(`${e.target.value}T10:00:00Z`);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Reset all synthetic FDR and audit records to original seed state?")) {
      setIsResetting(true);
      await repository.resetDemoData();
      resetDemoDate();
      setResetSuccess(true);
      setTimeout(() => {
        setIsResetting(false);
        setResetSuccess(false);
        window.location.reload();
      }, 700);
    }
  };

  return (
    <aside aria-label="Demo simulation control bar" className="w-full bg-[#0C1411] text-[#E9E2CF] border-b border-[#E9E2CF]/20 font-mono text-xs px-3 py-1.5 z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo disclaimer stamp */}
        <div className="flex items-center gap-2">
          <span className="inline-block px-1.5 py-0.5 bg-[#F2A900] text-[#0C1411] font-bold text-[9.5px] uppercase tracking-wider">
            SYNTHETIC DEMO
          </span>
          <span className="text-[11px] text-[#E9E2CF]/80 tracking-wide hidden sm:inline">
            DECISION SUPPORT PROTOTYPE · NOT LIVE BANK GATEWAY
          </span>
        </div>

        {/* Center: Injectable Demo Clock */}
        <div className="flex items-center gap-2 bg-[#17231E] px-2.5 py-1 border border-[#E9E2CF]/15">
          <Calendar className="w-3.5 h-3.5 text-[#F2A900]" />
          <span className="text-[10px] uppercase text-[#E9E2CF]/60 tracking-wider">
            Clock:
          </span>
          <input
            type="date"
            value={formattedDate}
            onChange={handleDateChange}
            className="bg-transparent text-[#E9E2CF] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#F2A900] cursor-pointer"
          />
          <button
            onClick={() => advanceDays(30)}
            title="Advance Demo Clock by 30 Days (Triggers maturity warnings & overdue flags)"
            className="flex items-center gap-1 px-1.5 py-0.5 bg-[#E9E2CF]/10 hover:bg-[#F2A900] hover:text-[#0C1411] transition-colors text-[10px] uppercase font-bold"
          >
            <FastForward className="w-3 h-3" />
            <span>+30d</span>
          </button>
          <button
            onClick={resetDemoDate}
            title="Reset Clock to 30 Oct 2026"
            className="p-1 hover:text-[#F2A900] transition-colors text-[10px]"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Role Switcher & Reset Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#F2A900]" />
            <span className="text-[10px] uppercase text-[#E9E2CF]/60 hidden md:inline">
              Role:
            </span>
            <select
              value={currentUserRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-[#17231E] border border-[#E9E2CF]/25 text-[#E9E2CF] px-2 py-0.5 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#F2A900]"
            >
              <option value="INSTITUTION_ADMIN">Institution Admin (College)</option>
              <option value="AICTE_SCRUTINY_OFFICER">AICTE Scrutiny Officer</option>
              <option value="AICTE_APPROVING_AUTHORITY">AICTE Approving Authority</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
          </div>

          <button
            onClick={handleResetData}
            disabled={isResetting}
            title="Restore default seeded synthetic records"
            className="flex items-center gap-1 px-2 py-0.5 bg-[#C4301C]/20 border border-[#C4301C]/50 hover:bg-[#C4301C] hover:text-white transition-colors text-[10px] font-mono uppercase tracking-wider text-[#E9E2CF]"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3 h-3 text-[#1E8A5A]" />
                <span>Restored</span>
              </>
            ) : (
              <>
                <RefreshCw className={`w-3 h-3 ${isResetting ? "animate-spin" : ""}`} />
                <span>Reset Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
