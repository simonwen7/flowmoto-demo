export type DemoQuizOption = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

export type DemoQuestion = {
  id: string;
  sourceCardId: string;
  eyebrow: string;
  prompt: string;
  options: DemoQuizOption[];
  correctSummary: string;
};

export const demoQuestions: DemoQuestion[] = [
  {
    id: "q-uneven-knowledge",
    sourceCardId: "uneven-knowledge",
    eyebrow: "MENTAL MODEL",
    prompt:
      "An AI gives a polished explanation of a familiar concept, then confidently invents a niche statistic. What is the best interpretation?",
    options: [
      {
        id: "a",
        label: "The model is probably hiding the real statistic.",
        correct: false,
        feedback:
          "Not quite. There may be no hidden correct fact inside the response. A model can produce plausible language without possessing a reliable answer to that specific claim.",
      },
      {
        id: "b",
        label: "Fluent answers can still reflect uneven knowledge.",
        correct: true,
        feedback:
          "Exactly. Fluency and reliability are separate signals. Performance can vary substantially across topics and tasks.",
      },
      {
        id: "c",
        label: "If the explanation was good, the statistic is probably good too.",
        correct: false,
        feedback:
          "This is the trap. Strong performance on one part of a response does not automatically validate another part.",
      },
      {
        id: "d",
        label: "AI should never be used for factual questions.",
        correct: false,
        feedback:
          "Too broad. AI can still be useful for factual work when the workflow includes appropriate verification.",
      },
    ],
    correctSummary:
      "A convincing answer can contain both strong reasoning and weak claims. Evaluate the claim, not the confidence of the prose around it.",
  },
  {
    id: "q-confidence",
    sourceCardId: "confidence-vs-evidence",
    eyebrow: "JUDGMENT",
    prompt:
      "A model answers your question immediately and sounds extremely certain. What does that confidence tell you?",
    options: [
      {
        id: "a",
        label: "That the answer was verified internally.",
        correct: false,
        feedback:
          "No. Confident wording does not mean the system performed an independent verification step.",
      },
      {
        id: "b",
        label: "That the answer is more likely to be current.",
        correct: false,
        feedback:
          "Not necessarily. Tone does not tell you whether the underlying information is current.",
      },
      {
        id: "c",
        label: "Mostly how the answer is presented, not whether it is true.",
        correct: true,
        feedback:
          "Right. Confidence is a presentation signal. Evidence and correctness need to be evaluated separately.",
      },
      {
        id: "d",
        label: "That a human would probably give the same answer.",
        correct: false,
        feedback:
          "That conclusion does not follow from tone either. The answer still needs to stand on its own evidence.",
      },
    ],
    correctSummary:
      "Separate presentation quality from evidential quality. A confident answer can still require checking.",
  },
  {
    id: "q-context",
    sourceCardId: "context-matters",
    eyebrow: "PROMPTING",
    prompt:
      "Which request is most likely to produce a useful response for a real task?",
    options: [
      {
        id: "a",
        label: "“Write something about this.”",
        correct: false,
        feedback:
          "The model has almost no information about the goal, audience, constraints, or desired output.",
      },
      {
        id: "b",
        label: "“Give me the best answer possible.”",
        correct: false,
        feedback:
          "The request asks for quality but still does not define what success looks like.",
      },
      {
        id: "c",
        label:
          "“Draft a 120-word update for my project team. Explain the delay, keep the tone calm, and end with the new Friday deadline.”",
        correct: true,
        feedback:
          "Exactly. The goal, audience, format, tone, and constraint give the model a much clearer target.",
      },
      {
        id: "d",
        label: "The shortest prompt, because AI fills in missing context.",
        correct: false,
        feedback:
          "AI can fill gaps, but those guesses may not match your actual situation. Relevant context reduces that ambiguity.",
      },
    ],
    correctSummary:
      "Useful context narrows the range of plausible outputs and helps the model aim at the real task.",
  },
];
