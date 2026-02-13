import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifyAdminSessionValue } from "@/lib/auth";

type DomainScores = { A?: number; B?: number; C?: number; D?: number };
type Flags = { ethics_low?: boolean; critical_low?: boolean };

export async function GET() {
  const cookie = cookies().get(ADMIN_COOKIE)?.value;

  if (!verifyAdminSessionValue(cookie)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await db.assessment.findMany({
    where: { submittedAt: { not: null } },
    select: {
      level: true,
      role: true,
      totalScore: true,
      domainScores: true,
      flags: true,
      submittedAt: true
    }
  });

  const totalAssessments = rows.length;
  const levelCounts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0 };
  const domainSums: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const weakestDomainFrequency: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const domainLowCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const roleCounts: Record<string, number> = {};
  const roleScoreSums: Record<string, number> = {};
  const scoreBands: Record<string, number> = {
    "20-44": 0,
    "45-64": 0,
    "65-84": 0,
    "85-100": 0
  };

  let totalScoreSum = 0;
  let ethicsLowCount = 0;
  let criticalLowCount = 0;

  for (const row of rows) {
    if (row.level) {
      levelCounts[String(row.level)] = (levelCounts[String(row.level)] || 0) + 1;
    }

    const totalScore = row.totalScore || 0;
    totalScoreSum += totalScore;

    if (totalScore <= 44) scoreBands["20-44"] += 1;
    else if (totalScore <= 64) scoreBands["45-64"] += 1;
    else if (totalScore <= 84) scoreBands["65-84"] += 1;
    else scoreBands["85-100"] += 1;

    const role = row.role?.trim() || "미지정";
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    roleScoreSums[role] = (roleScoreSums[role] || 0) + totalScore;

    const ds = (row.domainScores || {}) as DomainScores;
    const domainValues: Record<string, number> = {
      A: ds.A || 0,
      B: ds.B || 0,
      C: ds.C || 0,
      D: ds.D || 0
    };

    domainSums.A += domainValues.A;
    domainSums.B += domainValues.B;
    domainSums.C += domainValues.C;
    domainSums.D += domainValues.D;

    for (const key of ["A", "B", "C", "D"] as const) {
      if (domainValues[key] < 15) {
        domainLowCounts[key] += 1;
      }
    }

    const weakest = (Object.entries(domainValues).sort((a, b) => a[1] - b[1])[0]?.[0] || "A") as "A" | "B" | "C" | "D";
    weakestDomainFrequency[weakest] += 1;

    const flags = (row.flags || {}) as Flags;
    if (flags.ethics_low) ethicsLowCount += 1;
    if (flags.critical_low) criticalLowCount += 1;
  }

  const divisor = totalAssessments || 1;
  const domainAverages = {
    A: domainSums.A / divisor,
    B: domainSums.B / divisor,
    C: domainSums.C / divisor,
    D: domainSums.D / divisor
  };

  const weakestDomain = totalAssessments
    ? (["A", "B", "C", "D"] as const).reduce(
        (acc, key) => (domainAverages[key] < domainAverages[acc] ? key : acc),
        "A"
      )
    : "N/A";

  const roleAverages = Object.fromEntries(
    Object.entries(roleCounts).map(([role, count]) => [role, Number((roleScoreSums[role] / count).toFixed(2))])
  );

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30DaysCount = rows.filter((r) => (r.submittedAt ? r.submittedAt >= thirtyDaysAgo : false)).length;

  return NextResponse.json({
    totalAssessments,
    levelCounts,
    domainAverages,
    weakestDomain,
    last30DaysCount,
    averageTotalScore: Number((totalScoreSum / divisor).toFixed(2)),
    weakestDomainFrequency,
    domainLowCounts,
    ethicsLowCount,
    criticalLowCount,
    roleCounts,
    roleAverages,
    scoreBands
  });
}
