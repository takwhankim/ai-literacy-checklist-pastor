import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifyAdminSessionValue } from "@/lib/auth";

type DomainScores = { A?: number; B?: number; C?: number; D?: number };
type BucketAgg = {
  count: number;
  totalScoreSum: number;
  domainSums: Record<"A" | "B" | "C" | "D", number>;
};

function addToBucket(
  map: Record<string, BucketAgg>,
  key: string,
  totalScore: number,
  domainScores: Record<"A" | "B" | "C" | "D", number>
) {
  const current = map[key] || {
    count: 0,
    totalScoreSum: 0,
    domainSums: { A: 0, B: 0, C: 0, D: 0 }
  };
  current.count += 1;
  current.totalScoreSum += totalScore;
  current.domainSums.A += domainScores.A;
  current.domainSums.B += domainScores.B;
  current.domainSums.C += domainScores.C;
  current.domainSums.D += domainScores.D;
  map[key] = current;
}

function buildInsightRows(map: Record<string, BucketAgg>) {
  return Object.entries(map)
    .map(([label, agg]) => {
      const avgTotal = agg.totalScoreSum / (agg.count || 1);
      const domainAvg = {
        A: agg.domainSums.A / (agg.count || 1),
        B: agg.domainSums.B / (agg.count || 1),
        C: agg.domainSums.C / (agg.count || 1),
        D: agg.domainSums.D / (agg.count || 1)
      };
      const weakestDomain = (["A", "B", "C", "D"] as const).reduce((acc, key) =>
        domainAvg[key] < domainAvg[acc] ? key : acc
      , "A");
      return {
        label,
        count: agg.count,
        averageTotalScore: Number(avgTotal.toFixed(2)),
        weakestDomain
      };
    })
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
  const cookie = cookies().get(ADMIN_COOKIE)?.value;

  if (!verifyAdminSessionValue(cookie)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await db.assessment.findMany({
    where: { submittedAt: { not: null } },
    select: {
      level: true,
      domainScores: true,
      totalScore: true,
      submittedAt: true,
      role: true,
      ministry: true,
      gender: true,
      ageGroup: true,
      churchSize: true,
      region: true
    }
  });

  const totalAssessments = rows.length;
  const levelCounts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0 };
  const domainSums: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const genderCounts: Record<string, number> = {};
  const ageGroupCounts: Record<string, number> = {};
  const churchSizeCounts: Record<string, number> = {};
  const regionCounts: Record<string, number> = {};
  const roleCounts: Record<string, number> = {};
  const ministryCounts: Record<string, number> = {};

  const regionAgg: Record<string, BucketAgg> = {};
  const churchSizeAgg: Record<string, BucketAgg> = {};
  const roleAgg: Record<string, BucketAgg> = {};
  const ministryAgg: Record<string, BucketAgg> = {};

  for (const row of rows) {
    if (row.level) {
      levelCounts[String(row.level)] = (levelCounts[String(row.level)] || 0) + 1;
    }

    const ds = (row.domainScores || {}) as DomainScores;
    const domainValues: Record<"A" | "B" | "C" | "D", number> = {
      A: ds.A || 0,
      B: ds.B || 0,
      C: ds.C || 0,
      D: ds.D || 0
    };

    domainSums.A += domainValues.A;
    domainSums.B += domainValues.B;
    domainSums.C += domainValues.C;
    domainSums.D += domainValues.D;

    const gender = row.gender || "미응답";
    const ageGroup = row.ageGroup || "미응답";
    const churchSize = row.churchSize || "미응답";
    const region = row.region || "미응답";
    const role = row.role || "미응답";
    const ministry = row.ministry || "미응답";
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    ageGroupCounts[ageGroup] = (ageGroupCounts[ageGroup] || 0) + 1;
    churchSizeCounts[churchSize] = (churchSizeCounts[churchSize] || 0) + 1;
    regionCounts[region] = (regionCounts[region] || 0) + 1;
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    ministryCounts[ministry] = (ministryCounts[ministry] || 0) + 1;

    const totalScore = row.totalScore ?? (domainValues.A + domainValues.B + domainValues.C + domainValues.D);
    addToBucket(regionAgg, region, totalScore, domainValues);
    addToBucket(churchSizeAgg, churchSize, totalScore, domainValues);
    addToBucket(roleAgg, role, totalScore, domainValues);
    addToBucket(ministryAgg, ministry, totalScore, domainValues);
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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30DaysCount = rows.filter((r) => (r.submittedAt ? r.submittedAt >= thirtyDaysAgo : false)).length;

  return NextResponse.json({
    totalAssessments,
    levelCounts,
    domainAverages,
    weakestDomain,
    last30DaysCount,
    genderCounts,
    ageGroupCounts,
    churchSizeCounts,
    regionCounts,
    roleCounts,
    ministryCounts,
    regionInsights: buildInsightRows(regionAgg),
    churchSizeInsights: buildInsightRows(churchSizeAgg),
    roleInsights: buildInsightRows(roleAgg),
    ministryInsights: buildInsightRows(ministryAgg)
  });
}
