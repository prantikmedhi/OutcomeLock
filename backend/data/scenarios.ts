import type { OutcomeCase } from "@/backend/outcome-engine/types";

export type DemoScenario = {
  slug: string;
  title: string;
  citizen: {
    name: string;
    location: string;
  };
  grievance: {
    id: string;
    submitted: string;
    department: string;
    citizenRequest: string;
    status: string;
    response: string;
  };
  case: OutcomeCase;
  resolution?: {
    evidenceLabel: string;
    amount: string;
    date: string;
  };
};

export const primaryScenario: DemoScenario = {
  slug: "pension-forwarded",
  title: "Pension not paid",
  citizen: {
    name: "Asha Verma",
    location: "Indore, Madhya Pradesh",
  },
  grievance: {
    id: "GRV-48291",
    submitted: "12 August 2026",
    department: "Pension Services Department",
    citizenRequest: "I have not received my pension since May.",
    status: "Closed",
    response:
      "The grievance has been forwarded to the concerned office for necessary action.",
  },
  case: {
    id: "GRV-48291",
    requestedOutcome: {
      type: "PENSION_PAYMENT_RECEIVED",
      description: "Pension paid into my bank account",
    },
    governmentActions: [
      {
        type: "FORWARDED",
        label: "Complaint sent to another office",
        response:
          "The grievance has been forwarded to the concerned office for necessary action.",
      },
    ],
    evidence: [
      {
        type: "FORWARDING_NOTICE",
        label: "Notice that the complaint was sent to another office",
        date: "12 August 2026",
      },
    ],
  },
  resolution: {
    evidenceLabel: "Pension payment",
    amount: "INR 8,450",
    date: "19 August 2026",
  },
};

export const resolvedScenario: DemoScenario = {
  ...primaryScenario,
  slug: "pension-paid",
  title: "Pension payment confirmed",
  grievance: {
    ...primaryScenario.grievance,
    status: "Payment sent",
    response: "Your pension arrears have been processed and credited.",
  },
  case: {
    ...primaryScenario.case,
    governmentActions: [
      {
        type: "PAYMENT_PROCESSED",
        label: "Payment sent",
        response: "Your pension arrears have been processed and credited.",
      },
    ],
    evidence: [
      {
        type: "PENSION_CREDIT",
        label: "Pension payment of INR 8,450",
        amount: "INR 8,450",
        date: "19 August 2026",
      },
    ],
  },
};

export const actionRequiredScenario: DemoScenario = {
  ...primaryScenario,
  slug: "bank-verification",
  title: "Bank details need to be checked",
  grievance: {
    ...primaryScenario.grievance,
    status: "Waiting for you",
    response:
      "Please complete bank account verification before payment can be released.",
  },
  case: {
    ...primaryScenario.case,
    governmentActions: [
      {
        type: "BANK_VERIFICATION_REQUIRED",
        label: "Bank details need to be checked",
        response:
          "Please complete bank account verification before payment can be released.",
      },
    ],
    evidence: [
      {
        type: "BANK_VERIFICATION_REQUEST",
        label: "Request to check bank details",
        date: "14 August 2026",
      },
    ],
  },
};

export const insufficientEvidenceScenario: DemoScenario = {
  ...primaryScenario,
  slug: "processed-vague",
  title: "Reply does not show what happened",
  grievance: {
    ...primaryScenario.grievance,
    status: "Processed",
    response: "Your request has been processed.",
  },
  case: {
    ...primaryScenario.case,
    governmentActions: [
      {
        type: "GENERIC_PROCESSED",
        label: "Request marked as processed",
        response: "Your request has been processed.",
      },
    ],
    evidence: [
      {
        type: "GENERIC_PROCESSING_NOTICE",
        label: "Notice that says the request was processed",
        date: "16 August 2026",
      },
    ],
  },
};

export const scenarios = [
  primaryScenario,
  resolvedScenario,
  actionRequiredScenario,
  insufficientEvidenceScenario,
];
