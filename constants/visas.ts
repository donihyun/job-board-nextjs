import visaMetadataAuditJson from "../data/visa-metadata-audit.json" with { type: "json" };

export type VisaCategory =
  | "Working holiday"
  | "Student"
  | "Graduate"
  | "Employer-sponsored"
  | "Job seeker"
  | "Digital nomad"
  | "Self-employed"
  | "Temporary work";

export type WorkScope = "Open" | "Employer-specific" | "Occupation-specific" | "Remote foreign work" | "Limited hours" | "Varies";
export type PrRelevance = "Direct pathway" | "Residence counts" | "Residence partly counts" | "Work experience" | "Long residence" | "Does not count" | "Conditional";
export type EligibilityStatus = "Eligible" | "Ineligible" | "Conditional";
export type AgeRule = { min_age: number | null; max_age: number | null; varies: boolean };
export type WorkHoursRule = { type: "Unlimited" | "Limited" | "Conditional"; max_hours_per_week: number | null };
export type MoneyRule = { status: "Required" | "Not required" | "Unknown"; amount: number | null; currency: string | null; period: "Total" | "Monthly" | null };
export type ProcessingRule = { max_days: number | null; status: "Known" | "Unknown" };
export type AuditStatus = "Verified" | "Varies or not numeric" | "Not published on source" | "Fetch failed";
export type ApplicationFeeRule = { status: AuditStatus; amount: number | null; currency: string | null };
type MetadataAuditRecord = {
  checked_at: string;
  source_http_status: number;
  financial: { status: AuditStatus; amount?: number; currency?: string; period?: "Total" | "Monthly" };
  fee: { status: AuditStatus; amount?: number; currency?: string };
  processing: { status: AuditStatus; max_days?: number | null };
};
const visaMetadataAudit = visaMetadataAuditJson as Record<string, MetadataAuditRecord>;

export const countryKo: Record<string, string> = {
  Australia: "호주", Canada: "캐나다", "United Kingdom": "영국", Germany: "독일",
  "New Zealand": "뉴질랜드", Ireland: "아일랜드", France: "프랑스", Spain: "스페인",
  Portugal: "포르투갈", Estonia: "에스토니아", Croatia: "크로아티아",
  Japan: "일본", Netherlands: "네덜란드", Sweden: "스웨덴", Austria: "오스트리아",
  Czechia: "체코", Malta: "몰타", Argentina: "아르헨티나", Denmark: "덴마크", Taiwan: "대만",
  Andorra: "안도라", Brazil: "브라질", Chile: "칠레", "Hong Kong": "홍콩", Israel: "이스라엘",
};

const countryCodes: Record<string, string> = {
  Australia: "AU", Canada: "CA", "United Kingdom": "GB", Germany: "DE", "New Zealand": "NZ",
  Ireland: "IE", France: "FR", Spain: "ES", Portugal: "PT", Estonia: "EE", Croatia: "HR",
  Japan: "JP", Netherlands: "NL", Sweden: "SE", Austria: "AT", Czechia: "CZ", Malta: "MT",
  Belgium: "BE", Bulgaria: "BG", Cyprus: "CY", Finland: "FI", Greece: "GR", Hungary: "HU",
  Italy: "IT", Latvia: "LV", Lithuania: "LT", Luxembourg: "LU", Poland: "PL", Romania: "RO",
  Slovakia: "SK", Slovenia: "SI", Argentina: "AR", Denmark: "DK", Taiwan: "TW",
  Andorra: "AD", Brazil: "BR", Chile: "CL", "Hong Kong": "HK", Israel: "IL",
};

export const countryFlag = (country: string) => (countryCodes[country] || "")
  .replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));

export const categoryKo: Record<VisaCategory, string> = {
  "Working holiday": "워킹홀리데이", Student: "학생", Graduate: "졸업 후 취업",
  "Employer-sponsored": "고용주 스폰서", "Job seeker": "구직", "Digital nomad": "디지털 노마드",
  "Self-employed": "자영업·프리랜서", "Temporary work": "단기 취업",
};

export const workScopeKo: Record<WorkScope, string> = {
  Open: "자유 취업", "Employer-specific": "지정 고용주", "Occupation-specific": "지정 직종",
  "Remote foreign work": "해외 대상 원격근무", "Limited hours": "시간 제한 근로", Varies: "조건별 상이",
};

export const jobOfferKo = { Yes: "필요", No: "불필요", Varies: "조건별 상이" } as const;
export const prRelevanceKo: Record<PrRelevance, string> = {
  "Direct pathway": "직접 전환 경로",
  "Residence counts": "체류연수 산입",
  "Residence partly counts": "체류연수 일부 산입",
  "Work experience": "취업경력 요건에 산입",
  "Long residence": "장기체류 요건에 산입",
  "Does not count": "일반적으로 미산입",
  Conditional: "경로·국가별 조건부",
};

export const eligibilityKo: Record<EligibilityStatus, string> = { Eligible: "가능", Ineligible: "불가", Conditional: "조건부" };

export const normalizeAge = (value: string): AgeRule => {
  if (/no single|no fixed/i.test(value)) return { min_age: null, max_age: null, varies: false };
  if (/financial|pension/i.test(value)) return { min_age: null, max_age: null, varies: true };
  const numbers = Array.from(value.matchAll(/\d+/g), (match) => Number(match[0]));
  if (/over|or over/i.test(value)) return { min_age: numbers[0] ?? null, max_age: null, varies: false };
  if (/under/i.test(value)) return { min_age: null, max_age: numbers[0] ?? null, varies: /usually|exception/i.test(value) };
  if (/or|vary|extend|usually|exception/i.test(value)) return { min_age: numbers[0] ?? null, max_age: numbers.length ? Math.max(...numbers) : null, varies: true };
  return { min_age: numbers[0] ?? null, max_age: numbers[1] ?? numbers[0] ?? null, varies: false };
};

export const normalizeKoreanEligibility = (value: string): EligibilityStatus => {
  if (/south korea|republic of korea|most nationalities|international students|non-eu|non-eea|third-country|qualified applicants|eligible workers|entrepreneurs|location-independent/i.test(value)) return "Eligible";
  if (/iec citizenships|agreement/i.test(value)) return "Conditional";
  return "Conditional";
};

export const normalizeWorkHours = (scope: WorkScope, restrictions: string[]): WorkHoursRule => {
  if (scope !== "Limited hours" && scope !== "Varies") return { type: "Unlimited", max_hours_per_week: null };
  const text = restrictions.join(" ");
  const weekly = text.match(/(?:up to\s*)?(\d+) hours per week/i);
  const fortnight = text.match(/(\d+) hours per fortnight/i);
  return { type: scope === "Varies" ? "Conditional" : "Limited", max_hours_per_week: weekly ? Number(weekly[1]) : fortnight ? Number(fortnight[1]) / 2 : null };
};

export const normalizeMoney = (value: string): MoneyRule => {
  const match = value.match(/\b(AUD|CAD|NZD|GBP|EUR|USD)\s*([\d,]+)/i);
  return match
    ? { status: "Required", amount: Number(match[2].replace(/,/g, "")), currency: match[1].toUpperCase(), period: /per month/i.test(value) ? "Monthly" : "Total" }
    : { status: /not required/i.test(value) ? "Not required" : "Unknown", amount: null, currency: null, period: null };
};

export const normalizeProcessing = (value: string): ProcessingRule => {
  const weeks = value.match(/(\d+) weeks?/i);
  const days = value.match(/(\d+) days?/i);
  const max_days = weeks ? Number(weeks[1]) * 7 : days ? Number(days[1]) : null;
  return { max_days, status: max_days === null ? "Unknown" : "Known" };
};

export type DurationBasis = "fixed" | "course" | "contract" | "permit" | "varies";
export type VisaDuration = {
  min_months: number | null;
  max_months: number | null;
  basis: DurationBasis;
};

/** AI 수집 결과도 이 형태로 검증·저장한다. 원문은 duration에 별도로 보존한다. */
export const normalizeVisaDuration = (duration: string): VisaDuration => {
  const text = duration.toLowerCase();
  const range = text.match(/(\d+)\s*[–-]\s*(\d+)\s*(years?|년|months?|개월)/);
  const values = Array.from(text.matchAll(/(\d+)\s*(years?|년|months?|개월)/g),
    (match) => Number(match[1]) * (/year|년/.test(match[2]) ? 12 : 1));
  if (range) values.push(Number(range[1]) * (/year|년/.test(range[3]) ? 12 : 1));
  const basis: DurationBasis = /course|study|student|과정|학업|학년/.test(text) ? "course"
    : /contract|employment|고용|계약/.test(text) ? "contract"
      : /permit|visa|비자|허가/.test(text) ? "permit"
        : /var(?:y|ies)|상이|options exist/.test(text) ? "varies" : "fixed";
  if (!values.length) return { min_months: null, max_months: null, basis };
  const max = Math.max(...values);
  return {
    min_months: range ? Math.min(...values) : /at least|최소/.test(text) ? max : null,
    max_months: /at least|최소/.test(text) && !/max|최대/.test(text) ? null : max,
    basis,
  };
};

