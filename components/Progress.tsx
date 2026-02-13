"use client";

import { COPY } from "@/lib/copy";

type Props = {
  current: number;
  total: number;
};

export default function Progress({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
        <span>{COPY.survey.progress}</span>
        <span>{current}/{total} ({percent}%)</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
