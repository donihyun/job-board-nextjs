/* Hallmark · component: guided visa finder · genre: modern-minimal · design-system: design.md
 * states: default · hover · focus-visible · selected · disabled · results
 * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass · responsive: pass
 */
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { categoryKo, countryFlag, countryKo, durationKo, jobOfferKo, workScopeKo, type Visa, type VisaCategory } from "@/constants/visas";
import AdSlot from "@/components/ad-slot";

type Goal = "work" | "study" | "remote" | "business";
type Answers = { age: string; goal: Goal | ""; offer: "yes" | "no" | ""; stay: number | null; localWork: "yes" | "no" | "" };
type Status = "now" | "conditional" | "long";

const steps = ["여권", "나이", "목적", "잡오퍼", "체류기간", "근로방식"];
const goalCategories: Record<Goal, VisaCategory[]> = {
  work: ["Working holiday", "Job seeker", "Employer-sponsored", "Temporary work", "Graduate"],
  study: ["Student", "Graduate"],
  remote: ["Digital nomad"],
  business: ["Self-employed"],
};
const initialAnswers: Answers = { age: "", goal: "", offer: "", stay: null, localWork: "" };
const optionClass = "flex min-h-14 w-full items-center justify-between rounded-[var(--radius-input)] border-2 px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)]";
const localWorkAllowed = (visa: Visa) => ["Open", "Employer-specific", "Occupation-specific", "Limited hours"].includes(visa.work_scope);
const goalKo: Record<Goal, string> = { work: "해외 취업", study: "유학 후 취업", remote: "원격근무", business: "사업·프리랜서" };

function answersFromQuery(searchParams: { get: (name: string) => string | null }): Answers {
  const age = searchParams.get("age") || "";
  const goal = searchParams.get("goal");
  const offer = searchParams.get("offer");
  const stay = searchParams.get("stay");
  const localWork = searchParams.get("local");
  return {
    age: Number(age) >= 18 && Number(age) <= 80 ? age : "",
    goal: ["work", "study", "remote", "business"].includes(goal || "") ? goal as Goal : "",
    offer: offer === "yes" || offer === "no" ? offer : "",
    stay: ["0", "12", "24", "36"].includes(stay || "") ? Number(stay) : null,
    localWork: localWork === "yes" || localWork === "no" ? localWork : "",
  };
}

const hasCompleteAnswers = (answers: Answers) => Boolean(answers.age && answers.goal && answers.offer && answers.stay !== null && answers.localWork);

function classify(visa: Visa, answers: Answers): Status {
  const age = Number(answers.age);
  const ageFits = (visa.age_normalized.min_age === null || age >= visa.age_normalized.min_age)
    && (visa.age_normalized.max_age === null || age <= visa.age_normalized.max_age);
  const offerFits = answers.offer === "yes" || visa.job_offer_required === "No";
  const stayFits = answers.stay === null || visa.duration_normalized.max_months === null || visa.duration_normalized.max_months >= answers.stay;
  if (visa.korean_passport === "Eligible" && ageFits && offerFits && stayFits) return "now";
  if (visa.korean_passport !== "Ineligible" && ageFits && stayFits) return "conditional";
  return "long";
}

function reason(visa: Visa, answers: Answers, status: Status) {
  if (status === "now") return visa.job_offer_required === "No" ? "현재 입력 조건에서 잡오퍼 없이 검토 가능" : "현재 입력 조건과 기본 자격이 맞음";
  if (visa.korean_passport === "Ineligible") return "대한민국 여권 대상 여부를 다시 확인해야 함";
  if (answers.offer === "no" && visa.job_offer_required !== "No") return visa.job_offer_required === "Yes" ? "신청 전 잡오퍼가 필요함" : "경로에 따라 잡오퍼 조건이 달라짐";
  if (answers.stay !== null && visa.duration_normalized.max_months !== null && visa.duration_normalized.max_months < answers.stay) return "희망 체류기간보다 허용기간이 짧음";
  return "연령·세부 자격 또는 공식 조건 확인이 필요함";
}

