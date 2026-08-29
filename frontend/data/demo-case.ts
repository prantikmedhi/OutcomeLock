export const pensionDemoCase = {
  citizen: {
    name: "Asha Verma",
    location: "Indore, Madhya Pradesh",
    benefit: "Old age pension",
  },
  problem: "My pension has not been credited for three months.",
  desiredOutcome: "Pension paid into my bank account",
  grievance: {
    id: "GRV-48291",
    submitted: "12 August 2026",
    department: "Pension Services Department",
    citizenRequest: "I have not received my pension since May.",
    status: "Closed",
    response: "The grievance has been forwarded to the concerned office for necessary action.",
  },
  initialEvaluation: {
    status: "NOT RESOLVED",
    reason: "Forwarding the complaint does not prove that the pension was credited.",
    governmentAction: "Complaint sent to another office",
    missingEvidence: "Proof that the pension was credited.",
  },
  appeal: {
    subject: "Appeal against closure of complaint GRV-48291",
    body: "I am appealing the closure of complaint GRV-48291 regarding my missing pension payments.\n\nThe response states that the complaint was forwarded to the concerned office. It does not confirm that the pension was credited to my account or provide proof of payment.\n\nPlease review the closure and provide confirmation of the pension credit, including the payment date and amount.",
  },
  timeline: [
    { title: "Complaint submitted", detail: "12 August 2026", date: "12 Aug", state: "done" },
    { title: "Department response received", detail: "Forwarded for necessary action", date: "12 Aug", state: "done" },
    { title: "Case marked closed", detail: "No pension payment proof attached", date: "12 Aug", state: "done" },
    { title: "Payment checked", detail: "Payment proof still missing", date: "13 Aug", state: "done" },
    { title: "Appeal submitted", detail: "Simulated submission", date: "13 Aug", state: "done" },
    { title: "Review started", detail: "Sample case review", date: "19 Aug", state: "done" },
    { title: "Pension credit added", detail: "INR 8,450 recorded", date: "19 Aug", state: "current" },
  ],
  resolution: {
    status: "RESOLVED",
    evidence: "Pension payment",
    amount: "INR 8,450",
    date: "19 August 2026",
  },
} as const;
