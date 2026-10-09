const CHALLENGE_DESCRIPTIONS = {
    
  "distance limit challenge": {
    objective: (target, unit, period) =>
      `Keep your total travel distance within ${target} ${unit} during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Check the challenge target and duration.",
      "Record your travel distance in your activities.",
      `Keep your tracked distance within the ${target} ${unit} limit.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded travel distance for the selected ${period} challenge period must not exceed ${target} ${unit}.`,
  },

  "ev travel challenge": {
    objective: (target, unit, period) =>
      `Travel at least ${target} ${unit} using an electric vehicle during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Use an electric vehicle for your eligible journeys.",
      "Record your EV travel in your activities.",
      `Work towards the target of ${target} ${unit}.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded eligible EV travel during the selected ${period} challenge period must reach at least ${target} ${unit}.`,
  },

  "cng commute challenge": {
    objective: (target, unit, period) =>
      `Complete at least ${target} ${unit} using CNG-powered transport during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Use eligible CNG-powered transport for your commutes.",
      "Record your eligible CNG commutes in your activities.",
      `Work towards completing ${target} ${unit}.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded eligible CNG commutes during the selected ${period} challenge period must reach at least ${target} ${unit}.`,
  },

  "power saving month": {
    objective: (target, unit, period) =>
      `Keep your electricity consumption within ${target} ${unit} during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Monitor your electricity consumption.",
      "Use electricity efficiently and avoid unnecessary usage.",
      `Keep your recorded consumption within ${target} ${unit}.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded electricity consumption for the selected ${period} challenge period must not exceed ${target} ${unit}.`,
  },

  "waste reduction week": {
    objective: (target, unit, period) =>
      `Reduce or divert at least ${target} ${unit} of eligible waste during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Separate recyclable and reusable materials from general waste.",
      "Record eligible waste reduction or diversion in your activities.",
      `Work towards the target of ${target} ${unit}.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded eligible waste reduction or diversion during the selected ${period} challenge period must reach at least ${target} ${unit}.`,
  },

  "zero waste day": {
    objective: (target, unit, period) =>
      `Keep your recorded waste within ${target} ${unit} during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Avoid single-use items where practical.",
      "Reuse items and separate recyclable waste.",
      `Keep your recorded waste within the ${target} ${unit} limit.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded waste during the selected ${period} challenge period must not exceed ${target} ${unit}.`,
  },

  "recycle and save": {
    objective: (target, unit, period) =>
      `Recycle at least ${target} ${unit} of eligible material during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Separate recyclable materials from general waste.",
      "Record the eligible materials you recycle.",
      `Work towards recycling ${target} ${unit}.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded eligible recycled material during the selected ${period} challenge period must reach at least ${target} ${unit}.`,
  },

  "carbon control challenge": {
    objective: (target, unit, period) =>
      `Keep your recorded carbon emissions within ${target} ${unit} during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Track the activities included in this challenge.",
      "Choose lower-emission options where practical.",
      `Keep your recorded emissions within the ${target} ${unit} limit.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded carbon emissions for the selected ${period} challenge period must not exceed ${target} ${unit}.`,
  },

  "carbon saving challenge": {
    objective: (target, unit, period) =>
      `Save at least ${target} ${unit} of carbon emissions during the selected ${period} challenge period.`,
    instructions: (target, unit) => [
      "Choose lower-emission options for eligible activities.",
      "Record the eligible carbon savings supported by your tracking data.",
      `Work towards the target of ${target} ${unit} saved.`,
    ],
    completionCriteria: (target, unit, period) =>
      `Your recorded eligible carbon savings during the selected ${period} challenge period must reach at least ${target} ${unit}.`,
  },
};

const formatPeriod = (period) => {
  const value = String(period || "").trim().toLowerCase();

  const labels = {
    daily: "1-day",
    weekly: "7-day",
    monthly: "30-day",
  };

  return labels[value] || value || "selected";
};

export const generateChallengeDescription = (challenge) => {
  const type = String(challenge?.challengeType || "")
    .trim()
    .toLowerCase();

  const template = CHALLENGE_DESCRIPTIONS[type];

  if (!template) {
    return null;
  }

  const target = challenge?.target;
  const unit = String(challenge?.unit || "").trim();
  const period = formatPeriod(challenge?.period);

  if (
    target === null ||
    target === undefined ||
    target === "" ||
    !Number.isFinite(Number(target)) ||
    !unit
  ) {
    return null;
  }

  const formattedTarget = Number(target).toLocaleString("en-US");
  const readableUnit =
    unit.toLowerCase() === "kgco2"
      ? "kg CO₂e"
      : unit;

  return {
    objective: template.objective(
      formattedTarget,
      readableUnit,
      period,
    ),
    instructions: template.instructions(
      formattedTarget,
      readableUnit,
    ),
    completionCriteria: template.completionCriteria(
      formattedTarget,
      readableUnit,
      period,
    ),
  };
};