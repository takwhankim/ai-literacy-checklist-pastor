import { COPY } from "@/lib/copy";
import { QUESTIONS, type Domain } from "@/lib/questions";

export type AnswerInput = {
  questionId: string;
  value: number;
};

export type Flags = {
  ethics_low: boolean;
  critical_low: boolean;
};

export type DomainScores = Record<Domain, number>;

export type ScoreResult = {
  totalScore: number;
  level: 1 | 2 | 3 | 4;
  domainScores: DomainScores;
  flags: Flags;
  recommendations: string[];
};

function calcLevel(total: number): 1 | 2 | 3 | 4 {
  if (total <= 44) return 1;
  if (total <= 64) return 2;
  if (total <= 84) return 3;
  return 4;
}

export function scoreAssessment(answers: AnswerInput[]): ScoreResult {
  const byId = new Map(answers.map((a) => [a.questionId, a.value]));
  const domainScores: DomainScores = { A: 0, B: 0, C: 0, D: 0 };

  for (const q of QUESTIONS) {
    const value = byId.get(q.id) ?? 0;
    domainScores[q.domain] += value;
  }

  const totalScore = domainScores.A + domainScores.B + domainScores.C + domainScores.D;
  const level = calcLevel(totalScore);

  const flags: Flags = {
    ethics_low: domainScores.D < 15,
    critical_low: domainScores.C < 15
  };

  const recommendations: string[] = [...COPY.result.recommendations[level]];
  if (flags.ethics_low) {
    recommendations.push(COPY.result.extraRecommendations.ethicsLow);
  }
  if (flags.critical_low) {
    recommendations.push(COPY.result.extraRecommendations.criticalLow);
  }

  return { totalScore, level, domainScores, flags, recommendations };
}

export function levelMeta(level: 1 | 2 | 3 | 4) {
  return COPY.result.level[level];
}