export const durationKo = (visa: Pick<Visa, "duration" | "duration_normalized">) => {
  const { min_months: min, max_months: max, basis } = visa.duration_normalized;
  const unit = (months: number) => months % 12 === 0 ? `${months / 12}년` : `${months}개월`;
  if (min !== null && max !== null && min !== max) return `${unit(min)}~${unit(max)}`;
  if (max !== null) return `${basis === "fixed" ? "최대" : "통상 최대"} ${unit(max)}`;
  if (min !== null) return `최소 ${unit(min)}`;
  return ({ course: "승인된 학업기간", contract: "승인된 고용계약 기간", permit: "허가된 체류기간", varies: "조건별 상이", fixed: "공식 조건 확인" } as const)[basis];
};

export const categoryCautionsKo: Record<VisaCategory, string[]> = {
  "Working holiday": ["국적별 연령·쿼터·신청 시기가 다릅니다.", "동일 고용주 근무기간과 허용 직종을 확인해야 합니다."],
  Student: ["학기 중과 방학 중 허용 근로시간이 다를 수 있습니다.", "학교·과정·비자에 근로 허용 조건이 명시돼 있어야 합니다."],
  Graduate: ["수료한 학교와 과정이 졸업 후 취업비자 대상인지 먼저 확인해야 합니다.", "졸업 후 신청기한과 비자 발급 횟수 제한을 확인해야 합니다."],
  "Employer-sponsored": ["허가된 고용주·직종·근무지에만 취업할 수 있는 경우가 많습니다.", "급여·경력·자격과 고용주의 스폰서 요건을 함께 충족해야 합니다."],
  "Job seeker": ["구직 기간의 근로시간과 체험근무 범위가 제한될 수 있습니다.", "정식 취업 후에는 별도 취업 체류자격으로 전환해야 할 수 있습니다."],
  "Digital nomad": ["현지 기업 취업이 아니라 해외 고용주나 해외 고객을 위한 원격근무만 허용되는 경우가 많습니다.", "소득·보험·납세·체류지 요건을 최신 공식 안내에서 확인해야 합니다."],
  "Self-employed": ["허가받은 사업 또는 프리랜서 활동 범위 안에서만 일할 수 있습니다.", "사업성·자금·면허 요건은 직종과 지역에 따라 달라집니다."],
  "Temporary work": ["계약기간·고용주·직종이 비자 조건에 묶일 수 있습니다.", "계절근로와 일반 단기취업은 신청 요건이 다를 수 있습니다."],
};

const valueKo: Record<string, string> = {
  "Check official source": "공식 페이지에서 확인",
  "Varies — check current amount": "조건별 상이 · 최신 금액 확인",
  "Varies by route and dependant": "비자 및 동반가족 조건에 따라 다름",
  "No dependent children on the application": "신청서에 부양 자녀 포함 불가",
  "No single general age limit": "일반적인 단일 연령 제한 없음",
  "18 or over": "만 18세 이상",
  "16 or over for the Student route": "학생비자는 만 16세 이상",
  "18–30": "만 18~30세",
  "Usually 18–30; passport rules vary": "일반적으로 만 18~30세 · 여권별 상이",
  "Usually 18–30 or 18–35 by citizenship": "국적에 따라 만 18~30세 또는 18~35세",
  "Usually 18–30 or 18–35 by nationality": "국적에 따라 만 18~30세 또는 18~35세",
  "Usually 35 or under; exceptions apply": "일반적으로 만 35세 이하 · 예외 있음",
  "No fixed maximum; age affects points": "고정 상한 없음 · 나이가 점수에 반영됨",
  "Republic of Korea": "대한민국 여권",
  "Agreement countries, including South Korea": "대한민국을 포함한 협정 국가 여권",
  "IEC agreement countries, including South Korea": "대한민국을 포함한 IEC 협정 국가 여권",
  "Listed countries and territories, including South Korea": "대한민국을 포함한 지정 국가·지역 여권",
  "Working-holiday agreement countries, including South Korea": "대한민국을 포함한 워킹홀리데이 협정 국가 여권",
  "Most nationalities, subject to eligibility": "자격 요건을 충족하는 대부분의 국적",
  "Eligible recent Australian graduates": "요건을 충족한 최근 호주 졸업생",
  "Eligible international students": "근로 요건을 충족한 유학생",
  "Eligible graduates of PGWP-eligible institutions and programs": "PGWP 대상 학교·과정 졸업생",
  "Eligible graduates who completed a UK course on a Student visa": "학생비자로 영국 과정을 수료한 대상 졸업생",
  "Graduates of German higher education": "독일 고등교육기관 졸업생",
  "Eligible graduates of New Zealand qualifications": "대상 뉴질랜드 과정 졸업생",
  "Eligible non-EEA students on approved full-time courses": "승인된 정규과정의 비EEA 유학생",
  "Eligible non-EEA graduates of recognised Irish awards": "인정된 아일랜드 학위의 비EEA 졸업생",
  "Eligible non-EU/EEA remote employees and self-employed professionals": "요건을 충족한 비EU·EEA 원격근로자와 프리랜서",
  "Eligible third-country remote employees and independent professionals": "요건을 충족한 제3국 원격근로자와 독립 전문가",
  "Eligible non-EU/EEA/Swiss remote workers": "요건을 충족한 비EU·EEA·스위스 원격근로자",
  "Working-holiday partner citizens, including South Korea": "대한민국을 포함한 워킹홀리데이 협정 국가 여권",
  "Eligible recent graduates and researchers": "요건을 충족한 최근 졸업생과 연구자",
  "Qualified applicants hired by an IND-recognised sponsor": "네덜란드 이민국 인정 스폰서에게 채용된 전문인력",
  "South Korea and other agreement-country citizens": "대한민국을 포함한 협정 국가 여권",
  "Eligible former international students in Sweden": "요건을 충족한 스웨덴 유학 체류자",
  "Eligible third-country students in Austria": "요건을 충족한 오스트리아의 제3국 유학생",
  "Eligible graduates of Austrian higher education": "요건을 충족한 오스트리아 고등교육기관 졸업생",
  "Qualified third-country workers meeting Red-White-Red Card rules": "레드-화이트-레드 카드 요건을 충족한 제3국 전문인력",
  "Eligible third-country workers": "요건을 충족한 제3국 근로자",
  "Eligible third-country students in Malta": "요건을 충족한 몰타의 제3국 유학생",
  "Eligible non-EU citizens": "요건을 충족한 비EU 시민",
  "Varies by national route": "국가별 경로에 따라 다름",
  "South Korea: usually 18–25; authorities may extend to 30": "대한민국 여권은 일반적으로 만 18~25세 · 당국 판단에 따라 만 30세까지 가능",
};

export const visaValueKo = (value: string) => valueKo[value]
  || value.replace(/^Up to (\d+) months$/, "최대 $1개월")
    .replace(/^Up to (\d+) years$/, "최대 $1년")
    .replace(/^Usually (\d+) months$/, "일반적으로 $1개월")
    .replace(/^For the approved (.+) period$/, "승인된 $1 기간")
    .replace(/^For the (.+) validity$/, "$1 유효기간 동안");

export interface Visa {
  country: string;
  visa_type: string;
  category: VisaCategory;
  duration: string;
  duration_normalized: VisaDuration;
  processing_time: string;
  application_process: string;
  official_link: string;
  family_allowed: string;
  financial_proof_required: string;
  work_scope: WorkScope;
  job_offer_required: "Yes" | "No" | "Varies";
  job_offer_note: string;
  pr_relevance: PrRelevance;
  pr_relevance_note: string;
  eligible_passports: string;
  age_range: string;
  age_normalized: AgeRule;
  korean_passport: EligibilityStatus;
  work_hours_normalized: WorkHoursRule;
  financial_normalized: MoneyRule;
  processing_normalized: ProcessingRule;
  application_fee_normalized: ApplicationFeeRule;
  metadata_audit: { checked_at: string; source_http_status: number; financial: AuditStatus; fee: AuditStatus; processing: AuditStatus };
  restrictions: string[];
  last_verified: string;
  source_status: "Official source checked" | "Official overview checked";
  slug: string;
  is_temporary: true;
  detail_available: boolean;
  application_process_ko?: string;
  restrictions_ko?: string[];
}

