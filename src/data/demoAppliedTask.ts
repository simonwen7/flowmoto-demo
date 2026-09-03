export type EvidenceVerdict = "keep" | "question";

export type AppliedClaim = {
  id: string;
  claim: string;
  source: string;
  evidence: string;
  correctVerdict: EvidenceVerdict;
  feedback: string;
};

export type AppliedVehicle = {
  id: "harbor" | "northline";
  name: string;
  type: string;
  price: string;
  facts: string[];
  recommended: boolean;
  feedback: string;
};

export const demoAppliedTask = {
  scenario: {
    eyebrow: "DECISION PRACTICE",
    title: "Help Maya choose the car that fits her actual week.",
    description:
      "Maya asked an AI assistant to compare two cars. The answer sounds polished — but your job is to decide which parts are useful enough to carry into the final decision.",
    constraints: [
      {
        label: "Budget",
        value: "CAD 36,000 max",
      },
      {
        label: "Commute",
        value: "70 km each weekday",
      },
      {
        label: "Charging",
        value: "No reliable home charging",
      },
      {
        label: "Winter",
        value: "Below −15°C is common",
      },
      {
        label: "Priority",
        value: "Predictable refueling",
      },
    ],
  },

  vehicles: [
    {
      id: "harbor",
      name: "Harbor E2",
      type: "Battery EV",
      price: "CAD 34,900",
      facts: [
        "410 km rated range",
        "10–80% fast charge: 31 min",
        "Closest demo fast charger: 12 km away",
        "Cold conditions may reduce available range",
      ],
      recommended: false,
      feedback:
        "The Harbor E2 fits the budget and commute, but this scenario gives unusually high weight to predictable refueling and Maya has no reliable home charging. That makes the charging constraint important enough that the EV is not the strongest fit from the evidence currently available.",
    },
    {
      id: "northline",
      name: "Northline H5",
      type: "Hybrid",
      price: "CAD 35,400",
      facts: [
        "850 km estimated tank range",
        "4.8 L / 100 km demo estimate",
        "No plug required",
        "Uses conventional fuel stations",
      ],
      recommended: true,
      feedback:
        "This is the stronger fit for the constraints provided. It stays within budget and directly addresses Maya’s two highest-friction constraints: no reliable home charging and a preference for predictable refueling.",
    },
  ] satisfies AppliedVehicle[],

  aiSummary:
    "The Harbor E2 is obviously the better choice. It is cheaper, its 410 km range is guaranteed even in severe winter, and lower energy costs automatically make it the smarter long-term decision.",

  claims: [
    {
      id: "budget",
      claim: "Both cars fit Maya’s CAD 36,000 purchase budget.",
      source: "SIMULATED PRICE SHEETS",
      evidence:
        "Harbor E2: CAD 34,900. Northline H5: CAD 35,400.",
      correctVerdict: "keep",
      feedback:
        "This claim is directly supported by the provided prices. Both vehicles are below the stated CAD 36,000 ceiling.",
    },
    {
      id: "winter-range",
      claim:
        "The Harbor E2 is guaranteed to deliver its full 410 km rated range at −15°C.",
      source: "SIMULATED OWNER INFORMATION",
      evidence:
        "The supplied vehicle note says cold conditions may reduce available range. Nothing in the demo evidence guarantees 410 km at −15°C.",
      correctVerdict: "question",
      feedback:
        "This should be questioned. The AI turned a rated-range figure into a guarantee that the supplied evidence never makes.",
    },
    {
      id: "charging",
      claim:
        "The Northline H5 can be used without reliable home charging.",
      source: "SIMULATED VEHICLE SPEC",
      evidence:
        "The Northline H5 is represented as a non-plug-in hybrid that refuels at conventional fuel stations.",
      correctVerdict: "keep",
      feedback:
        "This is supported by the scenario data and directly relates to Maya’s charging constraint.",
    },
    {
      id: "automatic-winner",
      claim:
        "Lower energy cost automatically makes the Harbor E2 the better decision.",
      source: "AI CONCLUSION",
      evidence:
        "The task includes several decision constraints: charging access, winter conditions, budget, commute, and predictable refueling. No evidence says one cost factor automatically overrides all of them.",
      correctVerdict: "question",
      feedback:
        "This should be questioned. It is an unsupported leap from one possible advantage to a complete decision.",
    },
  ] satisfies AppliedClaim[],
};
