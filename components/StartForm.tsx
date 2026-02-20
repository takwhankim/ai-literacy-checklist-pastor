"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { COPY } from "@/lib/copy";

type Props = {
  compact?: boolean;
};

type StartResponse = {
  assessmentId: string;
};

export default function StartForm({ compact = false }: Props) {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [ministry, setMinistry] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [churchSize, setChurchSize] = useState("");
  const [region, setRegion] = useState("");
  const [consentAgg, setConsentAgg] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!role || !ministry || !gender || !ageGroup || !churchSize || !region) {
      setError(COPY.start.requiredError);
      return;
    }

    if (!consentAgg) {
      setError(COPY.start.consentError);
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/assessments/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        ministry,
        gender,
        ageGroup,
        churchSize,
        region,
        consentAgg,
        consentShare: false,
      }),
    });

    if (!res.ok) {
      setError(COPY.start.submitError);
      setLoading(false);
      return;
    }

    const data = (await res.json()) as StartResponse;
    router.push(`/survey/${data.assessmentId}`);
  }

  const sectionClass = compact
    ? "print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    : "print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

  return (
    <section className={sectionClass}>
      <h2 className="mb-6 text-2xl font-bold">{COPY.start.heading}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">{COPY.start.roleLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {COPY.start.roleOptions.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                <input type="radio" name="role" checked={role === option} onChange={() => setRole(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium">{COPY.start.ministryLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {COPY.start.ministryOptions.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                <input type="radio" name="ministry" checked={ministry === option} onChange={() => setMinistry(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium">{COPY.start.genderLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {COPY.start.genderOptions.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                <input type="radio" name="gender" checked={gender === option} onChange={() => setGender(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium">{COPY.start.ageLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {COPY.start.ageOptions.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                <input type="radio" name="ageGroup" checked={ageGroup === option} onChange={() => setAgeGroup(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium">{COPY.start.churchSizeLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {COPY.start.churchSizeOptions.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                <input type="radio" name="churchSize" checked={churchSize === option} onChange={() => setChurchSize(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium">{COPY.start.regionLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {COPY.start.regionOptions.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                <input type="radio" name="region" checked={region === option} onChange={() => setRegion(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={consentAgg} onChange={(e) => setConsentAgg(e.target.checked)} className="mt-1" />
          <span>{COPY.start.consentAgg}</span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {COPY.start.submit}
        </button>
      </form>
    </section>
  );
}
