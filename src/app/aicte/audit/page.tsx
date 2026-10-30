"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { repository } from "@/lib/data/repository";
import { AuditEvent } from "@/lib/types";
import { ChainedLedger } from "@/components/ui/chained-ledger";
import { ShieldCheck, Search } from "lucide-react";

export default function MasterAuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  useEffect(() => {
    async function loadEvents() {
      const evts = await repository.getAuditEvents();
      setEvents(evts);
    }
    loadEvents();
  }, []);

  // Filter events
  let displayed = [...events].reverse(); // latest first
  if (filterAction !== "ALL") {
    displayed = displayed.filter((e) => e.action === filterAction);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayed = displayed.filter(
      (e) =>
        e.details.toLowerCase().includes(q) ||
        (e.fdrNumber && e.fdrNumber.toLowerCase().includes(q)) ||
        e.actor.name.toLowerCase().includes(q) ||
        e.currentHash.toLowerCase().includes(q)
    );
  }

  const actions = Array.from(new Set(events.map((e) => e.action)));

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b-2 border-[#1A1F1B]/30 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F2A900]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#B5832A] font-bold">
              IRREVOCABLE CRYPTOGRAPHIC CHRONICLE
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#0C1411] tracking-tight mt-1">
            MASTER AUDIT TRAIL
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#1A1F1B]/80 mt-1 max-w-3xl">
            Sequential SHA-256 block-chained timeline. Every status change, OCR correction, bank SFMS match, and reviewer override is cryptographically linked to the previous block hash.
          </p>
        </div>

        {/* Search & Action Filter Bar */}
        <div className="p-4 bg-[#F6F0E0] border-2 border-[#0C1411] hard-shadow space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 flex items-center gap-2 bg-white border border-[#1A1F1B]/30 px-3 py-1.5">
              <Search className="w-4 h-4 text-[#1A1F1B]/60 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by FDR number, actor name, detail keyword, or block hash..."
                className="w-full bg-transparent outline-none font-mono text-xs"
              >
              </input>
            </div>

            <div className="md:col-span-4">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full bg-white border border-[#1A1F1B]/30 p-2 text-xs"
              >
                <option value="ALL">All Audit Actions ({actions.length})</option>
                {actions.map((act) => (
                  <option key={act} value={act}>
                    {act.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chained Ledger Component */}
        <ChainedLedger events={displayed} />
      </div>
    </AppShell>
  );
}
