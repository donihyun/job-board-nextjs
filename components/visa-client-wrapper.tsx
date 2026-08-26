/* Hallmark · component: visa filters · genre: modern-minimal · design-system: design.md
 * states: default · hover · focus · active · disabled · loading · error · success
 * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass (40–41) · responsive: pass (49–53)
 */
"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ArrowUpRight, ChevronDown, Copy, GitCompare, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { categoryKo, countryFlag, countryKo, durationKo, eligibilityKo, prRelevanceKo, workScopeKo, jobOfferKo, visaValueKo, type Visa } from "@/constants/visas";
import AdSlot from "@/components/ad-slot";

type Props = { visas: Visa[] };

const selectClass =
  "h-11 w-full rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] bg-[var(--color-control)] px-3 text-sm font-medium text-[var(--color-ink)] outline outline-2 outline-transparent transition-colors hover:border-[var(--color-chart-rule-strong)] hover:bg-[var(--color-control-hover)] focus:border-[var(--color-accent)] focus:outline-[var(--color-focus)] focus:outline-offset-0 disabled:cursor-not-allowed disabled:border-[var(--color-rule)] disabled:bg-[var(--color-paper-2)] disabled:opacity-70";

const badgeClass = "inline-flex w-fit items-center whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold leading-none";
const categoryBadgeClass: Record<Visa["category"], string> = {
  "Working holiday": "bg-[var(--badge-working-bg)] text-[var(--badge-working-text)]",
  Student: "bg-[var(--badge-student-bg)] text-[var(--badge-student-text)]",
  Graduate: "bg-[var(--badge-graduate-bg)] text-[var(--badge-graduate-text)]",
  "Employer-sponsored": "bg-[var(--badge-sponsored-bg)] text-[var(--badge-sponsored-text)]",
  "Job seeker": "bg-[var(--badge-seeker-bg)] text-[var(--badge-seeker-text)]",
  "Digital nomad": "bg-[var(--badge-nomad-bg)] text-[var(--badge-nomad-text)]",
  "Self-employed": "bg-[var(--badge-self-bg)] text-[var(--badge-self-text)]",
  "Temporary work": "bg-[var(--badge-temporary-bg)] text-[var(--badge-temporary-text)]",
};

const localWorkAllowed = (visa: Visa) => ["Open", "Employer-specific", "Occupation-specific", "Limited hours"].includes(visa.work_scope);
const auditStatusKo = { Verified: "금액 확인됨", "Varies or not numeric": "변동·숫자 미공개", "Not published on source": "공식 페이지 미공개", "Fetch failed": "출처 접속 실패" } as const;

