# ARTHKAVACH · अर्थकवच

### सुरक्षा · सतर्कता · सत्यता
**Security · Vigilance · Truthfulness**

> A statutory decision-support prototype for AICTE to manage Fixed Deposit Receipts (FDRs) submitted by institutions as Security Deposits. Built for **Smart India Hackathon**.

ARTHKAVACH keeps an evidence-backed, hash-chained ledger of every FDR instrument. It separates what an institution *submitted* from what a bank *confirmed* — and never silently upgrades one into the other. Every event is signed in order. No auto-approvals. No ambiguity about evidence level.

---

## Key Features

| Feature | Description |
|---|---|
| **3-Level Evidence Scale** | L1 Document-Screened (hollow ring) → L2 Digitally Evidenced (half-filled brass ring) → L3 Bank-Confirmed (solid green ring). A record never claims a higher level without hard evidence. |
| **SHA-256 Cryptographic Fingerprinting** | Real client-side `window.crypto.subtle` hashing of uploaded PDFs. Duplicate hash collision detection runs against all stored fingerprints. |
| **Hash-Chained Audit Trail** | Each audit event stores `previousHash` and its own `eventHash`. The "Verify Chain" button recomputes the entire chain and reports intact or broken — without a server. |
| **Simulated OCR Extraction** | Mock scanning animation returns seeded field values with per-field confidence scores. Low-confidence fields are highlighted for human correction; corrections store old value, new value, reason, and actor. |
| **Mock Bank Verification** | Returns one of: `match`, `mismatch`, `pending`, `unavailable`. Bank-unavailable **never** produces a verified state. Maker-Checker: scrutiny officer recommends, approving authority decides — a human always decides. |
| **Injectable Demo Clock** | A global clock with a date-picker + "Advance 30 days" button in the demo toolbar. All maturity alerts and overdue flags read this clock, never `Date.now()`. |
| **Role-Based Access** | Four roles: Institution Admin, AICTE Scrutiny Officer, AICTE Approving Authority, System Admin. Route guards per role with a mock MFA (TOTP) step. |
| **Maturity Warning Calendar** | Month-view surveillance calendar with configurable warning windows (90 / 60 / 30 / 15 / 7 days). |
| **IFAS Scoring** | Internal Financial Assurance Score with fully transparent formula inputs. Labelled *"internal monitoring indicator, not an official rating"* everywhere it appears. |
| **Multi-Filter Reports + CSV Export** | Filter by institution, bank, status, amount band, and date range. Real in-browser CSV download. |
| **Statutory Release Workflow** | 5-point readiness checklist (maturity date passed, no discrepancy, bank-confirmed, no liens, docs complete) with a workflow stage tracker. |
| **Reset Demo Data** | One-click restoration of all seed data from the demo toolbar. |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.4.3** — App Router, Turbopack, Partial Prerender (`cacheComponents`) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS** v4 — design tokens as CSS variables in `tailwind.config.ts` |
| State | **Zustand** with `persist` middleware (localStorage) |
| Crypto | **Web Crypto API** (`window.crypto.subtle`) — no external library |
| Icons | **Lucide React** |
| UI Primitives | **shadcn/ui** (Dialog, Tabs, Table, Calendar, DropdownMenu, Tooltip) — fully restyled |
| React | **React 19** |

---

## Design System

ARTHKAVACH uses a **security-print ledger** aesthetic — the visual language of Indian banknote security printing, bahi-khata ledgers, and Swiss data sheets.

| Token | Value | Role |
|---|---|---|
| `--vault-ink` | `#0C1411` | Dominant dark (green-black) |
| `--ledger-paper` | `#EDE4CE` | Dominant light surface |
| `--paper-lift` | `#F6F0E0` | Raised surface |
| `--seal-marigold` | `#F2A900` | Primary CTA, focus ring, active state |
| `--stamp-red` | `#C4301C` | Discrepancy, overdue, AWAITING stamp |
| `--l3-green` | `#1E8A5A` | Bank-Confirmed evidence |
| `--l2-brass` | `#B5832A` | Digitally Evidenced |
| `--l1-graphite` | `#8C9187` | Document-Screened |

