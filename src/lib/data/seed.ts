import { Institution, FDREntity, AuditEvent, ReleaseRequest, SystemRulesConfig } from "@/lib/types";

export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: "inst-001",
    aictePermanentId: "1-492817291",
    name: "Aryavarta Institute of Technology & Research",
    state: "Uttar Pradesh",
    district: "Varanasi",
    category: "ENGINEERING",
    totalFdrCount: 4,
    totalDepositAmount: 14500000,
    activeFdrCount: 3,
    ifasScore: {
      overall: 92,
      timelyRenewalScore: 95,
      evidenceQualityScore: 90,
      mismatchIncidentScore: 94,
      bankDiversityScore: 88,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "registrar@aryavarta-tech.edu.in",
    contactPhone: "+91 542 229 1082",
    adminName: "Dr. Suresh Chandra Trivedi"
  },
  {
    id: "inst-002",
    aictePermanentId: "1-839201948",
    name: "Sahyadri Academy of Pharmaceutical Sciences",
    state: "Maharashtra",
    district: "Pune",
    category: "PHARMACY",
    totalFdrCount: 3,
    totalDepositAmount: 8500000,
    activeFdrCount: 2,
    ifasScore: {
      overall: 78,
      timelyRenewalScore: 75,
      evidenceQualityScore: 82,
      mismatchIncidentScore: 70,
      bankDiversityScore: 85,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "accounts@sahyadri-pharma.ac.in",
    contactPhone: "+91 20 2569 8812",
    adminName: "Prof. Anjali Deshmukh"
  },
  {
    id: "inst-003",
    aictePermanentId: "1-729104819",
    name: "Kalinga Institute of Management & Governance",
    state: "Odisha",
    district: "Bhubaneswar",
    category: "MANAGEMENT",
    totalFdrCount: 4,
    totalDepositAmount: 12000000,
    activeFdrCount: 3,
    ifasScore: {
      overall: 88,
      timelyRenewalScore: 90,
      evidenceQualityScore: 85,
      mismatchIncidentScore: 92,
      bankDiversityScore: 84,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "finance@kalinga-img.org",
    contactPhone: "+91 674 230 4491",
    adminName: "Sri Bikram K. Mohanty"
  },
  {
    id: "inst-004",
    aictePermanentId: "1-610294829",
    name: "Vindhya Polytechnic & Skill Institute",
    state: "Madhya Pradesh",
    district: "Rewa",
    category: "POLYTECHNIC",
    totalFdrCount: 3,
    totalDepositAmount: 5500000,
    activeFdrCount: 2,
    ifasScore: {
      overall: 64,
      timelyRenewalScore: 60,
      evidenceQualityScore: 68,
      mismatchIncidentScore: 58,
      bankDiversityScore: 72,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "principal@vindhyapoly.edu.in",
    contactPhone: "+91 7662 254 901",
    adminName: "Er. Rameshwar Shukla"
  },
  {
    id: "inst-005",
    aictePermanentId: "1-992019481",
    name: "Chola School of Architecture & Town Planning",
    state: "Tamil Nadu",
    district: "Thanjavur",
    category: "ARCHITECTURE",
    totalFdrCount: 3,
    totalDepositAmount: 9000000,
    activeFdrCount: 3,
    ifasScore: {
      overall: 95,
      timelyRenewalScore: 98,
      evidenceQualityScore: 96,
      mismatchIncidentScore: 95,
      bankDiversityScore: 90,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "dean@chola-arch.ac.in",
    contactPhone: "+91 4362 231 774",
    adminName: "Ar. Soundararajan S."
  },
  {
    id: "inst-006",
    aictePermanentId: "1-558291039",
    name: "Brahmaputra Engineering College",
    state: "Assam",
    district: "Guwahati",
    category: "ENGINEERING",
    totalFdrCount: 4,
    totalDepositAmount: 16000000,
    activeFdrCount: 3,
    ifasScore: {
      overall: 82,
      timelyRenewalScore: 85,
      evidenceQualityScore: 80,
      mismatchIncidentScore: 82,
      bankDiversityScore: 81,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "bursar@brahmaputra-engg.ac.in",
    contactPhone: "+91 361 258 4930",
    adminName: "Dr. Himanta K. Barua"
  },
  {
    id: "inst-007",
    aictePermanentId: "1-447192837",
    name: "Malabar Institute of Advanced Technology",
    state: "Kerala",
    district: "Kozhikode",
    category: "ENGINEERING",
    totalFdrCount: 3,
    totalDepositAmount: 11500000,
    activeFdrCount: 2,
    ifasScore: {
      overall: 91,
      timelyRenewalScore: 92,
      evidenceQualityScore: 94,
      mismatchIncidentScore: 90,
      bankDiversityScore: 88,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "fdr@malabar-tech.in",
    contactPhone: "+91 495 272 1993",
    adminName: "Shri K. P. Namboodiri"
  },
  {
    id: "inst-008",
    aictePermanentId: "1-338291823",
    name: "Marwar College of Management & Technology",
    state: "Rajasthan",
    district: "Jodhpur",
    category: "MANAGEMENT",
    totalFdrCount: 3,
    totalDepositAmount: 7500000,
    activeFdrCount: 2,
    ifasScore: {
      overall: 59,
      timelyRenewalScore: 50,
      evidenceQualityScore: 65,
      mismatchIncidentScore: 54,
      bankDiversityScore: 70,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "trustee@marwar-mgmt.org",
    contactPhone: "+91 291 264 8831",
    adminName: "Choudhary Mahendra Singh"
  },
  {
    id: "inst-009",
    aictePermanentId: "1-229104728",
    name: "Utkal Polytechnic for Women",
    state: "Odisha",
    district: "Cuttack",
    category: "POLYTECHNIC",
    totalFdrCount: 3,
    totalDepositAmount: 4800000,
    activeFdrCount: 3,
    ifasScore: {
      overall: 89,
      timelyRenewalScore: 90,
      evidenceQualityScore: 88,
      mismatchIncidentScore: 92,
      bankDiversityScore: 84,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "polytechnic@utkalwomen.ac.in",
    contactPhone: "+91 671 241 3320",
    adminName: "Smt. Manasi Patnaik"
  },
  {
    id: "inst-010",
    aictePermanentId: "1-118293746",
    name: "Himalayan Institute of Pharmaceutical Sciences",
    state: "Uttarakhand",
    district: "Dehradun",
    category: "PHARMACY",
    totalFdrCount: 4,
    totalDepositAmount: 13000000,
    activeFdrCount: 3,
    ifasScore: {
      overall: 84,
      timelyRenewalScore: 88,
      evidenceQualityScore: 85,
      mismatchIncidentScore: 81,
      bankDiversityScore: 80,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "admin@himalayan-pharma.edu.in",
    contactPhone: "+91 135 277 8492",
    adminName: "Dr. Vinod Rawat"
  },
  {
    id: "inst-011",
    aictePermanentId: "1-904819203",
    name: "Kakatiya Institute of Engineering & Technology",
    state: "Telangana",
    district: "Warangal",
    category: "ENGINEERING",
    totalFdrCount: 3,
    totalDepositAmount: 15000000,
    activeFdrCount: 2,
    ifasScore: {
      overall: 73,
      timelyRenewalScore: 68,
      evidenceQualityScore: 78,
      mismatchIncidentScore: 72,
      bankDiversityScore: 76,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "treasurer@kakatiya-engg.org",
    contactPhone: "+91 870 245 9911",
    adminName: "Sri G. Venkateswarlu"
  },
  {
    id: "inst-012",
    aictePermanentId: "1-817293846",
    name: "Patliputra Academy of Architecture",
    state: "Bihar",
    district: "Patna",
    category: "ARCHITECTURE",
    totalFdrCount: 3,
    totalDepositAmount: 8000000,
    activeFdrCount: 2,
    ifasScore: {
      overall: 80,
      timelyRenewalScore: 82,
      evidenceQualityScore: 81,
      mismatchIncidentScore: 79,
      bankDiversityScore: 78,
      formulaExplanation: "IFAS = 0.35(TimelyRenewal) + 0.25(EvidenceQuality) + 0.25(LowMismatch) + 0.15(BankDiversity)"
    },
    contactEmail: "registrar@patliputra-arch.edu.in",
    contactPhone: "+91 612 228 3409",
    adminName: "Prof. Alok Kumar Sinha"
  }
];

export const INITIAL_RULES_CONFIG: SystemRulesConfig = {
  version: "4.2-POLICY-2026",
  effectiveDate: "2026-04-01",
  warningWindows: [90, 60, 30, 15, 7],
  requiredReleaseChecklist: [
    "AICTE Regional Office Inspection Clearance Letter",
    "Trustees Board Resolution for Course Closure / Amalgamation",
    "No Dues & Salary Disbursement Certificate to Faculty/Staff",
    "Student Transfer & Degree Completion Compliance Report",
    "Lien-Release Consent Letter from Financing / Deposit Bank"
  ],
  autoFlagOverdueDays: 1,
  discrepancyThresholdPct: 0.05
};

export const SEED_FDRS: FDREntity[] = [
  // 1. BANK CONFIRMED (L3) - Flagship specimen FDR
  {
    id: "fdr-001",
    fdrNumber: "FDR-2024-BH-00481920",
    institutionId: "inst-001",
    institutionName: "Aryavarta Institute of Technology & Research",
    bankName: "Bharat National Mercantile Bank",
    branchName: "Cantonment Branch, Varanasi",
    ifscCode: "BNMB0001428",
    amount: 3500000,
    depositDate: "2024-03-15",
    maturityDate: "2027-03-15",
    tenureMonths: 36,
    interestRate: 7.25,
    jointHolders: "Regional Officer, AICTE Kanpur & Member Secretary, Aryavarta Trust",
    lienMarkedToAicte: true,
    autoRenew: true,
    evidenceLevel: "L3",
    status: "BANK_CONFIRMED",
    riskLevel: "LOW",
    riskFactors: [],
    documents: [
      {
        id: "doc-001-a",
        fileName: "FDR_00481920_Original_Scan.pdf",
        fileSize: 1420580,
        mimeType: "application/pdf",
        sha256Hash: "8f48a1c9e3b7492c60e1d09e74bb7a349071c84b12dfc8369408b1a23805f77a",
        uploadedAt: "2024-03-16T10:30:00Z",
        uploadedBy: "Dr. Suresh Chandra Trivedi",
        docType: "FDR_CERTIFICATE"
      },
      {
        id: "doc-001-b",
        fileName: "BNMB_Lien_Confirmation_Letter.pdf",
        fileSize: 840290,
        mimeType: "application/pdf",
        sha256Hash: "d41d8cd98f00b204e9800998ecf8427e997230b429185a3c61d5673d09a47a11",
        uploadedAt: "2024-03-18T14:15:00Z",
        uploadedBy: "Dr. Suresh Chandra Trivedi",
        docType: "LIEN_LETTER"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR / Receipt No.", submittedValue: "FDR-2024-BH-00481920", ocrValue: "FDR-2024-BH-00481920", ocrConfidence: 99, bankConfirmedValue: "FDR-2024-BH-00481920", bankConfirmedScope: true, isMismatch: false },
      { field: "amount", label: "Deposit Principal (INR)", submittedValue: "₹ 35,00,000", ocrValue: "₹ 35,00,000", ocrConfidence: 98, bankConfirmedValue: "₹ 35,00,000", bankConfirmedScope: true, isMismatch: false },
      { field: "maturityDate", label: "Maturity Date", submittedValue: "15 Mar 2027", ocrValue: "15 Mar 2027", ocrConfidence: 97, bankConfirmedValue: "15 Mar 2027", bankConfirmedScope: true, isMismatch: false },
      { field: "bankName", label: "Issuing Bank", submittedValue: "Bharat National Mercantile Bank", ocrValue: "Bharat National Mercantile Bank", ocrConfidence: 99, bankConfirmedValue: "Bharat National Mercantile Bank", bankConfirmedScope: true, isMismatch: false },
      { field: "lienStatus", label: "Lien to AICTE", submittedValue: "Lien Duly Marked", ocrValue: "Lien Duly Marked to Member Secretary AICTE", ocrConfidence: 95, bankConfirmedValue: "Lien Marked to AICTE", bankConfirmedScope: true, isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2024-03-20T11:42:19Z",
      source: "SFMS / Core Banking Direct Interconnect (Simulated)",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount", "maturityDate", "lienMarked", "accountStatus"],
      referenceNumber: "SFMS-BNMB-2024-9981029",
      rawResponseCode: "RESP_200_MATCH_CONFIRMED",
      notes: "Direct SFMS tele-confirmation received with authentic SHA-256 seal from BNMB treasury server."
    },
    observations: [
      {
        id: "obs-001",
        createdAt: "2024-03-21T09:15:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "R. K. Saxena (Regional Scrutiny)",
        text: "Document OCR matches submitted data 100%. SFMS telemetry received from BNMB. Recommending Level 3 status.",
        type: "RECOMMENDATION"
      },
      {
        id: "obs-002",
        createdAt: "2024-03-22T15:30:00Z",
        authorRole: "AICTE_APPROVING_AUTHORITY",
        authorName: "Dr. Anupam Shrivastava (Director Approvals)",
        text: "Verified and confirmed on public ledger. L3 Bank-confirmed seal attached.",
        type: "DECISION"
      }
    ],
    createdAt: "2024-03-16T10:30:00Z",
    updatedAt: "2024-03-22T15:30:00Z"
  },

  // 2. DISCREPANCY UNDER REVIEW: AMOUNT MISMATCH
  {
    id: "fdr-002",
    fdrNumber: "FDR-2025-HA-00918231",
    institutionId: "inst-002",
    institutionName: "Sahyadri Academy of Pharmaceutical Sciences",
    bankName: "Hindustan Apex Trust Bank",
    branchName: "FC Road Branch, Pune",
    ifscCode: "HATB0000889",
    amount: 3500000, // Submitted claimed 35L
    depositDate: "2025-01-10",
    maturityDate: "2028-01-10",
    tenureMonths: 36,
    interestRate: 6.95,
    jointHolders: "AICTE WRO & Sahyadri Academy",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L1",
    status: "DISCREPANCY_UNDER_REVIEW",
    riskLevel: "CRITICAL",
    riskFactors: [
      { code: "AMOUNT_MISMATCH", label: "Amount Discrepancy", severity: "alert", description: "Institution submitted ₹ 35,00,000 but OCR scan reads ₹ 30,00,000 (shortfall ₹ 5,00,000)." },
      { code: "LOW_CONFIDENCE_FIELD", label: "Low OCR Confidence", severity: "warning", description: "Maturity date printed with poor ink fidelity (confidence 62%)." }
    ],
    documents: [
      {
        id: "doc-002-a",
        fileName: "Sahyadri_FDR_Scan_Jan2025.pdf",
        fileSize: 980400,
        mimeType: "application/pdf",
        sha256Hash: "3a91f58204b7e801c40f892d476318bbca6143c087e531998f029412a8740129",
        uploadedAt: "2025-01-12T11:00:00Z",
        uploadedBy: "Prof. Anjali Deshmukh",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR / Receipt No.", submittedValue: "FDR-2025-HA-00918231", ocrValue: "FDR-2025-HA-00918231", ocrConfidence: 94, bankConfirmedValue: null, isMismatch: false },
      { field: "amount", label: "Deposit Principal (INR)", submittedValue: "₹ 35,00,000", ocrValue: "₹ 30,00,000", ocrConfidence: 92, bankConfirmedValue: null, isMismatch: true },
      { field: "maturityDate", label: "Maturity Date", submittedValue: "10 Jan 2028", ocrValue: "10 Jan 2028", ocrConfidence: 62, isCorrected: true, correctionReason: "Faint dot matrix printer output corrected by officer", correctedBy: "P. V. Patil (Officer)", bankConfirmedValue: null, isMismatch: false }
    ],
    bankVerification: null,
    observations: [
      {
        id: "obs-002-a",
        createdAt: "2025-01-14T10:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "P. V. Patil (Scrutiny WRO)",
        text: "ALERT: Scanned instrument shows ₹30,00,000 in both words and numerals ('Rupees Thirty Lakhs Only'), whereas institution portal entry claims ₹35,00,000. Seeking urgent explanation.",
        type: "CLARIFICATION_REQUEST"
      }
    ],
    createdAt: "2025-01-12T11:00:00Z",
    updatedAt: "2025-01-14T10:00:00Z"
  },

  // 3. DUPLICATE FILE / HASH COLLISION CASE
  {
    id: "fdr-003",
    fdrNumber: "FDR-2025-DC-00331049",
    institutionId: "inst-008",
    institutionName: "Marwar College of Management & Technology",
    bankName: "Deccan Commercial Bank",
    branchName: "Mandore Road, Jodhpur",
    ifscCode: "DCBL0002910",
    amount: 2500000,
    depositDate: "2025-02-01",
    maturityDate: "2028-02-01",
    tenureMonths: 36,
    interestRate: 7.1,
    jointHolders: "AICTE NRO & Marwar Trust",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L1",
    status: "DISCREPANCY_UNDER_REVIEW",
    riskLevel: "CRITICAL",
    riskFactors: [
      { code: "DUPLICATE_SHA256", label: "Duplicate File Hash Detected", severity: "alert", description: "Uploaded document SHA-256 hash matches instrument FDR-2024-BH-00481920 uploaded by another institution." },
      { code: "SUSPECT_REUSE", label: "Collusion / Reuse Suspect", severity: "alert", description: "Identical binary PDF uploaded under different FDR number." }
    ],
    documents: [
      {
        id: "doc-003-a",
        fileName: "Marwar_Security_FDR_2025.pdf",
        fileSize: 1420580,
        mimeType: "application/pdf",
        // EXACT same hash as doc-001-a to trigger real duplicate check!
        sha256Hash: "8f48a1c9e3b7492c60e1d09e74bb7a349071c84b12dfc8369408b1a23805f77a",
        uploadedAt: "2025-02-03T16:20:00Z",
        uploadedBy: "Choudhary Mahendra Singh",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR / Receipt No.", submittedValue: "FDR-2025-DC-00331049", ocrValue: "FDR-2024-BH-00481920", ocrConfidence: 98, isMismatch: true },
      { field: "amount", label: "Deposit Principal", submittedValue: "₹ 25,00,000", ocrValue: "₹ 35,00,000", ocrConfidence: 96, isMismatch: true }
    ],
    bankVerification: null,
    observations: [
      {
        id: "obs-003-a",
        createdAt: "2025-02-04T11:30:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "N. Sharma (Forensic Cell)",
        text: "CRITICAL SECURITY WARNING: Cryptographic hash match confirmed. The binary payload submitted by Marwar College is byte-for-byte identical to Aryavarta Institute's FDR. Possible fraudulent upload or operator error.",
        type: "OBSERVATION"
      }
    ],
    createdAt: "2025-02-03T16:20:00Z",
    updatedAt: "2025-02-04T11:30:00Z"
  },

  // 4. BANK UNAVAILABLE CASE (Must NEVER produce verified state)
  {
    id: "fdr-004",
    fdrNumber: "FDR-2025-KG-00718293",
    institutionId: "inst-004",
    institutionName: "Vindhya Polytechnic & Skill Institute",
    bankName: "Kaveri Grameen Co-op",
    branchName: "Civil Lines, Rewa",
    ifscCode: "KGCB0009182",
    amount: 1500000,
    depositDate: "2025-03-01",
    maturityDate: "2028-03-01",
    tenureMonths: 36,
    interestRate: 6.75,
    jointHolders: "AICTE CRO & Vindhya Society",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L1",
    status: "AWAITING_CONFIRMATION",
    riskLevel: "HIGH",
    riskFactors: [
      { code: "BANK_API_UNAVAILABLE", label: "Bank Telemetry Offline", severity: "alert", description: "Issuing co-op bank has no functional SFMS gateway; API ping returned 503 SERVICE UNAVAILABLE." },
      { code: "MANUAL_SCRUTINY_REQUIRED", label: "Manual Physical Verification Needed", severity: "warning", description: "Physical bank confirmation letter required via registered post." }
    ],
    documents: [
      {
        id: "doc-004-a",
        fileName: "Vindhya_CoOp_FDR_Scan.pdf",
        fileSize: 720190,
        mimeType: "application/pdf",
        sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        uploadedAt: "2025-03-05T09:10:00Z",
        uploadedBy: "Er. Rameshwar Shukla",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2025-KG-00718293", ocrValue: "FDR-2025-KG-00718293", ocrConfidence: 89, isMismatch: false },
      { field: "amount", label: "Deposit Principal", submittedValue: "₹ 15,00,000", ocrValue: "₹ 15,00,000", ocrConfidence: 91, isMismatch: false },
      { field: "bankName", label: "Bank Name", submittedValue: "Kaveri Grameen Co-op", ocrValue: "Kaveri Grameen Co-op", ocrConfidence: 88, isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2025-03-06T12:00:00Z",
      source: "Rural Co-op Hub Interconnect (Attempted)",
      status: "UNAVAILABLE",
      confirmedFields: [],
      referenceNumber: "ERR-503-HUB-UNREACHABLE",
      rawResponseCode: "RESP_503_ENDPOINT_TIMED_OUT",
      notes: "Gateway unreachable. System strictly withheld Level 3 confirmation per policy."
    },
    observations: [
      {
        id: "obs-004-a",
        createdAt: "2025-03-07T14:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "Sunil Verma (CRO Scrutiny)",
        text: "Bank interconnect unavailable. Per section 11 rules, status remains Awaiting Independent Confirmation. Dispatched physical verification summon to bank branch manager.",
        type: "OBSERVATION"
      }
    ],
    createdAt: "2025-03-05T09:10:00Z",
    updatedAt: "2025-03-07T14:00:00Z"
  },

  // 5. RENEWAL CHAIN: OLD MATURED FDR
  {
    id: "fdr-005-old",
    fdrNumber: "FDR-2021-VU-00109284",
    institutionId: "inst-003",
    institutionName: "Kalinga Institute of Management & Governance",
    bankName: "Vedic Union Bank",
    branchName: "Janpath, Bhubaneswar",
    ifscCode: "VUBK0001004",
    amount: 3000000,
    depositDate: "2021-10-15",
    maturityDate: "2024-10-15",
    tenureMonths: 36,
    interestRate: 6.8,
    jointHolders: "AICTE ERO & Kalinga Trust",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L3",
    status: "RENEWED",
    riskLevel: "LOW",
    riskFactors: [],
    documents: [
      {
        id: "doc-005-old",
        fileName: "Kalinga_FDR_2021_Matured.pdf",
        fileSize: 1102940,
        mimeType: "application/pdf",
        sha256Hash: "6c72948271039845abcef1928374659102837461928374619283746192837461",
        uploadedAt: "2021-10-18T10:00:00Z",
        uploadedBy: "Sri Bikram K. Mohanty",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2021-VU-00109284", ocrValue: "FDR-2021-VU-00109284", ocrConfidence: 99, bankConfirmedValue: "FDR-2021-VU-00109284", isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 30,00,000", ocrValue: "₹ 30,00,000", ocrConfidence: 99, bankConfirmedValue: "₹ 30,00,000", isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2021-10-25T11:00:00Z",
      source: "VUB Core API",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount", "maturityDate", "lienMarked"],
      referenceNumber: "VUB-CONF-2021-8819",
      rawResponseCode: "RESP_200"
    },
    renewalFdrId: "fdr-005-new",
    observations: [
      {
        id: "obs-005-old-a",
        createdAt: "2024-10-20T10:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "M. Das (ERO)",
        text: "Matured on 15 Oct 2024. Institution submitted renewal instrument #FDR-2024-VU-00591244. Chain linked.",
        type: "RECOMMENDATION"
      }
    ],
    createdAt: "2021-10-18T10:00:00Z",
    updatedAt: "2024-10-20T10:00:00Z"
  },

  // 6. RENEWAL CHAIN: NEW LINKED FDR (L3 Bank Confirmed)
  {
    id: "fdr-005-new",
    fdrNumber: "FDR-2024-VU-00591244",
    institutionId: "inst-003",
    institutionName: "Kalinga Institute of Management & Governance",
    bankName: "Vedic Union Bank",
    branchName: "Janpath, Bhubaneswar",
    ifscCode: "VUBK0001004",
    amount: 3000000,
    depositDate: "2024-10-15",
    maturityDate: "2027-10-15",
    tenureMonths: 36,
    interestRate: 7.35,
    jointHolders: "AICTE ERO & Kalinga Trust",
    lienMarkedToAicte: true,
    autoRenew: true,
    evidenceLevel: "L3",
    status: "BANK_CONFIRMED",
    riskLevel: "LOW",
    riskFactors: [],
    documents: [
      {
        id: "doc-005-new",
        fileName: "Kalinga_FDR_2024_Renewal.pdf",
        fileSize: 1250390,
        mimeType: "application/pdf",
        sha256Hash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
        uploadedAt: "2024-10-18T14:00:00Z",
        uploadedBy: "Sri Bikram K. Mohanty",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2024-VU-00591244", ocrValue: "FDR-2024-VU-00591244", ocrConfidence: 99, bankConfirmedValue: "FDR-2024-VU-00591244", isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 30,00,000", ocrValue: "₹ 30,00,000", ocrConfidence: 99, bankConfirmedValue: "₹ 30,00,000", isMismatch: false },
      { field: "maturityDate", label: "Maturity Date", submittedValue: "15 Oct 2027", ocrValue: "15 Oct 2027", ocrConfidence: 98, bankConfirmedValue: "15 Oct 2027", isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2024-10-21T10:15:00Z",
      source: "SFMS Gateway VUB-DIRECT",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount", "maturityDate", "lienMarked"],
      referenceNumber: "SFMS-VUB-2024-77192",
      rawResponseCode: "RESP_200_OK"
    },
    previousFdrId: "fdr-005-old",
    observations: [
      {
        id: "obs-005-new-a",
        createdAt: "2024-10-22T16:00:00Z",
        authorRole: "AICTE_APPROVING_AUTHORITY",
        authorName: "Dr. Anupam Shrivastava",
        text: "Renewal verified. Lien continuity maintained from predecessor instrument #FDR-2021-VU-00109284.",
        type: "DECISION"
      }
    ],
    createdAt: "2024-10-18T14:00:00Z",
    updatedAt: "2024-10-22T16:00:00Z"
  },

  // 7. EXPIRING SOON (< 30 days based on Demo Clock anchor ~ Nov 2026)
  {
    id: "fdr-007",
    fdrNumber: "FDR-2023-PS-00829104",
    institutionId: "inst-006",
    institutionName: "Brahmaputra Engineering College",
    bankName: "Punjab & Sindh Sanyukta Bank",
    branchName: "Paltan Bazar, Guwahati",
    ifscCode: "PSSB0004910",
    amount: 4500000,
    depositDate: "2023-11-20",
    maturityDate: "2026-11-20", // Expiring within 21 days!
    tenureMonths: 36,
    interestRate: 7.15,
    jointHolders: "AICTE NERO & Brahmaputra Education Society",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L3",
    status: "EXPIRING_SOON",
    riskLevel: "MEDIUM",
    riskFactors: [
      { code: "EXPIRING_WINDOW_21D", label: "Maturity Within 21 Days", severity: "warning", description: "Instrument expires on 20 Nov 2026. Renewal deed not yet submitted." }
    ],
    documents: [
      {
        id: "doc-007-a",
        fileName: "Brahmaputra_FDR_2023.pdf",
        fileSize: 890400,
        mimeType: "application/pdf",
        sha256Hash: "b9c8d7e6f5a432109876543210fedcba9876543210fedcba9876543210fedcba",
        uploadedAt: "2023-11-22T11:00:00Z",
        uploadedBy: "Dr. Himanta K. Barua",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2023-PS-00829104", ocrValue: "FDR-2023-PS-00829104", ocrConfidence: 99, bankConfirmedValue: "FDR-2023-PS-00829104", isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 45,00,000", ocrValue: "₹ 45,00,000", ocrConfidence: 98, bankConfirmedValue: "₹ 45,00,000", isMismatch: false },
      { field: "maturityDate", label: "Maturity Date", submittedValue: "20 Nov 2026", ocrValue: "20 Nov 2026", ocrConfidence: 98, bankConfirmedValue: "20 Nov 2026", isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2023-11-25T14:00:00Z",
      source: "PSSB Core Switch",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount", "maturityDate"],
      referenceNumber: "PSSB-2023-10928",
      rawResponseCode: "RESP_200"
    },
    observations: [
      {
        id: "obs-007-a",
        createdAt: "2026-10-21T09:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "Automated Rule Engine (System)",
        text: "30-day maturity warning window triggered. Automated notice dispatched to institution portal.",
        type: "OBSERVATION"
      }
    ],
    createdAt: "2023-11-22T11:00:00Z",
    updatedAt: "2026-10-21T09:00:00Z"
  },

  // 8. MATURED / OVERDUE (> 0 days overdue)
  {
    id: "fdr-008",
    fdrNumber: "FDR-2023-BN-00441920",
    institutionId: "inst-008",
    institutionName: "Marwar College of Management & Technology",
    bankName: "Bharat National Mercantile Bank",
    branchName: "Jodhpur High Court Road",
    ifscCode: "BNMB0001099",
    amount: 2500000,
    depositDate: "2023-09-10",
    maturityDate: "2026-09-10", // 50 days overdue!
    tenureMonths: 36,
    interestRate: 6.9,
    jointHolders: "AICTE NRO & Marwar Education Trust",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L3",
    status: "MATURED_OVERDUE",
    riskLevel: "HIGH",
    riskFactors: [
      { code: "OVERDUE_RENEWAL", label: "Maturity Overdue 50 Days", severity: "alert", description: "Deposit matured on 10 Sep 2026. Non-renewal notice expired." },
      { code: "HOLD_PLACED", label: "Institutional Caution Hold", severity: "warning", description: "Approval extension paused pending FDR compliance." }
    ],
    documents: [
      {
        id: "doc-008-a",
        fileName: "Marwar_FDR_2023_Receipt.pdf",
        fileSize: 950000,
        mimeType: "application/pdf",
        sha256Hash: "f1e2d3c4b5a69788796857463524130291827364556473829102938475610293",
        uploadedAt: "2023-09-12T10:00:00Z",
        uploadedBy: "Choudhary Mahendra Singh",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2023-BN-00441920", ocrValue: "FDR-2023-BN-00441920", ocrConfidence: 99, bankConfirmedValue: "FDR-2023-BN-00441920", isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 25,00,000", ocrValue: "₹ 25,00,000", ocrConfidence: 99, bankConfirmedValue: "₹ 25,00,000", isMismatch: false },
      { field: "maturityDate", label: "Maturity Date", submittedValue: "10 Sep 2026", ocrValue: "10 Sep 2026", ocrConfidence: 98, bankConfirmedValue: "10 Sep 2026", isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2023-09-15T10:00:00Z",
      source: "BNMB Direct SFMS",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount", "maturityDate"],
      referenceNumber: "BNMB-2023-90214",
      rawResponseCode: "RESP_200"
    },
    observations: [
      {
        id: "obs-008-a",
        createdAt: "2026-09-15T12:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "R. Meena (NRO Scrutiny)",
        text: "Maturity overdue. Show cause letter dispatched to trustee.",
        type: "CLARIFICATION_REQUEST"
      }
    ],
    createdAt: "2023-09-12T10:00:00Z",
    updatedAt: "2026-09-15T12:00:00Z"
  },

  // 9. RELEASE REQUESTED (Under Active Maker-Checker Scrutiny)
  {
    id: "fdr-009",
    fdrNumber: "FDR-2022-CH-00628190",
    institutionId: "inst-005",
    institutionName: "Chola School of Architecture & Town Planning",
    bankName: "Hindustan Apex Trust Bank",
    branchName: "Medical College Road, Thanjavur",
    ifscCode: "HATB0000412",
    amount: 3000000,
    depositDate: "2022-08-10",
    maturityDate: "2025-08-10",
    tenureMonths: 36,
    interestRate: 7.0,
    jointHolders: "AICTE SRO & Chola Educational Trust",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L3",
    status: "RELEASE_REQUESTED",
    riskLevel: "LOW",
    riskFactors: [],
    documents: [
      {
        id: "doc-009-a",
        fileName: "Chola_FDR_Original.pdf",
        fileSize: 1120000,
        mimeType: "application/pdf",
        sha256Hash: "c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789aa",
        uploadedAt: "2022-08-12T12:00:00Z",
        uploadedBy: "Ar. Soundararajan S.",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2022-CH-00628190", ocrValue: "FDR-2022-CH-00628190", ocrConfidence: 99, bankConfirmedValue: "FDR-2022-CH-00628190", isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 30,00,000", ocrValue: "₹ 30,00,000", ocrConfidence: 99, bankConfirmedValue: "₹ 30,00,000", isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2022-08-16T15:00:00Z",
      source: "HATB Interconnect",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount", "maturityDate"],
      referenceNumber: "HATB-2022-54019",
      rawResponseCode: "RESP_200"
    },
    releaseRequestId: "rel-001",
    observations: [
      {
        id: "obs-009-a",
        createdAt: "2026-10-10T11:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "T. Swaminathan (SRO Officer)",
        text: "Institution has fulfilled 10 years of statutory operation without penalty. Regional committee recommended release of ₹30,00,000 deposit. Submitted for Approving Authority sanction.",
        type: "RECOMMENDATION"
      }
    ],
    createdAt: "2022-08-12T12:00:00Z",
    updatedAt: "2026-10-10T11:00:00Z"
  },

  // 10. RELEASED / CLOSED
  {
    id: "fdr-010",
    fdrNumber: "FDR-2020-ML-00192837",
    institutionId: "inst-007",
    institutionName: "Malabar Institute of Advanced Technology",
    bankName: "Bharat National Mercantile Bank",
    branchName: "Mavoor Road, Kozhikode",
    ifscCode: "BNMB0002104",
    amount: 3500000,
    depositDate: "2020-05-10",
    maturityDate: "2023-05-10",
    tenureMonths: 36,
    interestRate: 6.5,
    jointHolders: "AICTE SWRO & Malabar Trust",
    lienMarkedToAicte: false,
    autoRenew: false,
    evidenceLevel: "L3",
    status: "RELEASED_CLOSED",
    riskLevel: "LOW",
    riskFactors: [],
    documents: [
      {
        id: "doc-010-a",
        fileName: "Malabar_Closed_Receipt.pdf",
        fileSize: 1040000,
        mimeType: "application/pdf",
        sha256Hash: "44556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011",
        uploadedAt: "2020-05-12T10:00:00Z",
        uploadedBy: "Shri K. P. Namboodiri",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2020-ML-00192837", ocrValue: "FDR-2020-ML-00192837", ocrConfidence: 99, bankConfirmedValue: "FDR-2020-ML-00192837", isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 35,00,000", ocrValue: "₹ 35,00,000", ocrConfidence: 99, bankConfirmedValue: "₹ 35,00,000", isMismatch: false }
    ],
    bankVerification: {
      verifiedAt: "2020-05-15T12:00:00Z",
      source: "BNMB Interconnect",
      status: "MATCH",
      confirmedFields: ["fdrNumber", "amount"],
      referenceNumber: "BNMB-CLOSED-2023-09",
      rawResponseCode: "RESP_200"
    },
    observations: [
      {
        id: "obs-010-a",
        createdAt: "2023-06-01T10:00:00Z",
        authorRole: "AICTE_APPROVING_AUTHORITY",
        authorName: "Dr. Anupam Shrivastava",
        text: "Lien revocation certificate issued. Account closed and funds transferred to institution trust account.",
        type: "DECISION"
      }
    ],
    createdAt: "2020-05-12T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z"
  },

  // 11. DIGITALLY EVIDENCED (L2) - Digital stamp / notary verified, awaiting direct bank confirmation
  {
    id: "fdr-011",
    fdrNumber: "FDR-2026-DC-00819204",
    institutionId: "inst-010",
    institutionName: "Himalayan Institute of Pharmaceutical Sciences",
    bankName: "Deccan Commercial Bank",
    branchName: "Rajpur Road, Dehradun",
    ifscCode: "DCBL0001092",
    amount: 4000000,
    depositDate: "2026-06-01",
    maturityDate: "2029-06-01",
    tenureMonths: 36,
    interestRate: 7.4,
    jointHolders: "AICTE NWRO & Himalayan Trust",
    lienMarkedToAicte: true,
    autoRenew: true,
    evidenceLevel: "L2",
    status: "DIGITALLY_EVIDENCED",
    riskLevel: "LOW",
    riskFactors: [],
    documents: [
      {
        id: "doc-011-a",
        fileName: "Himalayan_eSign_FDR_2026.pdf",
        fileSize: 1350000,
        mimeType: "application/pdf",
        sha256Hash: "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
        uploadedAt: "2026-06-05T14:30:00Z",
        uploadedBy: "Dr. Vinod Rawat",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2026-DC-00819204", ocrValue: "FDR-2026-DC-00819204", ocrConfidence: 97, isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 40,00,000", ocrValue: "₹ 40,00,000", ocrConfidence: 98, isMismatch: false },
      { field: "eSignCertificate", label: "Digital Signature", submittedValue: "Class 3 eMudhra Token Signed", ocrValue: "Class 3 eMudhra Token Validated", ocrConfidence: 99, isMismatch: false }
    ],
    bankVerification: null,
    observations: [
      {
        id: "obs-011-a",
        createdAt: "2026-06-08T11:00:00Z",
        authorRole: "AICTE_SCRUTINY_OFFICER",
        authorName: "K. Negi (NWRO)",
        text: "Class 3 Digital signature verified via CCA CRL list. FDR promoted to Level 2 (Digitally Evidenced). SFMS batch scheduled.",
        type: "OBSERVATION"
      }
    ],
    createdAt: "2026-06-05T14:30:00Z",
    updatedAt: "2026-06-08T11:00:00Z"
  },

  // 12. DOCUMENT-SCREENED (L1) - Newly submitted, OCR complete, pending scrutiny
  {
    id: "fdr-012",
    fdrNumber: "FDR-2026-VU-00991823",
    institutionId: "inst-011",
    institutionName: "Kakatiya Institute of Engineering & Technology",
    bankName: "Vedic Union Bank",
    branchName: "Hanamkonda, Warangal",
    ifscCode: "VUBK0003019",
    amount: 5000000,
    depositDate: "2026-09-01",
    maturityDate: "2029-09-01",
    tenureMonths: 36,
    interestRate: 7.2,
    jointHolders: "AICTE SCRO & Kakatiya Society",
    lienMarkedToAicte: true,
    autoRenew: false,
    evidenceLevel: "L1",
    status: "DOCUMENT_SCREENED",
    riskLevel: "MEDIUM",
    riskFactors: [
      { code: "AWAITING_HUMAN_SCRUTINY", label: "Scrutiny Officer Assigned", severity: "info", description: "Document OCR extracted successfully; officer review in queue." }
    ],
    documents: [
      {
        id: "doc-012-a",
        fileName: "Kakatiya_FDR_Scan_Sep2026.pdf",
        fileSize: 840000,
        mimeType: "application/pdf",
        sha256Hash: "99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
        uploadedAt: "2026-09-03T10:00:00Z",
        uploadedBy: "Sri G. Venkateswarlu",
        docType: "FDR_CERTIFICATE"
      }
    ],
    fieldComparisons: [
      { field: "fdrNumber", label: "FDR No.", submittedValue: "FDR-2026-VU-00991823", ocrValue: "FDR-2026-VU-00991823", ocrConfidence: 96, isMismatch: false },
      { field: "amount", label: "Amount", submittedValue: "₹ 50,00,000", ocrValue: "₹ 50,00,000", ocrConfidence: 97, isMismatch: false }
    ],
    bankVerification: null,
    observations: [],
    createdAt: "2026-09-03T10:00:00Z",
    updatedAt: "2026-09-03T10:00:00Z"
  }
];

export const SEED_RELEASE_REQUESTS: ReleaseRequest[] = [
  {
    id: "rel-001",
    fdrId: "fdr-009",
    fdrNumber: "FDR-2022-CH-00628190",
    institutionId: "inst-005",
    institutionName: "Chola School of Architecture & Town Planning",
    amount: 3000000,
    requestDate: "2026-09-25",
    reason: "TENURE_COMPLETED_RENEWAL_WAIVED",
    requiredChecklist: [
      { item: "AICTE Regional Office Inspection Clearance Letter", status: "VERIFIED", notes: "SRO Inspection done on 15 Aug 2026" },
      { item: "Trustees Board Resolution for Course Closure / Amalgamation", status: "VERIFIED", notes: "Resolution #44 dated 20 Jul 2026" },
      { item: "No Dues & Salary Disbursement Certificate to Faculty/Staff", status: "VERIFIED", notes: "Chartered Accountant certified" },
      { item: "Student Transfer & Degree Completion Compliance Report", status: "VERIFIED", notes: "Anna University endorsement enclosed" },
      { item: "Lien-Release Consent Letter from Financing / Deposit Bank", status: "PENDING", notes: "Bank branch manager signature awaited" }
    ],
    stage: "SCRUTINY_REVIEW",
    scrutinyRecommendation: "RECOMMEND_RELEASE",
    scrutinyNotes: "All operational criteria completed. Recommendation submitted subject to final bank lien-release physical countersignature.",
    authorityDecision: undefined
  }
];

// Seed 10 hash-chained audit events with authentic previousHash pointers
export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "audit-001",
    sequence: 1,
    timestamp: "2024-03-16T10:30:00Z",
    actor: { name: "Dr. Suresh Chandra Trivedi", role: "INSTITUTION_ADMIN", ipAddress: "14.139.221.8" },
    action: "FDR_SUBMISSION",
    entityType: "FDR",
    entityId: "fdr-001",
    fdrNumber: "FDR-2024-BH-00481920",
    evidenceRef: "SHA:8f48a1c9e3b7492c60e1d09e74bb7a349071c84b12dfc8369408b1a23805f77a",
    details: "Initial deposit submission of ₹35,00,000 with Bharat National Mercantile Bank. PDF document uploaded.",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    currentHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
  },
  {
    id: "audit-002",
    sequence: 2,
    timestamp: "2024-03-16T10:31:14Z",
    actor: { name: "ArthKavach OCR Engine v2.4", role: "SYSTEM_ADMIN" },
    action: "OCR_EXTRACTION_COMPLETED",
    entityType: "FDR",
    entityId: "fdr-001",
    fdrNumber: "FDR-2024-BH-00481920",
    evidenceRef: "CONF:0.98",
    details: "Automated OCR extraction completed across 5 fields. Mean confidence score: 97.6%. Level 1 Document-Screened badge issued.",
    previousHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    currentHash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
  },
  {
    id: "audit-003",
    sequence: 3,
    timestamp: "2024-03-20T11:42:19Z",
    actor: { name: "SFMS Gateway Connector", role: "SYSTEM_ADMIN" },
    action: "BANK_SFMS_MATCH_RECEIVED",
    entityType: "FDR",
    entityId: "fdr-001",
    fdrNumber: "FDR-2024-BH-00481920",
    evidenceRef: "SFMS-BNMB-2024-9981029",
    details: "SFMS verification packet received from BNMB. Confirmed principal ₹35,00,000, maturity 15 Mar 2027, lien endorsed to Member Secretary AICTE.",
    previousHash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    currentHash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"
  },
  {
    id: "audit-004",
    sequence: 4,
    timestamp: "2024-03-21T09:15:00Z",
    actor: { name: "R. K. Saxena", role: "AICTE_SCRUTINY_OFFICER", ipAddress: "164.100.24.11" },
    action: "SCRUTINY_RECOMMENDATION",
    entityType: "FDR",
    entityId: "fdr-001",
    fdrNumber: "FDR-2024-BH-00481920",
    evidenceRef: "NOTE:REC-001",
    details: "Scrutiny officer reviewed OCR, physical PDF and SFMS telemetry. Recommended promotion to Level 3 Bank-Confirmed.",
    previousHash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    currentHash: "88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936ffcbed9"
  },
  {
    id: "audit-005",
    sequence: 5,
    timestamp: "2024-03-22T15:30:00Z",
    actor: { name: "Dr. Anupam Shrivastava", role: "AICTE_APPROVING_AUTHORITY", ipAddress: "164.100.24.4" },
    action: "APPROVING_AUTHORITY_DECISION",
    entityType: "FDR",
    entityId: "fdr-001",
    fdrNumber: "FDR-2024-BH-00481920",
    evidenceRef: "DEC-2024-L3-094",
    details: "Final sanction granted. Seal Marigold L3 Bank-Confirmed status anchored to national public registry ledger.",
    previousHash: "88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936ffcbed9",
    currentHash: "3235cf83ca6695eeea4931a3848b5256e792c34d3d2cb261f9dfc6ec0882e5b7"
  },
  {
    id: "audit-006",
    sequence: 6,
    timestamp: "2025-01-12T11:00:00Z",
    actor: { name: "Prof. Anjali Deshmukh", role: "INSTITUTION_ADMIN" },
    action: "FDR_SUBMISSION",
    entityType: "FDR",
    entityId: "fdr-002",
    fdrNumber: "FDR-2025-HA-00918231",
    evidenceRef: "SHA:3a91f58204b7e801c40f892d476318bbca6143c087e531998f029412a8740129",
    details: "Submission of instrument for Sahyadri Academy. Claimed amount ₹35,00,000.",
    previousHash: "3235cf83ca6695eeea4931a3848b5256e792c34d3d2cb261f9dfc6ec0882e5b7",
    currentHash: "7b8b4081c726359bc7f2e1df28a7e4b9f2913a525bc83489ecf4a7c13be06c7e"
  },
  {
    id: "audit-007",
    sequence: 7,
    timestamp: "2025-01-14T10:00:00Z",
    actor: { name: "P. V. Patil", role: "AICTE_SCRUTINY_OFFICER" },
    action: "DISCREPANCY_FLAGGED",
    entityType: "FDR",
    entityId: "fdr-002",
    fdrNumber: "FDR-2025-HA-00918231",
    evidenceRef: "DISC:AMT-5L-SHORT",
    details: "Discrepancy flagged: OCR extracted ₹30,00,000 vs portal declaration of ₹35,00,000. Risk flagged as CRITICAL.",
    previousHash: "7b8b4081c726359bc7f2e1df28a7e4b9f2913a525bc83489ecf4a7c13be06c7e",
    currentHash: "9f83a48e89f289d0b641885f81878b30a5cb288ab236f3c5f421f153a7b63f25"
  },
  {
    id: "audit-008",
    sequence: 8,
    timestamp: "2025-02-03T16:20:00Z",
    actor: { name: "Choudhary Mahendra Singh", role: "INSTITUTION_ADMIN" },
    action: "FDR_SUBMISSION_HASH_COLLISION",
    entityType: "FDR",
    entityId: "fdr-003",
    fdrNumber: "FDR-2025-DC-00331049",
    evidenceRef: "SHA:8f48a1c9e3b7492c60e1d09e74bb7a349071c84b12dfc8369408b1a23805f77a",
    details: "Automated tamper detection: Uploaded PDF SHA-256 matches existing document on file for Aryavarta Institute.",
    previousHash: "9f83a48e89f289d0b641885f81878b30a5cb288ab236f3c5f421f153a7b63f25",
    currentHash: "1e0c65538e8f85f3408c5c361c473de01b695123d45efb7b7f3299723cf2c0bc"
  },
  {
    id: "audit-009",
    sequence: 9,
    timestamp: "2025-03-06T12:00:00Z",
    actor: { name: "SFMS Gateway Hub", role: "SYSTEM_ADMIN" },
    action: "BANK_GATEWAY_UNAVAILABLE",
    entityType: "FDR",
    entityId: "fdr-004",
    fdrNumber: "FDR-2025-KG-00718293",
    evidenceRef: "ERR-503-HUB-UNREACHABLE",
    details: "Issuing bank Kaveri Grameen Co-op gateway offline. System strictly withheld verification state.",
    previousHash: "1e0c65538e8f85f3408c5c361c473de01b695123d45efb7b7f3299723cf2c0bc",
    currentHash: "46914b4369a842f1cfbb52c2dbad41e05d234208a0ab9d01211116c291dcf108"
  },
  {
    id: "audit-010",
    sequence: 10,
    timestamp: "2026-09-25T14:00:00Z",
    actor: { name: "Ar. Soundararajan S.", role: "INSTITUTION_ADMIN" },
    action: "RELEASE_REQUEST_SUBMITTED",
    entityType: "RELEASE_REQUEST",
    entityId: "rel-001",
    fdrNumber: "FDR-2022-CH-00628190",
    evidenceRef: "REL-2026-SRO-001",
    details: "Formal release request submitted for ₹30,00,000 security deposit following completion of 10-year term.",
    previousHash: "46914b4369a842f1cfbb52c2dbad41e05d234208a0ab9d01211116c291dcf108",
    currentHash: "6dcd4ce23d88e2ee9568ba546c007c63d9131c1b51730e8a8b49ac84836ae28d"
  }
];
