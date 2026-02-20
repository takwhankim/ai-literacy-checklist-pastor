import { COPY } from "@/lib/copy";

type Props = {
  totalAssessments: number;
  weakestDomain: string;
  last30DaysCount: number;
  domainAverages: Record<string, number>;
  genderCounts: Record<string, number>;
  ageGroupCounts: Record<string, number>;
  churchSizeCounts: Record<string, number>;
  regionCounts: Record<string, number>;
  regionInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
  churchSizeInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
  roleInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
  ministryInsights: Array<{ label: string; count: number; averageTotalScore: number; weakestDomain: string }>;
};

function topLabel(counts: Record<string, number>) {
  const entries = Object.entries(counts);
  if (!entries.length) return "N/A";
  const [label, count] = entries.sort((a, b) => b[1] - a[1])[0];
  return `${label} (${count}명)`;
}

export default function AdminTable({
  totalAssessments,
  weakestDomain,
  last30DaysCount,
  domainAverages,
  genderCounts,
  ageGroupCounts,
  churchSizeCounts,
  regionCounts,
  regionInsights,
  churchSizeInsights,
  roleInsights,
  ministryInsights
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold">{COPY.admin.dashboard.summary}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">{COPY.admin.dashboard.totalAssessments}</td>
              <td className="py-2 text-right">{totalAssessments}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">{COPY.admin.dashboard.last30Days}</td>
              <td className="py-2 text-right">{last30DaysCount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">{COPY.admin.dashboard.weakestDomain}</td>
              <td className="py-2 text-right">{weakestDomain}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">최다 성별</td>
              <td className="py-2 text-right">{topLabel(genderCounts)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">최다 연령대</td>
              <td className="py-2 text-right">{topLabel(ageGroupCounts)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">최다 교회 규모</td>
              <td className="py-2 text-right">{topLabel(churchSizeCounts)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">최다 지역</td>
              <td className="py-2 text-right">{topLabel(regionCounts)}</td>
            </tr>
            {Object.entries(domainAverages).map(([k, v]) => (
              <tr key={k} className="border-b">
                <td className="py-2 font-medium text-slate-700">
                  {COPY.admin.dashboard.domainAveragePrefix} {k} {COPY.admin.dashboard.domainAverageSuffix}
                </td>
                <td className="py-2 text-right">{v.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-slate-200 p-3">
          <h4 className="mb-2 text-sm font-semibold">지역별 인사이트</h4>
          <ul className="space-y-1 text-sm text-slate-700">
            {regionInsights.map((item) => (
              <li key={item.label}>
                {item.label}: 평균 {item.averageTotalScore}점, 취약영역 {item.weakestDomain} ({item.count}명)
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-slate-200 p-3">
          <h4 className="mb-2 text-sm font-semibold">교회 규모별 인사이트</h4>
          <ul className="space-y-1 text-sm text-slate-700">
            {churchSizeInsights.map((item) => (
              <li key={item.label}>
                {item.label}: 평균 {item.averageTotalScore}점, 취약영역 {item.weakestDomain} ({item.count}명)
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-slate-200 p-3">
          <h4 className="mb-2 text-sm font-semibold">역할별 인사이트</h4>
          <ul className="space-y-1 text-sm text-slate-700">
            {roleInsights.map((item) => (
              <li key={item.label}>
                {item.label}: 평균 {item.averageTotalScore}점, 취약영역 {item.weakestDomain} ({item.count}명)
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-slate-200 p-3">
          <h4 className="mb-2 text-sm font-semibold">사역부서별 인사이트</h4>
          <ul className="space-y-1 text-sm text-slate-700">
            {ministryInsights.map((item) => (
              <li key={item.label}>
                {item.label}: 평균 {item.averageTotalScore}점, 취약영역 {item.weakestDomain} ({item.count}명)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
