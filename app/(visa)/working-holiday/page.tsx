import type { Metadata } from "next";
import Link from "next/link";
import WorkingHolidayComparison from "@/components/working-holiday-comparison";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = {
  title: "워킹홀리데이 28개국 비교 — VisaChart",
  description: "대한민국 여권으로 신청 가능한 워킹홀리데이 국가를 나이, 쿼터, 체류기간과 취업 제한으로 비교하세요.",
};

export default function WorkingHolidayPage() {
  const visas = workVisaList.filter((visa) => visa.category === "Working holiday");
  return <main className="min-h-screen bg-[var(--color-canvas-dark)] px-3 py-4 text-[var(--color-ink)] sm:px-6 sm:py-8">
    <article className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-control)] shadow-[var(--shadow-sheet)]">
      <header className="border-b-2 border-[var(--color-filter-rule)] px-5 pb-8 pt-6 sm:px-8 sm:pb-10 lg:px-12">
        <nav aria-label="페이지 이동" className="mb-12 flex items-center justify-between text-sm"><Link className="font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href="/visachart">VisaChart</Link><div className="flex items-center gap-5"><Link className="whitespace-nowrap text-[var(--color-ink-2)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href="/visa-finder">내 조건으로 찾기</Link><Link className="whitespace-nowrap text-[var(--color-ink-2)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href="/visachart">전체 비자표</Link></div></nav>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end"><h1 className="min-w-0 [overflow-wrap:anywhere] text-3xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">워킹홀리데이 28개국 비교</h1><p className="max-w-[60ch] text-sm leading-6 text-[var(--color-ink-2)]">대한민국 여권으로 참여 가능한 28개 국가·지역을 같은 기준으로 비교합니다. 나이를 입력하면 현재 신청 연령에 맞는 국가만 남습니다.</p></div>
      </header>
      <WorkingHolidayComparison visas={visas} />
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[var(--color-filter-rule)] px-5 py-5 text-xs text-[var(--color-ink-2)] sm:px-8"><span>신청 전 각 국가의 최신 공식 공고를 확인하세요.</span><Link className="whitespace-nowrap font-semibold text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href="/visa-finder">내 조건으로 비자 찾기 →</Link></footer>
    </article>
  </main>;
}
