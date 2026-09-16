import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@sanity/client";
import { categoryCautionsKo, categoryKo, countryKo, durationKo, eligibilityKo, jobOfferKo, prRelevanceKo, visaValueKo, workScopeKo } from "@/constants/visas";
import type { Visa } from "@/constants/visas";
import AdSlot from "@/components/ad-slot";

type Props = { params: { slug: string } };

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2024-01-01',
});

async function getVisaBySlug(slug: string): Promise<Visa | null> {
  const visa = await sanityClient.fetch<Visa | null>(
    `*[_type == "visa" && slug.current == $slug][0] {
      country,
      visa_type,
      category,
      duration,
      duration_normalized,
      processing_time,
      application_process,
      official_link,
      family_allowed,
      financial_proof_required,
      work_scope,
      job_offer_required,
      job_offer_note,
      pr_relevance,
      pr_relevance_note,
      eligible_passports,
      age_range,
      age_normalized,
      korean_passport,
      work_hours_normalized,
      financial_normalized,
      processing_normalized,
      application_fee_normalized,
      metadata_audit,
      restrictions,
      last_verified,
      source_status,
      "slug": slug.current,
      is_temporary,
      detail_available,
      application_process_ko,
      restrictions_ko
    }`,
    { slug },
    {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    }
  );

  return visa;
}

async function getAllVisaSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(
    `*[_type == "visa"].slug.current`,
    {},
    {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    }
  );

  return slugs;
}

export async function generateStaticParams() {
  const slugs = await getAllVisaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const visa = await getVisaBySlug(params.slug);
  if (!visa) return {};
  return {
    title: `${visa.country} ${visa.visa_type} — VisaChart`,
    description: `${countryKo[visa.country] || visa.country} ${visa.visa_type}의 체류기간, 근로조건과 공식 출처를 확인하세요.`,
  };
}

export default async function VisaDetailPage({ params }: Props) {
  const visa = await getVisaBySlug(params.slug);
  if (!visa) notFound();

  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <article className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-10">
        <Link className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[var(--color-accent)]" href="/visachart">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> 비자 차트
        </Link>

        <header className="border-b border-[var(--color-rule)] pb-8 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">{countryKo[visa.country] || visa.country} · {categoryKo[visa.category]}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">{visa.visa_type}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--color-ink-2)]">
            공식 출처를 바탕으로 정리한 초기 안내입니다. 규정은 바뀔 수 있으므로 신청 전 반드시 최신 공식 요건을 다시 확인하세요.
          </p>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold">한눈에 보기</h2>
              <dl className="mt-5 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
                {[
                  ["체류기간", durationKo(visa)],
                  ["처리기간", visaValueKo(visa.processing_time)],
                  ["근로범위", workScopeKo[visa.work_scope]],
                  ["신청 시 잡오퍼", jobOfferKo[visa.job_offer_required]],
                  ["영주권 관련성", prRelevanceKo[visa.pr_relevance]],
                  ["연령 기준", visaValueKo(visa.age_range)],
                  ["한국 여권", eligibilityKo[visa.korean_passport]],
                  ["근로시간", visa.work_hours_normalized.type === "Unlimited" ? "시간 제한 없음" : visa.work_hours_normalized.max_hours_per_week ? `주 ${visa.work_hours_normalized.max_hours_per_week}시간` : "조건 확인"],
                  ["대상", visaValueKo(visa.eligible_passports)],
                  ["동반가족", visaValueKo(visa.family_allowed)],
                  ["재정증명", visaValueKo(visa.financial_proof_required)],
                  ["신청 수수료", visa.application_fee_normalized.amount ? `${visa.application_fee_normalized.currency} ${visa.application_fee_normalized.amount.toLocaleString()}` : "공식 페이지에서 금액 확인"],
                ].map(([label, value]) => (
                  <div className="bg-[var(--color-paper)] p-4" key={label}>
                    <dt className="text-xs text-[var(--color-ink-2)]">{label}</dt>
                    <dd className="mt-2 text-sm font-medium leading-6">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-5 text-[var(--color-ink-2)]">잡오퍼 조건: {visa.job_offer_note}</p>
              <p className="mt-3 text-xs leading-5 text-[var(--color-ink-2)]">영주권 관련성: {visa.pr_relevance_note}</p>
            </section>

            <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_VISA_DETAIL_TOP_SLOT} />

            <section className="border-t border-[var(--color-rule)] pt-8">
              <h2 className="text-2xl font-semibold">신청 개요</h2>
              <p className="mt-4 max-w-3xl leading-7 text-[var(--color-ink-2)]">
                {visa.application_process_ko || `${countryKo[visa.country] || visa.country}의 ${categoryKo[visa.category]} 경로입니다. 근로범위는 ${workScopeKo[visa.work_scope]}이며 잡오퍼는 ${jobOfferKo[visa.job_offer_required]}입니다. 세부 서류와 신청 순서는 아래 공식 페이지에서 최신 내용을 확인하세요.`}
              </p>
            </section>

            <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_VISA_DETAIL_MID_SLOT} />

            <section className="border-t border-[var(--color-rule)] pt-8">
              <h2 className="text-2xl font-semibold">꼭 확인할 근로조건</h2>
              <ul className="mt-5 max-w-3xl space-y-3">
                {(visa.restrictions_ko || categoryCautionsKo[visa.category]).map((restriction) => (
                  <li className="flex gap-3 leading-7 text-[var(--color-ink-2)]" key={restriction}>
                    <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)]" />
                    <span>{restriction}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          <aside className="h-fit border-t border-[var(--color-rule)] pt-5 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-2)]">출처 상태</p>
            <p className="mt-2 text-sm font-semibold">{visa.source_status === "Official source checked" ? "상세 검증 완료" : "공식 페이지 연결"}</p>
            <p className="mt-2 text-xs leading-5 text-[var(--color-ink-2)]">마지막 확인일 {visa.last_verified}. 법률·이민 자문이 아닌 정보 제공용 안내입니다.</p>
            <a
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent-ink)]"
              href={visa.official_link}
              rel="noopener noreferrer"
              target="_blank"
            >
              공식 페이지 <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
}
