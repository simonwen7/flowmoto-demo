import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers3,
  Sparkles,
  X,
} from "lucide-react";
import {
  demoQuestions,
} from "../data/demoQuestions";
import birdSuccess from "../assets/flowmoto-bird-success.png";

type KnowledgeCheckProps = {
  onBack: () => void;
  onComplete: (missedCardIds: string[]) => void;
};

export function KnowledgeCheck({
  onBack,
  onComplete,
}: KnowledgeCheckProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    null,
  );
  const [missedCardIds, setMissedCardIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const question = demoQuestions[questionIndex];

  const selectedOption =
    question?.options.find((option) => option.id === selectedOptionId) ??
    null;

  const progress = finished
    ? 100
    : ((questionIndex + 1) / demoQuestions.length) * 100;

  const chooseOption = (optionId: string) => {
    if (selectedOptionId) return;

    const option = question.options.find(
      (candidate) => candidate.id === optionId,
    );

    if (!option) return;

    setSelectedOptionId(option.id);

    if (!option.correct) {
      setMissedCardIds((current) =>
        current.includes(question.sourceCardId)
          ? current
          : [...current, question.sourceCardId],
      );
    }
  };

  const continueQuiz = () => {
    if (!selectedOptionId) return;

    if (questionIndex === demoQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((value) => value + 1);
    setSelectedOptionId(null);
  };

  return (
    <section className="screen quiz-screen">
      <div className="quiz-top-row">
        <button className="deck-back-link" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Modules
        </button>

        <span className="deck-demo-label">
          PREPARED DEMO QUESTIONS
        </span>
      </div>

      {!finished ? (
        <>
          <header className="quiz-heading">
            <div>
              <p className="eyebrow">KNOWLEDGE CHECK</p>
              <h1>
                What
                <br />
                <em>stuck?</em>
              </h1>
            </div>

            <div className="quiz-heading__note">
              <span className="quiz-heading__icon">
                <Sparkles size={16} />
              </span>
              <div>
                <strong>Instant feedback</strong>
                <span>No waiting for a final grade.</span>
              </div>
            </div>
          </header>

          <div className="quiz-progress">
            <div className="deck-progress__meta">
              <span>
                QUESTION {String(questionIndex + 1).padStart(2, "0")} /{" "}
                {String(demoQuestions.length).padStart(2, "0")}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

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
              className="quiz-workspace"
              key={question.id}
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{
                duration: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <article className="quiz-card">
                <div className="quiz-card__meta">
                  <div>
                    <p>{question.eyebrow}</p>
                    <span>
                      SOURCE CARD ·{" "}
                      {String(questionIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="quiz-card__number">
                    Q{questionIndex + 1}
                  </span>
                </div>

                <h2>{question.prompt}</h2>

                <div className="quiz-options">
                  {question.options.map((option) => {
                    const selected = selectedOptionId === option.id;
                    const revealed = Boolean(selectedOptionId);

                    const stateClass = !revealed
                      ? ""
                      : option.correct
                        ? "quiz-option--correct"
                        : selected
                          ? "quiz-option--wrong"
                          : "quiz-option--muted";

                    return (
                      <motion.button
                        key={option.id}
                        className={`quiz-option ${stateClass}`}
                        onClick={() => chooseOption(option.id)}
                        disabled={revealed}
                        whileHover={
                          !revealed ? { y: -2 } : undefined
                        }
                        whileTap={
                          !revealed ? { scale: 0.99 } : undefined
                        }
                      >
                        <span className="quiz-option__letter">
                          {option.id.toUpperCase()}
                        </span>

                        <span className="quiz-option__label">
                          {option.label}
                        </span>

                        {revealed && option.correct && (
                          <span className="quiz-option__mark">
                            <Check size={16} strokeWidth={2.4} />
                          </span>
                        )}

                        {selected && !option.correct && (
                          <span className="quiz-option__mark">
                            <X size={16} strokeWidth={2.4} />
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </article>

              <aside className="quiz-feedback-column">
                <AnimatePresence mode="wait">
                  {!selectedOption ? (
                    <motion.div
                      key="waiting"
                      className="quiz-waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="quiz-waiting__number">
                        {String(questionIndex + 1).padStart(2, "0")}
                      </span>
                      <p className="eyebrow">YOUR CALL</p>
                      <h3>Choose one.</h3>
                      <p>
                        Feedback appears immediately after your answer.
                      </p>
                      <span className="quiz-pencil-line" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`feedback-${selectedOption.id}`}
                      className={`quiz-feedback ${
                        selectedOption.correct
                          ? "quiz-feedback--correct"
                          : "quiz-feedback--wrong"
                      }`}
                      initial={{
                        opacity: 0,
                        y: 14,
                        scale: 0.985,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="quiz-feedback__status">
                        <span>
                          {selectedOption.correct ? (
                            <Check size={18} strokeWidth={2.4} />
                          ) : (
                            <X size={18} strokeWidth={2.4} />
                          )}
                        </span>

                        <strong>
                          {selectedOption.correct
                            ? "That’s it."
                            : "Not quite."}
                        </strong>
                      </div>

                      <p>{selectedOption.feedback}</p>

                      <div className="quiz-feedback__takeaway">
                        <span>WHY IT MATTERS</span>
                        <p>{question.correctSummary}</p>
                      </div>

                      <motion.button
                        className="quiz-next"
                        onClick={continueQuiz}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        <span>
                          {questionIndex === demoQuestions.length - 1
                            ? "See what stuck"
                            : "Next question"}
                        </span>
                        <ArrowRight size={17} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </aside>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.section
          className="quiz-finish"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="quiz-finish__cards" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="quiz-finish__content">
            <img
              className="fm-success-bird"
              src={birdSuccess}
              alt=""
              draggable={false}
            />

            <div className="status-chip">
              <Sparkles size={15} />
              Check complete
            </div>

            <p className="eyebrow">REMEMBER → REVISIT</p>

            <h2>
              {missedCardIds.length === 0 ? (
                <>
                  All three
                  <br />
                  <em>landed.</em>
                </>
              ) : (
                <>
                  {missedCardIds.length}{" "}
                  {missedCardIds.length === 1 ? "idea gets" : "ideas get"}
                  <br />
                  <em>another pass.</em>
                </>
              )}
            </h2>

            <p className="quiz-finish__lead">
              {missedCardIds.length === 0
                ? "You answered every demo question correctly. There are no cards to reinsert this time."
                : "Instead of ending with a score, FlowMoto brings the original flashcards behind missed questions back into your deck."}
            </p>

            {missedCardIds.length > 0 && (
              <div className="reinsert-demo">
                <div className="reinsert-demo__icon">
                  <Layers3 size={21} strokeWidth={1.8} />
                </div>

                <div>
                  <span>REMEDIATION LOOP</span>
                  <strong>
                    {missedCardIds.length} original{" "}
                    {missedCardIds.length === 1 ? "card" : "cards"} returning
                  </strong>
                </div>

                <motion.span
                  className="reinsert-demo__arrow"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ↪
                </motion.span>
              </div>
            )}

            <button
              className="quiz-finish__primary"
              onClick={() => onComplete(missedCardIds)}
            >
              <span>
                {missedCardIds.length === 0
                  ? "Back to modules"
                  : "Put them back in my deck"}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.section>
      )}
    </section>
  );
}
