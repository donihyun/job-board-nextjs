import type { Metadata } from "next";
import Link from "next/link";
import VisaClientWrapper from "@/components/visa-client-wrapper";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = {
  title: "VisaChart — 전 세계 취업 가능 비자 비교",
  description: "워킹홀리데이, 학생, 취업, 구직, 디지털 노마드 비자를 국가별로 검색하고 비교하세요.",
};

export default function VisaChartPage() {
  return (
    <main className="min-h-screen bg-[var(--color-control)] px-0 pb-8 text-[var(--color-ink)] sm:px-4 sm:pb-12 lg:px-8">
      {/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app
       * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass · responsive: pass
       */}
      <section className="mx-auto w-full max-w-[1180px] bg-[var(--color-control)] px-4 pb-12 pt-5 sm:mt-8 sm:px-6 lg:px-8">
        <header className="grid gap-2 border-b border-[var(--color-rule)] pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,.75fr)] sm:items-end">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
              VisaChart
            </p>
            <h1 className="text-2xl font-semibold leading-tight tracking-[-0.015em] sm:text-3xl">
              전 세계 취업 가능 비자 비교
            </h1>
          </div>
          <div><p className="text-xs leading-5 text-[var(--color-ink-2)] sm:text-sm">국가·체류기간·근로범위를 비교하고 공식 출처를 확인하세요.</p><Link className="mt-2 inline-block whitespace-nowrap text-xs font-semibold text-[var(--color-accent)]" href="/visa-guides">조건별 비자 가이드 보기 →</Link></div>
        </header>

        <VisaClientWrapper visas={workVisaList} />
      </section>
    </main>
  );
}
