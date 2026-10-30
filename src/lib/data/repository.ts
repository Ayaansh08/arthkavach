import {
  FDREntity,
  Institution,
  AuditEvent,
  ReleaseRequest,
  SystemRulesConfig,
  FDRFieldComparison,
  BankVerificationRecord,
  UserRole,
} from "@/lib/types";
import {
  SEED_INSTITUTIONS,
  SEED_FDRS,
  SEED_AUDIT_EVENTS,
  SEED_RELEASE_REQUESTS,
  INITIAL_RULES_CONFIG,
} from "./seed";
import { calculateSha256 } from "./crypto";

export interface FDRFilterOptions {
  institutionId?: string;
  status?: string;
  evidenceLevel?: string;
  riskLevel?: string;
  bankName?: string;
  searchQuery?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface IRepository {
  getInstitutions(): Promise<Institution[]>;
  getInstitutionById(id: string): Promise<Institution | null>;
  getFDRs(filters?: FDRFilterOptions): Promise<FDREntity[]>;
  getFDRById(id: string): Promise<FDREntity | null>;
  createFDR(fdr: Partial<FDREntity>): Promise<FDREntity>;
  updateFDR(id: string, updates: Partial<FDREntity>): Promise<FDREntity>;
  checkDuplicateHash(sha256Hash: string): Promise<{ isDuplicate: boolean; existingFdr?: FDREntity }>;
  getReleaseRequests(): Promise<ReleaseRequest[]>;
  getReleaseRequestById(id: string): Promise<ReleaseRequest | null>;
  createReleaseRequest(req: Partial<ReleaseRequest>): Promise<ReleaseRequest>;
  updateReleaseRequest(id: string, updates: Partial<ReleaseRequest>): Promise<ReleaseRequest>;
  getAuditEvents(fdrId?: string): Promise<AuditEvent[]>;
  addAuditEvent(eventData: {
    actor: { name: string; role: UserRole; ipAddress?: string };
    action: string;
    entityType: "FDR" | "INSTITUTION" | "RELEASE_REQUEST" | "SYSTEM_CONFIG" | "USER";
    entityId: string;
    fdrNumber?: string;
    evidenceRef?: string;
    details: string;
  }): Promise<AuditEvent>;
  verifyAuditChain(): Promise<{
    isValid: boolean;
    verifiedCount: number;
    brokenAtSequence?: number;
    genesisHash: string;
    latestHash: string;
    errorDetails?: string;
  }>;
  getSystemRules(): Promise<SystemRulesConfig>;
  updateSystemRules(rules: Partial<SystemRulesConfig>): Promise<SystemRulesConfig>;
  simulateOCR(file: File): Promise<{
    fields: FDRFieldComparison[];
    extractedData: {
      fdrNumber: string;
      bankName: string;
      branchName: string;
      amount: number;
      depositDate: string;
      maturityDate: string;
      interestRate: number;
      jointHolders: string;
      lienMarked: boolean;
    };
    overallConfidence: number;
  }>;
  simulateBankVerification(
    fdrId: string,
    forcedOutcome?: "MATCH" | "MISMATCH" | "PENDING" | "UNAVAILABLE"
  ): Promise<BankVerificationRecord>;
  resetDemoData(): Promise<void>;
}

const STORAGE_KEYS = {
  INSTITUTIONS: "arthkavach_institutions_v1",
  FDRS: "arthkavach_fdrs_v1",
  AUDIT: "arthkavach_audit_v1",
  RELEASES: "arthkavach_releases_v1",
  RULES: "arthkavach_rules_v1",
};

class ClientRepository implements IRepository {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  private load<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private save<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  async getInstitutions(): Promise<Institution[]> {
    return this.load<Institution[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    const list = await this.getInstitutions();
    return list.find((i) => i.id === id) || null;
  }

  async getFDRs(filters?: FDRFilterOptions): Promise<FDREntity[]> {
    let list = this.load<FDREntity[]>(STORAGE_KEYS.FDRS, SEED_FDRS);
    if (!filters) return list;

    if (filters.institutionId) {
      list = list.filter((f) => f.institutionId === filters.institutionId);
    }
    if (filters.status && filters.status !== "ALL") {
      list = list.filter((f) => f.status === filters.status);
    }
    if (filters.evidenceLevel && filters.evidenceLevel !== "ALL") {
      list = list.filter((f) => f.evidenceLevel === filters.evidenceLevel);
    }
    if (filters.riskLevel && filters.riskLevel !== "ALL") {
      list = list.filter((f) => f.riskLevel === filters.riskLevel);
    }
    if (filters.bankName && filters.bankName !== "ALL") {
      list = list.filter((f) => f.bankName === filters.bankName);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.fdrNumber.toLowerCase().includes(q) ||
          f.institutionName.toLowerCase().includes(q) ||
          f.bankName.toLowerCase().includes(q)
      );
    }
    if (filters.minAmount !== undefined) {
      list = list.filter((f) => f.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      list = list.filter((f) => f.amount <= filters.maxAmount!);
    }
    return list;
  }

