/* Hallmark · genre: modern-minimal · macrostructure: Long Document · design-system: design.md · designed-as-app
 * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass · responsive: pass
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import AdSlot from "@/components/ad-slot";
import { workingHolidayJobs } from "@/constants/jobs";
import { categoryCautionsKo, countryFlag, countryKo, durationKo, eligibilityKo, jobOfferKo, prRelevanceKo, visaValueKo, workScopeKo, type Visa } from "@/constants/visas";

export default function CountryGuide({ routeKey, visa, heroImage }: { routeKey: string; visa: Visa; heroImage?: string | null }) {
  const jobs = workingHolidayJobs.find((item) => item.country === routeKey)?.jobList || [];
  const countryName = countryKo[visa.country] || visa.country;
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_COUNTRY_SLOT;
  const facts = [
    ["체류기간", durationKo(visa)],
    ["신청 연령", visaValueKo(visa.age_range)],
    ["한국 여권", eligibilityKo[visa.korean_passport]],
    ["잡오퍼", jobOfferKo[visa.job_offer_required]],
    ["근로범위", workScopeKo[visa.work_scope]],
    ["영주권 관련성", prRelevanceKo[visa.pr_relevance]],
  ];

  return <main className="bg-[var(--color-paper)] text-[var(--color-ink)]">
    <article className="mx-auto w-full max-w-[1180px] bg-[var(--color-control)] pb-16 shadow-[var(--shadow-sheet)] sm:my-8 sm:rounded-[var(--radius-card)]">
      <header className="relative min-h-[420px] overflow-hidden bg-[var(--color-canvas-dark)] sm:rounded-t-[var(--radius-card)]">
        {heroImage !== null && <Image alt={`${countryName} 워킹홀리데이`} className="object-cover" fill priority sizes="(max-width: 1180px) 100vw, 1180px" src={heroImage || `/${routeKey}/bg.jpg`} />}
        {heroImage !== null && <div className="absolute inset-0 bg-[var(--color-canvas-dark)] opacity-60" />}
        <div className="relative flex min-h-[420px] flex-col justify-end px-5 pb-8 text-[var(--color-selected-ink)] sm:px-8 sm:pb-10 lg:px-12">
          <p className="text-xs font-semibold">{countryFlag(visa.country)} 대한민국 여권 기준</p>
          <h1 className="mt-2 min-w-0 max-w-3xl [overflow-wrap:anywhere] text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">{countryName} 워킹홀리데이</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-selected-ink)]">비자 조건을 확인하고, 실제 채용공고에서 원하는 직종과 도시를 검색하세요.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" href={`/jobs?country=${routeKey}`}>일자리 검색 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            <Link className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] border-2 border-[var(--color-selected-ink)] px-5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" href={`/visachart/${visa.slug}`}>비자 상세 <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      <section aria-label="비자 핵심 조건" className="border-b-2 border-[var(--color-filter-rule)] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold text-[var(--color-accent)]">비자 핵심 조건</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">한눈에 확인하기</h2></div><p className="hidden text-xs text-[var(--color-ink-2)] sm:block">마지막 확인 {visa.last_verified}</p></div>
        <dl className="grid gap-px overflow-hidden border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">{facts.map(([label, value]) => <div className="bg-[var(--color-control)] p-4" key={label}><dt className="text-xs text-[var(--color-ink-2)]">{label}</dt><dd className="mt-2 text-sm font-semibold leading-6">{value}</dd></div>)}</dl>
        <p className="mt-3 text-xs leading-5 text-[var(--color-ink-2)]">규정은 변경될 수 있습니다. 신청 전 {countryName} 정부 공식 페이지에서 최신 요건을 다시 확인하세요.</p>
      </section>

      <div className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-12">
        <div className="min-w-0 space-y-12">
          <section>
            <p className="text-xs font-semibold text-[var(--color-accent)]">일자리 탐색</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">많이 찾는 직종부터 검색</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-ink-2)]">직종을 선택하면 {countryName} 채용공고 검색 결과로 이동합니다. 급여와 채용 수는 공고마다 다르므로 검색 결과에서 직접 확인하세요.</p>
            {jobs.length ? <div className="mt-6 grid gap-px overflow-hidden border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">{jobs.map((job) => <Link className="group grid min-w-0 grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-3 bg-[var(--color-control)] p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href={`/jobs?country=${routeKey}&category=${encodeURIComponent(job.keyword.toLowerCase())}`} key={job.keyword}><div className="relative h-16 overflow-hidden"><Image alt="" aria-hidden="true" className="object-cover" fill sizes="80px" src={job.src} /></div><div className="min-w-0"><h3 className="font-semibold group-hover:underline">{job.name}</h3><p className="mt-1 text-xs text-[var(--color-ink-2)]">현재 공고 보기</p></div><ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--color-ink-2)]" /></Link>)}</div> : <div className="mt-6 border-y-2 border-[var(--color-filter-rule)] bg-[var(--color-filter-surface)] px-4 py-6"><p className="text-sm font-semibold">직종별 분류를 준비하고 있습니다.</p><p className="mt-2 text-xs leading-5 text-[var(--color-ink-2)]">현재 등록된 전체 채용공고는 아래 검색에서 먼저 확인할 수 있습니다.</p></div>}
            <Link className="mt-4 inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[var(--color-accent)]" href={`/jobs?country=${routeKey}`}>{countryName} 전체 일자리 보기 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </section>

          <AdSlot slot={adSlot} />

          <section className="border-t-2 border-[var(--color-filter-rule)] pt-8">
            <p className="text-xs font-semibold text-[var(--color-accent)]">신청 전 확인</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">공식 조건에서 놓치면 안 되는 것</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink-2)]">{visa.application_process_ko || `유효한 대한민국 여권과 국적별 요구 서류를 준비하고, 재정·건강보험 등 현재 요건을 확인한 뒤 ${countryName} 정부의 공식 온라인 절차에 따라 신청하세요.`}</p>
            <ul className="mt-6 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">{(visa.restrictions_ko || categoryCautionsKo[visa.category]).map((item) => <li className="flex gap-3 py-4 text-sm leading-6" key={item}><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" /><span>{item}</span></li>)}</ul>
          </section>
        </div>

        <aside className="h-fit border-t-2 border-[var(--color-selected)] pt-5 lg:sticky lg:top-24">
          <p className="text-xs font-semibold text-[var(--color-ink-2)]">현재 확인 중인 비자</p><h2 className="mt-2 font-semibold leading-6">{visa.visa_type}</h2><p className="mt-3 text-xs leading-5 text-[var(--color-ink-2)]">공식 출처 기반 정보 제공용 안내이며 승인 가능성을 보장하지 않습니다.</p>
          <a className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" href={visa.official_link} rel="noopener noreferrer" target="_blank">정부 공식 페이지 <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
          <Link className="mt-3 inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href="/visa-finder">내 조건으로 다시 찾기</Link>
        </aside>
      </div>
    </article>
  </main>;
}
