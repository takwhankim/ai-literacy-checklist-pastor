import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const consentAgg = Boolean(body?.consentAgg);

    if (!consentAgg) {
      return NextResponse.json({ error: "consentAgg is required" }, { status: 400 });
    }

    const assessment = await db.assessment.create({
      data: {
        name: body?.name?.trim() || null,
        role: body?.role?.trim() || null,
        ministry: body?.ministry?.trim() || null,
        consentAgg,
        consentShare: Boolean(body?.consentShare)
      },
      select: { id: true }
    });

    return NextResponse.json({ assessmentId: assessment.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