  async getFDRById(id: string): Promise<FDREntity | null> {
    const list = await this.getFDRs();
    return list.find((f) => f.id === id) || null;
  }

  async createFDR(data: Partial<FDREntity>): Promise<FDREntity> {
    const list = await this.getFDRs();
    const newId = `fdr-${Date.now()}`;
    const newFdr: FDREntity = {
      id: newId,
      fdrNumber: data.fdrNumber || `FDR-${new Date().getFullYear()}-GEN-${Math.floor(100000 + Math.random() * 900000)}`,
      institutionId: data.institutionId || "inst-001",
      institutionName: data.institutionName || "Aryavarta Institute of Technology & Research",
      bankName: data.bankName || "Bharat National Mercantile Bank",
      branchName: data.branchName || "Main Branch",
      ifscCode: data.ifscCode || "BNMB0001001",
      amount: data.amount || 2500000,
      depositDate: data.depositDate || new Date().toISOString().split("T")[0],
      maturityDate: data.maturityDate || new Date(Date.now() + 365 * 3 * 86400000).toISOString().split("T")[0],
      tenureMonths: data.tenureMonths || 36,
      interestRate: data.interestRate || 7.1,
      jointHolders: data.jointHolders || "Member Secretary AICTE & Principal",
      lienMarkedToAicte: data.lienMarkedToAicte ?? true,
      autoRenew: data.autoRenew ?? false,
      evidenceLevel: data.evidenceLevel || "L1",
      status: data.status || "DOCUMENT_SCREENED",
      riskLevel: data.riskLevel || "LOW",
      riskFactors: data.riskFactors || [],
      documents: data.documents || [],
      fieldComparisons: data.fieldComparisons || [],
      bankVerification: data.bankVerification || null,
      previousFdrId: data.previousFdrId || null,
      renewalFdrId: data.renewalFdrId || null,
      releaseRequestId: data.releaseRequestId || null,
      observations: data.observations || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newFdr);
    this.save(STORAGE_KEYS.FDRS, list);

    // Automatically record an audit event for this creation
    await this.addAuditEvent({
      actor: {
        name: "Institution Operator",
        role: "INSTITUTION_ADMIN",
      },
      action: "FDR_SUBMISSION",
      entityType: "FDR",
      entityId: newFdr.id,
      fdrNumber: newFdr.fdrNumber,
      evidenceRef: newFdr.documents[0]?.sha256Hash
        ? `SHA:${newFdr.documents[0].sha256Hash}`
        : "INITIAL_REGISTRATION",
      details: `New Fixed Deposit Receipt registered. Declared principal ₹ ${newFdr.amount.toLocaleString("en-IN")}. Status: ${newFdr.status}.`,
    });

    return newFdr;
  }

  async updateFDR(id: string, updates: Partial<FDREntity>): Promise<FDREntity> {
    const list = await this.getFDRs();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error(`FDR not found: ${id}`);

    const existing = list[idx];
    const updated: FDREntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    this.save(STORAGE_KEYS.FDRS, list);
    return updated;
  }

  async checkDuplicateHash(sha256Hash: string): Promise<{ isDuplicate: boolean; existingFdr?: FDREntity }> {
    const list = await this.getFDRs();
    for (const fdr of list) {
      for (const doc of fdr.documents) {
        if (doc.sha256Hash.toLowerCase() === sha256Hash.toLowerCase()) {
          return { isDuplicate: true, existingFdr: fdr };
        }
      }
    }
    return { isDuplicate: false };
  }

  async getReleaseRequests(): Promise<ReleaseRequest[]> {
    return this.load<ReleaseRequest[]>(STORAGE_KEYS.RELEASES, SEED_RELEASE_REQUESTS);
  }

  async getReleaseRequestById(id: string): Promise<ReleaseRequest | null> {
    const list = await this.getReleaseRequests();
    return list.find((r) => r.id === id) || null;
  }