**Typography:** Big Shoulders Display (headings) · IBM Plex Sans (UI/body) · IBM Plex Mono (data, hashes, timestamps) · Noto Serif Devanagari (tagline).

**Rules:** Zero border-radius (except circular seals). Hard offset box shadows only (`6px 6px 0 ink`), no blurred shadows. Hairline `1px` borders. Double rule (`2px + 1px`, `2px gap`) for primary containers. Procedurally generated guilloche SVG rosettes as watermarks.

See the full token showcase at [`/design-system`](http://localhost:3000/design-system).

---

## Getting Started

```bash
# Clone / navigate to the project
cd e:\Projects\arthkavach

# Install dependencies
npm install

# Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build (verify zero errors/warnings)
npm run build

# Lint
npm run lint
```

> **No backend required.** All data is persisted in `localStorage` under `arthkavach_*_v1` keys.

---

## Quick Navigation

| URL | Screen |
|---|---|
| `/` | Landing page (guilloche hero, verification ladder, hash-chained ledger) |
| `/sign-in` | Role-picker + mock MFA |
| `/design-system` | Full design token showcase |
| `/institution/dashboard` | Institution FDR dashboard |
| `/institution/submit` | 4-stage FDR intake (metadata → upload/hash → OCR review → commit) |
| `/institution/fdr/[id]` | FDR detail (5 tabs: Overview, Evidence, Lifecycle, Documents, Renewal chain) |
| `/institution/release` | Lien release petition workflow |
| `/aicte/overview` | AICTE command centre (KPIs, SVG charts, attention queue) |
| `/aicte/review/[id]` | Case review — maker-checker, mock bank verification, observations |
| `/aicte/maturity-calendar` | Surveillance calendar with warning windows |
| `/aicte/institutions` | Institution directory with IFAS breakdown |
| `/aicte/reports` | Multi-filter reports + CSV export |
| `/aicte/audit` | Global hash-chained audit trail + chain verifier |
| `/admin` | Configurable rules, warning windows, release checklist, RBAC directory |

---

## Demo Walkthrough

1. **Landing** — observe the ledger-tape marquee, guilloche hero, and scroll through the pinned Verification Ladder (hollow → half → solid ring).
2. **Sign in** as **Institution Admin** → mock MFA step → institution dashboard.
3. **Submit FDR** — drag-drop a PDF, watch SHA-256 hashing, simulate OCR with confidence scores, correct a low-confidence field, submit.
4. **Try submitting the same file again** — duplicate hash collision is detected and blocked.
5. **View FDR detail** — Evidence tab shows submitted vs. OCR vs. bank field comparison with field-level mismatch highlighting.
6. **Advance the demo clock** (demo toolbar) by 30 days to trigger expiry warnings.
7. **Switch role** to **AICTE Scrutiny Officer** — AICTE Overview shows updated KPI strip and attention queue ranked by explainable risk.
8. **Open Case Review** — trigger mock bank verification; try the "unavailable" path and confirm it cannot produce L3.
9. **Record an observation** — scrutiny officer recommends; switch to **Approving Authority** to decide.
10. **Maturity Calendar** — observe colour-coded warning bands driven by the demo clock.
11. **Reports** — apply institution + status filters; download CSV.
12. **Audit trail** — click "Verify Chain" to confirm cryptographic integrity; manually corrupt a hash in localStorage and re-verify to see a broken-chain report.
13. **Reset demo data** (demo toolbar) — all seed data is restored instantly.

---

## What's Real vs. Simulated

| Capability | Status |
|---|---|
| SHA-256 file fingerprinting (`window.crypto.subtle`) | ✅ Real |
| Duplicate hash detection | ✅ Real |
| SHA-256 hash-chained audit log (chain verification) | ✅ Real |
| CSV export | ✅ Real |
| Role-based route guards | ✅ Real (client-side) |
| OCR extraction | 🔶 Simulated (seeded field values + confidence scores) |
| Bank verification / SFMS | 🔶 Simulated (configurable outcome: match / mismatch / pending / unavailable) |
| MFA / TOTP | 🔶 Simulated (any 6-digit code is accepted) |
| Email / notifications | ❌ Not implemented |

---

## Role Access

| Role | Access |
|---|---|
| **Institution Admin** | Submit FDR, view own FDRs, initiate release request |
| **AICTE Scrutiny Officer** | AICTE overview, case review (recommend), maturity calendar, institutions list, reports, audit trail |
| **AICTE Approving Authority** | All Officer screens + final decision on maker-checker observations |
| **System Admin** | All screens + admin panel (rules config, RBAC directory) |

---

## Seed Data

The prototype ships with **12 fictional institutions** and **12 seed FDRs** covering every edge case:

- ✅ L3 Bank-Confirmed
- 🔶 L2 Digitally Evidenced
- ⬡ L1 Document-Screened
- 🔴 Discrepancy under review (amount mismatch case)
- 🔴 Duplicate hash collision case
- ⚠️ Bank-unavailable case (cannot achieve L3)
- ⏰ Expiring within 30 days
- ❗ Matured / overdue
- 🔗 Renewal chain (old FDR → new FDR linked)
- 📋 Release requested
- ✔️ Released / closed

Institutions, FDR numbers, bank names, amounts, and dates are entirely synthetic. No real financial data.

---

## localStorage Keys

| Key | Contents |
|---|---|
| `arthkavach_institutions_v1` | 12 seed institutions |
| `arthkavach_fdrs_v1` | 12 seed FDRs |
| `arthkavach_audit_v1` | 10 seed audit events (hash-chained) |
| `arthkavach_releases_v1` | 1 seed release request |
| `arthkavach_rules_v1` | Configurable policy rules |
| `arthkavach_demo_state_v1` | Demo clock offset, active role, MFA state |

Use the **Reset Demo Data** button in the demo toolbar to restore all of the above to their seeded values.

---

## Important Notices

> **SYNTHETIC DATA ONLY** — No real institution, bank, FDR, or financial figure appears anywhere in this prototype. All names, amounts, and document references are procedurally invented.

> **NOT A LIVE GATEWAY** — Mock bank verification does not connect to SFMS, NeSL, or any banking system. "Bank-Confirmed" status in the demo is a simulation and carries no legal weight.

> **DECISION SUPPORT PROTOTYPE** — ARTHKAVACH is a concept prototype submitted for Smart India Hackathon evaluation. It is not production software.

> **IFAS DISCLAIMER** — The Institutional Financial Assurance Score is an internal monitoring indicator only. It is not an official AICTE rating or accreditation metric.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── sign-in/                # Role-picker + mock MFA
│   ├── design-system/          # Design token showcase
│   ├── institution/            # Institution portal
│   │   ├── dashboard/
│   │   ├── submit/
│   │   ├── fdr/[id]/
│   │   └── release/
│   ├── aicte/                  # AICTE command centre
│   │   ├── overview/
│   │   ├── review/[id]/
│   │   ├── maturity-calendar/
│   │   ├── institutions/
│   │   ├── reports/
│   │   └── audit/
│   └── admin/
├── components/
│   └── ui/
│       ├── app-shell.tsx       # Vault Ink side rail + Suspense wrapper
│       ├── demo-toolbar.tsx    # Demo Clock, role switcher, reset
│       ├── guilloche.tsx       # Procedural SVG spirograph watermark
│       ├── status-ring.tsx     # L1/L2/L3 evidence glyphs
│       ├── stamp.tsx           # Rubber stamp component
│       ├── hash-chip.tsx       # SHA-256 truncated display + copy
│       ├── risk-flag.tsx       # Explainable risk flags
│       ├── evidence-compare.tsx # 3-way field comparison table
│       ├── receipt-card.tsx    # Specimen FDR card with tilt
│       ├── verification-ladder.tsx
│       ├── chained-ledger.tsx  # Hash-chain viewer + verifier
│       └── ledger-table.tsx    # Generic bahi-khata table
└── lib/
    ├── types/index.ts          # Full TypeScript domain types
    ├── data/
    │   ├── crypto.ts           # Web Crypto SHA-256 utilities
    │   ├── seed.ts             # Synthetic seed data
    │   └── repository.ts       # IRepository interface + localStorage impl
    └── store/
        └── demo-store.ts       # Zustand store (clock, role, MFA)
```

---

*ARTHKAVACH — Smart India Hackathon · Concept Prototype · Not for production use.*
