import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  MessageCircle,
  Scale,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import "./App.css";
import "./SwipeDeck.css";
import "./KnowledgeCheck.css";
import "./AppliedTask.css";
import "./JudgingTask.css";
import { SwipeDeck } from "./components/SwipeDeck";
import { KnowledgeCheck } from "./components/KnowledgeCheck";
import { AppliedTask } from "./components/AppliedTask";
import { JudgingTask } from "./components/JudgingTask";
import { demoCards } from "./data/demoCards";

type Screen =
  | "onboarding"
  | "home"
  | "deck"
  | "quiz"
  | "applied"
  | "judging";

type DeckMode = "daily" | "remediation";

const roleOptions = [
  "Running people",
  "Making content",
  "Crunching data",
  "Teaching & advising",
  "Building things",
  "Serving clients",
  "Researching",
  "Studying",
];

const reviewNotes = [
  {
    title: "Role taxonomy",
    status: "Needs decision",
    detail:
      "The product spec targets roughly 16 occupational roles, but the final taxonomy and classification rules are not defined yet.",
    demo:
      "This demo uses a small temporary role set purely to demonstrate the interaction.",
  },
  {
    title: "Visual direction",
    status: "Needs validation",
    detail:
      "The spec proposes moving toward pencil / crayon / hand-drawn warmth while retaining selected game-like elements.",
    demo:
      "This demo uses a hand-drawn + restrained game-like hybrid as a visual hypothesis.",
  },
  {
    title: "Quiz trigger",
    status: "Needs decision",
    detail:
      "The number of cards a learner should move through before a knowledge check appears is still TBD.",
    demo:
      "The demo currently uses five seed cards before the prepared Knowledge Check.",
  },
  {
    title: "Question pipeline",
    status: "Needs decision",
    detail:
      "The production workflow for LLM-generated questions, human review, review SLA, and rejected-question fallback is not finalized.",
    demo:
      "This demo uses three prepared questions so the feedback and remediation experience can be reviewed safely.",
  },
  {
    title: "Applied task content",
    status: "Demo assumption",
    detail:
      "The specification defines the Tier 1 learning objective and gives examples of realistic decisions, but does not define this exact scenario.",
    demo:
      "The Applying module uses fictional vehicles and simulated evidence to demonstrate gather → verify → decide without presenting demo data as real-world facts.",
  },
  {
    title: "Judging task structure",
    status: "Demo assumption",
    detail:
      "The specification establishes Judging as an open learner module but does not define a dedicated Judging task flow.",
    demo:
      "This v0.1 demo proposes a four-case Use / Verify / Reject response-triage interaction so the third module can be reviewed as a complete experience.",
  },
  {
    title: "Video threshold",
    status: "Needs decision",
    detail:
      "The rule for when a concept is complex enough to require short-form video is not defined.",
    demo:
      "Video remains outside the active demo flow until that rule is agreed.",
  },
  {
    title: "Tier 2 agentic scope",
    status: "Needs decision",
    detail:
      "The final REB-compliant boundary between Copilot-style tooling and truly agentic workflows remains open.",
    demo:
      "Tier 2 remains outside this v0.1 learner demo rather than being presented as a finished capability.",
  },
];

const modules = [
  {
    id: "foundations",
    eyebrow: "01",
    title: "Foundations",
    description:
      "Build the mental models that make AI easier to understand.",
    icon: BookOpen,
    note: "Know what you're working with.",
  },
  {
    id: "applying",
    eyebrow: "02",
    title: "Applying",
    description:
      "Practice using AI inside practical, everyday decisions.",
    icon: Wrench,
    note: "Turn knowledge into action.",
  },
  {
    id: "judging",
    eyebrow: "03",
    title: "Judging",
    description:
      "Learn when to trust, question, or verify an AI response.",
    icon: Scale,
    note: "Stay in charge of the answer.",
  },
];

function ReviewPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="review-backdrop"
            aria-label="Close review notes"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="review-panel"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
            }}
          >
            <div className="review-panel__header">
              <div>
                <p className="eyebrow">DEMO REVIEW</p>
                <h2>Open decisions</h2>
              </div>

              <button
                className="icon-button"
                aria-label="Close review notes"
                onClick={onClose}
              >
                <X size={19} strokeWidth={1.9} />
              </button>
            </div>

            <p className="review-intro">
              These notes separate temporary demo assumptions from
              decisions that are still open in the product
              specification.
            </p>

            <div className="review-list">
              {reviewNotes.map((note, index) => (
                <motion.article
                  className="review-note"
                  key={note.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + index * 0.045,
                  }}
                >
                  <div className="review-note__top">
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="decision-pill">
                      {note.status}
                    </span>
                  </div>

                  <h3>{note.title}</h3>
                  <p>{note.detail}</p>

                  <div className="demo-assumption">
                    <strong>Demo assumption</strong>
                    <span>{note.demo}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DoodleField() {
  return (
    <div className="doodle-field" aria-hidden="true">
      <motion.div
        className="doodle doodle--spark"
        animate={{
          rotate: [0, 8, -4, 0],
          y: [0, -7, 2, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✦
      </motion.div>

      <motion.div
        className="doodle doodle--loop"
        animate={{
          rotate: [8, -4, 8],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ∿
      </motion.div>

      <motion.div
        className="doodle doodle--sun"
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        ☼
      </motion.div>
    </div>
  );
}

function App() {
  const [screen, setScreen] =
    useState<Screen>("onboarding");

  const [selectedRole, setSelectedRole] =
    useState("");

  const [freeText, setFreeText] =
    useState("");

  const [reviewOpen, setReviewOpen] =
    useState(false);

  const [activeModule, setActiveModule] =
    useState("foundations");

  const [deckMode, setDeckMode] =
    useState<DeckMode>("daily");

  const [
    remediationCardIds,
    setRemediationCardIds,
  ] = useState<string[]>([]);

  const canContinue = Boolean(
    selectedRole || freeText.trim(),
  );

  const learnerFlavor =
    selectedRole ||
    freeText.trim() ||
    "your day-to-day";

  const activeModuleData = modules.find(
    (module) => module.id === activeModule,
  );

  const remediationCards = demoCards.filter(
    (card) =>
      remediationCardIds.includes(card.id),
  );

  const enterDailyDeck = () => {
    setDeckMode("daily");
    setRemediationCardIds([]);
    setScreen("deck");
  };

  const finishQuiz = (
    missedCardIds: string[],
  ) => {
    if (missedCardIds.length === 0) {
      setDeckMode("daily");
      setRemediationCardIds([]);
      setScreen("home");
      return;
    }

    setRemediationCardIds(missedCardIds);
    setDeckMode("remediation");
    setScreen("deck");
  };

  const finishRemediation = () => {
    setDeckMode("daily");
    setRemediationCardIds([]);
    setScreen("home");
  };

  const getModuleCopy = () => {
    if (activeModule === "foundations") {
      return "A five-card interaction prototype is ready. Drag the stack, reveal deeper explanations, and continue into an immediate-feedback Knowledge Check.";
    }

    if (activeModule === "applying") {
      return "Try one complete Tier 1 decision task: use an AI first pass, verify its claims against supplied evidence, and make the final call yourself.";
    }

    return "This v0.1 demo proposes a short response-triage exercise: decide when an AI answer is ready to use, when it needs verification, and when it should be rejected.";
  };

  const getModuleAction = () => {
    if (activeModule === "foundations") {
      return "Enter deck";
    }

    if (activeModule === "applying") {
      return "Start applied task";
    }

    return "Start judgment practice";
  };

  const handleModuleAction = () => {
    if (activeModule === "foundations") {
      enterDailyDeck();
      return;
    }

    if (activeModule === "applying") {
      setScreen("applied");
      return;
    }

    setScreen("judging");
  };

  return (
    <main className="app-shell">
      <div
        className="paper-texture"
        aria-hidden="true"
      />

      <DoodleField />

      <header className="topbar">
        <button
          className="brand"
          onClick={() =>
            setScreen("onboarding")
          }
          aria-label="Return to FlowMoto onboarding"
        >
          <span className="brand-mark">
            FM
          </span>
          <span>FlowMoto</span>
        </button>

        <div className="topbar-actions">
          <span className="demo-tag">
            LEARNER DEMO · V0.1
          </span>

          <button
            className="review-button"
            onClick={() =>
              setReviewOpen(true)
            }
          >
            <MessageCircle
              size={17}
              strokeWidth={1.9}
            />
            <span>Review notes</span>
            <span className="review-dot" />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {screen === "onboarding" ? (
          <motion.section
            key="onboarding"
            className="screen onboarding-screen"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.992,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -18,
              scale: 0.99,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="onboarding-copy">
              <motion.div
                className="status-chip"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.08,
                }}
              >
                <Sparkles size={15} />
                Quick check-in
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.13,
                }}
              >
                What best describes
                <br />
                your{" "}
                <em>day-to-day?</em>
              </motion.h1>

              <motion.p
                className="lead"
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.18,
                }}
              >
                A quick answer helps us
                shape examples around the
                work you actually do. It
                never sorts you into a
                track.
              </motion.p>

              <motion.div
                className="tiny-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.28,
                }}
              >
                <span className="tiny-note__line" />
                <span>
                  About 30 seconds. No
                  serious pre-test energy.
                </span>
              </motion.div>
            </div>

            <motion.div
              className="role-card-wrap"
              initial={{
                opacity: 0,
                x: 22,
                rotate: 0.5,
              }}
              animate={{
                opacity: 1,
                x: 0,
                rotate: 0,
              }}
              transition={{
                delay: 0.12,
                duration: 0.5,
              }}
            >
              <div className="back-card back-card--two" />
              <div className="back-card back-card--one" />

              <section className="role-card">
                <div className="role-card__header">
                  <div>
                    <p className="eyebrow">
                      PICK A FLAVOR
                    </p>

                    <h2>
                      Choose the closest
                      fit.
                    </h2>
                  </div>

                  <span className="pencil-number">
                    01
                  </span>
                </div>

                <div className="role-grid">
                  {roleOptions.map(
                    (role) => {
                      const selected =
                        role ===
                        selectedRole;

                      return (
                        <motion.button
                          key={role}
                          className={`role-chip ${
                            selected
                              ? "role-chip--selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedRole(
                              selected
                                ? ""
                                : role,
                            )
                          }
                          whileHover={{
                            y: -2,
                            rotate:
                              selected
                                ? 0
                                : -0.4,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                        >
                          <span>
                            {role}
                          </span>

                          {selected && (
                            <motion.span
                              className="role-check"
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                            >
                              <Check
                                size={14}
                                strokeWidth={
                                  2.4
                                }
                              />
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    },
                  )}
                </div>

                <div className="or-row">
                  <span />
                  <p>
                    or describe it yourself
                  </p>
                  <span />
                </div>

                <label className="freeform-field">
                  <span className="sr-only">
                    Describe what you do day
                    to day
                  </span>

                  <textarea
                    value={freeText}
                    onChange={(event) =>
                      setFreeText(
                        event.target.value,
                      )
                    }
                    placeholder='e.g. "I run a small clinic and use AI for scheduling and notes."'
                    rows={3}
                  />

                  <span
                    className="scribble-corner"
                    aria-hidden="true"
                  >
                    ↘
                  </span>
                </label>

                <motion.button
                  className="primary-button"
                  disabled={!canContinue}
                  onClick={() => {
                    if (canContinue) {
                      setScreen("home");
                    }
                  }}
                  whileHover={
                    canContinue
                      ? { y: -2 }
                      : undefined
                  }
                  whileTap={
                    canContinue
                      ? { scale: 0.985 }
                      : undefined
                  }
                >
                  <span>
                    Show my deck
                  </span>

                  <ArrowRight
                    size={19}
                  />
                </motion.button>

                <p className="role-card__footnote">
                  Demo role set · final
                  taxonomy is still under
                  review
                </p>
              </section>
            </motion.div>
          </motion.section>
        ) : screen === "home" ? (
          <motion.section
            key="home"
            className="screen home-screen"
            initial={{
              opacity: 0,
              x: 28,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -24,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <button
              className="back-link"
              onClick={() =>
                setScreen("onboarding")
              }
            >
              <ChevronLeft
                size={17}
              />
              Edit my answer
            </button>

            <div className="home-heading">
              <div>
                <p className="eyebrow">
                  YOUR DECK IS READY
                </p>

                <h1>
                  Learn a little. Use it a
                  lot.
                </h1>
              </div>

              <div className="daily-card">
                <span className="daily-card__dot" />

                <div>
                  <strong>
                    Today
                  </strong>

                  <span>
                    3 fresh cards waiting
                  </span>
                </div>
              </div>
            </div>

            <div className="flavor-banner">
              <div className="flavor-banner__icon">
                <Sparkles
                  size={19}
                />
              </div>

              <p>
                Your role only changes the
                examples we use.
                <strong>
                  {" "}
                  Every module stays open to
                  you.
                </strong>
              </p>
            </div>

            <div className="module-grid">
              {modules.map(
                (module, index) => {
                  const Icon =
                    module.icon;

                  const active =
                    activeModule ===
                    module.id;

                  return (
                    <motion.button
                      key={module.id}
                      className={`module-card ${
                        active
                          ? "module-card--active"
                          : ""
                      }`}
                      onClick={() =>
                        setActiveModule(
                          module.id,
                        )
                      }
                      whileHover={{
                        y: -7,
                        rotate:
                          index === 1
                            ? 0.35
                            : -0.35,
                      }}
                      whileTap={{
                        scale: 0.985,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      }}
                    >
                      <div className="module-card__top">
                        <span className="module-number">
                          {
                            module.eyebrow
                          }
                        </span>

                        <span className="module-icon">
                          <Icon
                            size={23}
                            strokeWidth={
                              1.8
                            }
                          />
                        </span>
                      </div>

                      <div>
                        <h2>
                          {module.title}
                        </h2>

                        <p>
                          {
                            module.description
                          }
                        </p>
                      </div>

                      <div className="module-card__footer">
                        <span>
                          {module.note}
                        </span>

                        <ArrowRight
                          size={18}
                        />
                      </div>

                      {active && (
                        <motion.span
                          className="active-stroke"
                          layoutId="active-module"
                          transition={{
                            type: "spring",
                            stiffness:
                              340,
                            damping:
                              28,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                },
              )}
            </div>

            <motion.div
              className="next-up"
              key={activeModule}
              initial={{
                opacity: 0,
                y: 7,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div>
                <span className="next-up__label">
                  SELECTED
                </span>

                <strong>
                  {
                    activeModuleData?.title
                  }
                </strong>
              </div>

              <p>
                {getModuleCopy()}
              </p>

              <motion.button
                className="next-up__action"
                onClick={
                  handleModuleAction
                }
                whileHover={{ y: -2 }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <span>
                  {getModuleAction()}
                </span>

                <ArrowRight
                  size={16}
                />
              </motion.button>
            </motion.div>
          </motion.section>
        ) : screen === "deck" ? (
          <motion.div
            key={`deck-${deckMode}-${remediationCardIds.join(
              "-",
            )}`}
            initial={{
              opacity: 0,
              x: 34,
              scale: 0.994,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -28,
              scale: 0.994,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SwipeDeck
              learnerFlavor={
                learnerFlavor
              }
              mode={deckMode}
              cards={
                deckMode ===
                "remediation"
                  ? remediationCards
                  : undefined
              }
              onBack={() =>
                setScreen("home")
              }
              onStartQuiz={() =>
                setScreen("quiz")
              }
              onComplete={
                finishRemediation
              }
            />
          </motion.div>
        ) : screen === "quiz" ? (
          <motion.div
            key="quiz"
            initial={{
              opacity: 0,
              x: 34,
              scale: 0.994,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -28,
              scale: 0.994,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <KnowledgeCheck
              onBack={() =>
                setScreen("home")
              }
              onComplete={
                finishQuiz
              }
            />
          </motion.div>
        ) : screen === "applied" ? (
          <motion.div
            key="applied"
            initial={{
              opacity: 0,
              x: 34,
              scale: 0.994,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -28,
              scale: 0.994,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AppliedTask
              onBack={() =>
                setScreen("home")
              }
              onComplete={() =>
                setScreen("home")
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="judging"
            initial={{
              opacity: 0,
              x: 34,
              scale: 0.994,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -28,
              scale: 0.994,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <JudgingTask
              onBack={() => setScreen("home")}
              onComplete={() => setScreen("home")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer">
        <span>FlowMoto</span>
        <span className="footer-line" />
        <span>
          Designed for a few thoughtful
          minutes a day.
        </span>
      </footer>

      <ReviewPanel
        open={reviewOpen}
        onClose={() =>
          setReviewOpen(false)
        }
      />
    </main>
  );
}

export default App;
