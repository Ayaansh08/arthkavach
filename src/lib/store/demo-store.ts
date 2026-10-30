"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserRole } from "@/lib/types";

interface DemoState {
  // Current demo time (stored as ISO string, initialized to current local demo anchor 2026-10-30T10:00:00Z)
  currentDateIso: string;
  setDemoDate: (dateIso: string) => void;
  advanceDays: (days: number) => void;
  resetDemoDate: () => void;

  // Active Role and Auth State
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserInstitutionId?: string;
  isAuthenticated: boolean;
  isMfaVerified: boolean;
  setRole: (role: UserRole) => void;
  login: (role: UserRole, name?: string, institutionId?: string) => void;
  logout: () => void;
  verifyMfa: () => void;

  // Quick Simulation Controls
  isScanningSimulation: boolean;
  setScanningSimulation: (val: boolean) => void;
}

const DEFAULT_DEMO_DATE = "2026-10-30T10:00:00Z";

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  INSTITUTION_ADMIN: "Dr. Suresh Chandra Trivedi (Aryavarta Tech)",
  AICTE_SCRUTINY_OFFICER: "R. K. Saxena (Regional Scrutiny Officer)",
  AICTE_APPROVING_AUTHORITY: "Dr. Anupam Shrivastava (Director Approvals)",
  SYSTEM_ADMIN: "S. K. Verma (Lead System Auditor)",
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      currentDateIso: DEFAULT_DEMO_DATE,
      setDemoDate: (dateIso: string) => set({ currentDateIso: dateIso }),
      advanceDays: (days: number) => {
        const current = new Date(get().currentDateIso);
        current.setDate(current.getDate() + days);
        set({ currentDateIso: current.toISOString() });
      },
      resetDemoDate: () => set({ currentDateIso: DEFAULT_DEMO_DATE }),

      currentUserRole: "INSTITUTION_ADMIN",
      currentUserName: ROLE_DISPLAY_NAMES["INSTITUTION_ADMIN"],
      currentUserInstitutionId: "inst-001",
      isAuthenticated: true,
      isMfaVerified: true,

      setRole: (role: UserRole) => {
        set({
          currentUserRole: role,
          currentUserName: ROLE_DISPLAY_NAMES[role],
          currentUserInstitutionId: role === "INSTITUTION_ADMIN" ? "inst-001" : undefined,
        });
      },

      login: (role: UserRole, name?: string, institutionId?: string) => {
        set({
          currentUserRole: role,
          currentUserName: name || ROLE_DISPLAY_NAMES[role],
          currentUserInstitutionId: institutionId || (role === "INSTITUTION_ADMIN" ? "inst-001" : undefined),
          isAuthenticated: true,
          isMfaVerified: false, // forces MFA step on fresh login
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isMfaVerified: false,
        });
      },

      verifyMfa: () => set({ isMfaVerified: true }),

      isScanningSimulation: false,
      setScanningSimulation: (val: boolean) => set({ isScanningSimulation: val }),
    }),
    {
      name: "arthkavach_demo_state_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Global helper function to get current timestamp from the Demo Clock.
 * Ensures the entire app respects the demo clock rather than live Date.now().
 */
export function getDemoCurrentDate(): Date {
  if (typeof window !== "undefined") {
    try {
      const state = useDemoStore.getState();
      if (state && state.currentDateIso) {
        return new Date(state.currentDateIso);
      }
    } catch {
      // fallback
    }
  }
  return new Date(DEFAULT_DEMO_DATE);
}

/**
 * Calculates days remaining from demo clock date to target maturity date.
 * Positive = days left until maturity
 * Negative = overdue days
 */
export function getDaysUntilMaturity(targetDateStr: string): number {
  const current = getDemoCurrentDate();
  const target = new Date(targetDateStr);
  const diffTime = target.getTime() - current.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
