import Image from "next/image";
import StartForm from "@/components/StartForm";
import { COPY } from "@/lib/copy";

export default function LandingPage() {
  return (
    <main className="container-page space-y-4">
      <section className="print-card rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">{COPY.landing.title}</h1>
        <p className="mx-auto max-w-3xl text-[13px] leading-6 text-slate-700">{COPY.landing.description}</p>
        <p className="mx-auto mt-3 max-w-3xl text-[13px] leading-7 text-slate-700">
          본 체트리스트는 유네스코(UNESCO) 교사및 리더용 AI 역량 프레임워크를 기반으로 제작되었습니다.
        </p>
      </section>

      <section className="rounded-2xl p-4 text-center">
        <div className="mx-auto max-w-4xl">
          <Image
            src="/og-image.png"
            alt="교회사역자를 위한 AI리터러시 체크리스트"
            width={1200}
            height={630}
            className="h-auto w-full rounded-xl"
            priority
          />
        </div>
        <p className="mt-4 text-xs text-slate-500">{COPY.common.copyright}</p>
      </section>

      <StartForm compact />

      <footer className="pb-2 text-center text-xs text-slate-500">
        {COPY.common.copyright}
      </footer>
    </main>
  );
}
