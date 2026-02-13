import { COPY } from "@/lib/copy";

type Props = {
  level: 1 | 2 | 3 | 4;
  title: string;
};

const levelColors = {
  1: "bg-slate-100 text-slate-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-emerald-100 text-emerald-700",
  4: "bg-violet-100 text-violet-700"
};

export default function LevelBadge({ level, title }: Props) {
  return (
    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${levelColors[level]}`}>
      {COPY.common.levelLabel} {level} · {title}
    </div>
  );
}
