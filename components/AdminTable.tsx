import { COPY } from "@/lib/copy";

type Props = {
  totalAssessments: number;
  weakestDomain: string;
  last30DaysCount: number;
  domainAverages: Record<string, number>;
  averageTotalScore: number;
  ethicsLowCount: number;
  criticalLowCount: number;
  domainLowCounts: Record<string, number>;
};

export default function AdminTable({
  totalAssessments,
  weakestDomain,
  last30DaysCount,
  domainAverages,
  averageTotalScore,
  ethicsLowCount,
  criticalLowCount,
  domainLowCounts
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold">요약 인사이트</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">제출 완료 수</td>
              <td className="py-2 text-right">{totalAssessments}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">최근 30일 제출</td>
              <td className="py-2 text-right">{last30DaysCount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">평균 총점(/100)</td>
              <td className="py-2 text-right">{averageTotalScore.toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">전체 평균 기준 취약 영역</td>
              <td className="py-2 text-right">{weakestDomain}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">윤리·책임 보완 필요(명)</td>
              <td className="py-2 text-right">{ethicsLowCount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium text-slate-700">검증 루틴 보완 필요(명)</td>
              <td className="py-2 text-right">{criticalLowCount}</td>
            </tr>

            {Object.entries(domainAverages).map(([k, v]) => (
              <tr key={`avg-${k}`} className="border-b">
                <td className="py-2 font-medium text-slate-700">영역 {k} 평균 점수</td>
                <td className="py-2 text-right">{v.toFixed(2)}</td>
              </tr>
            ))}

            {Object.entries(domainLowCounts).map(([k, v]) => (
              <tr key={`low-${k}`} className="border-b">
                <td className="py-2 font-medium text-slate-700">영역 {k} 저점(15점 미만) 인원</td>
                <td className="py-2 text-right">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