  async createReleaseRequest(data: Partial<ReleaseRequest>): Promise<ReleaseRequest> {
    const list = await this.getReleaseRequests();
    const newReq: ReleaseRequest = {
      id: `rel-${Date.now()}`,
      fdrId: data.fdrId || "",
      fdrNumber: data.fdrNumber || "",
      institutionId: data.institutionId || "",
      institutionName: data.institutionName || "",
      amount: data.amount || 0,
      requestDate: new Date().toISOString().split("T")[0],
      reason: data.reason || "TENURE_COMPLETED_RENEWAL_WAIVED",
      requiredChecklist: data.requiredChecklist || [],
      stage: "SUBMITTED",
      scrutinyRecommendation: undefined,
      authorityDecision: undefined,
    };
    list.unshift(newReq);
    this.save(STORAGE_KEYS.RELEASES, list);

    // Update parent FDR status to RELEASE_REQUESTED
    if (newReq.fdrId) {
      await this.updateFDR(newReq.fdrId, {
        status: "RELEASE_REQUESTED",
        releaseRequestId: newReq.id,
      });
    }

    await this.addAuditEvent({
      actor: { name: "Institution Trustee", role: "INSTITUTION_ADMIN" },
      action: "RELEASE_REQUEST_SUBMITTED",
      entityType: "RELEASE_REQUEST",
      entityId: newReq.id,
      fdrNumber: newReq.fdrNumber,
      evidenceRef: `REQ:${newReq.id}`,
      details: `Formal lien release & deposit refund request submitted for ${newReq.fdrNumber}. Principal ₹ ${newReq.amount.toLocaleString("en-IN")}.`,
    });

    return newReq;
  }

  async updateReleaseRequest(id: string, updates: Partial<ReleaseRequest>): Promise<ReleaseRequest> {
    const list = await this.getReleaseRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Release request not found");
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    this.save(STORAGE_KEYS.RELEASES, list);
    return updated;
  }

  async getAuditEvents(fdrId?: string): Promise<AuditEvent[]> {
    const list = this.load<AuditEvent[]>(STORAGE_KEYS.AUDIT, SEED_AUDIT_EVENTS);
    if (fdrId) {
      return list.filter((e) => e.entityId === fdrId || e.fdrNumber === fdrId);
    }
    return list;
  }

  async addAuditEvent(eventData: {
    actor: { name: string; role: UserRole; ipAddress?: string };
    action: string;
    entityType: "FDR" | "INSTITUTION" | "RELEASE_REQUEST" | "SYSTEM_CONFIG" | "USER";
    entityId: string;
    fdrNumber?: string;
    evidenceRef?: string;
    details: string;
  }): Promise<AuditEvent> {
    const list = await this.getAuditEvents();
    const lastEvent = list[list.length - 1];
    const previousHash = lastEvent ? lastEvent.currentHash : "0000000000000000000000000000000000000000000000000000000000000000";
    const sequence = list.length + 1;
    const timestamp = new Date().toISOString();

    // Compute cryptographic block hash: SHA-256(previousHash + sequence + timestamp + actor + action + details)
    const blockPayload = `${previousHash}|${sequence}|${timestamp}|${eventData.actor.name}|${eventData.actor.role}|${eventData.action}|${eventData.entityId}|${eventData.details}`;
    const currentHash = await calculateSha256(blockPayload);

    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}-${sequence}`,
      sequence,
      timestamp,
      actor: eventData.actor,
      action: eventData.action,
      entityType: eventData.entityType,
      entityId: eventData.entityId,
      fdrNumber: eventData.fdrNumber,
      evidenceRef: eventData.evidenceRef,
      details: eventData.details,
      previousHash,
      currentHash,
    };

    list.push(newEvent);
    this.save(STORAGE_KEYS.AUDIT, list);
    return newEvent;
  }

  async verifyAuditChain(): Promise<{
    isValid: boolean;
    verifiedCount: number;
    brokenAtSequence?: number;
    genesisHash: string;
    latestHash: string;
    errorDetails?: string;
  }> {
    const list = await this.getAuditEvents();
    if (list.length === 0) {
      return {
        isValid: true,
        verifiedCount: 0,
        genesisHash: "0000000000000000000000000000000000000000000000000000000000000000",
        latestHash: "0000000000000000000000000000000000000000000000000000000000000000",
      };
    }

    let expectedPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";

    for (let i = 0; i < list.length; i++) {
      const evt = list[i];

      // Verify backwards link
      if (evt.previousHash !== expectedPrevHash) {
        return {
          isValid: false,
          verifiedCount: i,
          brokenAtSequence: evt.sequence,
          genesisHash: list[0].currentHash,
          latestHash: list[list.length - 1].currentHash,
          errorDetails: `Hash link mismatch at sequence #${evt.sequence}. Expected ${expectedPrevHash.slice(0, 8)}... but found ${evt.previousHash.slice(0, 8)}...`,
        };
      }

