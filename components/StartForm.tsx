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
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [ministry, setMinistry] = useState("");
  const [consentAgg, setConsentAgg] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !role.trim() || !ministry.trim()) {
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
        name: name.trim(),
        role: role.trim(),
        ministry: ministry.trim(),
        consentAgg,
        consentShare: false
      })
    });

    if (!res.ok) {
      setError(COPY.start.submitError);
      setLoading(false);
      return;
    }

    const data = (await res.json()) as StartResponse;
    router.push(`/survey/${data.assessmentId}`);
  }

  return (
    <section className="print-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">{COPY.start.heading}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">{COPY.start.nameLabel}</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder={COPY.start.namePlaceholder}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">{COPY.start.roleLabel}</label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">{COPY.start.roleEmpty}</option>
            {COPY.start.roleOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">{COPY.start.ministryLabel}</label>
          <input
            required
            value={ministry}
            onChange={(e) => setMinistry(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder={COPY.start.ministryPlaceholder}
          />
        </div>

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
          {compact ? COPY.start.submit : COPY.start.submit}
        </button>
      </form>
    </section>
  );
}
