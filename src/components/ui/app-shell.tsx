"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoStore } from "@/lib/store/demo-store";
import { DemoToolbar } from "./demo-toolbar";
import { Guilloche } from "./guilloche";
import {
  Upload,
  RotateCcw,
  LayoutDashboard,
  Calendar,
  Building2,
  FileSpreadsheet,
  ShieldCheck,
  Sliders,
  Palette,
  Menu,
  X,
  Landmark,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const { currentUserRole, currentUserName } = useDemoStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isAicte =
    currentUserRole === "AICTE_SCRUTINY_OFFICER" ||
    currentUserRole === "AICTE_APPROVING_AUTHORITY";
  const isInstitution = currentUserRole === "INSTITUTION_ADMIN";
  const isAdmin = currentUserRole === "SYSTEM_ADMIN";

  const navItems = [
    // Institution Links
    ...(isInstitution
      ? [
          {
            href: "/institution/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            section: "INSTITUTION",
          },
          {
            href: "/institution/submit",
            label: "Submit FDR",
            icon: Upload,
            section: "INSTITUTION",
          },
          {
            href: "/institution/release",
            label: "Release / Refund",
            icon: RotateCcw,
            section: "INSTITUTION",
          },
        ]
      : []),

    // AICTE Command Centre Links
    ...(isAicte
      ? [
          {
            href: "/aicte/overview",
            label: "Attention Queue",
            icon: LayoutDashboard,
            section: "AICTE COMMAND",
          },
          {
            href: "/aicte/maturity-calendar",
            label: "Maturity Calendar",
            icon: Calendar,
            section: "AICTE COMMAND",
          },
          {
            href: "/aicte/institutions",
            label: "Institutions & IFAS",
            icon: Building2,
            section: "AICTE COMMAND",
          },
          {
            href: "/aicte/reports",
            label: "Reports & Export",
            icon: FileSpreadsheet,
            section: "AICTE COMMAND",
          },
          {
            href: "/aicte/audit",
            label: "Audit Trail",
            icon: ShieldCheck,
            section: "AICTE COMMAND",
          },
        ]
      : []),

    // Admin & System Links
    ...(isAdmin
      ? [
          {
            href: "/admin",
            label: "Rules & Policy",
            icon: Sliders,
            section: "ADMINISTRATION",
          },
          {
            href: "/aicte/overview",
            label: "All FDR Queue",
            icon: LayoutDashboard,
            section: "ADMINISTRATION",
          },
          {
            href: "/aicte/audit",
            label: "Master Audit Trail",
            icon: ShieldCheck,
            section: "ADMINISTRATION",
          },
        ]
      : []),

    // Universal Design System & Reference
    {
      href: "/design-system",
      label: "Design System",
      icon: Palette,
      section: "SYSTEM REFERENCE",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE4CE] text-[#1A1F1B]">
      {/* Top Demo Injectable Toolbar */}
      <DemoToolbar />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Nav Toggle Header */}
        <div className="md:hidden flex items-center justify-between p-3 bg-[#0C1411] text-[#E9E2CF] border-b border-[#E9E2CF]/20">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#F2A900]" />
            <span className="font-display text-lg font-black tracking-wider uppercase text-[#E9E2CF]">
              ARTHKAVACH
            </span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1 hover:text-[#F2A900]"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Vault Ink Side Rail */}
        <aside
          className={`${
            mobileNavOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-[#0C1411] text-[#E9E2CF] border-r border-[#E9E2CF]/20 shrink-0 flex flex-col justify-between relative`}
        >
          {/* Subtle Guilloche Watermark at Rail Base */}
          <div className="absolute bottom-0 left-0 pointer-events-none opacity-10">
            <Guilloche size={240} strokeColor="#E9E2CF" strokeWidth={0.5} />
          </div>

          <div className="p-4 z-10">
            {/* Header / Brand */}
            <Link
              href="/"
              className="group block border-b border-[#E9E2CF]/20 pb-4 mb-5"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F2A900] hard-shadow-sm shrink-0" />
                <h1 className="font-display text-2xl font-black tracking-wider uppercase text-[#E9E2CF] leading-none group-hover:text-[#F2A900] transition-colors">
                  ARTHKAVACH
                </h1>
              </div>
              <div className="font-devanagari text-xs text-[#F2A900] mt-1 font-semibold tracking-wider">
                सुरक्षा · सतर्कता · सत्यता
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#E9E2CF]/60 mt-1">
                AICTE FDR DECISION SUPPORT
              </div>
            </Link>

            {/* Current Active Persona */}
            <div className="mb-6 p-2.5 bg-[#17231E] border border-[#E9E2CF]/15">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#F2A900] font-bold">
                ACTIVE USER CONTEXT
              </div>
              <div className="font-sans text-xs font-semibold text-[#E9E2CF] mt-0.5 truncate">
                {currentUserName}
              </div>
              <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#E9E2CF]/60 mt-0.5">
                {currentUserRole.replace(/_/g, " ")}
              </div>
            </div>

            {/* Navigation items */}
            <nav className="space-y-1">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
                      isActive
                        ? "bg-[#F2A900] text-[#0C1411] border-[#F2A900] font-bold hard-shadow-sm"
                        : "border-transparent text-[#E9E2CF]/80 hover:bg-[#17231E] hover:text-[#E9E2CF] hover:border-[#E9E2CF]/20"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Side Rail Footer */}
          <div className="p-4 border-t border-[#E9E2CF]/20 z-10 text-[10px] font-mono text-[#E9E2CF]/60 space-y-2">
            <div className="flex items-center justify-between">
              <span>STATUTORY LEDGER</span>
              <span className="text-[#1E8A5A] font-bold">SECURED</span>
            </div>
            <div className="text-[8.5px] uppercase leading-tight tracking-wider text-[#E9E2CF]/50">
              DECISION SUPPORT PROTOCOL · NO AUTOMATED RELEASE
            </div>
          </div>
        </aside>

        {/* Content Area (Paper Surface) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#EDE4CE] paper-grain">
          <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>

          {/* Hatched caution footer strip */}
          <footer className="w-full bg-[#0C1411] text-[#E9E2CF] border-t border-[#E9E2CF]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-center flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <span className="w-2 h-2 bg-[#F2A900]" />
              <span>SYNTHETIC DEMO DATA · CONCEPT PROTOTYPE · DECISION SUPPORT ONLY</span>
            </div>
            <div className="mx-auto md:mx-0 text-[#E9E2CF]/60">
              AICTE · ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EDE4CE] p-8 font-mono text-xs flex items-center justify-center">
          Loading Statutory Portal Shell...
        </div>
      }
    >
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}
