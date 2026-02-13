import { COPY } from "@/lib/copy";

type Props = {
  warnings: string[];
  recommendations: string[];
  heading: string;
};

export default function ResultCards({ warnings, recommendations, heading }: Props) {
  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-800">{COPY.result.warningHeading}</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-amber-700">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">{heading}</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
