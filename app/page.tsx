"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FilePenLine,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryScenario } from "@/data/scenarios";
import { evaluateOutcome } from "@/lib/outcome-engine/evaluate";
import type { AppealDraft, ExplanationResult, IntentResult } from "@/lib/ai/schemas";

type Step =
  | "home"
  | "intake"
  | "confirm"
  | "grievance"
  | "verdict"
  | "appeal"
  | "submitted"
  | "timeline"
  | "resolved";

const defaultProblem = "I have not received my pension for three months.";

const fallbackIntent: IntentResult = {
  problemType: "PENSION_PAYMENT_MISSING",
  desiredOutcome: {
    type: "PENSION_PAYMENT_RECEIVED",
    description: "Pension paid into my bank account",
  },
};

const fallbackExplanation: ExplanationResult = {
  summary:
    "Your complaint was sent to another office, but there is no proof that your pension reached your account.",
  requestedOutcome: "Your pension reaches your bank account.",
  governmentAction: "The department sent your complaint to another office.",
  missingEvidence: ["Proof that the pension reached your account."],
  recommendedAction: "Ask for another review (appeal).",
};

const fallbackAppeal: AppealDraft = {
  subject: `Please review closed complaint ${primaryScenario.grievance.id}`,
  body:
    "Please review this closed complaint. I asked for my pension to be paid into my bank account. The reply says my complaint was sent to another office, but it does not show that the pension was paid. Please check the complaint again and share proof when the payment is made.",
};

