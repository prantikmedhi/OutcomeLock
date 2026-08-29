"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileCheck2,
  FilePenLine,
  LockKeyhole,
  MapPin,
  RotateCcw,
  SearchCheck,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { ThesisAmbientCanvas } from "@/frontend/components/effects/thesis-ambient-canvas";
import { StageTransition } from "@/frontend/components/motion/stage-transition";
import { VerdictChoreography } from "@/frontend/components/motion/verdict-choreography";
import { pensionDemoCase } from "@/frontend/data/demo-case";
import {
  postBackend,
  type AppealDraft,
  type ExplanationResult,
  type IntentResult,
} from "@/frontend/lib/api-client";

type DemoStep =
  | "home"
  | "intake"
  | "confirm"
  | "grievance"
  | "verdict"
  | "appeal"
  | "submitted"
  | "timeline"
  | "resolved";

const steps: { id: DemoStep; label: string; short: string }[] = [
  { id: "home", label: "Start", short: "Start" },
  { id: "intake", label: "Describe the issue", short: "Issue" },
  { id: "confirm", label: "Confirm the outcome", short: "Outcome" },
  { id: "grievance", label: "Review the response", short: "Response" },
  { id: "verdict", label: "Check the result", short: "Verdict" },
  { id: "appeal", label: "Prepare an appeal", short: "Appeal" },
  { id: "submitted", label: "Submit safely", short: "Submitted" },
  { id: "timeline", label: "Track progress", short: "Timeline" },
  { id: "resolved", label: "Verify the outcome", short: "Resolved" },
];

