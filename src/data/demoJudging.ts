export type JudgmentVerdict = "use" | "verify" | "reject";

export type JudgmentScenario = {
  id: string;
  number: string;
  context: string;
  prompt: string;
  aiAnswer: string;
  evidenceNote: string;
  correctVerdict: JudgmentVerdict;
  feedback: Record<JudgmentVerdict, string>;
  principle: string;
};

export const judgmentScenarios: JudgmentScenario[] = [
  {
    id: "rewrite",
    number: "01",
    context: "LOW-STAKES WRITING",
    prompt:
      "You ask AI to rewrite a friendly reminder so it sounds shorter and warmer.",
    aiAnswer:
      "“Quick reminder — whenever you have a moment, could you send the updated file? Thanks!”",
    evidenceNote:
      "The task is subjective, reversible, and the output can be inspected directly before use.",
    correctVerdict: "use",
    feedback: {
      use:
        "Good call. The output is low-stakes, easy to inspect, and does not depend on hidden factual claims.",
      verify:
        "Extra checking would be harmless, but the task does not contain a meaningful factual dependency. You can judge the wording directly.",
      reject:
        "Rejecting it throws away a useful low-risk assist. The output is visible and easy for you to evaluate yourself.",
    },
    principle:
      "When the task is low-stakes and directly inspectable, human review may be enough.",
  },
  {
    id: "policy",
    number: "02",
    context: "WORKPLACE POLICY",
    prompt:
      "You ask AI whether your company reimburses a specific travel expense.",
    aiAnswer:
      "“Yes. Your company reimburses this expense up to CAD 800 per trip.”",
    evidenceNote:
      "The response provides no policy link, document date, or company-specific source.",
    correctVerdict: "verify",
    feedback: {
      use:
        "This is risky to act on immediately. The answer makes a company-specific factual claim without showing where it came from.",
      verify:
        "Exactly. The answer may be useful as a lead, but the reimbursement policy should be checked against the current company source.",
      reject:
        "You do not yet know that the claim is false. The better move is to verify it against the authoritative policy.",
    },
    principle:
      "Specific factual claims that affect real decisions deserve an authoritative source.",
  },
  {
    id: "citation",
    number: "03",
    context: "RESEARCH SUPPORT",
    prompt:
      "AI recommends a paper and gives you a citation for a claim you want to include.",
    aiAnswer:
      "“Martinez, R. (2024). Adaptive cognition in AI-assisted teams. Journal of Human Systems, 18(4), 211–229.”",
    evidenceNote:
      "When you search the supplied title, author, and journal combination, you cannot locate the paper.",
    correctVerdict: "reject",
    feedback: {
      use:
        "Do not carry an unverified citation into your work. The provided reference cannot currently be substantiated.",
      verify:
        "Verification was the right instinct, but the scenario already tells you the search failed. At this point the supplied citation should not survive into the work.",
      reject:
        "Right. Once the supplied citation cannot be substantiated, remove it rather than treating plausible formatting as evidence that the source exists.",
    },
    principle:
      "A citation that looks academic is not evidence until the source itself can be found.",
  },
  {
    id: "estimate",
    number: "04",
    context: "ROUGH ESTIMATION",
    prompt:
      "You ask AI for a quick estimate of how many takeaway coffees a downtown office district might sell on a weekday.",
    aiAnswer:
      "“A reasonable rough estimate is about 18,000 cups, assuming roughly 30,000 workers and 0.6 takeaway coffees per worker.”",
    evidenceNote:
      "The assumptions are visible, the arithmetic can be checked, and the result is explicitly framed as an estimate rather than a measured fact.",
    correctVerdict: "use",
    feedback: {
      use:
        "Good. For a rough estimate, the assumptions are exposed and the arithmetic is inspectable. You can use it as a starting model while keeping the assumptions visible.",
      verify:
        "You could seek better inputs if the estimate becomes consequential, but the current answer is already transparent enough for a rough exploratory calculation.",
      reject:
        "The answer does not pretend to be measured truth. Because its assumptions are visible, rejecting it outright loses a useful reasoning scaffold.",
    },
    principle:
      "Transparent assumptions make approximate reasoning easier to evaluate than unsupported certainty.",
  },
];
