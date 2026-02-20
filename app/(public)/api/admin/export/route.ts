import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifyAdminSessionValue } from "@/lib/auth";

type DomainScores = { A?: number; B?: number; C?: number; D?: number };
type Flags = { ethics_low?: boolean; critical_low?: boolean };

function csvEscape(value: unknown) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes("\"")) {
    return `"${str.replaceAll("\"", "\"\"")}"`;
  }
  return str;
}

export async function GET() {
  const cookie = cookies().get(ADMIN_COOKIE)?.value;

  if (!verifyAdminSessionValue(cookie)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await db.assessment.findMany({
    where: { submittedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      submittedAt: true,
      gender: true,
      ageGroup: true,
      churchSize: true,
      region: true,
      role: true,
      ministry: true,
      name: true,
      consentShare: true,
      totalScore: true,
      level: true,
      domainScores: true,
      flags: true
    }
  });

  const header = [
    "assessmentId",
    "createdAt",
    "submittedAt",
    "name",
    "gender",
    "ageGroup",
    "churchSize",
    "region",
    "role",
    "ministry",
    "totalScore",
    "level",
    "A",
    "B",
    "C",
    "D",
    "ethics_low",
    "critical_low"
  ];

  const lines = [header.join(",")];

  for (const row of rows) {
    const ds = (row.domainScores || {}) as DomainScores;
    const flags = (row.flags || {}) as Flags;
    const visibleName = row.consentShare && row.name ? row.name : "";

    const line = [
      row.id,
      row.createdAt.toISOString(),
      row.submittedAt?.toISOString() || "",
      visibleName,
      row.gender || "",
      row.ageGroup || "",
      row.churchSize || "",
      row.region || "",
      row.role || "",
      row.ministry || "",
      row.totalScore ?? "",
      row.level ?? "",
      ds.A ?? "",
      ds.B ?? "",
      ds.C ?? "",
      ds.D ?? "",
      flags.ethics_low ? "true" : "false",
      flags.critical_low ? "true" : "false"
    ].map(csvEscape);

    lines.push(line.join(","));
  }

  const csv = `\uFEFF${lines.join("\n")}`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=church-ai-literacy-export.csv"
    }
  });
}