function PrimaryButton({ children, onClick, icon = true, disabled = false }: { children: React.ReactNode; onClick: () => void; icon?: boolean; disabled?: boolean }) {
  return (
    <button className="button button-primary" type="button" onClick={onClick} disabled={disabled}>
      <span>{children}</span>
      {icon ? <ArrowRight aria-hidden="true" size={18} strokeWidth={2} /> : null}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button className="button button-secondary" type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function StageIntro({ label, title, body }: { label?: string; title: string; body?: string }) {
  return (
    <header className="stage-intro">
      {label ? <p className="stage-label">{label}</p> : null}
      <h1 data-stage-heading tabIndex={-1}>{title}</h1>
      {body ? <p className="stage-copy">{body}</p> : null}
    </header>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function OutcomeLockDemo() {
  const [step, setStep] = useState<DemoStep>("home");
  const [problem, setProblem] = useState<string>(pensionDemoCase.problem);
  const [desiredOutcome, setDesiredOutcome] = useState<string>(pensionDemoCase.desiredOutcome);
  const [explanation, setExplanation] = useState<ExplanationResult>({
    status: "NOT_RESOLVED",
    summary: pensionDemoCase.initialEvaluation.reason,
    requestedOutcome: pensionDemoCase.desiredOutcome,
    governmentAction: pensionDemoCase.initialEvaluation.governmentAction,
    missingEvidence: [pensionDemoCase.initialEvaluation.missingEvidence],
    recommendedAction: "Appeal the closure.",
  });
  const [appealSubject, setAppealSubject] = useState<string>(pensionDemoCase.appeal.subject);
  const [appealBody, setAppealBody] = useState<string>(pensionDemoCase.appeal.body);
  const [intakeError, setIntakeError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [serviceNote, setServiceNote] = useState("");
  const stepIndex = steps.findIndex((item) => item.id === step);

  function resetBackendState() {
    setDesiredOutcome(pensionDemoCase.desiredOutcome);
    setExplanation({
      status: "NOT_RESOLVED",
      summary: pensionDemoCase.initialEvaluation.reason,
      requestedOutcome: pensionDemoCase.desiredOutcome,
      governmentAction: pensionDemoCase.initialEvaluation.governmentAction,
      missingEvidence: [pensionDemoCase.initialEvaluation.missingEvidence],
      recommendedAction: "Appeal the closure.",
    });
    setAppealSubject(pensionDemoCase.appeal.subject);
    setAppealBody(pensionDemoCase.appeal.body);
    setServiceNote("");
  }

  function startExample() {
    setProblem(pensionDemoCase.problem);
    resetBackendState();
    setIntakeError("");
    setStep("intake");
  }

  function startCustom() {
    setProblem("");
    resetBackendState();
    setIntakeError("");
    setStep("intake");
  }

  async function continueFromIntake() {
    const normalizedProblem = problem.trim().toLowerCase();
    if (!normalizedProblem) {
      setIntakeError("Describe the pension issue before continuing.");
      return;
    }
    const isSupportedPensionCase = /\bpension\b/.test(normalizedProblem)
      && /\b(missing|unpaid|delayed|due|not|never)\b|(?:have|has)(?:n't| not)/.test(normalizedProblem);
    if (!isSupportedPensionCase) {
      setIntakeError("Describe a missing pension payment. This version checks pension payment cases only.");
      return;
    }

    setIsWorking(true);
    setIntakeError("");
    setServiceNote("");
    try {
      const data = await postBackend("interpret", { problem: problem.trim() }) as IntentResult;
      if (!data?.desiredOutcome?.description || data.desiredOutcome.type === "UNKNOWN") {
        throw new Error("Unsupported interpretation");
      }
      setDesiredOutcome(data.desiredOutcome.description);
    } catch {
      setDesiredOutcome(pensionDemoCase.desiredOutcome);
      setServiceNote("Backend unavailable. Using built-in pension interpretation.");
    } finally {
      setIsWorking(false);
    }
    setStep("confirm");
  }

  async function checkOutcome() {
    setIsWorking(true);
    setServiceNote("");
    try {
      const data = await postBackend("explain") as ExplanationResult;
      if (!data?.summary || data.status !== "NOT_RESOLVED" || !data.requestedOutcome || !Array.isArray(data.missingEvidence)) {
        throw new Error("Invalid explanation");
      }
      setExplanation(data);
    } catch {
      setServiceNote("Backend unavailable. Using built-in outcome explanation.");
    } finally {
      setIsWorking(false);
    }
    setStep("verdict");
  }

  async function prepareAppeal() {
    setIsWorking(true);
    setServiceNote("");
    try {
      const data = await postBackend("appeal") as AppealDraft;
      if (!data?.subject || !data.body) throw new Error("Invalid appeal draft");
      setAppealSubject(data.subject);
      setAppealBody(data.body);
    } catch {
      setServiceNote("Backend unavailable. Using built-in appeal draft.");
    } finally {
      setIsWorking(false);
    }
    setStep("appeal");
  }

  function resetDemo() {
    if (isWorking) return;
    setProblem(pensionDemoCase.problem);
    resetBackendState();
    setIntakeError("");
    setStep("home");
  }

  const backTarget = steps[stepIndex - 1]?.id;

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#main" aria-label="OutcomeLock home" onClick={(event) => { event.preventDefault(); resetDemo(); }}>
          <span className="brand-mark" aria-hidden="true"><LockKeyhole size={17} strokeWidth={2.2} /></span>
          <span>OutcomeLock</span>
        </a>
        <div className="disclosure-note" role="note">
          <ShieldCheck aria-hidden="true" size={15} />
          <span className="disclosure-note-primary">Independent citizen tool</span>
          <span className="disclosure-note-detail">Uses sample data. Not a government service.</span>
          <span className="disclosure-note-mobile">Independent citizen tool. Uses sample data. Not a government service.</span>
        </div>
      </header>

      <main id="main" className="app-layout">
        <aside className="journey-rail" aria-label="Case journey">
          <div className="rail-intro">
            <span className="rail-caption">Your case journey</span>
            <strong>{Math.max(stepIndex, 0) + 1} of {steps.length}</strong>
          </div>
          <ol className="rail-list">
            {steps.map((item, index) => {
              const isCurrent = index === stepIndex;
              const isDone = index < stepIndex;
              return (
                <li className={isCurrent ? "is-current" : isDone ? "is-done" : ""} key={item.id} aria-current={isCurrent ? "step" : undefined}>
                  <span className="rail-node" aria-hidden="true">{isDone ? <Check size={13} strokeWidth={2.5} /> : index + 1}</span>
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ol>
          <div className="rail-case">
            <span>Sample case</span>
            <strong>{pensionDemoCase.grievance.id}</strong>
            <p>{pensionDemoCase.citizen.name}<br />{pensionDemoCase.citizen.location}</p>
          </div>
        </aside>

        <section className="workspace">
          {step !== "home" ? (
            <div className="workspace-toolbar">
              {backTarget ? (
                <button className="back-button" type="button" onClick={() => setStep(backTarget)} disabled={isWorking}>
                  <ArrowLeft aria-hidden="true" size={16} /> Back
                </button>
              ) : <span />}
              <span className="mobile-progress">{steps[stepIndex]?.short} · {stepIndex + 1}/{steps.length}</span>
            </div>
          ) : null}

          {serviceNote ? <p className="service-note" role="status">{serviceNote}</p> : null}

          <StageTransition stageKey={step} stageIndex={stepIndex}>
          {step === "home" ? (
            <div className="home-stage">
              <div className="home-copy">
                <p className="home-kicker">Checks what actually happened</p>
                <h1 data-stage-heading tabIndex={-1}>Did you get what you asked for?</h1>
                <p className="home-lede">A case can be closed while your problem stays open. OutcomeLock checks the proof, not the paperwork.</p>
                <div className="home-actions">
                  <PrimaryButton onClick={startExample}>Try an example case</PrimaryButton>
                  <SecondaryButton onClick={startCustom}>Write a pension example</SecondaryButton>
                </div>
                <p className="input-scope">Currently checks missing pension payments using sample data.</p>
              </div>
              <div className="thesis-panel" aria-label="How OutcomeLock works">
                <ThesisAmbientCanvas />
                <div className="thesis-topline">
                  <SearchCheck aria-hidden="true" size={22} />
                  <span>Outcome check</span>
                </div>
                <p className="admin-label">Case status</p>
                <div className="admin-status"><span>{pensionDemoCase.grievance.status}</span><span>Response received</span></div>
                <div className="thesis-divider" aria-hidden="true"><span>is not the same as</span></div>
                <p className="outcome-label">What you needed</p>
                <div className="outcome-question">Was the pension credited?</div>
                <div className="evidence-note"><CircleAlert aria-hidden="true" size={18} /><span>Payment proof still missing</span></div>
              </div>
            </div>
          ) : null}

          {step === "intake" ? (
            <div className="stage">
              <StageIntro label="Describe the issue" title="What happened?" body="Write it as you would explain it to someone you trust. Plain language is enough." />
              <div className="field-group">
                <label htmlFor="problem">Your complaint</label>
                <textarea id="problem" value={problem} onChange={(event) => { setProblem(event.target.value.slice(0, 500)); setIntakeError(""); }} aria-describedby={intakeError ? "problem-hint problem-error" : "problem-hint"} aria-invalid={Boolean(intakeError)} rows={7} />
                <div className="field-meta"><span id="problem-hint">Do not enter real account numbers or personal identifiers. Text may be processed by the configured AI provider.</span><span>{problem.length}/500</span></div>
                {intakeError ? <p className="field-error" id="problem-error" role="alert"><CircleAlert size={16} aria-hidden="true" />{intakeError}</p> : null}
              </div>
              <div className="action-row"><PrimaryButton onClick={continueFromIntake} disabled={isWorking}>{isWorking ? "Interpreting..." : "Check my complaint"}</PrimaryButton></div>
            </div>
          ) : null}

          {step === "confirm" ? (
            <div className="stage">
              <StageIntro label="Confirm the outcome" title="Let's check the right thing." body="OutcomeLock checks the result you need against what the department recorded." />
              <div className="outcome-statement">
                <span>What you need</span>
                <p>{desiredOutcome}</p>
              </div>
              <div className="source-quote"><span>You told us</span><blockquote>“{problem.trim()}”</blockquote></div>
              <div className="action-row"><PrimaryButton onClick={() => setStep("grievance")}>{"Yes, that's what I need"}</PrimaryButton></div>
            </div>
          ) : null}

          {step === "grievance" ? (
            <div className="stage">
              <StageIntro label="Review the response" title="The case says closed." body="Now compare what the department recorded with the outcome you asked for." />
              <div className="case-heading">
                <div><span>Complaint</span><strong>{pensionDemoCase.grievance.id}</strong></div>
                <span className="status-badge status-neutral">{pensionDemoCase.grievance.status}</span>
              </div>
              <dl className="details-list">
                <DetailRow label="Submitted">{pensionDemoCase.grievance.submitted}</DetailRow>
                <DetailRow label="Department">{pensionDemoCase.grievance.department}</DetailRow>
                <DetailRow label="Benefit">{pensionDemoCase.citizen.benefit}</DetailRow>
              </dl>
              <div className="response-block">
                <span>Department response</span>
                <blockquote>“{pensionDemoCase.grievance.response}”</blockquote>
              </div>
              <div className="action-row"><PrimaryButton onClick={checkOutcome} disabled={isWorking}>{isWorking ? "Checking evidence..." : "Check if this is actually resolved"}</PrimaryButton></div>
            </div>
          ) : null}

          {step === "verdict" ? (
            <div className="stage verdict-stage">
              <VerdictChoreography>
              <div className="verdict-mark" data-verdict-part="mark"><CircleAlert aria-hidden="true" size={24} /><span>Proof check complete</span></div>
              <h1 data-stage-heading data-verdict-part="status" tabIndex={-1}>{explanation.status.replaceAll("_", " ").toLowerCase()}</h1>
              <p className="verdict-reason" data-verdict-part="reason">{explanation.summary}</p>
              <div className="comparison-grid">
                <div className="comparison-item asked" data-verdict-part="comparison"><span>You asked for</span><strong>{explanation.requestedOutcome}</strong><CheckCircle2 aria-hidden="true" size={20} /></div>
                <div className="comparison-item confirmed" data-verdict-part="comparison"><span>They confirmed</span><strong>{explanation.governmentAction}</strong><FileCheck2 aria-hidden="true" size={20} /></div>
                <div className="comparison-item missing" data-verdict-part="comparison"><span>Still missing</span><strong>{explanation.missingEvidence.join(" ") || "No proof is missing."}</strong><CircleAlert aria-hidden="true" size={20} /></div>
              </div>
              <div className="next-action" data-verdict-part="action">
                <div><span>What you can do now</span><strong>{explanation.recommendedAction}</strong></div>
                <PrimaryButton onClick={prepareAppeal} disabled={isWorking}>{isWorking ? "Preparing appeal..." : "Appeal the closure"}</PrimaryButton>
              </div>
              </VerdictChoreography>
            </div>
          ) : null}

          {step === "appeal" ? (
            <div className="stage">
              <StageIntro label="Prepare an appeal" title="Ask for proof, not another update." body="This neutral draft uses only known facts from the sample case. Edit it before the simulated submission." />
              <div className="appeal-subject"><span>Subject</span><strong>{appealSubject}</strong></div>
              <div className="field-group">
                <label htmlFor="appeal">Appeal text</label>
                <textarea id="appeal" value={appealBody} onChange={(event) => setAppealBody(event.target.value.slice(0, 1600))} rows={12} />
                <div className="field-meta"><span>Firm, factual, and editable.</span><span>{appealBody.length}/1600</span></div>
              </div>
              <div className="simulation-note"><ShieldCheck aria-hidden="true" size={17} /><span>This action is simulated. Nothing is sent to a department.</span></div>
              <div className="action-row"><PrimaryButton onClick={() => setStep("submitted")} icon={false} disabled={!appealBody.trim()}><span className="button-label-with-icon"><Send aria-hidden="true" size={17} />Submit appeal</span></PrimaryButton></div>
            </div>
          ) : null}

          {step === "submitted" ? (
            <div className="stage centered-stage">
              <div className="success-icon"><FilePenLine aria-hidden="true" size={30} /></div>
              <StageIntro title="Appeal ready for tracking" body="Your appeal is ready to track. It was not sent to any department." />
              <div className="receipt-block">
                <div><span>Reference</span><strong>APL-{pensionDemoCase.grievance.id.replace("GRV-", "")}-SIM</strong></div>
                <div><span>Status</span><strong>Simulated submission</strong></div>
              </div>
              <div className="action-row action-row-center"><PrimaryButton onClick={() => setStep("timeline")}>Track my case</PrimaryButton></div>
            </div>
          ) : null}

          {step === "timeline" ? (
            <div className="stage">
              <StageIntro label="Track progress" title="The case moved. Was your pension paid?" body="Updates matter only when they include proof of the result you asked for." />
              <ol className="timeline-list">
                {pensionDemoCase.timeline.map((event) => (
                  <li key={event.title} className={event.state === "current" ? "timeline-current" : ""}>
                    <span className="timeline-node" aria-hidden="true">{event.state === "current" ? <Clock3 size={15} /> : <Check size={14} />}</span>
                    <div><strong>{event.title}</strong><span>{event.detail}</span></div>
                    <time>{event.date}</time>
                  </li>
                ))}
              </ol>
              <div className="new-evidence"><FileCheck2 aria-hidden="true" size={21} /><div><span>New sample proof</span><strong>{pensionDemoCase.resolution.evidence} recorded: {pensionDemoCase.resolution.amount}</strong></div></div>
              <div className="action-row"><PrimaryButton onClick={() => setStep("resolved")}>Confirm payment</PrimaryButton></div>
            </div>
          ) : null}

          {step === "resolved" ? (
            <div className="stage resolved-stage">
              <div className="resolved-mark"><CheckCircle2 aria-hidden="true" size={26} /><span>Required proof found</span></div>
              <h1 data-stage-heading tabIndex={-1}>{pensionDemoCase.resolution.status.toLowerCase()}</h1>
              <p className="resolved-copy">The available proof now matches the result you asked for.</p>
              <div className="payment-proof">
                <div className="proof-header"><span>{pensionDemoCase.resolution.evidence}</span><FileCheck2 aria-hidden="true" size={21} /></div>
                <strong>{pensionDemoCase.resolution.amount}</strong>
                <dl>
                  <DetailRow label="Credited">{pensionDemoCase.resolution.date}</DetailRow>
                  <DetailRow label="Outcome">{desiredOutcome}</DetailRow>
                  <DetailRow label="Case">{pensionDemoCase.grievance.id}</DetailRow>
                </dl>
              </div>
              <div className="citizen-chip"><UserRound aria-hidden="true" size={17} /><span>{pensionDemoCase.citizen.name}</span><MapPin aria-hidden="true" size={15} /><span>{pensionDemoCase.citizen.location}</span></div>
              <div className="action-row"><SecondaryButton onClick={resetDemo}><span className="button-label-with-icon"><RotateCcw aria-hidden="true" size={16} />Restart demo</span></SecondaryButton></div>
            </div>
          ) : null}
          </StageTransition>
        </section>
      </main>
      <footer className="site-footer"><span>OutcomeLock</span><span>Proof over case status.</span><span>Uses sample data. Not a government service.</span></footer>
    </div>
  );
}