async function postJson<T>(url: string, payload: unknown): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export default function Home() {
  const [step, setStep] = useState<Step>("home");
  const [problem, setProblem] = useState(defaultProblem);
  const [intent, setIntent] = useState<IntentResult>(fallbackIntent);
  const [explanation, setExplanation] =
    useState<ExplanationResult>(fallbackExplanation);
  const [appeal, setAppeal] = useState<AppealDraft>(fallbackAppeal);
  const [appealBody, setAppealBody] = useState(fallbackAppeal.body);
  const [isBusy, setIsBusy] = useState(false);

  const evaluation = useMemo(
    () => evaluateOutcome(primaryScenario.case),
    [],
  );

  async function startDemo() {
    setProblem(defaultProblem);
    setIntent(fallbackIntent);
    setStep("intake");
  }

  async function interpretProblem() {
    setIsBusy(true);
    const result = await postJson<IntentResult>("/api/interpret", { problem });
    setIntent(result ?? fallbackIntent);
    setIsBusy(false);
    setStep("confirm");
  }

  async function loadExplanation() {
    setIsBusy(true);
    const result = await postJson<ExplanationResult>("/api/explain", {});
    setExplanation(result ?? fallbackExplanation);
    setIsBusy(false);
    setStep("verdict");
  }

  async function loadAppeal() {
    setIsBusy(true);
    const result = await postJson<AppealDraft>("/api/appeal", {});
    const nextAppeal = result ?? fallbackAppeal;
    setAppeal(nextAppeal);
    setAppealBody(nextAppeal.body);
    setIsBusy(false);
    setStep("appeal");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-5 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <button
            className="flex items-center gap-2 text-left text-lg font-bold"
            onClick={() => setStep("home")}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
              <LockKeyhole size={18} aria-hidden />
            </span>
            OutcomeLock
          </button>
          <p className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-medium text-ink/70">
            Demo only · Uses made-up information · Not run by the government
          </p>
        </header>

        <section className="flex flex-1 items-center py-8">
          {step === "home" && (
            <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-leaf shadow-sm">
                  <ShieldCheck size={16} aria-hidden />
                  Checks if your problem was fixed
                </p>
                <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-6xl">
                  Did they actually fix it?
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
                  OutcomeLock checks if you got what you asked for. A reply or a
                  closed complaint does not always mean the problem was fixed.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={startDemo}>
                    Try an example case <ArrowRight size={18} aria-hidden />
                  </Button>
                  <Button variant="secondary" onClick={() => setStep("intake")}>
                    Try your own example
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-ink/60">
                  Example complaint
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  Pension not paid for three months
                </h2>
                <dl className="mt-5 grid gap-3 text-sm">
                  <InfoRow label="Status" value="Closed" />
                  <InfoRow label="Reply" value="Sent to another office" />
                  <InfoRow label="Still needed" value="Proof that the pension reached the account" />
                </dl>
              </div>
            </div>
          )}

          {step === "intake" && (
            <Panel
              icon={<SearchCheck size={22} aria-hidden />}
              eyebrow="Step 1"
              title="Tell us what happened"
              body="Write the problem in your own words. We added a pension example for this demo."
            >
              <label className="block text-sm font-semibold" htmlFor="problem">
                What is the problem?
              </label>
              <textarea
                id="problem"
                value={problem}
                onChange={(event) => setProblem(event.target.value)}
                className="mt-3 min-h-36 w-full resize-none rounded-lg border border-ink/15 bg-white p-4 text-base leading-7 shadow-sm"
              />
              <FooterAction>
                <Button onClick={interpretProblem} disabled={isBusy}>
                  {isBusy ? "Checking..." : "Check my complaint"}
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "confirm" && (
            <Panel
              icon={<CheckCircle2 size={22} aria-hidden />}
              eyebrow="Step 2"
              title="Is this what you need?"
              body="We will check if this is what actually happened."
            >
              <OutcomeBlock
                label="What you need"
                value={intent.desiredOutcome.description}
              />
              <FooterAction>
                <Button onClick={() => setStep("grievance")}>
                  Yes, this is right
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "grievance" && (
            <Panel
              icon={<FilePenLine size={22} aria-hidden />}
              eyebrow="Step 3"
              title="Department reply (sample)"
              body="The department marked this complaint as closed. We will check if your pension reached your account."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard label="Complaint number" value={primaryScenario.grievance.id} />
                <InfoCard label="Date sent" value={primaryScenario.grievance.submitted} />
                <InfoCard label="Office" value={primaryScenario.grievance.department} />
                <InfoCard label="Status shown" value={primaryScenario.grievance.status} />
              </div>
              <OutcomeBlock
                label="Original department reply"
                value={primaryScenario.grievance.response}
              />
              <OutcomeBlock
                label="In simple words"
                value="Your complaint was sent to another office. The reply does not say that your pension was paid."
              />
              <FooterAction>
                <Button onClick={loadExplanation} disabled={isBusy}>
                  {isBusy ? "Checking..." : "Check if my problem was fixed"}
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "verdict" && (
            <Panel
              icon={<AlertTriangle size={22} aria-hidden />}
              eyebrow="What we found"
              title="Not fixed yet"
              body={explanation.summary}
              tone="alert"
            >
              <div className="grid gap-4">
                <OutcomeBlock label="You asked for" value={explanation.requestedOutcome} />
                <OutcomeBlock label="What the department did" value={explanation.governmentAction} />
                <OutcomeBlock
                  label="What is still needed"
                  value={explanation.missingEvidence.join(" ")}
                />
                <OutcomeBlock label="What to do next" value={explanation.recommendedAction} />
              </div>
              <p className="mt-5 rounded-lg bg-clay/10 p-4 text-sm font-semibold text-clay">
                Our check: {evaluation.status === "NOT_RESOLVED" ? "Not fixed yet" : "Check complete"}
              </p>
              <FooterAction>
                <Button onClick={loadAppeal} disabled={isBusy}>
                  {isBusy ? "Writing..." : "Ask for another review (appeal)"}
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "appeal" && (
            <Panel
              icon={<FilePenLine size={22} aria-hidden />}
              eyebrow="Step 5"
              title="Check your review request"
              body="You can change this message. It only uses the sample facts shown here."
            >
              <InfoCard label="Subject" value={appeal.subject} />
              <label className="mt-5 block text-sm font-semibold" htmlFor="appeal">
                Your message
              </label>
              <textarea
                id="appeal"
                value={appealBody}
                onChange={(event) => setAppealBody(event.target.value)}
                className="mt-3 min-h-56 w-full resize-none rounded-lg border border-ink/15 bg-white p-4 text-base leading-7 shadow-sm"
              />
              <FooterAction>
                <Button onClick={() => setStep("submitted")}>
                  Send my request
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "submitted" && (
            <Panel
              icon={<ShieldCheck size={22} aria-hidden />}
              eyebrow="Demo action"
              title="Review request sent"
              body="This is only a demo. Nothing was sent to a real government office."
            >
              <FooterAction>
                <Button onClick={() => setStep("timeline")}>
                  See what happens next
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "timeline" && (
            <Panel
              icon={<Clock3 size={22} aria-hidden />}
              eyebrow="What happened next"
              title="We can now check the result"
              body="The demo now adds a sample pension payment."
            >
              <ol className="grid gap-3">
                {[
                  "Complaint sent",
                  "Complaint sent to another office and marked closed",
                  "OutcomeLock found no proof of payment",
                  "Review request sent",
                  "Sample review started",
                  "Pension payment added",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-3 text-sm font-semibold"
                  >
                    <CheckCircle2 className="text-leaf" size={18} aria-hidden />
                    {item}
                  </li>
                ))}
              </ol>
              <OutcomeBlock
                label="New proof"
                value={`${primaryScenario.resolution?.evidenceLabel}: ${primaryScenario.resolution?.amount} on ${primaryScenario.resolution?.date}`}
              />
              <FooterAction>
                <Button onClick={() => setStep("resolved")}>
                  Check the result
                  <ArrowRight size={18} aria-hidden />
                </Button>
              </FooterAction>
            </Panel>
          )}

          {step === "resolved" && (
            <Panel
              icon={<CheckCircle2 size={22} aria-hidden />}
              eyebrow="Final result"
              title="Fixed"
              body="The sample payment shows that the pension reached the account."
              tone="success"
            >
              <OutcomeBlock
                label="Proof found"
                value={`${primaryScenario.resolution?.amount} pension payment on ${primaryScenario.resolution?.date}`}
              />
              <FooterAction>
                <Button onClick={startDemo}>Run demo again</Button>
              </FooterAction>
            </Panel>
          )}
        </section>
      </div>
    </main>
  );
}

function Panel({
  icon,
  eyebrow,
  title,
  body,
  children,
  tone = "default",
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
  tone?: "default" | "alert" | "success";
}) {
  const toneClass = {
    default: "bg-white",
    alert: "bg-[#fff8f4]",
    success: "bg-[#f5fbf8]",
  };

  return (
    <div className={`mx-auto w-full max-w-3xl rounded-xl border border-ink/10 p-5 shadow-soft sm:p-8 ${toneClass[tone]}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
        {icon}
      </div>
      <p className="mt-5 text-sm font-bold uppercase text-leaf">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70">{body}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function OutcomeBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4">
      <p className="text-xs font-bold uppercase text-ink/50">{label}</p>
      <p className="mt-2 text-lg font-bold leading-7">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
      <dt className="text-ink/55">{label}</dt>
      <dd className="text-right font-bold">{value}</dd>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4">
      <p className="text-xs font-bold uppercase text-ink/50">{label}</p>
      <p className="mt-2 font-semibold leading-6">{value}</p>
    </div>
  );
}

function FooterAction({ children }: { children: React.ReactNode }) {
  return <div className="mt-7 flex justify-end">{children}</div>;
}
