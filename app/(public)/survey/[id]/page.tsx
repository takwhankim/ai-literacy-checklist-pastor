"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Likert from "@/components/Likert";
import { COPY } from "@/lib/copy";
import { QUESTIONS } from "@/lib/questions";

export default function SurveyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];

  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => typeof answers[q.id] === "number").length,
    [answers]
  );
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);
  const hasCurrentAnswer = typeof answers[currentQuestion.id] === "number";

  async function handleSubmit() {
    if (answeredCount !== QUESTIONS.length) {
      setError(COPY.survey.requiredError);
      return;
    }

    setLoading(true);
    setError("");

    const payload = QUESTIONS.map((q) => ({ questionId: q.id, value: answers[q.id] }));
    const res = await fetch(`/api/assessments/${params.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload })
    });

    if (!res.ok) {
      setError(COPY.survey.submitError);
      setLoading(false);
      return;
    }

    router.push(`/result/${params.id}`);
  }

  function handleNext() {
    if (!hasCurrentAnswer) {
      setError(COPY.survey.nextRequiresAnswer);
      return;
    }
    setError("");
    setCurrentIndex((prev) => Math.min(prev + 1, total - 1));
  }

  return (
    <main className="container-page">
      <section className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-2xl font-bold">{COPY.survey.heading}</h1>
          <p className="text-sm text-slate-600">{COPY.survey.description}</p>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">{COPY.survey.domainGuideTitle}</p>
            <ul className="mt-2 space-y-1">
              <li>• {COPY.survey.domainGuideA}</li>
              <li>• {COPY.survey.domainGuideB}</li>
              <li>• {COPY.survey.domainGuideC}</li>
              <li>• {COPY.survey.domainGuideD}</li>
            </ul>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>
                {currentIndex + 1} / {total}
              </span>
              <span>
                {progressPercent}% {COPY.survey.progressComplete}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <Likert
          key={currentQuestion.id}
          index={currentIndex + 1}
          total={total}
          text={`${currentQuestion.id}. ${currentQuestion.text}`}
          value={answers[currentQuestion.id]}
          onChange={(value) => {
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
            setError("");
          }}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0 || loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            {COPY.survey.previous}
          </button>

          <p className="text-sm text-slate-500">
            {answeredCount} / {total} {COPY.survey.answeredStatus}
          </p>

          {currentIndex === total - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !hasCurrentAnswer}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {COPY.survey.finish}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {COPY.survey.next}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
