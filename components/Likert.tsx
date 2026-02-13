"use client";

import { COPY } from "@/lib/copy";

type Props = {
  index: number;
  total: number;
  text: string;
  value?: number;
  onChange: (value: number) => void;
};

export default function Likert({ index, total, text, value, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-medium text-slate-500">
        문항 {index} / {total}
      </p>
      <p className="mb-5 text-lg font-semibold leading-8 text-slate-900">{text}</p>
      <div className="space-y-3">
        {COPY.likert.labels.map((label, idx) => {
          const score = idx + 1;
          return (
            <label
              key={label}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-left ${
                value === score
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name={`likert-${index}`}
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
                className="mt-1 h-4 w-4"
              />
              <span>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-slate-500">{COPY.likert.descriptions[idx]}</p>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
