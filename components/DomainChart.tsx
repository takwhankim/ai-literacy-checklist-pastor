"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

type Props = {
  scores: { A: number; B: number; C: number; D: number };
};

export default function DomainChart({ scores }: Props) {
  const data = [
    { domain: "A", score: scores.A, percent: Math.round((scores.A / 25) * 100) },
    { domain: "B", score: scores.B, percent: Math.round((scores.B / 25) * 100) },
    { domain: "C", score: scores.C, percent: Math.round((scores.C / 25) * 100) },
    { domain: "D", score: scores.D, percent: Math.round((scores.D / 25) * 100) }
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="domain" />
          <YAxis domain={[0, 25]} />
          <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="percent" position="top" formatter={(v: number) => `${v}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