export default function VisaFinder({ visas }: { visas: Visa[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryAnswers = answersFromQuery(searchParams);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(queryAnswers);
  const [complete, setComplete] = useState(hasCompleteAnswers(queryAnswers));

  const results = useMemo(() => {
    if (!answers.goal) return [];
    return visas
      .filter((visa) => goalCategories[answers.goal as Goal].includes(visa.category))
      .filter((visa) => answers.localWork !== "yes" || localWorkAllowed(visa))
      .map((visa) => ({ visa, status: classify(visa, answers) }))
      .sort((a, b) => ["now", "conditional", "long"].indexOf(a.status) - ["now", "conditional", "long"].indexOf(b.status));
  }, [answers, visas]);

  const canContinue = step === 0 || (step === 1 && Number(answers.age) >= 18 && Number(answers.age) <= 80)
    || (step === 2 && Boolean(answers.goal)) || (step === 3 && Boolean(answers.offer))
    || (step === 4 && answers.stay !== null) || (step === 5 && Boolean(answers.localWork));
  const select = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((current) => ({ ...current, [key]: value }));
  const showResults = () => {
    const params = new URLSearchParams({ age: answers.age, goal: answers.goal, offer: answers.offer, stay: String(answers.stay), local: answers.localWork });
    router.replace(`/visa-finder?${params}`);
    setComplete(true);
  };
  const restart = () => { setAnswers(initialAnswers); setStep(0); setComplete(false); router.replace("/visa-finder"); };

  return (
    <section className="mx-auto min-h-[calc(100vh-2rem)] w-full max-w-[920px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-control)] shadow-[var(--shadow-sheet)] sm:min-h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between border-b-2 border-[var(--color-filter-rule)] px-4 py-4 sm:px-7">
        <Link className="text-sm font-semibold tracking-[-0.01em]" href="/visachart">VisaChart</Link>
        <Link className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-2)] hover:text-[var(--color-ink)]" href="/visachart">전체 비자표 <ArrowUpRight className="h-3.5 w-3.5" /></Link>
      </header>

      {!complete ? (
        <div className="flex min-h-[calc(100vh-6.5rem)] flex-col">
          <div className="border-b border-[var(--color-rule)] px-4 py-4 sm:px-7">
            <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--color-ink-2)]"><span>질문 {step + 1} / {steps.length}</span><span>{steps[step]}</span></div>
            <div className="h-1 overflow-hidden bg-[var(--color-paper-2)]"><div className="h-full bg-[var(--color-selected)]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          </div>
          <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center px-5 py-10 sm:px-8">
            {step === 0 && <Question title="어떤 여권으로 신청하나요?" note="현재 데이터는 대한민국 여권 기준으로 분류되어 있습니다."><Option selected label="🇰🇷 대한민국 여권" /></Question>}
            {step === 1 && <Question title="현재 나이가 어떻게 되나요?" note="비자별 최소·최대 연령 조건을 대조합니다."><label className="block"><span className="sr-only">나이</span><input autoFocus className="h-16 w-full rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] bg-[var(--color-control)] px-5 text-2xl font-semibold outline outline-2 outline-transparent focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-1" max="80" min="18" onChange={(event) => select("age", event.target.value)} placeholder="예: 29" type="number" value={answers.age} /></label></Question>}
            {step === 2 && <Question title="해외에서 가장 먼저 하고 싶은 일은?" note="목적이 바뀌면 적합한 체류 경로도 달라집니다."><div className="grid gap-3 sm:grid-cols-2"><Option label="해외에서 취업하기" onClick={() => select("goal", "work")} selected={answers.goal === "work"} /><Option label="유학 후 취업하기" onClick={() => select("goal", "study")} selected={answers.goal === "study"} /><Option label="원격으로 일하기" onClick={() => select("goal", "remote")} selected={answers.goal === "remote"} /><Option label="사업·프리랜서 활동" onClick={() => select("goal", "business")} selected={answers.goal === "business"} /></div></Question>}
            {step === 3 && <Question title="현지 고용주의 잡오퍼가 있나요?" note="아직 없다면 잡오퍼가 필수인 경로는 조건부로 분리합니다."><div className="grid gap-3 sm:grid-cols-2"><Option label="아직 없음" onClick={() => select("offer", "no")} selected={answers.offer === "no"} /><Option label="이미 있음" onClick={() => select("offer", "yes")} selected={answers.offer === "yes"} /></div></Question>}
            {step === 4 && <Question title="최소 얼마나 머물고 싶나요?" note="공식 체류기간이 수치화되지 않은 경로는 제외하지 않습니다."><div className="grid gap-3 sm:grid-cols-2"><Option label="기간 상관없음" onClick={() => select("stay", 0)} selected={answers.stay === 0} /><Option label="1년 이상" onClick={() => select("stay", 12)} selected={answers.stay === 12} /><Option label="2년 이상" onClick={() => select("stay", 24)} selected={answers.stay === 24} /><Option label="3년 이상" onClick={() => select("stay", 36)} selected={answers.stay === 36} /></div></Question>}
            {step === 5 && <Question title="현지에서 직접 일해야 하나요?" note="아니오를 고르면 원격근무 전용 경로도 함께 검토합니다."><div className="grid gap-3 sm:grid-cols-2"><Option label="예, 현지 취업" onClick={() => select("localWork", "yes")} selected={answers.localWork === "yes"} /><Option label="아니오, 원격근무도 가능" onClick={() => select("localWork", "no")} selected={answers.localWork === "no"} /></div></Question>}
          </div>
          <footer className="flex items-center justify-between border-t-2 border-[var(--color-filter-rule)] px-4 py-4 sm:px-7">
            <button className="flex h-11 items-center gap-2 whitespace-nowrap px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)] disabled:invisible disabled:cursor-not-allowed disabled:opacity-55" disabled={step === 0} onClick={() => setStep((current) => current - 1)} type="button"><ArrowLeft className="h-4 w-4" /> 이전</button>
            <button className="flex h-11 items-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] bg-[var(--color-selected)] px-5 text-sm font-semibold text-[var(--color-selected-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-ink)] disabled:cursor-not-allowed disabled:bg-[var(--color-ink-2)] disabled:opacity-55" disabled={!canContinue} onClick={() => step === steps.length - 1 ? showResults() : setStep((current) => current + 1)} type="button">{step === steps.length - 1 ? "결과 보기" : "다음"} <ArrowRight className="h-4 w-4" /></button>
          </footer>
        </div>
      ) : <Results answers={answers} results={results} restart={restart} />}
    </section>
  );
}

