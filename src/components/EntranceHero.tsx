import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroLandscape from "../assets/flowmoto-hero-landscape.png";

type EntranceHeroProps = {
  onEnter: () => void;
};

export function EntranceHero({ onEnter }: EntranceHeroProps) {
  const [exiting, setExiting] = useState(false);
  const reducedMotion = useReducedMotion();

  const softEnter = (delay: number, duration = 0.65) =>
    reducedMotion
      ? { opacity: 1, y: 0 }
      : {
          opacity: 1,
          y: 0,
          transition: {
            delay,
            duration,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  const handleEnter = () => {
    if (exiting) return;

    if (reducedMotion) {
      onEnter();
      return;
    }

    setExiting(true);
    window.setTimeout(() => {
      onEnter();
    }, 520);
  };

  return (
    <section
      className={`entrance-hero ${exiting ? "is-exiting" : ""}`}
      aria-label="FlowMoto entrance"
    >

      <motion.p
        className="entrance-hero__eyebrow"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={exiting ? { opacity: 0 } : softEnter(0.12, 0.5)}
        transition={
          exiting
            ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            : undefined
        }
      >
        AI LITERACY <span>·</span> FOR REAL LIFE
      </motion.p>

      <div className="entrance-hero__lockup">
        <motion.h1
          className="entrance-hero__title"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={
            exiting
              ? { opacity: 0, y: -10 }
              : softEnter(0.16, 0.65)
          }
          transition={
            exiting
              ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              : undefined
          }
        >
          FlowMoto
        </motion.h1>

        <motion.div
          className="entrance-hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={
            exiting ? { opacity: 0, y: -6 } : softEnter(0.26, 0.55)
          }
          transition={
            exiting
              ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
              : undefined
          }
        >
          <p className="entrance-hero__pillars">Learn. Apply. Judge.</p>
          <p className="entrance-hero__lead">
            AI literacy, one thoughtful decision at a time.
          </p>
        </motion.div>

        <motion.div
          className="entrance-hero__cta-wrap"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={
            exiting ? { opacity: 0, y: -4 } : softEnter(0.34, 0.55)
          }
          transition={
            exiting
              ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              : undefined
          }
        >
          <motion.button
            type="button"
            className="entrance-hero__cta"
            onClick={handleEnter}
            disabled={exiting}
            whileHover={
              exiting || reducedMotion ? undefined : { y: -2 }
            }
            whileTap={
              exiting || reducedMotion
                ? undefined
                : { scale: 0.985 }
            }
          >
            <span>Enter FlowMoto</span>
            <ArrowRight size={20} strokeWidth={1.8} />
          </motion.button>

          <p className="entrance-hero__whisper">
            A gentle space to think clearly with AI.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="entrance-hero__landscape-wrap"
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={
          exiting
            ? { opacity: 0, y: 12 }
            : softEnter(0.2, 0.85)
        }
        transition={
          exiting
            ? { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
            : undefined
        }
      >
        <img
          className="entrance-hero__landscape"
          src={heroLandscape}
          alt=""
          draggable={false}
        />
      </motion.div>

      <motion.footer
        className="entrance-hero__meta"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={exiting ? { opacity: 0 } : softEnter(0.42, 0.5)}
        transition={
          exiting
            ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            : undefined
        }
      >
        <span aria-hidden="true">❧</span>
        <span>Built for curious minds</span>
        <span className="entrance-hero__meta-dot">·</span>
        <span>Demo v0.1</span>
      </motion.footer>
    </section>
  );
}
