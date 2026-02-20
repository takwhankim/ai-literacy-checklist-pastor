"use client";

import { useEffect, useState } from "react";
import AdminCharts from "@/components/AdminCharts";
import AdminTable from "@/components/AdminTable";
import { COPY } from "@/lib/copy";

type SummaryData = {
  totalAssessments: number;
  levelCounts: Record<string, number>;
  domainAverages: Record<string, number>;
  weakestDomain: string;
  last30DaysCount: number;
  roleCounts: Record<string, number>;
  ministryCounts: Record<string, number>;
  genderCounts: Record<string, number>;
  ageGroupCounts: Record<string, number>;
  churchSizeCounts: Record<string, number>;
  regionCounts: Record<string, number>;
  regionInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
  churchSizeInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
  roleInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
  ministryInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
};

export default function AdminDashboard() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/summary")
      .then(async (res) => {
        if (!res.ok) throw new Error(COPY.admin.dashboard.error);
        return res.json() as Promise<SummaryData>;
      })
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!data) {
    return <p>{COPY.admin.dashboard.loading}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{COPY.admin.dashboard.heading}</h1>
        <div className="flex gap-2">
          <a href="/api/admin/export" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
            {COPY.admin.dashboard.export}
          </a>
          <button
            type="button"
            onClick={logout}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {COPY.admin.dashboard.logout}
          </button>
        </div>
      </div>

      <AdminCharts
        levelCounts={data.levelCounts}
        domainAverages={data.domainAverages}
        roleCounts={data.roleCounts}
        ministryCounts={data.ministryCounts}
        genderCounts={data.genderCounts}
        ageGroupCounts={data.ageGroupCounts}
        churchSizeCounts={data.churchSizeCounts}
        regionCounts={data.regionCounts}
      />
      <AdminTable
        totalAssessments={data.totalAssessments}
        weakestDomain={data.weakestDomain}
        last30DaysCount={data.last30DaysCount}
        domainAverages={data.domainAverages}
        genderCounts={data.genderCounts}
        ageGroupCounts={data.ageGroupCounts}
        churchSizeCounts={data.churchSizeCounts}
        regionCounts={data.regionCounts}
        regionInsights={data.regionInsights}
        churchSizeInsights={data.churchSizeInsights}
        roleInsights={data.roleInsights}
        ministryInsights={data.ministryInsights}
      />
    </div>
  );
}
