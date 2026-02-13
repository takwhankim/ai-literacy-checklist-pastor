import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { QUESTIONS, QUESTION_IDS } from "@/lib/questions";
import { scoreAssessment } from "@/lib/scoring";

type AnswerItem = {
  questionId: string;
  value: number;
};

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id;
    const assessment = await db.assessment.findUnique({ where: { id: assessmentId }, select: { id: true } });

    if (!assessment) {
      return NextResponse.json({ error: "assessment not found" }, { status: 404 });
    }

    const body = await req.json();
    const answers = (body?.answers || []) as AnswerItem[];

    if (answers.length !== QUESTIONS.length) {
      return NextResponse.json({ error: "invalid answer length" }, { status: 400 });
    }

    const idSet = new Set(answers.map((a) => a.questionId));
    if (idSet.size !== QUESTIONS.length) {
      return NextResponse.json({ error: "duplicate questionId" }, { status: 400 });
    }

    for (const answer of answers) {
      if (!QUESTION_IDS.has(answer.questionId)) {
        return NextResponse.json({ error: `invalid questionId ${answer.questionId}` }, { status: 400 });
      }
      if (!Number.isInteger(answer.value) || answer.value < 1 || answer.value > 5) {
        return NextResponse.json({ error: `invalid value for ${answer.questionId}` }, { status: 400 });
      }
    }

    const scored = scoreAssessment(answers);
    const domainByQuestion = new Map(QUESTIONS.map((q) => [q.id, q.domain]));

    await db.$transaction(async (tx) => {
      await tx.response.deleteMany({ where: { assessmentId } });
      await tx.response.createMany({
        data: answers.map((a) => ({
          assessmentId,
          questionId: a.questionId,
          domain: domainByQuestion.get(a.questionId) || "",
          value: a.value
        }))
      });

      await tx.assessment.update({
        where: { id: assessmentId },
        data: {
          totalScore: scored.totalScore,
          level: scored.level,
          domainScores: scored.domainScores,
          flags: scored.flags,
          submittedAt: new Date()
        }
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
