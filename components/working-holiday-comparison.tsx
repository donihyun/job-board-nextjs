/* Hallmark · component: working-holiday comparison · genre: modern-minimal · design-system: design.md
 * states: default · hover · focus-visible · active · filtered · empty
 * pre-emit critique: P5 H5 E5 S5 R5 V4 · contrast: pass · responsive: pass
 */
"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { countryFlag, countryKo, durationKo, visaValueKo, type Visa } from "@/constants/visas";

const routeOverrides: Record<string, string> = { "United Kingdom": "uk", "New Zealand": "newzealand", Czechia: "czeckia", "Hong Kong": "hong-kong" };
const routeFor = (country: string) => routeOverrides[country] || country.toLowerCase().replaceAll(" ", "-");
const quotas: Record<string, string> = { Netherlands: "200", "New Zealand": "3,000", Taiwan: "800", Latvia: "100", Luxembourg: "100", Belgium: "200", Spain: "1,000", Argentina: "200", Ireland: "800", Andorra: "50", "United Kingdom": "5,000", Austria: "300", Israel: "200", Italy: "500", Japan: "10,000", Czechia: "300", Canada: "10,000", Portugal: "200", Poland: "200", France: "2,000", Hungary: "100", "Hong Kong": "1,000", Brazil: "300" };
const unlimitedQuota = new Set(["Australia", "Chile", "Denmark", "Germany", "Sweden"]);
const quotaFor = (visa: Visa) => {
  if (quotas[visa.country]) return { type: "limited", label: `${quotas[visa.country]}명` } as const;
  if (unlimitedQuota.has(visa.country)) return { type: "unlimited", label: "제한 없음" } as const;
  return { type: "check", label: "공고 확인" } as const;
};
const workLimitFor = (visa: Visa) => {
  const text = visa.restrictions.join(" ");
  const match = text.match(/(?:one employer|Employment) is limited to (\d+) months/i);
  return match ? { type: "limited", label: `${match[1]}개월 제한` } as const : { type: "unlimited", label: "협정상 제한 없음" } as const;
};

export default function WorkingHolidayComparison({ visas }: { visas: Visa[] }) {
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("");
  const [quota, setQuota] = useState("all");
  const [workLimit, setWorkLimit] = useState("all");
  const rows = useMemo(() => visas.map((visa) => ({ visa, quota: quotaFor(visa), workLimit: workLimitFor(visa) })).filter(({ visa, quota: quotaInfo, workLimit: limit }) => {
    const name = `${visa.country} ${countryKo[visa.country] || ""}`.toLowerCase();
    const ageNumber = Number(age);
    const ageFits = !age || ((visa.age_normalized.min_age === null || ageNumber >= visa.age_normalized.min_age) && (visa.age_normalized.max_age === null || ageNumber <= visa.age_normalized.max_age));
    return name.includes(query.trim().toLowerCase()) && ageFits && (quota === "all" || quotaInfo.type === quota) && (workLimit === "all" || limit.type === workLimit);
  }).sort((a, b) => (countryKo[a.visa.country] || a.visa.country).localeCompare(countryKo[b.visa.country] || b.visa.country, "ko")), [age, query, quota, visas, workLimit]);
  const hasFilters = Boolean(query || age || quota !== "all" || workLimit !== "all");
  const reset = () => { setQuery(""); setAge(""); setQuota("all"); setWorkLimit("all"); };
  const control = "h-11 w-full rounded-[var(--radius-input)] border border-[var(--color-filter-rule)] bg-[var(--color-control)] px-3 text-sm outline outline-2 outline-transparent hover:bg-[var(--color-control-hover)] focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-1 active:bg-[var(--color-active-surface)] disabled:cursor-not-allowed disabled:opacity-55";

  return <section aria-label="워킹홀리데이 국가 비교">
    <div className="border-y-2 border-[var(--color-filter-rule)] bg-[var(--color-filter-surface)] p-3">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))_auto]">
        <label className="relative min-w-0"><span className="sr-only">국가 검색</span><Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-2)]" /><input className={`${control} pl-10`} onChange={(event) => setQuery(event.target.value)} placeholder="국가 검색" type="search" value={query} /></label>
        <label><span className="sr-only">현재 나이</span><input className={control} min="18" onChange={(event) => setAge(event.target.value)} placeholder="나이 입력" type="number" value={age} /></label>
        <label><span className="sr-only">연간 모집인원</span><select className={control} onChange={(event) => setQuota(event.target.value)} value={quota}><option value="all">모든 쿼터</option><option value="limited">연간 쿼터 있음</option><option value="unlimited">쿼터 제한 없음</option><option value="check">공고 확인 필요</option></select></label>
        <label><span className="sr-only">고용기간 제한</span><select className={control} onChange={(event) => setWorkLimit(event.target.value)} value={workLimit}><option value="all">취업 제한 전체</option><option value="limited">기간 제한 있음</option><option value="unlimited">협정상 제한 없음</option></select></label>
        <button className="h-11 whitespace-nowrap px-3 text-sm font-semibold text-[var(--color-ink-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)] disabled:cursor-not-allowed disabled:opacity-40" disabled={!hasFilters} onClick={reset} type="button">초기화</button>
      </div>
    </div>

    <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-4 py-3 text-xs text-[var(--color-ink-2)] sm:px-6"><span><strong className="font-semibold text-[var(--color-ink)]">{rows.length}</strong>개 국가·지역</span><span>대한민국 여권 기준</span></div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] border-collapse text-left text-sm">
        <thead className="bg-[var(--color-control)] text-xs text-[var(--color-ink-2)]"><tr className="border-b-2 border-[var(--color-filter-rule)]"><th className="px-4 py-3 font-semibold sm:px-6">국가</th><th className="px-4 py-3 font-semibold">신청 연령</th><th className="px-4 py-3 font-semibold">체류기간</th><th className="px-4 py-3 font-semibold">연간 쿼터</th><th className="px-4 py-3 font-semibold">고용기간</th><th className="px-4 py-3"><span className="sr-only">상세</span></th></tr></thead>
        <tbody className="divide-y divide-[var(--color-rule)]">{rows.map(({ visa, quota: quotaInfo, workLimit: limit }) => <tr className="group hover:bg-[var(--color-control-hover)]" key={visa.slug}><td className="px-4 py-4 sm:px-6"><Link className="inline-flex items-center gap-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href={`/${routeFor(visa.country)}`}><span className="text-lg">{countryFlag(visa.country)}</span><span>{countryKo[visa.country] || visa.country}</span></Link></td><td className="px-4 py-4 tabular-nums">{visaValueKo(visa.age_range)}</td><td className="px-4 py-4">{durationKo(visa)}</td><td className="px-4 py-4">{quotaInfo.label}</td><td className="px-4 py-4">{limit.label}</td><td className="px-4 py-4 text-right"><Link aria-label={`${countryKo[visa.country] || visa.country} 상세 보기`} className="inline-flex h-9 w-9 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)]" href={`/${routeFor(visa.country)}`}><ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--color-ink-2)]" /></Link></td></tr>)}</tbody>
      </table>
    </div>
    {!rows.length && <div className="px-5 py-14 text-center"><p className="font-semibold">조건에 맞는 국가가 없습니다.</p><p className="mt-2 text-sm text-[var(--color-ink-2)]">나이 또는 쿼터 조건을 바꿔 다시 확인하세요.</p><button className="mt-5 h-10 rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)]" onClick={reset} type="button">필터 초기화</button></div>}
  </section>;
}