      // Check format
      if (!evt.currentHash || evt.currentHash.length !== 64) {
        return {
          isValid: false,
          verifiedCount: i,
          brokenAtSequence: evt.sequence,
          genesisHash: list[0].currentHash,
          latestHash: list[list.length - 1].currentHash,
          errorDetails: `Invalid SHA-256 hash length at sequence #${evt.sequence}`,
        };
      }

      expectedPrevHash = evt.currentHash;
    }

    return {
      isValid: true,
      verifiedCount: list.length,
      genesisHash: list[0].currentHash,
      latestHash: list[list.length - 1].currentHash,
    };
  }

  async getSystemRules(): Promise<SystemRulesConfig> {
    return this.load<SystemRulesConfig>(STORAGE_KEYS.RULES, INITIAL_RULES_CONFIG);
  }

  async updateSystemRules(rules: Partial<SystemRulesConfig>): Promise<SystemRulesConfig> {
    const current = await this.getSystemRules();
    const updated = { ...current, ...rules };
    this.save(STORAGE_KEYS.RULES, updated);

    await this.addAuditEvent({
      actor: { name: "System Administrator", role: "SYSTEM_ADMIN" },
      action: "SYSTEM_RULES_UPDATED",
      entityType: "SYSTEM_CONFIG",
      entityId: "CONFIG-POLICY",
      details: `Updated monitoring windows to [${updated.warningWindows.join(", ")}] days. Release checklist version: ${updated.version}.`,
    });

    return updated;
  }

  async simulateOCR(file: File): Promise<{
    fields: FDRFieldComparison[];
    extractedData: {
      fdrNumber: string;
      bankName: string;
      branchName: string;
      amount: number;
      depositDate: string;
      maturityDate: string;
      interestRate: number;
      jointHolders: string;
      lienMarked: boolean;
    };
    overallConfidence: number;
  }> {
    // Generate realistic seeded OCR extraction with confidence scores
    void file.name;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const fdrNumber = `FDR-2026-BN-${randomSuffix}`;
    const amount = 2500000;
    const depositDate = new Date().toISOString().split("T")[0];
    const maturityDate = new Date(Date.now() + 3 * 365 * 86400000).toISOString().split("T")[0];

    const fields: FDRFieldComparison[] = [
      {
        field: "fdrNumber",
        label: "Fixed Deposit Number",
        submittedValue: fdrNumber,
        ocrValue: fdrNumber,
        ocrConfidence: 98,
        isMismatch: false,
      },
      {
        field: "amount",
        label: "Deposit Principal (INR)",
        submittedValue: "₹ 25,00,000",
        ocrValue: "₹ 25,00,000",
        ocrConfidence: 96,
        isMismatch: false,
      },
      {
        field: "bankName",
        label: "Issuing Financial Institution",
        submittedValue: "Bharat National Mercantile Bank",
        ocrValue: "Bharat National Mercantile Bank",
        ocrConfidence: 99,
        isMismatch: false,
      },
      {
        field: "maturityDate",
        label: "Maturity Expiry Date",
        submittedValue: maturityDate,
        ocrValue: maturityDate,
        ocrConfidence: 74, // Intentionally medium confidence to demo highlight & human correction
        isMismatch: false,
      },
      {
        field: "lienMarked",
        label: "Lien Clause to AICTE",
        submittedValue: "Lien Marked to AICTE",
        ocrValue: "Lien Marked in favour of Member Secretary, AICTE",
        ocrConfidence: 92,
        isMismatch: false,
      },
    ];

    return {
      fields,
      extractedData: {
        fdrNumber,
        bankName: "Bharat National Mercantile Bank",
        branchName: "Institutional Hub Branch",
        amount,
        depositDate,
        maturityDate,
        interestRate: 7.2,
        jointHolders: "Member Secretary AICTE & Principal",
        lienMarked: true,
      },
      overallConfidence: 91.8,
    };
  }

  async simulateBankVerification(
    fdrId: string,
    forcedOutcome?: "MATCH" | "MISMATCH" | "PENDING" | "UNAVAILABLE"
  ): Promise<BankVerificationRecord> {
    const fdr = await this.getFDRById(fdrId);
    if (!fdr) throw new Error("FDR not found");

    const outcome = forcedOutcome || "MATCH";
    const refNum = `SFMS-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString();

    let record: BankVerificationRecord;

    if (outcome === "MATCH") {
      record = {
        verifiedAt: timestamp,
        source: "SFMS / Core Banking Direct Interconnect (Simulated)",
        status: "MATCH",
        confirmedFields: ["fdrNumber", "amount", "maturityDate", "lienMarked", "accountStatus"],
        referenceNumber: refNum,
        rawResponseCode: "RESP_200_MATCH_CONFIRMED",
        notes: "Direct SFMS verification confirmed. Scope: principal, tenure, lien and account active status.",
      };
      await this.updateFDR(fdrId, {
        evidenceLevel: "L3",
        status: "BANK_CONFIRMED",
        bankVerification: record,
      });
      await this.addAuditEvent({
        actor: { name: "SFMS Gateway Automated", role: "SYSTEM_ADMIN" },
        action: "BANK_SFMS_MATCH_RECEIVED",
        entityType: "FDR",
        entityId: fdr.id,
        fdrNumber: fdr.fdrNumber,
        evidenceRef: refNum,
        details: `SFMS Match Telemetry confirmed for ${fdr.fdrNumber}. Level 3 Bank-Confirmed status anchored.`,
      });
    } else if (outcome === "MISMATCH") {
      record = {
        verifiedAt: timestamp,
        source: "SFMS Core Gateway (Simulated)",
        status: "MISMATCH",
        confirmedFields: ["fdrNumber"],
        referenceNumber: refNum,
        rawResponseCode: "RESP_409_FIELD_DISCREPANCY",
        notes: "Bank reports amount in ledger is ₹5,00,000 less than submitted claim.",
      };
      await this.updateFDR(fdrId, {
        status: "DISCREPANCY_UNDER_REVIEW",
        riskLevel: "CRITICAL",
        bankVerification: record,
        riskFactors: [
          ...fdr.riskFactors,
          {
            code: "BANK_CONFIRMED_MISMATCH",
            label: "Bank Ledger Mismatch",
            severity: "alert",
            description: "Issuing bank SFMS feed returned discrepant principal amount.",
          },
        ],
      });
      await this.addAuditEvent({
        actor: { name: "SFMS Gateway Automated", role: "SYSTEM_ADMIN" },
        action: "BANK_MISMATCH_DISCREPANCY",
        entityType: "FDR",
        entityId: fdr.id,
        fdrNumber: fdr.fdrNumber,
        evidenceRef: refNum,
        details: `Discrepancy detected via SFMS for ${fdr.fdrNumber}. Escalated to Critical Discrepancy Queue.`,
      });
    } else if (outcome === "UNAVAILABLE") {
      record = {
        verifiedAt: timestamp,
        source: "Rural Co-op Gateway Hub (Simulated)",
        status: "UNAVAILABLE",
        confirmedFields: [],
        referenceNumber: `ERR-503-${refNum}`,
        rawResponseCode: "RESP_503_ENDPOINT_TIMED_OUT",
        notes: "Bank API gateway offline. Per Section 11 truthfulness rules: Unavailable NEVER produces verified state.",
      };
      await this.updateFDR(fdrId, {
        status: "AWAITING_CONFIRMATION",
        bankVerification: record,
      });
      await this.addAuditEvent({
        actor: { name: "Gateway Monitor", role: "SYSTEM_ADMIN" },
        action: "BANK_GATEWAY_UNAVAILABLE",
        entityType: "FDR",
        entityId: fdr.id,
        fdrNumber: fdr.fdrNumber,
        evidenceRef: record.referenceNumber,
        details: `Telemetry offline for ${fdr.bankName}. Status strictly held at Awaiting Independent Confirmation.`,
      });
    } else {
      // PENDING
      record = {
        verifiedAt: timestamp,
        source: "Inter-bank Queue (Simulated)",
        status: "PENDING",
        confirmedFields: [],
        referenceNumber: `Q-${refNum}`,
        rawResponseCode: "RESP_102_PROCESSING",
        notes: "Batch transmission queued with settlement agency.",
      };
      await this.updateFDR(fdrId, {
        bankVerification: record,
      });
    }

    return record;
  }

  async resetDemoData(): Promise<void> {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.INSTITUTIONS);
    localStorage.removeItem(STORAGE_KEYS.FDRS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.RELEASES);
    localStorage.removeItem(STORAGE_KEYS.RULES);
  }
}

// Singleton repository export
export const repository: IRepository = new ClientRepository();
