export type DemoCardTone = "general" | "work";

export type DemoCard = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  question: string;
  explanation: string;
  analogy: string;
  takeaway: string;
  tone: DemoCardTone;
};

export const demoCards: DemoCard[] = [
  {
    id: "uneven-knowledge",
    number: "01",
    kicker: "MENTAL MODEL",
    title: "AI doesn’t know everything equally.",
    question:
      "Why can the same model sound brilliant on one task and shaky on another?",
    explanation:
      "A language model is not pulling facts from one perfectly organized internal encyclopedia. Its responses are shaped by patterns learned across uneven training data, the prompt you give it, and the task you ask it to perform.",
    analogy:
      "Think of a very well-read improviser. They may be excellent at explaining a familiar theme, but much less reliable when the scene depends on a tiny fact they only half remember.",
    takeaway:
      "Fluency tells you how smoothly an answer is expressed — not how well supported it is.",
    tone: "general",
  },
  {
    id: "confidence-vs-evidence",
    number: "02",
    kicker: "JUDGMENT",
    title: "Confidence is not evidence.",
    question:
      "If an AI answer sounds certain, what have you actually learned about whether it is correct?",
    explanation:
      "AI systems can produce confident language even when the underlying answer is incomplete, outdated, or fabricated. Tone and factual reliability are separate signals.",
    analogy:
      "Picture two people giving directions. One hesitates but checked the map. The other speaks instantly and confidently from memory. Confidence alone does not tell you who has the better route.",
    takeaway:
      "Treat confident wording as presentation, then look separately for evidence.",
    tone: "general",
  },
  {
    id: "context-matters",
    number: "03",
    kicker: "PROMPTING",
    title: "Context changes what AI can do for you.",
    question:
      "What changes when you give AI the situation, constraints, and goal instead of only a short command?",
    explanation:
      "Useful context narrows the space of possible answers. Clear goals, constraints, audience, and relevant background help the model produce something that better fits the actual task.",
    analogy:
      "Asking a chef to “make dinner” leaves almost everything open. Saying who is eating, what is in the fridge, and the time limit turns the same chef into a much more useful collaborator.",
    takeaway:
      "Good context does not guarantee truth, but it can dramatically improve relevance.",
    tone: "work",
  },
  {
    id: "augment-vs-automate",
    number: "04",
    kicker: "WORKFLOW",
    title: "Automation and augmentation are different choices.",
    question:
      "Should AI replace the step, or help a person perform the step better?",
    explanation:
      "Automation hands a task over to a system. Augmentation keeps a person in the loop and uses AI to make part of the work faster, broader, or easier to evaluate.",
    analogy:
      "A self-driving shuttle and a navigation app both use automation technology, but they give the human very different roles.",
    takeaway:
      "Before asking what AI can do, decide what role you still want the human to own.",
    tone: "work",
  },
  {
    id: "verification-loop",
    number: "05",
    kicker: "PRACTICE",
    title: "Verification is part of the skill.",
    question:
      "When does checking an AI answer stop being extra work and become part of using the tool well?",
    explanation:
      "For decisions that matter, verification belongs inside the workflow. The more consequential or unfamiliar the claim, the stronger the reason to inspect sources, compare evidence, or test the result.",
    analogy:
      "A calculator saves time, but you still notice when a restaurant bill says dinner cost $4,800. Tools become useful when speed and judgment work together.",
    takeaway:
      "The goal is not to distrust everything. It is to know when checking is worth the effort.",
    tone: "general",
  },
];