type VisaInput = Omit<Visa, "slug" | "is_temporary" | "detail_available" | "duration_normalized" | "age_normalized" | "korean_passport" | "work_hours_normalized" | "financial_normalized" | "processing_normalized" | "application_fee_normalized" | "metadata_audit" | "pr_relevance" | "pr_relevance_note" | "job_offer_note" | "processing_time" | "family_allowed" | "financial_proof_required" | "last_verified" | "source_status"> &
  Partial<Pick<Visa, "detail_available" | "duration_normalized" | "age_normalized" | "korean_passport" | "work_hours_normalized" | "financial_normalized" | "processing_normalized" | "application_fee_normalized" | "metadata_audit" | "pr_relevance" | "pr_relevance_note" | "job_offer_note" | "processing_time" | "family_allowed" | "financial_proof_required" | "last_verified" | "source_status">>;

const slugify = (value: string) => value.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)/g, "");

const defaultPrRelevance = (input: VisaInput): PrRelevance => {
  if (input.country === "United Kingdom") return input.category === "Employer-sponsored" ? "Direct pathway" : "Long residence";
  if (input.country === "Canada") return input.category === "Student" ? "Does not count" : "Work experience";
  if (input.country === "Australia") return input.category === "Employer-sponsored" ? "Direct pathway" : input.category === "Working holiday" || input.category === "Graduate" ? "Work experience" : "Does not count";
  if (input.country === "New Zealand") return input.category === "Employer-sponsored" ? "Direct pathway" : input.category === "Graduate" || input.category === "Working holiday" ? "Work experience" : "Does not count";
  if (input.country === "Ireland") return input.category === "Employer-sponsored" ? "Residence counts" : "Does not count";
  if (input.country === "Japan") return "Does not count";

  const euLongTermCountries = new Set(["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"]);
  if (euLongTermCountries.has(input.country)) {
    if (input.category === "Student") return "Residence partly counts";
    if (input.category === "Working holiday" || /seasonal|계절/i.test(input.visa_type)) return "Does not count";
    if (/intra-corporate|ICT|전근/i.test(input.visa_type)) return "Does not count";
    if (input.category === "Job seeker") return input.country === "Germany" && /Opportunity Card/.test(input.visa_type) ? "Does not count" : "Residence partly counts";
    if (input.category === "Digital nomad") return ["Spain", "Portugal"].includes(input.country) ? "Residence counts" : "Does not count";
    return "Residence counts";
  }
  return "Conditional";
};

const defaultPrNote = (input: VisaInput, relevance: PrRelevance) => {
  if (/intra-corporate|ICT|전근/i.test(input.visa_type)) return "ICT는 한시적 기업 내 전근 체류입니다. 이 기간 자체는 일반 장기거주 연수에서 제외되며, 다른 취업 체류허가로 전환한 뒤부터 새 경로의 산입 규칙이 적용됩니다.";
  if (input.category === "Job seeker") return "구직 체류만으로 영주권이 보장되지는 않습니다. EU 유학 후 경로는 선행 학생 체류기간이 통상 50% 반영되며, 취업허가 전환 후에는 해당 국가의 일반 산입 규칙을 따릅니다.";
  if (input.country === "Ireland" && input.category === "Graduate") return "Stamp 1G는 시민권의 reckonable residence에는 활용될 수 있지만, 고용허가 기반 장기거주 제도의 60개월에는 일반적으로 포함되지 않습니다.";
  if (input.country === "Croatia" && input.category === "Digital nomad") return "디지털 노마드 체류는 한시적 체류이며 연속 장기거주 경로로 바로 이어지지 않습니다. 다른 산입 대상 체류허가로 전환해야 합니다.";
  return ({
    "Direct pathway": "요건을 충족하면 이 취업 경로에서 영주·정착 경로로 전환할 수 있습니다. 자동 전환은 아니며 직종·급여·고용기간 요건을 별도로 충족해야 합니다.",
    "Residence counts": "합법적이고 연속된 체류는 일반적으로 장기거주 연수에 산입됩니다. 출국기간·소득·보험·통합 요건은 별도입니다.",
    "Residence partly counts": "학생 체류 등은 일반적으로 전체 기간이 아니라 일부만 장기거주 연수에 산입됩니다.",
    "Work experience": "체류기간 자체보다 현지의 적격 취업경력이 영주권 점수 또는 신청요건에 반영됩니다.",
    "Long residence": "대부분의 합법적 체류는 영국 10년 장기체류 경로에 합산될 수 있지만 연속체류와 출국 제한을 충족해야 합니다.",
    "Does not count": "이 임시 체류 자체는 일반적인 영주·장기거주 연수에 산입되지 않습니다. 산입 대상 체류자격으로 별도 전환해야 합니다.",
    Conditional: "국가와 후속 체류자격에 따라 산입 여부가 달라집니다.",
  } as const)[relevance];
};

const normalizeJobOffer = (input: VisaInput) => {
  if (input.category === "Student" && input.country === "Austria") return {
    required: "No" as const,
    note: "학생 체류허가 신청에는 잡오퍼가 필요하지 않습니다. 실제 취업 전에는 고용주가 AMS에 주 20시간 이내 취업허가를 신청해야 합니다.",
  };
  if (input.category === "Student" && input.country === "Malta") return {
    required: "No" as const,
    note: "학생비자 신청에는 잡오퍼가 필요하지 않습니다. 실제 취업에는 잡오퍼를 확보한 뒤 별도 취업허가를 받아야 합니다.",
  };
  return {
    required: input.job_offer_required,
    note: input.job_offer_note ?? (input.job_offer_required === "Yes"
      ? "이 비자 또는 체류허가를 신청할 때 유효한 잡오퍼·고용계약이 필요합니다."
      : input.job_offer_required === "No"
        ? "이 비자 신청 단계에서는 잡오퍼가 필요하지 않습니다. 실제 취업 시 별도 고용계약이나 취업허가가 필요할 수 있습니다."
        : "세부 신청 경로에 따라 잡오퍼 필요 여부가 달라집니다."),
  };
};

const visa = (input: VisaInput): Visa => {
  const prRelevance = input.pr_relevance ?? defaultPrRelevance(input);
  const jobOffer = normalizeJobOffer(input);
  const processingTime = input.processing_time ?? "Check official source";
  const financialProof = input.financial_proof_required ?? "Varies — check current amount";
  const slug = slugify(`${input.country}-${input.visa_type}`);
  const audit = visaMetadataAudit[slug];
  const parsedFinancial = normalizeMoney(financialProof);
  const auditedFinancial: MoneyRule = audit?.financial.amount
    ? { status: "Required", amount: audit.financial.amount, currency: audit.financial.currency || null, period: audit.financial.period || "Total" }
    : parsedFinancial;
  const parsedProcessing = normalizeProcessing(processingTime);
  return ({
  processing_time: processingTime,
  family_allowed: "Varies by route and dependant",
  financial_proof_required: financialProof,
  last_verified: "2026-08-19",
  source_status: "Official source checked",
  ...input,
  duration_normalized: input.duration_normalized ?? normalizeVisaDuration(input.duration),
  age_normalized: input.age_normalized ?? normalizeAge(input.age_range),
  korean_passport: input.korean_passport ?? normalizeKoreanEligibility(input.eligible_passports),
  work_hours_normalized: input.work_hours_normalized ?? normalizeWorkHours(input.work_scope, input.restrictions),
  financial_normalized: input.financial_normalized ?? auditedFinancial,
  processing_normalized: input.processing_normalized ?? (audit?.processing.max_days ? { status: "Known", max_days: audit.processing.max_days } : parsedProcessing),
  application_fee_normalized: input.application_fee_normalized ?? { status: audit?.fee.status || "Not published on source", amount: audit?.fee.amount || null, currency: audit?.fee.currency || null },
  metadata_audit: input.metadata_audit ?? {
    checked_at: audit?.checked_at || "2026-08-20",
    source_http_status: audit?.source_http_status || 0,
    financial: audit?.financial.status || "Not published on source",
    fee: audit?.fee.status || "Not published on source",
    processing: audit?.processing.status || "Not published on source",
  },
  job_offer_required: jobOffer.required,
  job_offer_note: jobOffer.note,
  pr_relevance: prRelevance,
  pr_relevance_note: input.pr_relevance_note ?? defaultPrNote(input, prRelevance),
  slug,
  is_temporary: true,
  detail_available: input.detail_available ?? true,
  });
};

