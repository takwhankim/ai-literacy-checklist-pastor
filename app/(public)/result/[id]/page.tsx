"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import LevelBadge from "@/components/LevelBadge";
import PrintButton from "@/components/PrintButton";
import { COPY } from "@/lib/copy";

type ResultData = {
  id: string;
  totalScore: number;
  level: 1 | 2 | 3 | 4;
  submittedAt: string;
  domainScores: { A: number; B: number; C: number; D: number };
  flags: { ethics_low: boolean; critical_low: boolean };
  recommendations: string[];
  levelTitle: string;
  levelDesc: string;
};

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/assessments/${params.id}/result`)
      .then(async (res) => {
        if (!res.ok) throw new Error(COPY.result.fetchError);
        return res.json() as Promise<ResultData>;
      })
      .then((json) => {
        if (active) setData(json);
      })
      .catch((e: Error) => setError(e.message));

    return () => {
      active = false;
    };
  }, [params.id]);

  async function copyUrl() {
    await navigator.clipboard.writeText(window.location.href);
    alert(COPY.result.copyDone);
  }

  if (error) {
    return (
      <main className="container-page">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="container-page">
        <p>{COPY.result.loading}</p>
      </main>
    );
  }

  const warnings: string[] = [];
  if (data.flags.ethics_low) warnings.push(COPY.result.warnings.ethics_low);
  if (data.flags.critical_low) warnings.push(COPY.result.warnings.critical_low);
  const completedAt = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(data.submittedAt));

  const domainRows = [
    { key: "A", name: COPY.result.domainNameA, score: data.domainScores.A },
    { key: "B", name: COPY.result.domainNameB, score: data.domainScores.B },
    { key: "C", name: COPY.result.domainNameC, score: data.domainScores.C },
    { key: "D", name: COPY.result.domainNameD, score: data.domainScores.D }
  ];

  const strongest = [...domainRows].sort((a, b) => b.score - a.score)[0];
  const weakest = [...domainRows].sort((a, b) => a.score - b.score)[0];

  const keyTraits = [
    `현재 수준은 "${data.levelTitle}" 단계이며, 총점은 ${data.totalScore}점입니다.`,
    `가장 강한 영역은 ${strongest.name}(${strongest.score}/25)입니다.`,
    `보완이 필요한 영역은 ${weakest.name}(${weakest.score}/25)입니다.`,
    data.flags.critical_low
      ? "중요 사실 검증 루틴(출처 확인/교차검증) 강화가 우선 과제입니다."
      : "사실 확인과 재구성 습관이 비교적 안정적으로 형성되어 있습니다.",
    data.flags.ethics_low
      ? "개인정보/저작권/책임 기준을 팀 단위로 명문화할 필요가 있습니다."
      : "윤리·책임 관점의 기본 기준이 잘 유지되고 있습니다."
  ];

  const practicalPoints = [
    `다음 2주 동안 ${weakest.name} 영역을 중심으로 실습 과제를 진행해 보세요.`,
    "모든 AI 산출물에 대해 '초안 생성 → 검증 → 재작성' 순서를 고정하세요.",
    "사역 상황에 맞는 금지 입력 항목(상담/개인정보) 체크리스트를 팀과 공유하세요.",
    "매주 1회 20분, 실제 사역 문서를 활용한 프롬프트 개선 회고를 진행하세요.",
    data.flags.critical_low
      ? "숫자·연도·인용 문장은 최소 2개 출처 확인 전까지 배포하지 마세요."
      : "검증이 끝난 문장은 팀 공용 템플릿으로 축적해 재사용률을 높이세요."
  ];

  const actionItems = data.recommendations.slice(0, 3);

  return (
    <main className="container-page space-y-4">
      <header className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{COPY.result.heading}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {COPY.result.completedAtPrefix}: {completedAt}
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <article className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{COPY.result.overallScore}</h2>
            <p className="mt-4 text-5xl font-bold text-slate-900">{data.totalScore}</p>
            <p className="mt-2 text-sm text-slate-500">{COPY.result.outOf100}</p>
            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${data.totalScore}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{data.totalScore}%</p>
          </article>

          <article className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{COPY.result.levelSectionTitle}</h2>
            <div className="mt-3">
              <LevelBadge level={data.level} title={data.levelTitle} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{data.levelDesc}</p>
          </article>
        </div>

        <article className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-2xl font-semibold text-slate-900">{COPY.result.scoreAnalysis}</h2>
          <div className="mt-4 space-y-5">
            {domainRows.map((row) => {
              const percent = Math.round((row.score / 25) * 100);
              return (
                <div key={row.key}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{row.name}</p>
                    <p className="text-sm text-slate-600">{row.score}/25</p>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{percent}%</p>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {COPY.result.levelSectionTitle}: {data.levelTitle}
        </h2>
        <p className="mt-3 text-sm text-slate-700">{COPY.result.topNote}</p>

        {warnings.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <ul className="space-y-1 text-sm text-amber-700">
              {warnings.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          </div>
        )}

        <h3 className="mt-6 text-lg font-semibold text-slate-900">{COPY.result.keyTraits}</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {keyTraits.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-slate-900">{COPY.result.practicalHeading}</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {practicalPoints.map((item) => (
            <li key={item}>› {item}</li>
          ))}
        </ul>
      </section>

      <section className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">{COPY.result.actionHeading}</h2>
        <p className="mt-2 text-sm text-slate-600">{COPY.result.actionSubheading}</p>

        <div className="mt-4 space-y-3">
          {actionItems.map((item) => (
            <article key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{item}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">{COPY.result.bottomNote}</p>
      </section>

      <div className="no-print flex flex-wrap gap-2">
        <PrintButton />
        <button
          type="button"
          onClick={copyUrl}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        >
          {COPY.result.copyLink}
        </button>
        <Link
          href="/start"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {COPY.result.retry}
        </Link>
      </div>
    </main>
  );
}
