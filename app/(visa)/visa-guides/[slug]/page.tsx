import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ad-slot";
import { visaGuides } from "@/constants/visa-guides";
import { categoryKo, countryFlag, countryKo, durationKo, jobOfferKo, prRelevanceKo, workScopeKo, workVisaList } from "@/constants/visas";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return visaGuides.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = visaGuides.find((item) => item.slug === params.slug);
  return guide ? { title: `${guide.title} — VisaChart`, description: guide.description } : {};
}

export default function VisaGuidePage({ params }: Props) {
  const guide = visaGuides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  const results = workVisaList.filter(guide.matches);
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_VISA_GUIDE_SLOT;

  return <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
    {/* Hallmark · genre: modern-minimal · macrostructure: Long Document · design-system: design.md
     * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass · responsive: pass
     */}
    <article className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-10">
      <Link className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[var(--color-accent)]" href="/visa-guides"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> 조건별 가이드</Link>
      <header className="border-b-2 border-[var(--color-filter-rule)] pb-8 pt-9"><p className="text-xs font-semibold text-[var(--color-accent)]">VisaChart 가이드</p><h1 className="mt-2 min-w-0 max-w-4xl [overflow-wrap:anywhere] text-3xl font-semibold leading-tight tracking-[-0.025em] sm:text-4xl">{guide.title}</h1><p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--color-ink-2)]">{guide.description}</p><dl className="mt-6 grid gap-px overflow-hidden border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2"><div className="bg-[var(--color-control)] p-4"><dt className="text-xs text-[var(--color-ink-2)]">분류 기준</dt><dd className="mt-2 text-sm font-semibold">{guide.criterion}</dd></div><div className="bg-[var(--color-control)] p-4"><dt className="text-xs text-[var(--color-ink-2)]">현재 검색 결과</dt><dd className="mt-2 text-sm font-semibold">{results.length}개 경로</dd></div></dl></header>
      <section className="py-8"><h2 className="text-xl font-semibold">비자 경로 목록</h2><div className="mt-4 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
        {results.map((visa, index) => <Fragment key={visa.slug}><Link className="group grid gap-2 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-3" href={`/visachart/${visa.slug}`}><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-2)]"><span className="text-base">{countryFlag(visa.country)}</span><span className="font-semibold">{countryKo[visa.country] || visa.country}</span><span>{categoryKo[visa.category]}</span></div><h3 className="mt-1 font-semibold group-hover:underline">{visa.visa_type}</h3><p className="mt-2 text-xs leading-5 text-[var(--color-ink-2)]">{durationKo(visa)} · {workScopeKo[visa.work_scope]} · 잡오퍼 {jobOfferKo[visa.job_offer_required]} · {prRelevanceKo[visa.pr_relevance]}</p></div><ArrowUpRight aria-hidden="true" className="hidden h-4 w-4 text-[var(--color-ink-2)] sm:block" /></Link>{index === 7 && <AdSlot className="my-0" slot={adSlot} />}</Fragment>)}
      </div></section>
      <p className="border-t border-[var(--color-rule)] pt-5 text-xs leading-5 text-[var(--color-ink-2)]">분류는 현재 저장된 구조화 데이터 기준입니다. 실제 자격과 규정은 바뀔 수 있으므로 각 상세페이지의 공식 출처를 신청 전에 확인하세요.</p>
    </article>
  </main>;
}
