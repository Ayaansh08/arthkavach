export type UserRole =
  | "INSTITUTION_ADMIN"
  | "AICTE_SCRUTINY_OFFICER"
  | "AICTE_APPROVING_AUTHORITY"
  | "SYSTEM_ADMIN";

export type EvidenceLevel = "L1" | "L2" | "L3";
// L1 = Document-screened (Graphite, Hollow ring)
// L2 = Digitally evidenced (Brass, Half-filled ring)
// L3 = Bank-confirmed (Green, Solid ring with check notch)

export type FDRStatus =
  | "AWAITING_CONFIRMATION"
  | "DOCUMENT_SCREENED"
  | "DIGITALLY_EVIDENCED"
  | "BANK_CONFIRMED"
  | "DISCREPANCY_UNDER_REVIEW"
  | "EXPIRING_SOON"
  | "MATURED_OVERDUE"
  | "RENEWED"
  | "RELEASE_REQUESTED"
  | "RELEASED_CLOSED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskFactor {
  code: string;
  label: string;
  severity: "info" | "warning" | "alert";
  description: string;
}

export interface FDRFieldComparison {
  field: string;
  label: string;
  submittedValue: string;
  ocrValue: string;
  ocrConfidence: number; // 0 to 100
  isCorrected?: boolean;
  correctionReason?: string;
  correctedBy?: string;
  bankConfirmedValue?: string | null;
  bankConfirmedScope?: boolean;
  isMismatch?: boolean;
}

export interface BankVerificationRecord {
  verifiedAt: string; // ISO date
  source: string; // e.g. "SFMS / NEFT Core Interface (Simulated)"
  status: "MATCH" | "MISMATCH" | "PENDING" | "UNAVAILABLE";
  confirmedFields: string[]; // e.g. ["amount", "maturityDate", "lienMarked"]
  referenceNumber: string;
  rawResponseCode: string;
  notes?: string;
}

export interface FDRDocument {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  uploadedAt: string;
  uploadedBy: string;
  docType: "FDR_CERTIFICATE" | "LIEN_LETTER" | "COVERING_LETTER" | "BANK_CONFIRMATION_SLIP";
}

export interface FDREntity {
  id: string;
  fdrNumber: string;
  institutionId: string;
  institutionName: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  amount: number; // in INR
  depositDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
  tenureMonths: number;
  interestRate: number; // percentage
  jointHolders: string; // e.g. "Member Secretary, AICTE & Principal"
  lienMarkedToAicte: boolean;
  autoRenew: boolean;
  evidenceLevel: EvidenceLevel;
  status: FDRStatus;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  documents: FDRDocument[];
  fieldComparisons: FDRFieldComparison[];
  bankVerification?: BankVerificationRecord | null;
  previousFdrId?: string | null; // for renewal chains
  renewalFdrId?: string | null;
  releaseRequestId?: string | null;
  observations: Array<{
    id: string;
    createdAt: string;
    authorRole: UserRole;
    authorName: string;
    text: string;
    type: "OBSERVATION" | "CLARIFICATION_REQUEST" | "RECOMMENDATION" | "DECISION";
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  aictePermanentId: string;
  name: string;
  state: string;
  district: string;
  category: "ENGINEERING" | "MANAGEMENT" | "PHARMACY" | "ARCHITECTURE" | "POLYTECHNIC";
  totalFdrCount: number;
  totalDepositAmount: number;
  activeFdrCount: number;
  ifasScore: {
    overall: number; // 0 to 100
    timelyRenewalScore: number;
    evidenceQualityScore: number;
    mismatchIncidentScore: number;
    bankDiversityScore: number;
    formulaExplanation: string;
  };
  contactEmail: string;
  contactPhone: string;
  adminName: string;
}

export interface AuditEvent {
  id: string;
  sequence: number;
  timestamp: string;
  actor: {
    name: string;
    role: UserRole;
    ipAddress?: string;
  };
  action: string;
  entityType: "FDR" | "INSTITUTION" | "RELEASE_REQUEST" | "SYSTEM_CONFIG" | "USER";
  entityId: string;
  fdrNumber?: string;
  evidenceRef?: string;
  details: string;
  previousHash: string;
  currentHash: string; // real SHA-256
}

export interface ReleaseRequest {
  id: string;
  fdrId: string;
  fdrNumber: string;
  institutionId: string;
  institutionName: string;
  amount: number;
  requestDate: string;
  reason: "COURSE_CLOSURE" | "INTAKE_REDUCTION" | "TENURE_COMPLETED_RENEWAL_WAIVED" | "TRUST_DISSOLUTION";
  requiredChecklist: Array<{
    item: string;
    status: "ATTACHED" | "VERIFIED" | "PENDING";
    notes?: string;
  }>;
  stage: "SUBMITTED" | "SCRUTINY_REVIEW" | "FINANCE_VERIFICATION" | "AUTHORITY_APPROVAL" | "COMPLETED" | "REJECTED";
  scrutinyRecommendation?: "RECOMMEND_RELEASE" | "SEEK_CLARIFICATION" | "RECOMMEND_REJECTION";
  scrutinyNotes?: string;
  authorityDecision?: "APPROVED" | "REJECTED";
  authorityNotes?: string;
  authorityDecisionDate?: string;
}

export interface SystemRulesConfig {
  version: string;
  effectiveDate: string;
  warningWindows: number[]; // e.g. [90, 60, 30, 15, 7]
  requiredReleaseChecklist: string[];
  autoFlagOverdueDays: number;
  discrepancyThresholdPct: number;
}
