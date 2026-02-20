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
  roleCounts: Record<string, number>;
  ministryCounts: Record<string, number>;
  genderCounts: Record<string, number>;
  ageGroupCounts: Record<string, number>;
  churchSizeCounts: Record<string, number>;
  regionCounts: Record<string, number>;
};

const pieColors = ["#64748b", "#2563eb", "#10b981", "#8b5cf6"];

export default function AdminCharts({
  levelCounts,
  domainAverages,
  roleCounts,
  ministryCounts,
  genderCounts,
  ageGroupCounts,
  churchSizeCounts,
  regionCounts
}: Props) {
  const levelData = [1, 2, 3, 4].map((level) => ({
    name: `L${level}`,
    value: levelCounts[String(level)] || 0
  }));

  const domainData = ["A", "B", "C", "D"].map((key) => ({
    domain: key,
    avg: Number(domainAverages[key] || 0)
  }));

  const genderData = Object.entries(genderCounts).map(([name, count]) => ({ name, count }));
  const ageData = Object.entries(ageGroupCounts).map(([name, count]) => ({ name, count }));
  const churchSizeData = Object.entries(churchSizeCounts).map(([name, count]) => ({ name, count }));
  const regionData = Object.entries(regionCounts).map(([name, count]) => ({ name, count }));
  const roleData = Object.entries(roleCounts).map(([name, count]) => ({ name, count }));
  const ministryData = Object.entries(ministryCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.levelDistribution}</h3>
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
        <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.domainAverage}</h3>
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
        <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.genderDistribution}</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={genderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.ageDistribution}</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.churchSizeDistribution}</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={churchSizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.regionDistribution}</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">역할 분포</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">사역 부서 분포</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={ministryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
