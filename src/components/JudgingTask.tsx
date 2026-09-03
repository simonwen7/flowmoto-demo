import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import {
  judgmentScenarios,
  type JudgmentVerdict,
} from "../data/demoJudging";

type JudgingTaskProps = {
  onBack: () => void;
  onComplete: () => void;
};

const verdictMeta: Record<
  JudgmentVerdict,
  {
    label: string;
    description: string;
  }
> = {
  use: {
    label: "USE",
    description: "Good enough to act on after your own review.",
  },
  verify: {
    label: "VERIFY",
    description: "Useful lead, but check the underlying claim first.",
  },
  reject: {
    label: "REJECT",
    description: "Do not carry this answer forward as-is.",
  },
};

export function JudgingTask({
  onBack,
  onComplete,
}: JudgingTaskProps) {
  const [started, setStarted] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedVerdict, setSelectedVerdict] =
    useState<JudgmentVerdict | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenario = judgmentScenarios[scenarioIndex];

  const progress = finished
    ? 100
    : ((scenarioIndex + 1) / judgmentScenarios.length) * 100;

  const correct =
    selectedVerdict === scenario?.correctVerdict;

  const chooseVerdict = (verdict: JudgmentVerdict) => {
    if (selectedVerdict) return;

    setSelectedVerdict(verdict);

    if (verdict === scenario.correctVerdict) {
      setCorrectCount((value) => value + 1);
    }
  };

  const continueTask = () => {
    if (!selectedVerdict) return;

    if (scenarioIndex === judgmentScenarios.length - 1) {
      setFinished(true);
      return;
    }

    setScenarioIndex((value) => value + 1);
    setSelectedVerdict(null);
  };

  return (
    <section className="screen judging-screen">
      <div className="judging-top-row">
        <button className="deck-back-link" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Modules
        </button>

        <div className="judging-demo-labels">
          <span>JUDGING</span>
          <span>DEMO INTERACTION PROPOSAL</span>
        </div>
      </div>

      {!started ? (
        <motion.section
          className="judging-intro"
          initial={{
            opacity: 0,
            y: 18,
            scale: 0.99,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="judging-intro__copy">
            <p className="eyebrow">JUDGMENT PRACTICE</p>

            <h1>
              Not every answer
              <br />
              needs the <em>same reaction.</em>
            </h1>

            <p>
              Sometimes AI is ready to use. Sometimes it gives you
              a useful lead that still needs checking. Sometimes the
              safest move is to throw the answer away.
            </p>

            <motion.button
              className="judging-primary"
              onClick={() => setStarted(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
            >
              <span>Try four quick calls</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>

          <div className="judgment-compass-preview">
            <div className="compass-preview-card compass-preview-card--use">
              <span>01</span>
              <strong>USE</strong>
              <p>Inspectable + low risk</p>
            </div>

            <div className="compass-preview-card compass-preview-card--verify">
              <span>02</span>
              <strong>VERIFY</strong>
              <p>Claim matters + source needed</p>
            </div>

            <div className="compass-preview-card compass-preview-card--reject">
              <span>03</span>
              <strong>REJECT</strong>
              <p>Unsupported answer should not survive</p>
            </div>
          </div>
        </motion.section>
      ) : !finished ? (
        <>
          <header className="judging-heading">
            <div>
              <p className="eyebrow">
                RESPONSE TRIAGE · {scenario.context}
              </p>

              <h1>
                Make
                <br />
                <em>the call.</em>
              </h1>
            </div>

            <div className="judging-counter">
              <span>
                CASE {String(scenarioIndex + 1).padStart(2, "0")}
              </span>
              <strong>
                {scenarioIndex + 1} / {judgmentScenarios.length}
              </strong>
            </div>
          </header>

          <div className="judging-progress">
            <div className="deck-progress__track">
              <motion.span
                className="deck-progress__fill"
                animate={{ width: `${progress}%` }}
                transition={{
                  type: "spring",
                  stiffness: 170,
                  damping: 24,
                }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="judging-workspace"
              key={scenario.id}
              initial={{
                opacity: 0,
                x: 22,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -18,
              }}
              transition={{
                duration: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <article className="judgment-card">
                <div className="judgment-card__top">
                  <div>
                    <span className="micro-label">THE SITUATION</span>
                    <p>{scenario.prompt}</p>
                  </div>

                  <span className="judgment-card__number">
                    {scenario.number}
                  </span>
                </div>

                <div className="judgment-ai-answer">
                  <span className="judgment-ai-answer__icon">
                    <Sparkles size={17} strokeWidth={1.8} />
                  </span>

                  <div>
                    <span>AI ANSWER</span>
                    <blockquote>“{scenario.aiAnswer}”</blockquote>
                  </div>
                </div>

                <div className="judgment-evidence-note">
                  <Eye size={16} strokeWidth={1.8} />
                  <div>
                    <span>WHAT YOU CAN SEE</span>
                    <p>{scenario.evidenceNote}</p>
                  </div>
                </div>
              </article>

              <aside className="judgment-control">
                {!selectedVerdict ? (
                  <>
                    <div>
                      <p className="eyebrow">YOUR JUDGMENT</p>
                      <h2>What should happen next?</h2>
                    </div>

                    <div className="verdict-list">
                      {(
                        Object.keys(verdictMeta) as JudgmentVerdict[]
                      ).map((verdict) => (
                        <motion.button
                          className={`verdict-button verdict-button--${verdict}`}
                          key={verdict}
                          onClick={() => chooseVerdict(verdict)}
                          whileHover={{
                            x: 4,
                          }}
                          whileTap={{
                            scale: 0.985,
                          }}
                        >
                          <span className="verdict-button__label">
                            {verdictMeta[verdict].label}
                          </span>

                          <span className="verdict-button__description">
                            {verdictMeta[verdict].description}
                          </span>

                          <ArrowRight size={16} />
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    className={`judgment-feedback ${
                      correct
                        ? "judgment-feedback--correct"
                        : "judgment-feedback--wrong"
                    }`}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <div className="judgment-feedback__status">
                      <span>
                        {correct ? (
                          <Check size={17} strokeWidth={2.4} />
                        ) : (
                          <X size={17} strokeWidth={2.4} />
                        )}
                      </span>

                      <div>
                        <p className="micro-label">
                          {correct
                            ? "JUDGMENT MATCH"
                            : "TRY A DIFFERENT LENS"}
                        </p>

                        <strong>
                          {correct
                            ? "Good call."
                            : `Better fit: ${
                                verdictMeta[
                                  scenario.correctVerdict
                                ].label
                              }`}
                        </strong>
                      </div>
                    </div>

                    <p className="judgment-feedback__body">
                      {scenario.feedback[selectedVerdict]}
                    </p>

                    <div className="judgment-principle">
                      <SearchCheck size={17} strokeWidth={1.8} />

                      <div>
                        <span>KEEP THIS RULE</span>
                        <p>{scenario.principle}</p>
                      </div>
                    </div>

                    <motion.button
                      className="judging-primary"
                      onClick={continueTask}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span>
                        {scenarioIndex ===
                        judgmentScenarios.length - 1
                          ? "See my judgment compass"
                          : "Next case"}
                      </span>

                      <ArrowRight size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </aside>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.section
          className="judging-finish"
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
          <div className="judging-finish__stack" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="judging-finish__content">
            <div className="status-chip">
              <ShieldAlert size={15} />
              Judgment practice complete
            </div>

            <p className="eyebrow">YOUR JUDGMENT COMPASS</p>

            <h2>
              Match the
              <br />
              <em>reaction to the risk.</em>
            </h2>

            <p className="judging-finish__lead">
              You matched {correctCount} of {judgmentScenarios.length} demo
              cases to the intended judgment. The point is not to
              distrust AI by default — it is to choose the right level
              of scrutiny for the situation.
            </p>

            <div className="judgment-compass">
              <div className="judgment-compass__item">
                <span className="judgment-compass__icon judgment-compass__icon--use">
                  <Check size={17} />
                </span>
                <div>
                  <strong>USE</strong>
                  <p>
                    Low-stakes, inspectable output that you can evaluate
                    directly.
                  </p>
                </div>
              </div>

              <div className="judgment-compass__item">
                <span className="judgment-compass__icon judgment-compass__icon--verify">
                  <SearchCheck size={17} />
                </span>
                <div>
                  <strong>VERIFY</strong>
                  <p>
                    A meaningful factual claim where the source matters
                    to the decision.
                  </p>
                </div>
              </div>

              <div className="judgment-compass__item">
                <span className="judgment-compass__icon judgment-compass__icon--reject">
                  <X size={17} />
                </span>
                <div>
                  <strong>REJECT</strong>
                  <p>
                    An answer that has already failed the evidence check
                    should not survive into the work.
                  </p>
                </div>
              </div>
            </div>

            <div className="judging-demo-note">
              <span>DEMO NOTE</span>
              <p>
                This dedicated Judging flow is a v0.1 interaction
                proposal. The current product specification establishes
                Judging as a learner module but does not yet define this
                exact task structure.
              </p>
            </div>

            <button
              className="judging-finish__primary"
              onClick={onComplete}
            >
              <span>Return to modules</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.section>
      )}
    </section>
  );
}