export default function VisaClientWrapper({ visas }: Props) {
  const chartAdSlot = process.env.NEXT_PUBLIC_ADSENSE_VISACHART_SLOT;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [country, setCountry] = useState(() => searchParams.get("country") || "all");
  const [category, setCategory] = useState(() => searchParams.get("category") || "all");
  const [duration, setDuration] = useState(() => searchParams.get("duration") || "all");
  const [korean, setKorean] = useState(() => searchParams.get("ko") === "1" ? "Eligible" : searchParams.get("ko") || "all");
  const [age, setAge] = useState(() => searchParams.get("age") || "");
  const [workHours, setWorkHours] = useState(() => searchParams.get("hours") || "all");
  const [funds, setFunds] = useState(() => searchParams.get("funds") || "all");
  const [processing, setProcessing] = useState(() => searchParams.get("processing") || "all");
  const [fee, setFee] = useState(() => searchParams.get("fee") || "all");
  const [offer, setOffer] = useState(() => searchParams.get("offer") || "all");
  const [pr, setPr] = useState(() => searchParams.get("pr") || "all");
  const [localWork, setLocalWork] = useState(() => searchParams.get("local") === "1");
  const [selected, setSelected] = useState<string[]>(() => (searchParams.get("compare") || "").split(",").filter((slug) => visas.some((visa) => visa.slug === slug)).slice(0, 3));
  const [compareOpen, setCompareOpen] = useState(() => selected.length >= 2);
  const [advancedOpen, setAdvancedOpen] = useState(() => ["duration", "hours", "funds", "processing", "fee", "pr", "local"].some((key) => searchParams.has(key)));
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderAge, setFinderAge] = useState("");
  const [finderOffer, setFinderOffer] = useState<"no" | "yes">("no");
  const [finderGoal, setFinderGoal] = useState<"all" | "work" | "study" | "remote">("all");

  const countries = useMemo(
    () => Array.from(new Set(visas.map((visa) => visa.country))).sort(),
    [visas],
  );
  const categories = useMemo(
    () => Array.from(new Set(visas.map((visa) => visa.category))).sort(),
    [visas],
  );
  const filteredResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visas.filter((visa) => {
      const matchesQuery = !needle || `${visa.country} ${countryKo[visa.country] || ""} ${visa.visa_type} ${categoryKo[visa.category]}`.toLowerCase().includes(needle);
      return (
        matchesQuery &&
        (country === "all" || visa.country === country) &&
        (category === "all" || visa.category === category) &&
        (duration === "all" || (duration === "unknown" ? visa.duration_normalized.max_months === null : visa.duration_normalized.max_months !== null && visa.duration_normalized.max_months <= Number(duration))) &&
        (korean === "all" || visa.korean_passport === korean) &&
        (!age || ((visa.age_normalized.min_age === null || Number(age) >= visa.age_normalized.min_age) && (visa.age_normalized.max_age === null || Number(age) <= visa.age_normalized.max_age))) &&
        (workHours === "all" || visa.work_hours_normalized.type === workHours) &&
        (funds === "all" || visa.financial_normalized.status === funds) &&
        (processing === "all" || visa.processing_normalized.status === processing) &&
        (fee === "all" || visa.application_fee_normalized.status === fee) &&
        (offer === "all" || visa.job_offer_required.toLowerCase() === offer) &&
        (pr === "all" || visa.pr_relevance === pr) &&
        (!localWork || localWorkAllowed(visa))
      );
    });
  }, [age, category, country, duration, fee, funds, korean, localWork, offer, pr, processing, query, visas, workHours]);

  const routeStatus = (visa: Visa) => {
    const applicantAge = Number(finderAge);
    const ageFits = !finderAge || ((visa.age_normalized.min_age === null || applicantAge >= visa.age_normalized.min_age) && (visa.age_normalized.max_age === null || applicantAge <= visa.age_normalized.max_age));
    const offerFits = finderOffer === "yes" || visa.job_offer_required === "No";
    if (visa.korean_passport === "Eligible" && ageFits && offerFits) return "now" as const;
    if (ageFits && visa.korean_passport !== "Ineligible") return "conditional" as const;
    return "long" as const;
  };
  const finderResults = visas
    .filter((visa) => finderGoal === "all"
      || (finderGoal === "work" && ["Working holiday", "Job seeker", "Employer-sponsored", "Temporary work", "Self-employed"].includes(visa.category))
      || (finderGoal === "study" && ["Student", "Graduate"].includes(visa.category))
      || (finderGoal === "remote" && visa.category === "Digital nomad"))
    .sort((a, b) => ({ now: 0, conditional: 1, long: 2 }[routeStatus(a)] - { now: 0, conditional: 1, long: 2 }[routeStatus(b)]));
  const results = finderOpen ? finderResults : filteredResults;
  const routeCounts = finderResults.reduce((counts, visa) => ({ ...counts, [routeStatus(visa)]: counts[routeStatus(visa)] + 1 }), { now: 0, conditional: 0, long: 0 });

  const selectedVisas = selected.map((slug) => visas.find((visa) => visa.slug === slug)).filter((visa): visa is Visa => Boolean(visa));
  const hasFilters = query || country !== "all" || category !== "all" || duration !== "all" || korean !== "all" || age || workHours !== "all" || funds !== "all" || processing !== "all" || fee !== "all" || offer !== "all" || pr !== "all" || localWork;
  const activeFilters = [
    query && { label: `검색: ${query}`, clear: () => setQuery("") },
    country !== "all" && { label: `국가: ${countryKo[country] || country}`, clear: () => setCountry("all") },
    category !== "all" && { label: `종류: ${categoryKo[category as Visa["category"]]}`, clear: () => setCategory("all") },
    korean !== "all" && { label: korean === "Eligible" ? "한국 여권 가능" : "한국 여권 조건부", clear: () => setKorean("all") },
    age && { label: `나이: ${age}세`, clear: () => setAge("") },
    offer !== "all" && { label: offer === "no" ? "잡오퍼 불필요" : "잡오퍼 필요", clear: () => setOffer("all") },
    duration !== "all" && { label: `체류: ${{ "12": "최대 1년", "24": "최대 2년", "36": "최대 3년", unknown: "기간 미정" }[duration]}`, clear: () => setDuration("all") },
    workHours !== "all" && { label: `근로시간: ${{ Unlimited: "제한 없음", Limited: "제한 있음", Conditional: "조건부" }[workHours]}`, clear: () => setWorkHours("all") },
    funds !== "all" && { label: funds === "Required" ? "재정금액 확인됨" : "재정금액 확인 필요", clear: () => setFunds("all") },
    processing !== "all" && { label: processing === "Known" ? "처리기간 확인됨" : "처리기간 확인 필요", clear: () => setProcessing("all") },
    fee !== "all" && { label: `수수료: ${auditStatusKo[fee as keyof typeof auditStatusKo]}`, clear: () => setFee("all") },
    pr !== "all" && { label: `영주권: ${prRelevanceKo[pr as Visa["pr_relevance"]]}`, clear: () => setPr("all") },
    localWork && { label: "현지취업 가능", clear: () => setLocalWork(false) },
  ].filter((item): item is { label: string; clear: () => void } => Boolean(item));
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (country !== "all") params.set("country", country);
    if (category !== "all") params.set("category", category);
    if (duration !== "all") params.set("duration", duration);
    if (korean !== "all") params.set("ko", korean);
    if (age) params.set("age", age);
    if (workHours !== "all") params.set("hours", workHours);
    if (funds !== "all") params.set("funds", funds);
    if (processing !== "all") params.set("processing", processing);
    if (fee !== "all") params.set("fee", fee);
    if (offer !== "all") params.set("offer", offer);
    if (pr !== "all") params.set("pr", pr);
    if (localWork) params.set("local", "1");
    if (selected.length) params.set("compare", selected.join(","));
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  }, [age, category, country, duration, fee, funds, korean, localWork, offer, pathname, pr, processing, query, router, selected, workHours]);
  const reset = () => {
    setQuery("");
    setCountry("all");
    setCategory("all");
    setDuration("all");
    setKorean("all");
    setAge("");
    setWorkHours("all");
    setFunds("all");
    setProcessing("all");
    setFee("all");
    setOffer("all");
    setPr("all");
    setLocalWork(false);
  };
  const toggleSelected = (slug: string) => setSelected((current) => current.includes(slug)
    ? current.filter((item) => item !== slug)
    : current.length < 3 ? [...current, slug] : current);
  const openVisa = (visa: Visa) => {
    router.push(`/visachart/${visa.slug}`);
  };

  return (
    <div className="pt-4 [&_button:focus-visible]:outline-[var(--color-focus)] [&_button:focus-visible]:outline-offset-1">
      <nav aria-label="VisaChart 보기 방식" className="mb-5 inline-flex rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] bg-[var(--color-control)] p-1">
        <button aria-current={!finderOpen ? "page" : undefined} className={`h-9 whitespace-nowrap rounded-[4px] border-2 px-4 text-sm font-semibold transition-colors ${!finderOpen ? "border-[var(--color-chart-selected)] bg-[var(--color-chart-selected)] text-[var(--color-chart-selected-ink)]" : "border-transparent text-[var(--color-ink-2)] hover:bg-[var(--color-control-hover)]"}`} onClick={() => setFinderOpen(false)} type="button">전체 비자 검색</button>
        <Link className="flex h-9 items-center whitespace-nowrap rounded-[4px] px-4 text-sm font-semibold text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-control-hover)]" href="/visa-finder">내 조건으로 찾기</Link>
      </nav>
      {finderOpen && <section aria-label="내 조건으로 비자 찾기" className="mb-5 overflow-hidden rounded-[var(--radius-card)] border-2 border-[var(--color-filter-rule)] bg-[var(--color-control)]">
        <header className="grid gap-2 border-b-2 border-[var(--color-filter-rule)] bg-[var(--color-filter-surface)] px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div><h2 className="text-lg font-semibold tracking-[-0.01em]">어떤 방식으로 해외에 나가고 싶나요?</h2><p className="mt-1 text-xs leading-5 text-[var(--color-ink-2)]">대한민국 여권 기준 · 불확실한 조건은 가능으로 단정하지 않습니다.</p></div>
          <span className="text-xs font-semibold text-[var(--color-ink-2)]">220개 경로 대조</span>
        </header>
        <div className="grid sm:grid-cols-4">
          <label className="border-b border-[var(--color-rule)] p-4 sm:border-b-0 sm:border-r"><span className="mb-3 block text-[11px] font-semibold text-[var(--color-ink-2)]">01 · 여권</span><select className={selectClass} disabled value="KR"><option value="KR">대한민국</option></select></label>
          <label className="border-b border-[var(--color-rule)] p-4 sm:border-b-0 sm:border-r"><span className="mb-3 block text-[11px] font-semibold text-[var(--color-ink-2)]">02 · 나이</span><input className={selectClass} min="0" onChange={(event) => setFinderAge(event.target.value)} placeholder="예: 29" type="number" value={finderAge} /></label>
          <label className="border-b border-[var(--color-rule)] p-4 sm:border-b-0 sm:border-r"><span className="mb-3 block text-[11px] font-semibold text-[var(--color-ink-2)]">03 · 현재 잡오퍼</span><select className={selectClass} onChange={(event) => setFinderOffer(event.target.value as "no" | "yes")} value={finderOffer}><option value="no">없음</option><option value="yes">있음</option></select></label>
          <label className="p-4"><span className="mb-3 block text-[11px] font-semibold text-[var(--color-ink-2)]">04 · 원하는 경로</span><select className={selectClass} onChange={(event) => setFinderGoal(event.target.value as typeof finderGoal)} value={finderGoal}><option value="all">전체 경로</option><option value="work">해외 취업</option><option value="study">유학 후 취업</option><option value="remote">원격근무</option></select></label>
        </div>
        <dl className="grid grid-cols-3 border-t border-[var(--color-rule)]">
          <div className="border-t-2 border-[var(--color-success-ink)] bg-[var(--color-success-surface)] px-3 py-3 text-[var(--color-success-ink)] sm:px-4"><dt className="text-[11px] font-semibold">지금 가능</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{routeCounts.now}</dd></div>
          <div className="border-x border-t-2 border-x-[var(--color-rule)] border-t-[var(--color-warning-ink)] bg-[var(--color-warning-surface)] px-3 py-3 text-[var(--color-warning-ink)] sm:px-4"><dt className="text-[11px] font-semibold">조건 충족 시</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{routeCounts.conditional}</dd></div>
          <div className="border-t-2 border-[var(--color-chart-rule-strong)] bg-[var(--color-control)] px-3 py-3 text-[var(--color-ink-2)] sm:px-4"><dt className="text-[11px] font-semibold">장기 경로</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{routeCounts.long}</dd></div>
        </dl>
      </section>}
      {!finderOpen && (
      <section aria-label="비자 검색 필터" className="overflow-hidden rounded-[var(--radius-card)] border-2 border-[var(--color-filter-rule)] bg-[var(--color-control)]">
        <div className="grid gap-2 bg-[var(--color-chart-filter)] p-3 md:grid-cols-[minmax(0,1.7fr)_repeat(2,minmax(0,1fr))]">
          <label className="relative min-w-0">
            <span className="sr-only">비자 검색</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-2)]" />
            <input
              className={`${selectClass} pl-10`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="국가 또는 비자 이름 검색"
              type="search"
              value={query}
            />
          </label>
          <label>
            <span className="sr-only">목적지</span>
            <select className={selectClass} onChange={(event) => setCountry(event.target.value)} value={country}>
              <option value="all">모든 국가</option>
              {countries.map((item) => <option key={item} value={item}>{countryKo[item] || item}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">비자 종류</span>
            <select className={selectClass} onChange={(event) => setCategory(event.target.value)} value={category}>
              <option value="all">모든 비자 종류</option>
              {categories.map((item) => <option key={item} value={item}>{categoryKo[item]}</option>)}
            </select>
          </label>
        </div>
        <div aria-label="기본 필터" className="flex flex-wrap items-center gap-2 border-t-2 border-[var(--color-filter-rule)] bg-[var(--color-control)] p-3">
          <label className="min-w-36">
            <span className="sr-only">한국 여권 자격</span>
            <select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setKorean(event.target.value)} value={korean}>
              <option value="all">한국 여권 전체</option>
              <option value="Eligible">한국 여권 가능</option>
              <option value="Conditional">한국 여권 조건부</option>
            </select>
          </label>
          <label className="w-28">
            <span className="sr-only">신청자 나이</span>
            <input className={`${selectClass} h-8 py-0 text-xs`} min="0" onChange={(event) => setAge(event.target.value)} placeholder="나이 입력" type="number" value={age} />
          </label>
          <label className="min-w-40">
            <span className="sr-only">비자 신청 시 잡오퍼 조건</span>
            <select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setOffer(event.target.value)} value={offer}>
              <option value="all">신청 시 잡오퍼 전체</option>
              <option value="no">신청 시 잡오퍼 불필요</option>
              <option value="yes">신청 시 잡오퍼 필요</option>
            </select>
          </label>
          <span aria-hidden="true" className="h-5 w-px bg-[var(--color-rule)]" />
          <button aria-expanded={advancedOpen} className="inline-flex h-8 items-center gap-1 whitespace-nowrap px-1 text-xs font-semibold text-[var(--color-ink-2)]" onClick={() => setAdvancedOpen((open) => !open)} type="button">
            {advancedOpen ? "세부 조건 닫기" : "세부 조건 더보기"} <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
          </button>
          <button className="h-8 whitespace-nowrap px-2 text-xs font-semibold text-[var(--color-ink-2)] disabled:cursor-not-allowed disabled:opacity-40" disabled={!hasFilters} onClick={reset} type="button">전체 초기화</button>
        </div>
        {advancedOpen && (
        <div aria-label="고급 필터" className="grid gap-2 border-t-2 border-[var(--color-filter-rule)] bg-[var(--color-advanced-surface)] p-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="min-w-36">
            <span className="sr-only">최대 체류기간</span>
            <select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setDuration(event.target.value)} value={duration}>
              <option value="all">모든 체류기간</option><option value="12">최대 1년</option><option value="24">최대 2년</option><option value="36">최대 3년</option><option value="unknown">기간 미정</option>
            </select>
          </label>
          <label className="min-w-36"><span className="sr-only">근로시간</span><select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setWorkHours(event.target.value)} value={workHours}><option value="all">근로시간 전체</option><option value="Unlimited">시간 제한 없음</option><option value="Limited">시간 제한 있음</option><option value="Conditional">근로시간 조건부</option></select></label>
          <label className="min-w-40"><span className="sr-only">재정증명</span><select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setFunds(event.target.value)} value={funds}><option value="all">재정증명 전체</option><option value="Required">금액 확인됨</option><option value="Unknown">금액 확인 필요</option></select></label>
          <label className="min-w-40"><span className="sr-only">신청 수수료</span><select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setFee(event.target.value)} value={fee}><option value="all">신청 수수료 전체</option><option value="Verified">수수료 확인됨</option><option value="Varies or not numeric">수수료 변동·숫자 미공개</option><option value="Not published on source">공식 페이지 미공개</option><option value="Fetch failed">출처 접속 실패</option></select></label>
          <label className="min-w-40"><span className="sr-only">처리기간</span><select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setProcessing(event.target.value)} value={processing}><option value="all">처리기간 전체</option><option value="Known">처리기간 확인됨</option><option value="Unknown">처리기간 확인 필요</option></select></label>
          <label className="min-w-48">
            <span className="sr-only">영주권 관련성</span>
            <select className={`${selectClass} h-8 py-0 text-xs`} onChange={(event) => setPr(event.target.value)} value={pr}>
              <option value="all">영주권 관련성 전체</option>
              <option value="Direct pathway">직접 전환 경로</option>
              <option value="Residence counts">체류연수 산입</option>
              <option value="Residence partly counts">체류연수 일부 산입</option>
              <option value="Work experience">취업경력 요건에 산입</option>
              <option value="Long residence">장기체류 요건에 산입</option>
              <option value="Does not count">일반적으로 미산입</option>
            </select>
          </label>
          {[
            ["현지취업 가능", localWork, () => setLocalWork(!localWork)],
          ].map(([label, active, onClick]) => (
            <button aria-pressed={Boolean(active)} className={`h-8 whitespace-nowrap rounded-[var(--radius-input)] border-2 px-3 text-xs font-semibold ${active ? "border-[var(--color-chart-selected)] bg-[var(--color-chart-selected)] text-[var(--color-chart-selected-ink)]" : "border-[var(--color-filter-rule)] bg-[var(--color-control)] text-[var(--color-ink-2)] hover:bg-[var(--color-control-hover)]"}`} key={String(label)} onClick={onClick as () => void} type="button">{String(label)}</button>
          ))}
        </div>
        )}
        {activeFilters.length > 0 && (
          <div aria-label="적용된 필터" className="flex flex-wrap items-center gap-1.5 border-t-2 border-[var(--color-chart-yellow-ink)] bg-[var(--color-chart-yellow)] p-3">
            <span className="mr-1 text-xs font-semibold text-[var(--color-ink-2)]">적용 {activeFilters.length}</span>
            {activeFilters.map((filter) => <button aria-label={`${filter.label} 해제`} className="inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-[var(--radius-input)] border border-[var(--color-chart-rule-strong)] bg-[var(--color-control)] px-2 text-xs font-semibold text-[var(--color-chart-selected-ink)] hover:border-[var(--color-accent)] hover:bg-[var(--color-chart-selected)]" key={filter.label} onClick={filter.clear} type="button">{filter.label}<X aria-hidden="true" className="h-3 w-3" /></button>)}
          </div>
        )}
      </section>
      )}

      <div className="flex items-center justify-between gap-4 py-3">
        <p aria-live="polite" className="text-sm text-[var(--color-ink-2)]">
          <strong className="text-[var(--color-ink)]">{results.length}</strong>개 비자
        </p>
        <p className="text-xs text-[var(--color-ink-2)]">공식 출처 기반 · 신청 전 최신 규정 확인</p>
      </div>

      <div className="hidden overflow-hidden border-y border-t-4 border-[var(--color-rule)] border-t-[var(--color-chart-selected)] md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-[var(--color-paper-2)] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-2)]">
            <tr>
              <th className="w-[5%] px-2 py-2.5 text-center">비교</th>
              <th className="w-[17%] px-3 py-2.5">국가</th>
              <th className="w-[23%] px-3 py-2.5">비자</th>
              <th className="w-[16%] px-3 py-2.5">카테고리</th>
              <th className="w-[16%] px-3 py-2.5">체류기간</th>
              <th className="w-[15%] px-3 py-2.5">근로범위</th>
              <th className="w-[9%] px-3 py-2.5 text-right">{finderOpen ? "판정" : "상세"}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((visa, index) => (
              <Fragment key={visa.slug}>
              <tr
                aria-label={`${visa.visa_type} 상세 보기`}
                className="group cursor-pointer border-t border-[var(--color-rule)] first:border-t-0 hover:bg-[var(--color-paper-2)]"
                onClick={() => openVisa(visa)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openVisa(visa);
                  }
                }}
                role="link"
                tabIndex={0}
              >
                <td className="px-2 py-2.5 text-center" onClick={(event) => event.stopPropagation()}>
                  <input aria-label={`${visa.visa_type} 비교 선택`} checked={selected.includes(visa.slug)} disabled={!selected.includes(visa.slug) && selected.length >= 3} onChange={() => toggleSelected(visa.slug)} type="checkbox" />
                </td>
                <td className="px-3 py-2.5 text-sm font-medium">
                  <span className="flex items-center gap-2"><span aria-hidden="true" className="text-xl leading-none">{countryFlag(visa.country)}</span>{countryKo[visa.country] || visa.country}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="block text-sm font-medium leading-5">{visa.visa_type}</span>
                </td>
                <td className="px-3 py-2.5"><span className={`${badgeClass} ${categoryBadgeClass[visa.category]}`}>{categoryKo[visa.category]}</span></td>
                <td className="px-3 py-2.5 text-xs text-[var(--color-ink-2)]">{durationKo(visa)}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--color-ink-2)]">{workScopeKo[visa.work_scope]}</td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold ${finderOpen ? routeStatus(visa) === "now" ? "text-[var(--color-accent)]" : routeStatus(visa) === "conditional" ? "text-[var(--color-ink)]" : "text-[var(--color-ink-2)]" : "text-[var(--color-accent)] group-hover:underline"}`}>
                    {finderOpen ? ({ now: "지금 가능", conditional: "조건부", long: "장기 경로" } as const)[routeStatus(visa)] : "상세"} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </td>
              </tr>
              {index === 7 && (
                <tr>
                  <td className="border-t-2 border-[var(--color-rule)] px-4" colSpan={7}>
                    <AdSlot className="my-4" slot={chartAdSlot} />
                  </td>
                </tr>
              )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {results.map((visa, index) => (
          <Fragment key={visa.slug}>
          <Link
            className="block rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-4 active:bg-[var(--color-paper-2)]"
            href={`/visachart/${visa.slug}`}
          >
            <div className="mb-3 flex items-center justify-end" onClick={(event) => event.preventDefault()}>
              <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink-2)]" onClick={(event) => event.stopPropagation()}>
                <input checked={selected.includes(visa.slug)} disabled={!selected.includes(visa.slug) && selected.length >= 3} onChange={() => toggleSelected(visa.slug)} type="checkbox" /> 비교
              </label>
            </div>
            <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]"><span aria-hidden="true" className="text-lg leading-none">{countryFlag(visa.country)}</span>{countryKo[visa.country] || visa.country}</p>
                <h2 className="mt-1 text-lg font-semibold leading-6">{visa.visa_type}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2"><span className={`${badgeClass} ${categoryBadgeClass[visa.category]}`}>{categoryKo[visa.category]}</span>{finderOpen && <span className={`${badgeClass} border border-[var(--color-rule)]`}>{({ now: "지금 가능", conditional: "조건부", long: "장기 경로" } as const)[routeStatus(visa)]}</span>}</div>
              </div>
              <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" />
            </div>
            <dl className="grid grid-cols-2 gap-3 border-t border-[var(--color-rule)] pt-3 text-sm">
              <div><dt className="text-xs text-[var(--color-ink-2)]">종류</dt><dd className="mt-1">{categoryKo[visa.category]}</dd></div>
              <div><dt className="text-xs text-[var(--color-ink-2)]">체류기간</dt><dd className="mt-1">{durationKo(visa)}</dd></div>
              <div><dt className="text-xs text-[var(--color-ink-2)]">근로범위</dt><dd className="mt-1">{workScopeKo[visa.work_scope]}</dd></div>
              <div><dt className="text-xs text-[var(--color-ink-2)]">신청 시 잡오퍼</dt><dd className="mt-1">{jobOfferKo[visa.job_offer_required]}</dd></div>
            </dl>
          </Link>
          {index === 7 && <AdSlot className="my-1" slot={chartAdSlot} />}
          </Fragment>
        ))}
      </div>

      {results.length === 0 && (
        <div className="border-y border-[var(--color-rule)] py-16 text-center">
          <h2 className="text-xl font-semibold">조건에 맞는 비자가 없습니다</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-2)]">다른 국가, 종류 또는 검색어를 선택해보세요.</p>
          <button className="mt-5 whitespace-nowrap text-sm font-semibold text-[var(--color-accent)] underline" onClick={reset} type="button">필터 초기화</button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-rule)] bg-[var(--color-paper)]/95 px-4 py-3 shadow-lg backdrop-blur">
          <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3">
            <p className="text-sm font-semibold">비교 선택 {selected.length}/3</p>
            <div className="flex items-center gap-2">
              <button className="h-9 whitespace-nowrap px-3 text-xs font-semibold text-[var(--color-ink-2)]" onClick={() => setSelected([])} type="button">선택 해제</button>
              <button className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] bg-[var(--color-accent)] px-4 text-xs font-semibold text-[var(--color-accent-ink)] disabled:opacity-45" disabled={selected.length < 2} onClick={() => setCompareOpen(true)} type="button"><GitCompare className="h-4 w-4" /> 선택한 비자 비교</button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && selectedVisas.length >= 2 && (
        <div aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto bg-[var(--color-ink)]/45 p-3 sm:p-6" role="dialog">
          <section className="mx-auto max-w-5xl rounded-[var(--radius-card)] bg-[var(--color-paper)] p-4 shadow-xl sm:p-6">
            <header className="flex items-center justify-between gap-4 border-b border-[var(--color-rule)] pb-4">
              <div><p className="text-xs font-semibold text-[var(--color-accent)]">VisaChart</p><h2 className="mt-1 text-2xl font-semibold">선택한 비자 비교</h2></div>
              <button aria-label="비교 닫기" className="p-2" onClick={() => setCompareOpen(false)} type="button"><X className="h-5 w-5" /></button>
            </header>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] table-fixed border-collapse text-left text-sm">
                <thead><tr><th className="w-36 border-b border-[var(--color-rule)] p-3">항목</th>{selectedVisas.map((visa) => <th className="border-b border-[var(--color-rule)] p-3" key={visa.slug}><span className="block text-lg">{countryFlag(visa.country)} {countryKo[visa.country] || visa.country}</span><span className="mt-1 block font-medium">{visa.visa_type}</span></th>)}</tr></thead>
                <tbody>{[
                  ["카테고리", (visa: Visa) => categoryKo[visa.category]],
                  ["체류기간", (visa: Visa) => durationKo(visa)],
                  ["근로범위", (visa: Visa) => workScopeKo[visa.work_scope]],
                  ["신청 시 잡오퍼", (visa: Visa) => jobOfferKo[visa.job_offer_required]],
                  ["잡오퍼 조건", (visa: Visa) => visa.job_offer_note],
                  ["영주권 관련성", (visa: Visa) => prRelevanceKo[visa.pr_relevance]],
                  ["영주권 반영 조건", (visa: Visa) => visa.pr_relevance_note],
                  ["연령", (visa: Visa) => visaValueKo(visa.age_range)],
                  ["한국 여권", (visa: Visa) => eligibilityKo[visa.korean_passport]],
                  ["연령 범위", (visa: Visa) => visaValueKo(visa.age_range)],
                  ["근로시간", (visa: Visa) => visa.work_hours_normalized.type === "Unlimited" ? "시간 제한 없음" : visa.work_hours_normalized.max_hours_per_week ? `주 ${visa.work_hours_normalized.max_hours_per_week}시간` : "조건 확인"],
                  ["재정증명", (visa: Visa) => visa.financial_normalized.amount ? `${visa.financial_normalized.currency} ${visa.financial_normalized.amount.toLocaleString()}${visa.financial_normalized.period === "Monthly" ? "/월" : ""}` : "금액 확인 필요"],
                  ["처리기간", (visa: Visa) => visa.processing_normalized.max_days ? `최대 ${visa.processing_normalized.max_days}일` : "확인 필요"],
                  ["신청 수수료", (visa: Visa) => visa.application_fee_normalized.amount ? `${visa.application_fee_normalized.currency} ${visa.application_fee_normalized.amount.toLocaleString()}` : auditStatusKo[visa.application_fee_normalized.status]],
                ].map(([label, value]) => <tr key={String(label)}><th className="border-b border-[var(--color-rule)] p-3 text-[var(--color-ink-2)]">{String(label)}</th>{selectedVisas.map((visa) => <td className="border-b border-[var(--color-rule)] p-3" key={visa.slug}>{(value as (visa: Visa) => string)(visa)}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <footer className="mt-5 flex flex-wrap justify-end gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-rule)] px-4 text-sm font-semibold" onClick={() => navigator.clipboard.writeText(window.location.href)} type="button"><Copy className="h-4 w-4" /> 비교 링크 복사</button>
              <button className="h-10 rounded-[var(--radius-input)] bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--color-paper)]" onClick={() => setCompareOpen(false)} type="button">닫기</button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
