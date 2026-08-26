import type { Visa } from "@/constants/visas";

export const visaGuides: Array<{
  slug: string;
  title: string;
  description: string;
  criterion: string;
  matches: (visa: Visa) => boolean;
}> = [
  {
    slug: "koreans-without-job-offer",
    title: "한국인이 잡오퍼 없이 검토할 수 있는 비자",
    description: "대한민국 여권이 가능 또는 조건부로 분류되고, 신청 단계에서 잡오퍼가 필수가 아닌 경로를 모았습니다.",
    criterion: "한국 여권 불가 항목 제외 · 잡오퍼 불필요",
    matches: (visa) => visa.korean_passport !== "Ineligible" && visa.job_offer_required === "No",
  },
  {
    slug: "working-holiday-age-30-plus",
    title: "30세 이상이 검토할 수 있는 워킹홀리데이 비자",
    description: "대한민국 여권 관련성이 있고 구조화된 최대 연령이 30세 이상이거나 단일 상한이 없는 워킹홀리데이 경로입니다.",
    criterion: "워킹홀리데이 · 한국 여권 불가 항목 제외 · 최대 연령 30세 이상",
    matches: (visa) => visa.category === "Working holiday" && visa.korean_passport !== "Ineligible"
      && (visa.age_normalized.max_age === null || visa.age_normalized.max_age >= 30),
  },
  {
    slug: "visas-relevant-to-permanent-residence",
    title: "영주권 경로에 반영될 수 있는 비자",
    description: "직접 전환, 체류연수 산입, 취업경력 또는 장기체류 관련성이 구조화된 경로를 구분해 모았습니다.",
    criterion: "영주권 관련성 enum이 조건부·미산입이 아닌 경로",
    matches: (visa) => !["Conditional", "Does not count"].includes(visa.pr_relevance),
  },
];
