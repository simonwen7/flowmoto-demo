import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CircleHelp,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  demoAppliedTask,
  type EvidenceVerdict,
} from "../data/demoAppliedTask";

type AppliedStage = "brief" | "verify" | "decide" | "finish";

type AppliedTaskProps = {
  onBack: () => void;
  onComplete: () => void;
};

export function AppliedTask({
  onBack,
  onComplete,
}: AppliedTaskProps) {
  const [stage, setStage] = useState<AppliedStage>("brief");
  const [reviews, setReviews] = useState<
    Record<string, EvidenceVerdict>
  >({});
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    "harbor" | "northline" | null
  >(null);

  const reviewedCount = Object.keys(reviews).length;

  const correctReviewCount = useMemo(
    () =>
      demoAppliedTask.claims.filter(
        (claim) => reviews[claim.id] === claim.correctVerdict,
      ).length,
    [reviews],
  );

  const allClaimsReviewed =
    reviewedCount === demoAppliedTask.claims.length;

  const selectedVehicle =
    demoAppliedTask.vehicles.find(
      (vehicle) => vehicle.id === selectedVehicleId,
    ) ?? null;

  const reviewClaim = (
    claimId: string,
    verdict: EvidenceVerdict,
  ) => {
    if (reviews[claimId]) return;

    setReviews((current) => ({
      ...current,
      [claimId]: verdict,
    }));
  };

  const stageNumber =
    stage === "brief"
      ? 1
      : stage === "verify"
        ? 2
        : stage === "decide"
          ? 3
          : 3;

  const stageLabel =
    stage === "brief"
      ? "Gather"
      : stage === "verify"
        ? "Verify"
        : stage === "decide"
          ? "Decide"
          : "Complete";

  return (
    <section className="screen applied-screen">
      <div className="applied-top-row">
        <button
          className="deck-back-link"
          onClick={onBack}
        >
          <ArrowLeft size={16} strokeWidth={1.9} />
          Modules
        </button>

        <div className="applied-demo-labels">
          <span>APPLYING · TIER 1</span>
          <span>SIMULATED DEMO EVIDENCE</span>
        </div>
      </div>

      <div className="applied-progress">
        {["Gather", "Verify", "Decide"].map(
          (label, index) => {
            const number = index + 1;
            const active = number === stageNumber;
            const complete = number < stageNumber || stage === "finish";

            return (
              <div
                className={`applied-progress__step ${
                  active
                    ? "applied-progress__step--active"
                    : ""
                } ${
                  complete
                    ? "applied-progress__step--complete"
                    : ""
                }`}
                key={label}
              >
                <span className="applied-progress__number">
                  {complete ? (
                    <Check size={12} strokeWidth={2.4} />
                  ) : (
                    `0${number}`
                  )}
                </span>

                <span>{label}</span>
              </div>
            );
          },
        )}
      </div>

      <AnimatePresence mode="wait">
        {stage === "brief" ? (
          <motion.div
            className="applied-stage"
            key="brief"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{
              duration: 0.36,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <header className="applied-heading">
              <div>
                <p className="eyebrow">
                  {demoAppliedTask.scenario.eyebrow}
                </p>

                <h1>
                  Use AI.
                  <br />
                  <em>Keep your judgment.</em>
                </h1>
              </div>

              <div className="applied-stage-badge">
                <span>STEP 01 / 03</span>
                <strong>{stageLabel}</strong>
              </div>
            </header>

            <div className="applied-brief-grid">
              <article className="decision-brief">
                <div className="decision-brief__header">
                  <div>
                    <span className="micro-label">
                      MAYA’S DECISION
                    </span>

                    <h2>
                      {demoAppliedTask.scenario.title}
                    </h2>
                  </div>

                  <span className="decision-brief__scribble">
                    01
                  </span>
                </div>

                <p className="decision-brief__intro">
                  {demoAppliedTask.scenario.description}
                </p>

                <div className="constraint-grid">
                  {demoAppliedTask.scenario.constraints.map(
                    (constraint) => (
                      <div
                        className="constraint-card"
                        key={constraint.label}
                      >
                        <span>{constraint.label}</span>
                        <strong>{constraint.value}</strong>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <aside className="ai-briefing">
                <div className="ai-briefing__top">
                  <span className="ai-avatar">
                    <Bot size={20} strokeWidth={1.8} />
                  </span>

                  <div>
                    <p className="micro-label">
                      AI FIRST PASS
                    </p>
                    <strong>Sounds confident.</strong>
                  </div>
                </div>

                <blockquote>
                  “{demoAppliedTask.aiSummary}”
                </blockquote>

                <div className="ai-warning">
                  <CircleHelp size={17} strokeWidth={1.8} />
                  <p>
                    The answer is useful as a starting point.
                    It is not the decision.
                  </p>
                </div>

                <motion.button
                  className="applied-primary"
                  onClick={() => setStage("verify")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <span>Check the AI’s claims</span>
                  <ArrowRight size={18} />
                </motion.button>
              </aside>
            </div>
          </motion.div>
        ) : stage === "verify" ? (
          <motion.div
            className="applied-stage"
            key="verify"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{
              duration: 0.36,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <header className="applied-heading applied-heading--compact">
              <div>
                <p className="eyebrow">EVIDENCE CHECK</p>
                <h1>
                  Keep the facts.
                  <br />
                  <em>Question the leap.</em>
                </h1>
              </div>

              <div className="applied-stage-badge">
                <span>STEP 02 / 03</span>
                <strong>
                  {reviewedCount} / {demoAppliedTask.claims.length} reviewed
                </strong>
              </div>
            </header>

            <div className="evidence-workspace">
              <div className="evidence-list">
                {demoAppliedTask.claims.map(
                  (claim, index) => {
                    const verdict = reviews[claim.id];
                    const reviewed = Boolean(verdict);
                    const correct =
                      verdict === claim.correctVerdict;

                    return (
                      <motion.article
                        className={`evidence-card ${
                          reviewed
                            ? correct
                              ? "evidence-card--correct"
                              : "evidence-card--wrong"
                            : ""
                        }`}
                        key={claim.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.045,
                        }}
                      >
                        <div className="evidence-card__top">
                          <span className="evidence-number">
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span className="evidence-source">
                            {claim.source}
                          </span>
                        </div>

                        <h3>{claim.claim}</h3>

                        <div className="evidence-detail">
                          <SearchCheck
                            size={16}
                            strokeWidth={1.8}
                          />
                          <p>{claim.evidence}</p>
                        </div>

                        {!reviewed ? (
                          <div className="evidence-actions">
                            <motion.button
                              className="evidence-action evidence-action--keep"
                              onClick={() =>
                                reviewClaim(
                                  claim.id,
                                  "keep",
                                )
                              }
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Check
                                size={15}
                                strokeWidth={2.2}
                              />
                              Keep it
                            </motion.button>

                            <motion.button
                              className="evidence-action evidence-action--question"
                              onClick={() =>
                                reviewClaim(
                                  claim.id,
                                  "question",
                                )
                              }
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CircleHelp
                                size={15}
                                strokeWidth={2}
                              />
                              Question it
                            </motion.button>
                          </div>
                        ) : (
                          <motion.div
                            className="evidence-feedback"
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                          >
                            <span
                              className={`evidence-feedback__icon ${
                                correct
                                  ? "evidence-feedback__icon--correct"
                                  : "evidence-feedback__icon--wrong"
                              }`}
                            >
                              {correct ? (
                                <Check
                                  size={14}
                                  strokeWidth={2.4}
                                />
                              ) : (
                                <X
                                  size={14}
                                  strokeWidth={2.4}
                                />
                              )}
                            </span>

                            <p>{claim.feedback}</p>
                          </motion.div>
                        )}
                      </motion.article>
                    );
                  },
                )}
              </div>

              <aside className="evidence-summary">
                <div>
                  <p className="eyebrow">
                    YOUR EVIDENCE BOARD
                  </p>
                  <h3>
                    Don’t outsource
                    <br />
                    the filter.
                  </h3>
                </div>

                <div className="evidence-score">
                  <span>
                    {correctReviewCount}
                  </span>
                  <p>
                    of {demoAppliedTask.claims.length} calls
                    currently match the supplied evidence
                  </p>
                </div>

                <div className="evidence-summary__note">
                  <ShieldCheck
                    size={18}
                    strokeWidth={1.8}
                  />
                  <p>
                    You are not trying to prove AI wrong.
                    You are deciding which claims deserve to
                    survive into the decision.
                  </p>
                </div>

                <button
                  className="applied-primary"
                  disabled={!allClaimsReviewed}
                  onClick={() => setStage("decide")}
                >
                  <span>
                    {allClaimsReviewed
                      ? "Build the decision"
                      : `${demoAppliedTask.claims.length - reviewedCount} claims left`}
                  </span>
                  <ArrowRight size={18} />
                </button>
              </aside>
            </div>
          </motion.div>
        ) : stage === "decide" ? (
          <motion.div
            className="applied-stage"
            key="decide"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{
              duration: 0.36,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <header className="applied-heading applied-heading--compact">
              <div>
                <p className="eyebrow">
                  SYNTHESIZE THE EVIDENCE
                </p>

                <h1>
                  Now make
                  <br />
                  <em>the call.</em>
                </h1>
              </div>

              <div className="applied-stage-badge">
                <span>STEP 03 / 03</span>
                <strong>Decide</strong>
              </div>
            </header>

            <div className="decision-workspace">
              <div className="vehicle-grid">
                {demoAppliedTask.vehicles.map(
                  (vehicle, index) => {
                    const selected =
                      selectedVehicleId === vehicle.id;

                    return (
                      <motion.button
                        className={`vehicle-card ${
                          selected
                            ? "vehicle-card--selected"
                            : ""
                        }`}
                        key={vehicle.id}
                        onClick={() =>
                          setSelectedVehicleId(
                            vehicle.id,
                          )
                        }
                        whileHover={{
                          y: -6,
                          rotate:
                            index === 0 ? -0.35 : 0.35,
                        }}
                        whileTap={{ scale: 0.988 }}
                      >
                        <div className="vehicle-card__top">
                          <span>
                            OPTION{" "}
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          {selected && (
                            <motion.span
                              className="vehicle-selected-mark"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check
                                size={15}
                                strokeWidth={2.4}
                              />
                            </motion.span>
                          )}
                        </div>

                        <div>
                          <p className="vehicle-type">
                            {vehicle.type}
                          </p>
                          <h2>{vehicle.name}</h2>
                          <strong className="vehicle-price">
                            {vehicle.price}
                          </strong>
                        </div>

                        <div className="vehicle-facts">
                          {vehicle.facts.map(
                            (fact) => (
                              <span key={fact}>
                                {fact}
                              </span>
                            ),
                          )}
                        </div>

                        <div className="vehicle-card__foot">
                          <span>
                            {selected
                              ? "Selected"
                              : "Choose this"}
                          </span>
                          <ArrowRight size={17} />
                        </div>
                      </motion.button>
                    );
                  },
                )}
              </div>

              <AnimatePresence mode="wait">
                {!selectedVehicle ? (
                  <motion.div
                    className="decision-prompt"
                    key="decision-waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles
                      size={18}
                      strokeWidth={1.8}
                    />
                    <p>
                      Use the verified evidence and Maya’s
                      constraints — not the AI’s confidence.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className={`decision-feedback ${
                      selectedVehicle.recommended
                        ? "decision-feedback--strong"
                        : ""
                    }`}
                    key={selectedVehicle.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <div>
                      <span className="micro-label">
                        DECISION FEEDBACK
                      </span>

                      <strong>
                        {selectedVehicle.recommended
                          ? "Strong fit for these constraints."
                          : "Defensible, but the fit is weaker."}
                      </strong>
                    </div>

                    <p>
                      {selectedVehicle.feedback}
                    </p>

                    <motion.button
                      className="applied-primary"
                      onClick={() => setStage("finish")}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span>See the decision trail</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="applied-stage"
            key="finish"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <section className="applied-finish">
              <div
                className="applied-finish__stack"
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>

              <div className="applied-finish__content">
                <div className="status-chip">
                  <ShieldCheck size={15} />
                  Applied task complete
                </div>

                <p className="eyebrow">
                  AI AS ASSISTANT · YOU AS DECISION MAKER
                </p>

                <h2>
                  The useful part
                  <br />
                  <em>survived the filter.</em>
                </h2>

                <p className="applied-finish__lead">
                  You used AI to generate a starting point,
                  checked the claims against evidence, and made
                  a decision from the constraints that actually
                  mattered.
                </p>

                <div className="decision-trail">
                  <div>
                    <span>01</span>
                    <strong>Gather</strong>
                    <p>AI produced a confident first pass.</p>
                  </div>

                  <span className="decision-trail__arrow">
                    →
                  </span>

                  <div>
                    <span>02</span>
                    <strong>Verify</strong>
                    <p>
                      {correctReviewCount} /{" "}
                      {demoAppliedTask.claims.length} evidence
                      judgments matched the supplied evidence.
                    </p>
                  </div>

                  <span className="decision-trail__arrow">
                    →
                  </span>

                  <div>
                    <span>03</span>
                    <strong>Decide</strong>
                    <p>
                      You chose{" "}
                      {selectedVehicle?.name ??
                        "a final option"}.
                    </p>
                  </div>
                </div>

                <div className="simulation-note">
                  <span>DEMO NOTE</span>
                  <p>
                    Vehicle names, prices, specifications,
                    evidence, and recommendations in this task
                    are fictional and exist only to demonstrate
                    the learning interaction.
                  </p>
                </div>

                <button
                  className="applied-finish__primary"
                  onClick={onComplete}
                >
                  <span>Return to modules</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
