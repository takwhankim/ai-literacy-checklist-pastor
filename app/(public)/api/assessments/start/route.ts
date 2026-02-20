import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const consentAgg = Boolean(body?.consentAgg);
    const role = body?.role?.trim() || "";
    const ministry = body?.ministry?.trim() || "";
    const gender = body?.gender?.trim() || "";
    const ageGroup = body?.ageGroup?.trim() || "";
    const churchSize = body?.churchSize?.trim() || "";
    const region = body?.region?.trim() || "";

    if (!consentAgg) {
      return NextResponse.json({ error: "consentAgg is required" }, { status: 400 });
    }
    if (!role || !ministry || !gender || !ageGroup || !churchSize || !region) {
      return NextResponse.json(
        { error: "role, ministry, gender, ageGroup, churchSize, region are required" },
        { status: 400 }
      );
    }

    const assessment = await db.assessment.create({
      data: {
        role,
        ministry,
        gender,
        ageGroup,
        churchSize,
        region,
        name: null,
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
