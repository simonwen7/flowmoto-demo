import { useMemo, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { demoCards, type DemoCard } from "../data/demoCards";
import birdCurious from "../assets/flowmoto-bird-curious.png";
import birdSuccess from "../assets/flowmoto-bird-success.png";

type DetailMode = "what" | "unsure" | null;
type DeckMode = "daily" | "remediation";

type SwipeDeckProps = {
  learnerFlavor: string;
  onBack: () => void;
  cards?: DemoCard[];
  mode?: DeckMode;
  onStartQuiz?: () => void;
  onComplete?: () => void;
};

export function SwipeDeck({
  learnerFlavor,
  onBack,
  cards = demoCards,
  mode = "daily",
  onStartQuiz,
  onComplete,
}: SwipeDeckProps) {
  const [cardIndex, setCardIndex] = useState(0);
  const [detailMode, setDetailMode] = useState<DetailMode>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);

  const rotate = useTransform(x, [-280, 0, 280], [-11, 0, 11]);
  const cardOpacity = useTransform(
    x,
    [-900, -360, 0, 360, 900],
    [0.15, 0.94, 1, 0.94, 0.15],
  );

  const skipOpacity = useTransform(x, [-190, -70, 0], [1, 0.28, 0]);
  const knowOpacity = useTransform(x, [0, 70, 190], [0, 0.28, 1]);

  const currentCard = cards[cardIndex];
  const firstBackCard = cards[cardIndex + 1];
  const secondBackCard = cards[cardIndex + 2];

  const isFinished = !currentCard;

  const denominator = Math.max(cards.length, 1);

  const progress = isFinished
    ? 100
    : ((cardIndex + 1) / denominator) * 100;

  const learnerLabel = useMemo(() => {
    const value = learnerFlavor.trim();

    if (!value) return "your day-to-day";
    if (value.length <= 48) return value;

    return `${value.slice(0, 48).trim()}…`;
  }, [learnerFlavor]);

  const flingCard = (direction: -1 | 1) => {
    if (isAnimating || !currentCard) return;

    setIsAnimating(true);
    setDetailMode(null);

    const viewportWidth =
      typeof window === "undefined" ? 900 : window.innerWidth;

    const target = direction * Math.max(viewportWidth * 0.92, 760);

    const controls = animate(x, target, {
      duration: reducedMotion ? 0.01 : 0.9,
      ease: [0.22, 1, 0.36, 1],
    });

    void controls.then(() => {
      x.set(0);
      setCardIndex((value) => value + 1);
      setIsAnimating(false);
    });
  };

  const returnCardToCenter = () => {
    animate(x, 0, {
      type: "spring",
      stiffness: 500,
      damping: 34,
      mass: 0.8,
    });
  };

  const handleDragEnd = (offsetX: number, velocityX: number) => {
    const crossedDistance = Math.abs(offsetX) > 115;
    const crossedVelocity = Math.abs(velocityX) > 700;

    if (crossedDistance || crossedVelocity) {
      flingCard(offsetX >= 0 || velocityX >= 0 ? 1 : -1);
      return;
    }

    returnCardToCenter();
  };

  const replayDeck = () => {
    setDetailMode(null);
    setIsAnimating(false);
    x.set(0);
    setCardIndex(0);
  };

  return (
    <section className="screen deck-screen">
      <div className="deck-back-row">
        <button className="deck-back-link" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Modules
        </button>

        <span className="deck-demo-label">
          {mode === "daily"
            ? "INTERACTION PROTOTYPE"
            : "REMEDIATION LOOP"}
        </span>
      </div>

      <header className="deck-heading">
        <div>
          <p className="eyebrow">
            {mode === "daily"
              ? "FOUNDATIONS · DAILY DECK"
              : "FOUNDATIONS · BACK IN THE DECK"}
          </p>

          <h1>
            {mode === "daily" ? (
              <>
                One idea.
                <br />
                <em>Then move.</em>
              </>
            ) : (
              <>
                One more
                <br />
                <em>pass.</em>
              </>
            )}
          </h1>
        </div>

        <div className="deck-session">
          <span className="deck-session__spark">
            <Sparkles size={16} />
          </span>
          <div>
            <strong>
              {mode === "daily"
                ? "Today’s rhythm"
                : "Quick revisit"}
            </strong>
            <span>
              {mode === "daily"
                ? "Swipe · wonder · move on"
                : `${cards.length} missed ${
                    cards.length === 1 ? "idea" : "ideas"
                  } · original cards`}
            </span>
          </div>
        </div>
      </header>

      <div className="deck-progress">
        <div className="deck-progress__meta">
          <span>
            {isFinished
              ? mode === "daily"
                ? "DEMO LOOP COMPLETE"
                : "REVIEW COMPLETE"
              : `CARD ${String(cardIndex + 1).padStart(
                  2,
                  "0",
                )} / ${String(cards.length).padStart(2, "0")}`}
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
          <motion.span
            className="deck-progress__pencil"
            animate={{ left: `calc(${progress}% - 7px)` }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 24,
            }}
          >
            ✎
          </motion.span>
        </div>
      </div>

      {!isFinished ? (
        <>
          <div className="deck-workspace">
            <div className="swipe-stage">
              <div className="drag-whisper drag-whisper--left">
                <span>←</span>
                skip
              </div>

              <div className="drag-whisper drag-whisper--right">
                know
                <span>→</span>
              </div>

              <div className="card-stack">
                {secondBackCard && (
                  <div
                    className="stack-card stack-card--two"
                    aria-hidden="true"
                  >
                    <span>{secondBackCard.number}</span>
                    <strong>{secondBackCard.title}</strong>
                  </div>
                )}

                {firstBackCard && (
                  <div
                    className="stack-card stack-card--one"
                    aria-hidden="true"
                  >
                    <span>{firstBackCard.number}</span>
                    <strong>{firstBackCard.title}</strong>
                  </div>
                )}

                <motion.article
                  className="swipe-card"
                  style={{
                    x,
                    rotate,
                    opacity: cardOpacity,
                  }}
                  drag={detailMode ? false : "x"}
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.22}
                  dragMomentum={false}
                  onDragEnd={(_, info) =>
                    handleDragEnd(info.offset.x, info.velocity.x)
                  }
                  whileTap={
                    detailMode ? undefined : { cursor: "grabbing" }
                  }
                >
                  <motion.div
                    className="swipe-stamp swipe-stamp--skip"
                    style={{ opacity: skipOpacity }}
                  >
                    SKIP
                  </motion.div>

                  <motion.div
                    className="swipe-stamp swipe-stamp--know"
                    style={{ opacity: knowOpacity }}
                  >
                    I KNOW
                  </motion.div>

                  <div
                    className={`swipe-card__flip ${
                      detailMode ? "is-flipped" : ""
                    }`}
                  >
                    <div className="swipe-card__face swipe-card__front">
                      <div className="card-meta">
                        <div>
                          <p>{currentCard.kicker}</p>
                          <span>
                            {currentCard.tone === "work"
                              ? "WORK-TINTED DEMO"
                              : "GENERAL FOUNDATION"}
                          </span>
                        </div>

                        <span className="card-index">
                          {currentCard.number}
                        </span>
                      </div>

                      <div className="card-main">
                        <h2>{currentCard.title}</h2>
                        <p>{currentCard.question}</p>
                      </div>

                      {currentCard.tone === "work" && (
                        <div className="deck-role-note">
                          <span>YOUR CONTEXT</span>
                          <p>{learnerLabel}</p>
                        </div>
                      )}

                      <div className="card-bottom-line">
                        <span>drag or tap a button below</span>
                        <span aria-hidden="true">↝</span>
                      </div>
                    </div>

                    <div className="swipe-card__face swipe-card__back">
                      <button
                        className="card-detail-close"
                        onClick={() => setDetailMode(null)}
                        aria-label="Return to front of card"
                      >
                        <X size={17} />
                      </button>

                      <div className="detail-heading">
                        <p className="eyebrow">
                          {detailMode === "unsure"
                            ? "LET’S SLOW IT DOWN"
                            : "WHAT IT MEANS"}
                        </p>

                        <h2>
                          {detailMode === "unsure"
                            ? "Make it concrete."
                            : currentCard.title}
                        </h2>
                      </div>

                      <div className="detail-grid">
                        <div className="detail-block">
                          <span className="detail-number">01</span>
                          <div>
                            <strong>Plain-language idea</strong>
                            <p>{currentCard.explanation}</p>
                          </div>
                        </div>

                        <div className="detail-block detail-block--analogy">
                          <span className="detail-number">02</span>
                          <div>
                            <strong>Try this analogy</strong>
                            <p>{currentCard.analogy}</p>
                          </div>
                        </div>
                      </div>

                      <div className="detail-takeaway">
                        <span>KEEP THIS</span>
                        <p>{currentCard.takeaway}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            </div>

            <aside className="deck-side-note">
              <span className="deck-side-note__number">
                {currentCard.number}
              </span>

              <div>
                <p className="eyebrow">YOUR CALL</p>
                <h3>How deep do you want to go?</h3>
                <p>
                  Keep moving when it feels familiar. Open the
                  card when you want another layer.
                </p>
              </div>

              <div className="deck-side-note__scribble">
                <span />
                you choose the depth
              </div>

              <motion.img
                className="deck-side-mascot"
                src={birdCurious}
                alt=""
                draggable={false}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 6 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </aside>
          </div>

          <div className="deck-actions">
            <motion.button
              className="deck-action deck-action--skip"
              aria-label="Skip this card"
              onClick={() => flingCard(-1)}
              disabled={isAnimating}
              whileHover={{ y: -3, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={19} strokeWidth={2.2} />
              <span>Skip</span>
            </motion.button>

            <motion.button
              className={`deck-action deck-action--what ${
                detailMode === "what"
                  ? "deck-action--active"
                  : ""
              }`}
              onClick={() =>
                setDetailMode(
                  detailMode === "what" ? null : "what",
                )
              }
              disabled={isAnimating}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              WHAT?
            </motion.button>

            <motion.button
              className={`deck-action deck-action--unsure ${
                detailMode === "unsure"
                  ? "deck-action--active"
                  : ""
              }`}
              onClick={() =>
                setDetailMode(
                  detailMode === "unsure" ? null : "unsure",
                )
              }
              disabled={isAnimating}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              UNSURE
            </motion.button>

            <motion.button
              className="deck-action deck-action--know"
              onClick={() => flingCard(1)}
              disabled={isAnimating}
              whileHover={{ y: -3, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>I KNOW</span>
              <Check size={18} strokeWidth={2.3} />
            </motion.button>
          </div>

          <p className="deck-keyboard-hint">
            ← drag left to skip
            <span>·</span>
            drag right when you know it →
          </p>
        </>
      ) : mode === "daily" ? (
        <motion.section
          className="deck-finish"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="deck-finish__stack" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="deck-finish__content">
            <div className="status-chip">
              <Sparkles size={15} />
              Next in the learning loop
            </div>

            <p className="eyebrow">KNOWLEDGE CHECK</p>

            <h2>
              Nice. Now we check
              <br />
              <em>what stuck.</em>
            </h2>

            <p className="deck-finish__lead">
              This demo moves into a knowledge check after five seed
              cards. The production trigger count is still an open
              product decision.
            </p>

            <div className="tbd-ticket">
              <div>
                <span>DEMO ASSUMPTION</span>
                <strong>5 cards → Knowledge Check</strong>
              </div>

              <span className="tbd-ticket__status">
                NEEDS DECISION
              </span>
            </div>

            <div className="deck-finish__actions">
              <button
                className="finish-primary"
                onClick={onStartQuiz}
              >
                Start knowledge check
                <ArrowRight size={17} />
              </button>

              <button
                className="finish-secondary"
                onClick={onBack}
              >
                Back to modules
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section
          className="deck-finish"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="deck-finish__stack" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="deck-finish__content">
            <img
              className="fm-success-bird"
              src={birdSuccess}
              alt=""
              draggable={false}
            />

            <div className="status-chip">
              <Check size={15} />
              Remediation complete
            </div>

            <p className="eyebrow">LOOP CLOSED</p>

            <h2>
              Back through.
              <br />
              <em>Now move on.</em>
            </h2>

            <p className="deck-finish__lead">
              The original flashcards connected to missed questions
              have now been placed back into the learning flow and
              reviewed again.
            </p>

            <div className="deck-finish__actions">
              <button
                className="finish-primary"
                onClick={onComplete}
              >
                Return to modules
                <ArrowRight size={17} />
              </button>

              <button
                className="finish-secondary"
                onClick={replayDeck}
              >
                <RotateCcw size={17} />
                Replay these cards
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </section>
  );
}
