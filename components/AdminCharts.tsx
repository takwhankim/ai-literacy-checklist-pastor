"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { COPY } from "@/lib/copy";

type Props = {
  levelCounts: Record<string, number>;
  domainAverages: Record<string, number>;
  weakestDomainFrequency: Record<string, number>;
  scoreBands: Record<string, number>;
  roleAverages: Record<string, number>;
};

const pieColors = ["#64748b", "#2563eb", "#10b981", "#8b5cf6"];

export default function AdminCharts({
  levelCounts,
  domainAverages,
  weakestDomainFrequency,
  scoreBands,
  roleAverages
}: Props) {
  const levelData = [1, 2, 3, 4].map((level) => ({
    name: `L${level}`,
    value: levelCounts[String(level)] || 0
  }));

  const domainData = ["A", "B", "C", "D"].map((key) => ({
    domain: key,
    avg: Number(domainAverages[key] || 0)
  }));

  const weakestData = ["A", "B", "C", "D"].map((key) => ({
    domain: key,
    count: Number(weakestDomainFrequency[key] || 0)
  }));

  const scoreBandData = ["20-44", "45-64", "65-84", "85-100"].map((band) => ({
    band,
    count: Number(scoreBands[band] || 0)
  }));

  const roleAverageData = Object.entries(roleAverages)
    .map(([role, avg]) => ({ role, avg }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 8);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">레벨 분포</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={levelData} dataKey="value" nameKey="name" outerRadius={90} label>
                {levelData.map((_, idx) => (
                  <Cell key={idx} fill={pieColors[idx]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">영역 평균 점수(/25)</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={domainData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domain" />
              <YAxis domain={[0, 25]} />
              <Tooltip />
              <Bar dataKey="avg" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">공통 취약영역(개인별 최저영역 빈도)</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={weakestData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domain" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">총점 구간 분포</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={scoreBandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="band" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
        <h3 className="mb-3 text-sm font-semibold">역할별 평균 총점(상위 8개)</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={roleAverageData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="role" width={160} />
              <Tooltip />
              <Bar dataKey="avg" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