function Question({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return <div className="min-w-0"><p className="mb-2 text-xs font-semibold text-[var(--color-accent)]">내 조건으로 찾기</p><h1 className="min-w-0 [overflow-wrap:anywhere] text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h1><p className="mb-8 mt-3 text-sm leading-6 text-[var(--color-ink-2)]">{note}</p>{children}</div>;
}

function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick?: () => void }) {
  return <button aria-pressed={selected} className={`${optionClass} ${selected ? "border-[var(--color-selected)] bg-[var(--color-selected)] text-[var(--color-selected-ink)]" : "border-[var(--color-filter-rule)] bg-[var(--color-control)] hover:bg-[var(--color-control-hover)]"}`} onClick={onClick} type="button"><span>{label}</span>{selected && <Check className="h-4 w-4" />}</button>;
}

function Results({ answers, results, restart }: { answers: Answers; results: { visa: Visa; status: Status }[]; restart: () => void }) {
  const finderAdSlot = process.env.NEXT_PUBLIC_ADSENSE_VISA_FINDER_SLOT;
  const [expanded, setExpanded] = useState<Status[]>([]);
  const [copied, setCopied] = useState(false);
  const groups: { status: Status; title: string; description: string }[] = [
    { status: "now", title: "지금 검토할 경로", description: "입력한 기본 조건과 구조화된 자격 데이터가 맞습니다." },
    { status: "conditional", title: "조건 확인이 필요한 경로", description: "잡오퍼 또는 개별 자격을 충족하면 가능한 경로입니다." },
    { status: "long", title: "장기 준비 경로", description: "현재 조건과 차이가 있어 우선순위가 낮은 경로입니다." },
  ];
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  return <div>
    <div className="border-b-2 border-[var(--color-filter-rule)] px-5 py-7 sm:px-8">
      <p className="text-xs font-semibold text-[var(--color-accent)]">검색 완료</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0"><h1 className="min-w-0 [overflow-wrap:anywhere] text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">검토할 비자 경로 {results.length}개</h1><p className="mt-2 text-sm text-[var(--color-ink-2)]">입력한 조건과 각 비자의 구조화된 요건을 대조했습니다.</p></div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 items-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] px-4 text-sm font-semibold hover:bg-[var(--color-control-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)]" onClick={copyLink} type="button"><Copy className="h-4 w-4" /> {copied ? "복사됨" : "결과 공유"}</button>
          <button className="flex h-10 items-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] border-2 border-[var(--color-filter-rule)] px-4 text-sm font-semibold hover:bg-[var(--color-control-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-active-surface)]" onClick={restart} type="button"><RotateCcw className="h-4 w-4" /> 다시 찾기</button>
        </div>
      </div>
      <dl className="mt-6 grid gap-px overflow-hidden border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["여권", "대한민국"],
          ["나이", `${answers.age}세`],
          ["목적", answers.goal ? goalKo[answers.goal] : "—"],
          ["잡오퍼", answers.offer === "yes" ? "있음" : "없음"],
          ["희망 체류", answers.stay === 0 ? "상관없음" : `${answers.stay! / 12}년 이상`],
          ["근로방식", answers.localWork === "yes" ? "현지 취업" : "원격 포함"],
        ].map(([label, value]) => <div className="bg-[var(--color-control)] px-3 py-3" key={label}><dt className="text-[11px] text-[var(--color-ink-2)]">{label}</dt><dd className="mt-1 text-xs font-semibold">{value}</dd></div>)}
      </dl>
    </div>
    <div className="px-5 py-6 sm:px-8">
      {groups.map((group) => {
        const items = results.filter((item) => item.status === group.status);
        if (!items.length) return null;
        const isExpanded = expanded.includes(group.status);
        const visibleItems = isExpanded ? items : items.slice(0, 8);
        return <Fragment key={group.status}><section className="mb-8">
          <div className="mb-3 border-b-2 border-[var(--color-selected)] pb-2"><h2 className="font-semibold">{group.title} <span className="ml-1 tabular-nums text-[var(--color-ink-2)]">{items.length}</span></h2><p className="mt-1 text-xs text-[var(--color-ink-2)]">{group.description}</p></div>
          <div className="divide-y divide-[var(--color-rule)] border-b border-[var(--color-rule)]">
            {visibleItems.map(({ visa, status }) => <Link className="group grid gap-2 py-4 hover:bg-[var(--color-control-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-3" href={`/visachart/${visa.slug}`} key={visa.slug}><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-base">{countryFlag(visa.country)}</span><span className="text-xs font-semibold text-[var(--color-ink-2)]">{countryKo[visa.country] || visa.country}</span><span className="text-xs text-[var(--color-ink-2)]">{categoryKo[visa.category]}</span></div><h3 className="mt-1 font-semibold group-hover:underline">{visa.visa_type}</h3><p className="mt-1 text-xs leading-5 text-[var(--color-ink-2)]"><strong className="font-semibold text-[var(--color-ink)]">{reason(visa, answers, status)}</strong> · {durationKo(visa)} · {workScopeKo[visa.work_scope]} · 잡오퍼 {jobOfferKo[visa.job_offer_required]}</p></div><ArrowUpRight className="hidden h-4 w-4 text-[var(--color-ink-2)] sm:block" /></Link>)}
          </div>
          {items.length > 8 && <button className="ml-auto mt-3 block whitespace-nowrap text-xs font-semibold text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" onClick={() => setExpanded((current) => isExpanded ? current.filter((status) => status !== group.status) : [...current, group.status])} type="button">{isExpanded ? "상위 8개만 보기" : `${items.length}개 모두 보기`}</button>}
        </section>{group.status === "now" && <AdSlot className="mb-8 mt-0" slot={finderAdSlot} />}</Fragment>;
      })}
      <p aria-live="polite" className="sr-only">{copied ? "결과 링크가 복사되었습니다." : ""}</p>
      <p className="border-t border-[var(--color-rule)] pt-4 text-xs leading-5 text-[var(--color-ink-2)]">이 결과는 경로 탐색용이며 비자 승인 가능성을 보장하지 않습니다. 신청 전 각 비자의 공식 안내와 최신 요건을 확인하세요.</p>
    </div>
  </div>;
}