const verifiedVisaList: Visa[] = [
  visa({
    country: "Australia", visa_type: "Work and Holiday visa (subclass 462)", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Agreement countries, including South Korea", age_range: "Usually 18–30; passport rules vary", application_process: "Apply for a first subclass 462 visa with an eligible passport, required funds, health cover and the documents specified for your nationality.", restrictions: ["Usually no more than 6 months with one employer", "Study is limited to 4 months", "Second and third visas require specified work"], official_link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462/first-work-holiday-462", family_allowed: "No dependent children on the application" }),
  visa({
    country: "Australia", visa_type: "Student visa (subclass 500)", category: "Student", duration: "For the approved course period", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Most nationalities, subject to eligibility", age_range: "No single general age limit", application_process: "Enrol with an approved provider, obtain a Confirmation of Enrolment and meet financial, English, health and genuine-student requirements.", restrictions: ["Generally up to 48 hours per fortnight while the course is in session", "Work cannot normally start before the course begins", "Unlimited hours may apply during scheduled course breaks"], official_link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" }),
  visa({
    country: "Australia", visa_type: "Temporary Graduate visa (subclass 485)", category: "Graduate", duration: "Usually 2–3 years; stream rules vary", work_scope: "Open", job_offer_required: "No", eligible_passports: "Eligible recent Australian graduates", age_range: "Usually 35 or under; exceptions apply", application_process: "Apply after completing an eligible CRICOS-registered qualification and meet the stream, timing, English, health and insurance requirements.", restrictions: ["Eligibility and stay depend on qualification and stream", "Application deadlines after study are strict"], official_link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485" }),
  visa({
    country: "Australia", visa_type: "Skills in Demand visa (subclass 482)", category: "Employer-sponsored", duration: "Up to 4 years, depending on stream", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Qualified applicants sponsored for an eligible role", age_range: "No single general age limit", application_process: "An approved business nominates an eligible position and the applicant demonstrates the required skills, experience and English level.", restrictions: ["Work is tied to the nominated occupation and sponsor", "Occupation, salary and experience rules apply"], official_link: "https://immi.homeaffairs.gov.au/Visa-subsite/Pages/work/skills-in-demand-482-landing.aspx", source_status: "Official overview checked" }),

  visa({
    country: "Canada", visa_type: "IEC Working Holiday", category: "Working holiday", duration: "Up to 24 months; citizenship rules vary", work_scope: "Open", job_offer_required: "No", eligible_passports: "IEC agreement countries, including South Korea", age_range: "Usually 18–30 or 18–35 by citizenship", application_process: "Create an IEC profile, enter the eligible pool, receive an invitation and submit the work-permit application with the required documents and fees.", restrictions: ["Quota and invitation rounds apply", "Some occupations require a medical examination", "Participation limits vary by citizenship"], official_link: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/about.html" }),
  visa({
    country: "Canada", visa_type: "IEC Young Professionals", category: "Employer-sponsored", duration: "Varies by citizenship agreement", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Eligible IEC citizenships", age_range: "Usually 18–30 or 18–35 by citizenship", application_process: "Enter the Young Professionals pool with a signed Canadian job offer that contributes to professional development, then apply after invitation.", restrictions: ["Paid work for the named employer and location", "The role generally needs to meet occupational requirements", "Self-employment is not the purpose of this category"], official_link: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/eligibility.html" }),
  visa({
    country: "Canada", visa_type: "Study permit with work rights", category: "Student", duration: "For the study-permit validity", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Eligible international students", age_range: "No single general age limit", application_process: "Hold a valid study permit, study full time at an eligible designated learning institution and meet the conditions printed on the permit.", restrictions: ["Eligible students may work off campus up to 24 hours per week during regular terms", "Full-time work may be allowed during scheduled breaks", "Work cannot begin before studies start"], official_link: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html" }),
  visa({
    country: "Canada", visa_type: "Post-graduation work permit (PGWP)", category: "Graduate", duration: "Up to 3 years; depends on program", work_scope: "Open", job_offer_required: "No", eligible_passports: "Eligible graduates of PGWP-eligible institutions and programs", age_range: "No single general age limit", application_process: "Complete an eligible program at a designated learning institution and apply within the required period while meeting language, field-of-study and location rules where applicable.", restrictions: ["Not every school or program is PGWP-eligible", "Length depends on program length and current policy", "A PGWP is generally issued only once"], official_link: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html" }),
  visa({
    country: "Canada", visa_type: "Employer-specific work permit", category: "Employer-sponsored", duration: "For the approved employment period", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Applicants with an eligible Canadian employment offer", age_range: "No single general age limit", application_process: "Obtain an employment offer and the required LMIA or exemption details, then apply for a permit naming the employer, occupation and work location.", restrictions: ["Work is limited to the conditions printed on the permit", "Changing employer may require a new permit"], official_link: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/employer-specific.html" }),

  visa({
    country: "United Kingdom", visa_type: "Youth Mobility Scheme visa", category: "Working holiday", duration: "Usually 24 months; some citizens can extend", work_scope: "Open", job_offer_required: "No", eligible_passports: "Listed countries and territories, including South Korea", age_range: "Usually 18–30 or 18–35 by nationality", application_process: "Apply under the nationality-specific rules, including any ballot requirement, and provide the required maintenance funds.", restrictions: ["Professional sport is not allowed", "Self-employment is allowed only within specific limits", "Extension rights depend on nationality"], official_link: "https://www.gov.uk/youth-mobility" }),
  visa({
    country: "United Kingdom", visa_type: "Student visa with work rights", category: "Student", duration: "For the approved course plus permitted wrap-up period", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Eligible international students with a licensed sponsor", age_range: "16 or over for the Student route", application_process: "Receive a Confirmation of Acceptance for Studies from a licensed sponsor and meet financial, English and course requirements.", restrictions: ["Commonly 20 hours per week in term time for eligible degree-level study", "Some courses allow 10 hours or no work", "Self-employment and professional sport are generally prohibited"], official_link: "https://www.gov.uk/student-visa" }),
  visa({
    country: "United Kingdom", visa_type: "Graduate visa", category: "Graduate", duration: "At least 18 months; timing and qualification rules vary", work_scope: "Open", job_offer_required: "No", eligible_passports: "Eligible graduates who completed a UK course on a Student visa", age_range: "No single general age limit", application_process: "Apply from inside the UK after the education provider reports successful completion of an eligible course.", restrictions: ["Professional sport is not allowed", "The route is not normally extendable", "Exact duration depends on application date and qualification"], official_link: "https://www.gov.uk/graduate-visa" }),
  visa({
    country: "United Kingdom", visa_type: "Skilled Worker visa", category: "Employer-sponsored", duration: "Up to 5 years per grant", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Applicants sponsored for an eligible skilled occupation", age_range: "18 or over", application_process: "Obtain an eligible job from an approved sponsor, a Certificate of Sponsorship and meet occupation, salary and English requirements.", restrictions: ["Main work is tied to the sponsor and occupation", "Salary thresholds and going rates apply", "Additional work is limited by route rules"], official_link: "https://www.gov.uk/skilled-worker-visa" }),

  visa({
    country: "Germany", visa_type: "Opportunity Card", category: "Job seeker", duration: "Up to 12 months initially", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Qualified third-country nationals meeting recognition or points rules", age_range: "No fixed maximum; age affects points", application_process: "Qualify through a recognised credential or the points route and prove funds for the job-search period.", restrictions: ["Secondary work is limited to 20 hours per week", "Job trials are limited to 2 weeks per employer", "Full employment requires the appropriate residence title"], official_link: "https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/job-search" }),
  visa({
    country: "Germany", visa_type: "Student residence permit with work rights", category: "Student", duration: "For the approved study period", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Admitted international students", age_range: "No single general age limit", application_process: "Secure university admission, prove financing and health insurance, and obtain the required visa or residence permit.", restrictions: ["Generally up to 140 full or 280 half working days per year", "Study progress and residence conditions must be maintained"], official_link: "https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work" }),
  visa({
    country: "Germany", visa_type: "Graduate job-search residence permit", category: "Graduate", duration: "Up to 18 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Graduates of German higher education", age_range: "No single general age limit", application_process: "Apply after successfully completing a German degree and prove funds and valid residence requirements.", restrictions: ["Designed to find qualified employment", "A suitable work residence title is needed after finding the long-term role"], official_link: "https://www.make-it-in-germany.com/en/visa-residence/types/studying" }),
  visa({
    country: "Germany", visa_type: "Work visa for qualified professionals", category: "Employer-sponsored", duration: "Up to 4 years or contract term plus 3 months", work_scope: "Occupation-specific", job_offer_required: "Yes", eligible_passports: "Third-country nationals with recognised qualifications", age_range: "Special financial rule may apply to first-time applicants over 45", application_process: "Obtain qualified employment and demonstrate a recognised or comparable qualification plus any professional licence required.", restrictions: ["Employment must be qualified", "Regulated professions require permission to practise", "Older first-time applicants may need a salary threshold or pension provision"], official_link: "https://www.make-it-in-germany.com/en/visa-residence/types/work-qualified-professionals" }),
  visa({
    country: "Germany", visa_type: "EU Blue Card", category: "Employer-sponsored", duration: "Up to 4 years or contract term plus 3 months", work_scope: "Occupation-specific", job_offer_required: "Yes", eligible_passports: "Qualified third-country nationals meeting Blue Card rules", age_range: "No single general age limit", application_process: "Secure qualified employment for at least 6 months that matches the relevant qualification and meets the current salary threshold.", restrictions: ["Salary thresholds change regularly", "Lower thresholds apply only to specified cases", "Qualification and job matching rules apply"], official_link: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" }),
  visa({
    country: "Germany", visa_type: "Self-employment residence permit", category: "Self-employed", duration: "Usually up to 3 years initially", work_scope: "Varies", job_offer_required: "No", eligible_passports: "Eligible entrepreneurs and freelancers", age_range: "Applicants over 45 may need pension provision", application_process: "Show a viable business or freelance activity, financing, required licences and a positive economic case where applicable.", restrictions: ["Business and freelance requirements differ", "Permission is tied to the approved activity", "This is not officially named a digital-nomad visa"], official_link: "https://www.make-it-in-germany.com/en/visa-residence/types/other/self-employment" }),

  visa({
    country: "New Zealand", visa_type: "Korea Working Holiday Visa", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply online with a Korean passport, at least NZD 4,200, medical insurance and plans to leave after the stay.", restrictions: ["Temporary jobs only; no permanent job", "Study or training is limited to 6 months", "Annual quota is 3,000"], official_link: "https://www.immigration.govt.nz/visas/korea-working-holiday-visa/", processing_time: "80% within 2 weeks on the checked official page", financial_proof_required: "At least NZD 4,200 on the checked official page", family_allowed: "Partner and children need separate visas" }),
  visa({
    country: "New Zealand", visa_type: "Fee Paying Student Visa with work rights", category: "Student", duration: "For the approved study period", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Eligible fee-paying international students", age_range: "No single general age limit", application_process: "Enrol with an approved provider, pay tuition and meet funds, health, character and insurance requirements.", restrictions: ["Work rights depend on course and visa conditions", "Check the eVisa for permitted hours and employers"], official_link: "https://www.immigration.govt.nz/visas/fee-paying-student-visa/" }),
  visa({
    country: "New Zealand", visa_type: "Post Study Work Visa", category: "Graduate", duration: "Up to 3 years, depending on study", work_scope: "Open", job_offer_required: "No", eligible_passports: "Eligible graduates of New Zealand qualifications", age_range: "No single general age limit", application_process: "Complete an eligible qualification in New Zealand and apply within the specified period after the student visa.", restrictions: ["Eligibility and work conditions depend on qualification", "Normally available only once", "New short-term graduate rules begin in November 2026"], official_link: "https://www.immigration.govt.nz/visas/post-study-work-visa/" }),
  visa({
    country: "New Zealand", visa_type: "Accredited Employer Work Visa (AEWV)", category: "Employer-sponsored", duration: "Up to 5 years; role rules vary", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Applicants offered eligible work by an accredited employer", age_range: "No single general age limit", application_process: "Receive an eligible offer from an accredited employer after the employer completes the required job-check process.", restrictions: ["Work is tied to the approved employer, role and location", "Skill, wage and maximum-stay rules vary by occupation"], official_link: "https://www.immigration.govt.nz/visas/accredited-employer-work-visa/" }),

  visa({
    country: "Ireland", visa_type: "Stamp 2 student permission with work rights", category: "Student", duration: "For the registered student permission", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Eligible non-EEA students on approved full-time courses", age_range: "No single general age limit", application_process: "Enrol in an eligible full-time program and register an immigration permission carrying Stamp 2 conditions.", restrictions: ["Casual employment is generally limited to 20 hours per week during term", "Specified holiday periods may allow 40 hours", "Stamp 2A does not permit work"], official_link: "https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/" }),
  visa({
    country: "Ireland", visa_type: "Third Level Graduate Programme (Stamp 1G)", category: "Graduate", duration: "12 months; eligible master's graduates may receive another 12", work_scope: "Open", job_offer_required: "No", eligible_passports: "Eligible non-EEA graduates of recognised Irish awards", age_range: "No single general age limit", application_process: "Complete an eligible Irish level 8 or 9 award and register under the Third Level Graduate Programme within its conditions.", restrictions: ["Full-time employment is allowed", "Operating a business or self-employment is not allowed", "A work permit is needed to continue after Stamp 1G"], official_link: "https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/" }),
  visa({
    country: "Ireland", visa_type: "Critical Skills Employment Permit", category: "Employer-sponsored", duration: "Initial permit commonly 2 years", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Non-EEA applicants with an eligible critical-skills offer", age_range: "No single general age limit", application_process: "Secure an eligible two-year job offer meeting occupation and remuneration rules, then submit the employment-permit application.", restrictions: ["Occupation and salary criteria apply", "Changing employer is restricted during the initial period"], official_link: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/" }),

  visa({
    country: "France", visa_type: "Working Holiday visa", category: "Working holiday", duration: "Usually up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Working-holiday agreement countries, including South Korea", age_range: "Usually 18–30; agreement rules vary", application_process: "Apply through France-Visas under the nationality-specific working-holiday agreement with funds, insurance and required supporting documents.", restrictions: ["Tourism and cultural exchange remain the main purpose", "Temporary work is allowed to supplement travel funds", "Nationality-specific quotas and conditions may apply"], official_link: "https://www.france-visas.gouv.fr/en/jeunes-salaries" }),

  visa({
    country: "Spain", visa_type: "Digital Nomad Visa", category: "Digital nomad", duration: "Varies by consular or residence route", work_scope: "Remote foreign work", job_offer_required: "No", eligible_passports: "Eligible non-EU/EEA remote employees and self-employed professionals", age_range: "18 or over", application_process: "Prove a qualifying remote employment or professional relationship, qualifications or experience, income, insurance and other residence requirements.", restrictions: ["Remote work must primarily be for organisations outside Spain", "Self-employed applicants may perform up to 20% of activity for Spanish clients", "Employee and self-employed evidence differs"], official_link: "https://www.exteriores.gob.es/Embajadas/dublin/en/ServiciosConsulares/Paginas/Consular/Digital-Nomad-Visa.aspx" }),

  visa({
    country: "Portugal", visa_type: "Remote-work residence route (digital nomad)", category: "Digital nomad", duration: "Temporary-stay and residence options exist", work_scope: "Remote foreign work", job_offer_required: "No", eligible_passports: "Eligible third-country remote employees and independent professionals", age_range: "18 or over", application_process: "Demonstrate remote employment or services performed for entities outside Portugal and meet the applicable visa or residence requirements.", restrictions: ["Temporary-stay and residence procedures differ", "Income and document thresholds must be checked at application time"], official_link: "https://aima.gov.pt/pt/trabalhar", source_status: "Official overview checked" }),
  visa({
    country: "Portugal", visa_type: "Temporary stay visa for employed or independent work", category: "Temporary work", duration: "Temporary stay; contract rules apply", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Eligible third-country workers", age_range: "No single general age limit", application_process: "Provide the relevant employment contract, promise of employment or independent service agreement plus accommodation, funds, insurance and criminal-record documents.", restrictions: ["Seasonal and ordinary temporary work have different evidence", "Independent activity requires its own contract or company evidence"], official_link: "https://www2.gov.pt/en/servicos/pedir-um-visto-de-estada-temporaria-para-trabalho-subordinado-ou-independente" }),

  visa({
    country: "Estonia", visa_type: "Digital Nomad long-stay D visa", category: "Digital nomad", duration: "Up to the long-stay D visa limit", work_scope: "Remote foreign work", job_offer_required: "No", eligible_passports: "Eligible location-independent workers for foreign employers or businesses", age_range: "No single general age limit", application_process: "Apply for a long-stay D visa with proof of teleworking purpose, income, insurance, accommodation and other visa documents.", restrictions: ["The checked official page lists EUR 3,960 monthly means for teleworking", "This does not authorise ordinary local employment"], official_link: "https://www.vm.ee/en/consular-visa-and-travel-information/visa-information/application-long-stay-d-visa", financial_proof_required: "EUR 3,960 per month on the checked official page" }),

  visa({
    country: "Croatia", visa_type: "Temporary stay of digital nomads", category: "Digital nomad", duration: "Up to 18 months", work_scope: "Remote foreign work", job_offer_required: "No", eligible_passports: "Eligible non-EU/EEA/Swiss remote workers", age_range: "No single general age limit", application_process: "Prove remote work for a foreign employer or foreign-owned business, insurance, funds, criminal record and a Croatian address.", restrictions: ["Cannot work for or provide services to Croatian employers", "A new application generally requires a 6-month gap after expiry", "Visa-required applicants may also need a long-stay D visa"], official_link: "https://mup.gov.hr/aliens-281621/stay-and-work/temporary-stay-of-digital-nomads/286833" }),
  visa({
    country: "Croatia", visa_type: "University student temporary stay with work rights", category: "Student", duration: "For the approved study stay", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Eligible third-country university students", age_range: "No single general age limit", application_process: "Obtain temporary stay for university study and comply with the employment conditions for third-country students.", restrictions: ["Employment or self-employment is limited to 20 hours per week", "Internship rules may differ when part of the study program"], official_link: "https://mup.gov.hr/aliens-281621/stay-and-work/work-of-third-country-nationals/281663" }),

  visa({
    country: "Japan", visa_type: "Working Holiday Visa", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Working-holiday partner citizens, including South Korea", age_range: "South Korea: usually 18–25; authorities may extend to 30", application_process: "Apply through the Japanese embassy or consulate responsible for your place of residence with the nationality-specific documents, funds and travel plan.", restrictions: ["Holiday is the primary purpose and work is incidental", "Applicants must normally reside in their country of nationality", "A previous Japanese working-holiday visa normally disqualifies the applicant"], official_link: "https://www.mofa.go.jp/j_info/visit/w_holiday/index.html", family_allowed: "No dependent children on the application" }),

  visa({
    country: "Netherlands", visa_type: "Orientation year residence permit", category: "Graduate", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Eligible recent graduates and researchers", age_range: "No single general age limit", application_process: "Apply within three years of completing an eligible Dutch or designated foreign qualification or research route and provide the required evidence.", restrictions: ["The permit cannot be extended", "Foreign qualifications and research routes have additional eligibility rules", "A different permit is needed after the orientation year"], official_link: "https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year" }),
  visa({
    country: "Netherlands", visa_type: "Highly skilled migrant residence permit", category: "Employer-sponsored", duration: "Up to 5 years", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Qualified applicants hired by an IND-recognised sponsor", age_range: "No single general age limit", application_process: "An IND-recognised sponsor applies for the employee after agreeing an employment contract that meets the current income and market-rate salary rules.", restrictions: ["The main job is tied to the recognised sponsor", "Income thresholds change regularly", "Other salaried work may require a separate work permit"], official_link: "https://ind.nl/en/residence-permits/work/highly-skilled-migrant" }),
  visa({
    country: "Netherlands", visa_type: "Student residence permit with work rights", category: "Student", duration: "Study period plus 3 months; maximum 5 years", work_scope: "Limited hours", job_offer_required: "No", eligible_passports: "Eligible international students", age_range: "No single general age limit", application_process: "An IND-recognised educational institution applies for the residence permit; a prospective employer separately obtains the required work permit.", restrictions: ["Choose either up to 16 hours per week or full-time work in the summer months", "The employer needs a work permit", "Study-progress requirements apply"], official_link: "https://ind.nl/en/about-us/background-articles/international-students-and-the-ind" }),

  visa({
    country: "Sweden", visa_type: "Working holiday permit", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "South Korea and other agreement-country citizens", age_range: "18–30", application_process: "Apply with an eligible passport, funds for the initial stay and return journey, comprehensive health insurance and the required documents.", restrictions: ["Work must not be the main purpose of the stay", "The permit cannot be extended", "Applicants cannot bring family members on this application"], official_link: "https://www.migrationsverket.se/en/you-want-to-apply/work/temporary-work-in-sweden/working-holiday-visa-for-young-people.html", family_allowed: "No dependent children on the application" }),
  visa({
    country: "Sweden", visa_type: "Work permit for former students", category: "Employer-sponsored", duration: "For the approved employment period", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Eligible former international students in Sweden", age_range: "No single general age limit", application_process: "Apply before the current Swedish permit expires after completing the required study period and signing an employment contract that meets work-permit conditions.", restrictions: ["At least two semesters of eligible higher education or doctoral study are required", "Salary, insurance and employment conditions must meet current rules", "Application must be made before the existing permit expires"], official_link: "https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/students-who-have-found-work.html" }),

  visa({
    country: "Austria", visa_type: "Student residence permit with work rights", category: "Student", duration: "For the student residence validity", work_scope: "Limited hours", job_offer_required: "Varies", eligible_passports: "Eligible third-country students in Austria", age_range: "No single general age limit", application_process: "Hold a valid student residence permit; the employer applies to the Public Employment Service for an employment permit before work begins.", restrictions: ["Employment is generally limited to 20 hours per week", "The employer must obtain the employment permit", "Study must remain the primary purpose of residence"], official_link: "https://www.migration.gv.at/en/faq/" }),
  visa({
    country: "Austria", visa_type: "Graduate job-search extension", category: "Graduate", duration: "Up to 12 months", work_scope: "Varies", job_offer_required: "No", eligible_passports: "Eligible graduates of Austrian higher education", age_range: "No single general age limit", application_process: "After successfully completing eligible Austrian study, apply once to renew the student residence permit for job search or starting a business.", restrictions: ["This is a one-time extension", "A matching offer is required to move to an employment-based Red-White-Red Card", "Work rights must be checked against the conditions of the current permit"], official_link: "https://www.migration.gv.at/en/types-of-immigration/temporary-residence.html" }),
  visa({
    country: "Austria", visa_type: "Red-White-Red Card", category: "Employer-sponsored", duration: "Up to 24 months", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Qualified third-country workers meeting Red-White-Red Card rules", age_range: "No single general age limit", application_process: "Qualify in an eligible worker category, secure the required employment offer where applicable and submit the residence-and-work application with the employer documentation.", restrictions: ["Employment is tied to the specified employer", "Points, qualification and salary rules vary by category", "A separate route applies before labour-market access becomes unrestricted"], official_link: "https://www.migration.gv.at/en/types-of-immigration/permanent-immigration.html/" }),

  visa({
    country: "Czechia", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Czech–Korean working-holiday agreement with proof of funds, insurance, accommodation and the required supporting documents.", restrictions: ["Annual quota is 300", "Work must remain secondary to the holiday", "The visa cannot be repeated or extended", "Dependants cannot accompany the applicant under this visa"], official_link: "https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/visa-for-a-stay-longer-than-90-days-for-the-purpose-of-a-working-holiday/", family_allowed: "No dependent children on the application" }),
  visa({
    country: "Czechia", visa_type: "Employee Card", category: "Employer-sponsored", duration: "Up to 2 years", work_scope: "Employer-specific", job_offer_required: "Yes", eligible_passports: "Eligible third-country workers", age_range: "No single general age limit", application_process: "Apply for a qualifying job vacancy with an employment contract or preliminary contract and submit the residence, accommodation and qualification evidence.", restrictions: ["Employment and position changes are subject to reporting or approval rules", "The card is normally tied to the approved job", "After employment ends, strict deadlines apply to report a new job or change status"], official_link: "https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/employee-card/" }),

  visa({
    country: "Malta", visa_type: "Student residence with employment access", category: "Student", duration: "For the approved study period", work_scope: "Limited hours", job_offer_required: "Varies", eligible_passports: "Eligible third-country students in Malta", age_range: "No single general age limit", application_process: "Hold the qualifying student visa or residence permission and obtain the required employment licence before starting work.", restrictions: ["Work is limited to 20 hours per week", "Some courses allow work only after the first three months", "Eligibility depends on the course level, institution and residence conditions"], official_link: "https://identita.gov.mt/central-visa-unit-student-visa-employment/" }),

  visa({
    country: "Argentina", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Check the current embassy notice, then apply with a valid Korean passport and the required funds, insurance and supporting documents.", restrictions: ["Annual quota is 200", "Work is intended to support the holiday", "Current application documents must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Austria", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Austria working-holiday arrangement with the required passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 300", "Work is intended to support the holiday", "Current embassy requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Belgium", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Belgium working-holiday arrangement with the current embassy documents, funds and insurance.", restrictions: ["Annual quota is 200", "Employment is limited to 6 months", "Language study is limited to 6 months"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Denmark", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply under the Korea–Denmark working-holiday arrangement with the required passport, funds, insurance and current supporting documents.", restrictions: ["Employment is limited to 9 months", "Language study is limited to 6 months", "Work must remain secondary to the holiday"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Germany", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply under the Korea–Germany working-holiday arrangement with the required passport, funds, insurance and supporting documents.", restrictions: ["Work for one employer is limited to 6 months", "Work is intended to support the holiday", "Current mission requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Hungary", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Hungary working-holiday arrangement with the current passport, funds, insurance and supporting-document requirements.", restrictions: ["Annual quota is 100", "Work is intended to support the holiday", "Current mission requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Ireland", visa_type: "Working Holiday Authorisation for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Check the current embassy application window, then apply with the required Korean passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 800", "Language study is limited to 6 months", "Applications follow embassy-announced periods"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Netherlands", visa_type: "Working Holiday Program for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Check the current embassy notice and apply under the Netherlands–Korea Working Holiday Program with the required documents.", restrictions: ["Annual quota is 200", "Applications follow embassy-announced periods", "Work is intended to support the holiday"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Poland", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Poland working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 200", "Work is intended to support the holiday", "Current embassy requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Spain", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Spain working-holiday arrangement with the required passport, funds, insurance and current consular documents.", restrictions: ["Annual quota is 1,000", "Work is intended to support the holiday", "Current consular requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Taiwan", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply in person through the Taipei Mission in Korea or its Busan office with the application form, passport, funds, insurance and travel evidence.", restrictions: ["Annual quota is 800", "Each initial stay is up to 180 days and can be extended within the one-year total", "Study is limited to 3 months", "The visa can be issued only once"], official_link: "https://www.boca.gov.tw/fp-153-383-76a8a-2.html", financial_proof_required: "At least KRW 3,000,000", family_allowed: "No accompanying spouse, dependants or children", source_status: "Official source checked", last_verified: "2026-08-25" }),
  visa({
    country: "Andorra", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Andorra working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 50", "Work is intended to support the holiday", "Current application requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Brazil", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply under the Korea–Brazil working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 300", "Work is intended to support the holiday", "Current consular requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Chile", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply under the Korea–Chile working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Work is intended to support the holiday", "Current consular requirements must be checked before applying", "The official overview lists no annual quota"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Hong Kong", visa_type: "Working Holiday Scheme for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Hong Kong Working Holiday Scheme with the required passport, funds, insurance and current supporting documents.", restrictions: ["Annual quota is 1,000", "Work for one employer is limited to 6 months", "Study is limited to 6 months"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Israel", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Israel working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 200", "Work for one employer is limited to 3 months", "Study is limited to 6 months"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Italy", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–30", application_process: "Apply under the Korea–Italy working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 500", "Employment is limited to 6 months", "Current consular requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Latvia", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply under the Korea–Latvia working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 100", "Work is intended to support the holiday", "Current consular requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Luxembourg", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–35", application_process: "Apply under the Korea–Luxembourg working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 100", "Work is intended to support the holiday", "Current consular requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
  visa({
    country: "Portugal", visa_type: "Working Holiday Visa for Korean citizens", category: "Working holiday", duration: "Up to 12 months", work_scope: "Open", job_offer_required: "No", eligible_passports: "Republic of Korea", age_range: "18–34", application_process: "Apply under the Korea–Portugal working-holiday arrangement with the current passport, funds, insurance and supporting documents.", restrictions: ["Annual quota is 200", "Work is intended to support the holiday", "Current consular requirements must be checked before applying"], official_link: "https://whic.mofa.go.kr/whic/about/working.jsp", source_status: "Official overview checked", last_verified: "2026-08-25" }),
];

const euCountries: Array<[string, string]> = [
  ["Austria", "오스트리아"], ["Belgium", "벨기에"], ["Bulgaria", "불가리아"], ["Croatia", "크로아티아"],
  ["Cyprus", "키프로스"], ["Czechia", "체코"], ["Estonia", "에스토니아"], ["Finland", "핀란드"],
  ["France", "프랑스"], ["Germany", "독일"], ["Greece", "그리스"], ["Hungary", "헝가리"],
  ["Italy", "이탈리아"], ["Latvia", "라트비아"], ["Lithuania", "리투아니아"], ["Luxembourg", "룩셈부르크"],
  ["Malta", "몰타"], ["Netherlands", "네덜란드"], ["Poland", "폴란드"], ["Portugal", "포르투갈"],
  ["Romania", "루마니아"], ["Slovakia", "슬로바키아"], ["Slovenia", "슬로베니아"], ["Spain", "스페인"],
  ["Sweden", "스웨덴"],
];

Object.assign(countryKo, Object.fromEntries(euCountries));

const euRouteTypes: Array<Pick<Visa, "visa_type" | "category" | "work_scope" | "job_offer_required"> & { officialSlug: string; priorityDetail?: boolean }> = [
  { visa_type: "일반 취업 체류 경로", category: "Employer-sponsored", work_scope: "Employer-specific", job_offer_required: "Yes", officialSlug: "employed-worker", priorityDetail: true },
  { visa_type: "고숙련 취업 경로", category: "Employer-sponsored", work_scope: "Occupation-specific", job_offer_required: "Yes", officialSlug: "highly-qualified-worker", priorityDetail: true },
  { visa_type: "연구자 체류·근로 경로", category: "Temporary work", work_scope: "Occupation-specific", job_offer_required: "Yes", officialSlug: "researcher" },
  { visa_type: "학생 체류 중 근로 경로", category: "Student", work_scope: "Limited hours", job_offer_required: "No", officialSlug: "student", priorityDetail: true },
  { visa_type: "기업 내 전근자(ICT) 경로", category: "Employer-sponsored", work_scope: "Employer-specific", job_offer_required: "Yes", officialSlug: "intra-corporate-transferee-ict" },
  { visa_type: "계절근로자 경로", category: "Temporary work", work_scope: "Employer-specific", job_offer_required: "Yes", officialSlug: "seasonal-worker" },
  { visa_type: "연구·유학 종료 후 구직 경로", category: "Job seeker", work_scope: "Varies", job_offer_required: "No", officialSlug: "student" },
];

const priorityDetailCountries = new Set([
  "Austria", "Belgium", "Czechia", "Finland", "France",
  "Germany", "Italy", "Netherlands", "Spain", "Sweden",
]);

type PriorityFacts = Record<string, Record<"employed-worker" | "highly-qualified-worker" | "student", {
  duration: string;
  application: string;
  cautions: string[];
}>>;

const priorityFacts: PriorityFacts = {
  Austria: {
    "employed-worker": { duration: "일반적으로 1년", application: "직종에 맞는 체류자격을 신청하며 경우에 따라 별도 취업허가도 받아야 합니다.", cautions: ["체류자격별 자격·소득 요건이 다릅니다.", "일반 체류자격은 통상 1년이며 갱신 조건을 다시 심사합니다."] },
    "highly-qualified-worker": { duration: "최대 2년", application: "EU 블루카드 또는 레드-화이트-레드 카드의 학력·경력·급여 요건과 잡오퍼를 충족해야 합니다.", cautions: ["고숙련 경로마다 점수와 급여 기준이 다릅니다.", "허가된 고용주와 직무 조건을 확인해야 합니다."] },
    student: { duration: "최대 1년 · 교환과정은 2년 가능", application: "오스트리아 고등교육기관 등록 후 학생 체류허가를 신청하고, 취업 전 고용주가 취업허가를 신청합니다.", cautions: ["통상 주 20시간까지 노동시장 심사 없이 허가될 수 있습니다.", "학업이 주된 체류 목적이어야 합니다."] },
  },
  Belgium: {
    "employed-worker": { duration: "계약기간 · 일반적으로 최대 1년", application: "고용주가 근무 지역 관할기관에 단일허가를 신청한 뒤 장기체류 D비자를 신청합니다.", cautions: ["일반적으로 노동시장 심사가 적용됩니다.", "일부 근로자 범주는 최대 3년 허가가 가능합니다."] },
    "highly-qualified-worker": { duration: "계약기간 · 최대 3년", application: "고등교육 학위, 고용계약과 지역별 급여 기준을 충족해 고용주가 단일허가를 신청합니다.", cautions: ["급여 기준은 지역·연령·직종에 따라 달라집니다.", "고용주 변경 시 새 허가가 필요할 수 있습니다."] },
    student: { duration: "최대 1학년 + 1개월", application: "인가된 고등교육기관의 정규과정 등록을 근거로 D비자와 학생 체류허가를 신청합니다.", cautions: ["학기 중 주 20시간까지 일할 수 있습니다.", "학교 방학에는 시간 제한 없이 근무할 수 있으며 학업을 방해해서는 안 됩니다."] },
  },
  Czechia: {
    "employed-worker": { duration: "고용기간 · 최대 2년", application: "고용계약과 자격 증빙을 갖춰 재외공관에서 Employee Card를 신청합니다.", cautions: ["카드는 승인된 직무와 연결됩니다.", "특별취업비자는 최대 1년이며 적용 대상이 제한됩니다."] },
    "highly-qualified-worker": { duration: "계약기간 + 3개월 · 최대 2년", application: "고숙련 직무의 고용계약과 자격·급여 요건을 갖춰 블루카드를 신청합니다.", cautions: ["블루카드 대상 공석과 급여 조건을 확인해야 합니다.", "연장은 가능하지만 요건을 다시 충족해야 합니다."] },
    student: { duration: "장기비자 최대 1년 · 체류허가 최대 2년", application: "법상 학업으로 인정되는 과정의 입학 확인서를 갖춰 장기비자 또는 학생 체류허가를 신청합니다.", cautions: ["유효한 학생비자·체류허가 소지자는 별도 취업허가 없이 일할 수 있습니다.", "과정이 법률상 학업에 해당하는지 확인해야 합니다."] },
  },
  Finland: {
    "employed-worker": { duration: "일반적으로 1년", application: "Enter Finland에서 취업 체류허가를 신청한 뒤 재외공관에서 본인확인과 지문등록을 합니다.", cautions: ["노동시장 수요 심사가 적용될 수 있습니다.", "연장 신청은 기존 허가 만료 전에 해야 합니다."] },
    "highly-qualified-worker": { duration: "최초 2년 · 연장 시 최대 4년", application: "전문가 체류허가 또는 EU 블루카드의 직무·급여 조건에 맞춰 온라인으로 신청합니다.", cautions: ["전문가와 블루카드의 기준이 서로 다릅니다.", "허가 사유가 사라지면 체류허가가 취소될 수 있습니다."] },
    student: { duration: "최대 2년 또는 남은 학업기간", application: "입학, 재정능력과 보험을 증명해 학업 체류허가를 신청합니다.", cautions: ["학위 관련 실습·논문 업무는 제한 없이 가능할 수 있습니다.", "그 밖의 일은 공식 EU 포털 기준 학기 중 주 평균 25시간 제한을 확인해야 합니다."] },
  },
  France: {
    "employed-worker": { duration: "경로별 상이 · 일부 최대 4년", application: "고용주가 필요한 취업허가 절차를 진행한 뒤 장기체류비자와 해당 체류허가를 신청합니다.", cautions: ["일반근로와 Talent Passport의 조건·기간이 다릅니다.", "직종과 계약에 따라 노동시장 심사가 적용될 수 있습니다."] },
    "highly-qualified-worker": { duration: "최대 4년", application: "고숙련 직무의 계약·학력·급여 조건을 갖춰 Talent Passport 등 해당 경로를 신청합니다.", cautions: ["경로별 급여와 자격 기준을 확인해야 합니다.", "회사 내 전근 허가는 별도 기간·갱신 제한이 있습니다."] },
    student: { duration: "학업기간 · 최대 4년", application: "인가된 과정 입학 후 장기 학생비자 또는 학생 체류허가를 신청합니다.", cautions: ["일반 학생은 연 964시간까지 별도 취업허가 없이 근무할 수 있습니다.", "국적별 양자협정에 따라 다른 제한이 적용될 수 있습니다."] },
  },
  Germany: {
    "employed-worker": { duration: "일반적으로 1년", application: "인정되는 자격과 고용계약을 준비해 취업 목적 비자·체류허가를 신청합니다.", cautions: ["직업 자격 인정과 연방고용청 동의가 필요할 수 있습니다.", "허가는 갱신 가능하지만 고용 조건을 유지해야 합니다."] },
    "highly-qualified-worker": { duration: "EU 블루카드 최대 4년", application: "관련 학력 또는 인정 경력, 최소 6개월의 고숙련 고용계약과 급여 기준을 충족해 신청합니다.", cautions: ["급여 기준은 매년 바뀔 수 있습니다.", "짧은 계약은 계약기간에 맞춰 허가기간도 짧아집니다."] },
    student: { duration: "최대 2년 단위", application: "대학 입학, 재정능력과 보험을 증명해 학생비자와 체류허가를 신청합니다.", cautions: ["일반적으로 연 140일 전일 또는 280일 반일 근로가 가능합니다.", "추가 근로는 외국인청 동의가 필요할 수 있습니다."] },
  },
  Italy: {
    "employed-worker": { duration: "기간제 최대 1년 · 무기계약 2년", application: "고용주가 취업허가를 신청한 뒤 비자를 받고 입국 8일 이내 체류허가를 신청합니다.", cautions: ["연간 쿼터가 적용되는 경우가 많습니다.", "허가기간은 고용계약 형태에 따라 달라집니다."] },
    "highly-qualified-worker": { duration: "계약기간 + 3개월 · 무기계약 2년", application: "고용주가 이민국 단일창구에 고숙련 고용계약을 제안하고, 신청자는 비자와 입국 후 체류허가를 받습니다.", cautions: ["고숙련 근로자는 일반 취업 쿼터 밖에서 심사됩니다.", "초기에는 직무·고용주 변경 제한을 확인해야 합니다."] },
    student: { duration: "승인된 학업기간", application: "입학과 재정·보험 증빙으로 학생비자를 받고 입국 후 학업 체류허가를 신청합니다.", cautions: ["주 20시간, 52주 합계 1,040시간까지 근무할 수 있습니다.", "갱신에는 학업성과와 재정·보험 증명이 필요합니다."] },
  },
  Netherlands: {
    "employed-worker": { duration: "GVVA 최대 1년 · 일부 최대 5년", application: "대부분 고용주 또는 신청자가 IND에 체류·취업 단일허가(GVVA)를 신청합니다.", cautions: ["UWV 노동시장 심사가 포함될 수 있습니다.", "별도 취업허가가 면제되는 경우 계약기간 기준 최대 5년이 가능합니다."] },
    "highly-qualified-worker": { duration: "계약기간 · 최대 5년", application: "IND 인정 스폰서와 계약하고 현행 소득 기준을 충족해 고용주가 신청합니다.", cautions: ["인정 스폰서와 급여 기준을 모두 충족해야 합니다.", "실직 시 통상 최대 3개월의 새 일자리 탐색기간이 적용됩니다."] },
    student: { duration: "학업기간 + 3개월 · 최대 5년", application: "IND 인정 교육기관이 학생을 대신해 임시체류허가와 학생 체류허가를 신청합니다.", cautions: ["고용주가 TWV를 받은 경우 주 16시간 또는 6~8월 전일제 중 하나를 선택합니다.", "자영업은 별도 TWV 없이 가능할 수 있지만 학업 조건을 유지해야 합니다."] },
  },
  Spain: {
    "employed-worker": { duration: "최초 1년", application: "고용주가 취업허가를 받은 뒤 신청자가 재외공관에서 취업·체류비자를 신청합니다.", cautions: ["부족직종 또는 노동시장 심사 통과가 필요할 수 있습니다.", "초기 허가는 업종과 지역에 묶일 수 있습니다."] },
    "highly-qualified-worker": { duration: "최초 1년", application: "고용주가 고숙련 취업허가를 신청한 뒤 신청자가 취업·체류비자를 신청합니다.", cautions: ["EU 블루카드와 스페인 국내 고숙련 경로가 병존합니다.", "회사·직무·급여 기준을 확인해야 합니다."] },
    student: { duration: "승인된 과정기간", application: "인가된 교육기관 입학 후 학생비자와 학업 체류허가를 신청합니다.", cautions: ["근로는 학업과 양립해야 하며 고용주가 취업허가를 신청합니다.", "근로소득이 체류 재정증명의 필수 재원이어서는 안 됩니다."] },
  },
  Sweden: {
    "employed-worker": { duration: "계약기간 · 회당 최대 2년", application: "서면 잡오퍼를 받은 뒤 고용조건 심사를 포함한 취업·체류허가를 신청합니다.", cautions: ["고용주는 통상 스웨덴과 EU에 구인공고를 먼저 내야 합니다.", "최대 2년을 추가 연장할 수 있습니다."] },
    "highly-qualified-worker": { duration: "계약기간 · 회당 최대 2년", application: "일반 취업허가, EU 블루카드 또는 ICT 중 조건에 맞는 경로로 신청합니다.", cautions: ["경로마다 학력·급여·고용기간 기준이 다릅니다.", "일반 허가는 최대 2년 추가 연장이 가능합니다."] },
    student: { duration: "일반적으로 1년 · 최초 신청 최대 13개월", application: "3개월을 넘는 학업의 입학과 학비·재정·보험 증빙으로 학생 체류허가를 신청합니다.", cautions: ["대학·대학원 학생은 학생 체류허가가 유효한 동안 별도 취업허가 없이 일할 수 있습니다.", "중등학교·일부 과정은 취업허가 없이 일할 수 없습니다."] },
  },
};
const euPortalVisaList = euCountries.flatMap(([country]) => euRouteTypes.map(({ officialSlug, priorityDetail, ...route }) => ({
  ...visa({
    country, ...route,
    duration: priorityDetail && priorityDetailCountries.has(country) ? priorityFacts[country][officialSlug as keyof PriorityFacts[string]].duration : "Varies by national route",
    eligible_passports: "Eligible non-EU citizens",
    age_range: "No single general age limit",
    application_process: "Use the European Commission immigration portal to check the destination country's current conditions and competent national authority.",
    application_process_ko: priorityDetail && priorityDetailCountries.has(country) ? priorityFacts[country][officialSlug as keyof PriorityFacts[string]].application : undefined,
    restrictions: ["National eligibility, duration and work conditions vary", "Confirm the current country-specific rules before applying"],
    official_link: `https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/${officialSlug}-${country.toLowerCase()}_en`,
    restrictions_ko: priorityDetail && priorityDetailCountries.has(country) ? priorityFacts[country][officialSlug as keyof PriorityFacts[string]].cautions : undefined,
    source_status: priorityDetail && priorityDetailCountries.has(country) ? "Official source checked" : "Official overview checked",
    detail_available: priorityDetailCountries.has(country) && priorityDetail === true,
  }),
  slug: `${slugify(country)}-${slugify(route.category)}-${officialSlug}`,
})));

export const workVisaList: Visa[] = [...verifiedVisaList, ...euPortalVisaList];

// Backwards-compatible name for older imports.
export const visalist = workVisaList;
