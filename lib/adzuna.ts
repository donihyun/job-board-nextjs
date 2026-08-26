import type { SearchParams, AdzunaJob, JobSearchResponse } from "@/lib/types";
import { AdzunaResponseSchema } from "@/lib/types";
import { ContractType, WorkHours } from "@/lib/enums";

const countries: Record<string, { code: string; currency: string }> = {
  australia: { code: "au", currency: "AUD" },
  austria: { code: "at", currency: "EUR" },
  belgium: { code: "be", currency: "EUR" },
  canada: { code: "ca", currency: "CAD" },
  france: { code: "fr", currency: "EUR" },
  germany: { code: "de", currency: "EUR" },
  netherlands: { code: "nl", currency: "EUR" },
  newzealand: { code: "nz", currency: "NZD" },
  poland: { code: "pl", currency: "PLN" },
  uk: { code: "gb", currency: "GBP" },
};

interface AdzunaJobRaw {
  id: string;
  title: string;
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  contract_time?: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
}

function salary(job: AdzunaJobRaw, currency: string) {
  if (!job.salary_min && !job.salary_max) return "";
  const money = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  if (job.salary_min && job.salary_max) {
    return `${money.format(job.salary_min)}–${money.format(job.salary_max)}`;
  }
  return money.format(job.salary_min || job.salary_max || 0);
}

export async function searchAdzuna(params: SearchParams): Promise<JobSearchResponse> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const market = countries[params.country];

  if (!appId || !appKey || !market) {
    return { joblist: [], nextPage: 0 };
  }

  const query = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "20",
    what: [params.query, params.industry === "none" ? "" : params.industry]
      .filter(Boolean).join(" "),
  });

  if (params.location) query.set("where", params.location);
  if (params.type === ContractType.PERMANENT) query.set("permanent", "1");
  if (params.type === ContractType.CONTRACT) query.set("contract", "1");
  if (params.hours === WorkHours.FULL_TIME) query.set("full_time", "1");
  if (params.hours === WorkHours.PART_TIME) query.set("part_time", "1");
  if (params.days) query.set("max_days_old", params.days);

  const page = Math.max(params.page, 1);
  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${market.code}/search/${page}?${query}`,
    { next: { revalidate: 300 } } // Cache for 5 minutes
  );

  if (!response.ok) {
    throw new Error(`Adzuna API request failed with status ${response.status}`);
  }

  const rawData = await response.json();

  // Validate response with Zod
  const parseResult = AdzunaResponseSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error("Adzuna response validation failed:", parseResult.error);
    throw new Error("Invalid Adzuna API response format");
  }

  const data = parseResult.data;

  if (data.exception) {
    throw new Error(data.exception);
  }

  const joblist: AdzunaJob[] = (data.results || []).map((job) => ({
    _id: `adzuna-${job.id}`,
    url: job.redirect_url,
    title: { en: job.title, kr: "" },
    location: { en: job.location?.display_name || "", kr: "" },
    company: job.company?.display_name || "Company not listed",
    date: job.created,
    salary: salary(job, market.currency),
    category: params.industry === "none" ? "job" : params.industry,
    contracttype: job.contract_type === "permanent" ? ContractType.PERMANENT :
      job.contract_type === "contract" ? ContractType.CONTRACT : params.type,
    workHours: job.contract_time === "full_time" ? WorkHours.FULL_TIME :
      job.contract_time === "part_time" ? WorkHours.PART_TIME : params.hours,
    source: "Adzuna" as const,
  }));

  return {
    joblist,
    nextPage: (data.count || 0) > page * 20 ? 1 : 0,
  };
}
