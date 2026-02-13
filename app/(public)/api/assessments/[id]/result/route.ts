import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { COPY } from "@/lib/copy";
import { levelMeta } from "@/lib/scoring";

type DomainScores = { A: number; B: number; C: number; D: number };
type Flags = { ethics_low: boolean; critical_low: boolean };

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const row = await db.assessment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        totalScore: true,
        level: true,
        domainScores: true,
        flags: true,
        submittedAt: true
      }
    });

    if (!row || !row.submittedAt || !row.totalScore || !row.level) {
      return NextResponse.json({ error: "result not ready" }, { status: 404 });
    }

    const level = row.level as 1 | 2 | 3 | 4;
    const domainScores = (row.domainScores || { A: 0, B: 0, C: 0, D: 0 }) as DomainScores;
    const flags = (row.flags || { ethics_low: false, critical_low: false }) as Flags;

    const recommendations: string[] = [...COPY.result.recommendations[level]];
    if (flags.ethics_low) {
      recommendations.push(COPY.result.extraRecommendations.ethicsLow);
    }
    if (flags.critical_low) {
      recommendations.push(COPY.result.extraRecommendations.criticalLow);
    }

    const meta = levelMeta(level);

    return NextResponse.json({
      id: row.id,
      totalScore: row.totalScore,
      level,
      submittedAt: row.submittedAt.toISOString(),
      levelTitle: meta.title,
      levelDesc: meta.desc,
      domainScores,
      flags,
      recommendations
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
