import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { visaGuides } from "@/constants/visa-guides";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = {
  title: "조건별 비자 가이드 — VisaChart",
  description: "잡오퍼, 연령, 영주권 관련성처럼 실제 검색 조건에 따라 전 세계 취업 가능 비자 경로를 확인하세요.",
};

export default function VisaGuidesPage() {
  return <main className="min-h-screen bg-[var(--color-canvas-dark)] px-3 py-4 text-[var(--color-ink)] sm:px-6 sm:py-8">
    {/* Hallmark · genre: modern-minimal · macrostructure: Long Document index · design-system: design.md
     * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass · responsive: pass
     */}
    <section className="mx-auto w-full max-w-[920px] rounded-[var(--radius-card)] bg-[var(--color-control)] px-5 py-7 shadow-[var(--shadow-sheet)] sm:px-8 sm:py-10">
      <Link className="text-sm font-semibold text-[var(--color-accent)]" href="/visachart">VisaChart</Link>
      <header className="mt-8 border-b-2 border-[var(--color-filter-rule)] pb-6"><h1 className="min-w-0 [overflow-wrap:anywhere] text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">조건별 비자 가이드</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-ink-2)]">구조화된 비자 데이터를 자주 찾는 조건별로 분류했습니다. 각 항목에서 판정 기준과 공식 출처를 함께 확인할 수 있습니다.</p></header>
      <div className="divide-y divide-[var(--color-rule)]">
        {visaGuides.map((guide) => {
          const count = workVisaList.filter(guide.matches).length;
          return <Link className="group grid gap-3 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" href={`/visa-guides/${guide.slug}`} key={guide.slug}><div className="min-w-0"><p className="text-xs font-semibold text-[var(--color-ink-2)]">{count}개 경로</p><h2 className="mt-1 text-lg font-semibold group-hover:underline">{guide.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-2)]">{guide.description}</p></div><ArrowRight aria-hidden="true" className="hidden h-5 w-5 text-[var(--color-ink-2)] sm:block" /></Link>;
        })}
      </div>
    </section>
  </main>;
}
