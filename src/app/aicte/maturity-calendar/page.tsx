"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { FDREntity, SystemRulesConfig } from "@/lib/types";
import { useDemoStore, getDemoCurrentDate, getDaysUntilMaturity } from "@/lib/store/demo-store";
import { StatusRing } from "@/components/ui/status-ring";
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function MaturityCalendarPage() {
  const { currentDateIso } = useDemoStore();
  const [fdrs, setFdrs] = useState<FDREntity[]>([]);
  const [rules, setRules] = useState<SystemRulesConfig | null>(null);

  // Month navigation offset from demo clock anchor
  const [monthOffset, setMonthOffset] = useState(0);

  const [selectedDayFdrs, setSelectedDayFdrs] = useState<FDREntity[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const all = await repository.getFDRs();
      const conf = await repository.getSystemRules();
      setFdrs(all);
      setRules(conf);
    }
    loadData();
  }, [currentDateIso]);

  // Derive displayed calendar month based on demo date + monthOffset
  const demoDate = getDemoCurrentDate();
  const displayDate = new Date(demoDate.getFullYear(), demoDate.getMonth() + monthOffset, 1);
  const currentYear = displayDate.getFullYear();
  const currentMonth = displayDate.getMonth(); // 0-indexed

  const prevMonth = () => {
    setMonthOffset((prev) => prev - 1);
    setSelectedDayFdrs([]);
    setSelectedDayNumber(null);
  };

  const nextMonth = () => {
    setMonthOffset((prev) => prev + 1);
    setSelectedDayFdrs([]);
    setSelectedDayNumber(null);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Find FDRs maturing in current month
  const monthFdrs = fdrs.filter((f) => {
    const d = new Date(f.maturityDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F2A900]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
              STATUTORY MATURITY SURVEILLANCE
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            MATURITY WARNING CALENDAR
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1 max-w-3xl">
            Surveillance schedule powered by the injectable Demo Clock. Tracks instruments approaching statutory expiry under configurable warning windows (90 / 60 / 30 / 15 / 7 days).
          </p>
        </div>

        {/* Warning Policy Strip */}
        <div className="p-4 bg-[#F6F0E0] border border-[#1A1F1B]/30 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0C1411] uppercase">Configured Warning Policy Windows:</span>
            <div className="flex gap-1.5">
              {rules?.warningWindows.map((w) => (
                <span
                  key={w}
                  className="px-2 py-0.5 bg-[#EDE4CE] border border-[#1A1F1B]/30 font-bold text-[#0C1411]"
                >
                  {w} Days
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-[#1A1F1B]/60 uppercase">
            POLICY VERSION: {rules?.version || "4.2-POLICY-2026"} (Sample Policy)
          </span>
        </div>

        {/* Calendar Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Month Calendar (8 cols) */}
          <div className="lg:col-span-8 p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4">
            {/* Month & Year Navigation Header */}
            <div className="flex items-center justify-between border-b-2 border-[#0C1411] pb-3">
              <div className="font-display text-2xl font-black uppercase text-[#0C1411]">
                {monthNames[currentMonth]} {currentYear}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={prevMonth}
                  className="p-1.5 bg-[#EDE4CE] border border-[#0C1411] hover:bg-[#F2A900] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 bg-[#EDE4CE] border border-[#0C1411] hover:bg-[#F2A900] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold uppercase text-[#0C1411] bg-[#EDE4CE] p-1.5 border border-[#1A1F1B]/20">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 font-mono text-xs">
              {/* Empty leading padding days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[72px] bg-[#EDE4CE]/30 border border-transparent" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const maturing = fdrs.filter((f) => f.maturityDate === dateStr);

                const isToday =
                  demoDate.getFullYear() === currentYear &&
                  demoDate.getMonth() === currentMonth &&
                  demoDate.getDate() === dayNum;

                const isSelected = selectedDayNumber === dayNum;

                return (
                  <div
                    key={dayNum}
                    onClick={() => {
                      if (maturing.length > 0) {
                        setSelectedDayNumber(dayNum);
                        setSelectedDayFdrs(maturing);
                      }
                    }}
                    className={`min-h-[72px] p-1.5 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#0C1411] bg-[#F2A900]/20 hard-shadow-sm"
                        : isToday
                        ? "border-[#0C1411] bg-[#EDE4CE]"
                        : "border-[#1A1F1B]/20 bg-white hover:border-[#1A1F1B]/50"
                    } ${maturing.length > 0 ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isToday ? "text-[#C4301C]" : "text-[#0C1411]"}`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[8px] uppercase font-bold px-1 bg-[#C4301C] text-white">
                          CLOCK
                        </span>
                      )}
                    </div>

                    {maturing.length > 0 && (
                      <div className="space-y-0.5 mt-1">
                        {maturing.map((mf) => (
                          <div
                            key={mf.id}
                            className="text-[9px] font-bold px-1 py-0.5 bg-[#0C1411] text-[#E9E2CF] truncate"
                            title={`${mf.fdrNumber} (₹ ${mf.amount.toLocaleString("en-IN")})`}
                          >
                            ₹ {(mf.amount / 100000).toFixed(0)}L
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day / Month Summary (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-4">
            <div className="border-b border-[#1A1F1B]/20 pb-2">
              <h3 className="font-display text-xl font-black uppercase text-[#0C1411]">
                {selectedDayNumber
                  ? `Maturing Instruments · Day ${selectedDayNumber}`
                  : `Month Overview (${monthFdrs.length})`}
              </h3>
              <div className="font-mono text-[10px] text-[#1A1F1B]/60 uppercase">
                {selectedDayNumber
                  ? `${monthNames[currentMonth]} ${selectedDayNumber}, ${currentYear}`
                  : `${monthNames[currentMonth]} ${currentYear}`}
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {(selectedDayFdrs.length > 0 ? selectedDayFdrs : monthFdrs).map((item) => {
                const days = getDaysUntilMaturity(item.maturityDate);
                const isOverdue = days < 0;

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-[#0C1411] text-xs font-mono space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-[#1A1F1B]/15 pb-1">
                      <div className="flex items-center gap-1.5">
                        <StatusRing level={item.evidenceLevel} size="sm" />
                        <Link
                          href={`/aicte/review/${item.id}`}
                          className="font-bold text-[#0C1411] hover:text-[#C4301C]"
                        >
                          {item.fdrNumber}
                        </Link>
                      </div>
                      <span className="font-bold text-[#0C1411]">
                        ₹ {item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="font-sans text-[11px] text-[#1A1F1B]/80 font-semibold truncate">
                      {item.institutionName}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-[#1A1F1B]/60">{item.bankName}</span>
                      <span
                        className={`font-bold ${
                          isOverdue
                            ? "text-[#C4301C]"
                            : days <= 30
                            ? "text-[#B5832A]"
                            : "text-[#1E8A5A]"
                        }`}
                      >
                        {isOverdue ? `Overdue by ${Math.abs(days)}d` : `Matures in ${days}d`}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-[#1A1F1B]/10 flex justify-end">
                      <Link
                        href={`/aicte/review/${item.id}`}
                        className="text-[10px] uppercase font-bold text-[#0C1411] hover:text-[#F2A900] flex items-center gap-1"
                      >
                        <span>Inspect Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {monthFdrs.length === 0 && (
                <div className="py-8 text-center text-xs font-mono text-[#1A1F1B]/60 italic">
                  No fixed deposit instruments expire in this calendar month.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
