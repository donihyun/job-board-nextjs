import type { SearchParams } from "@/lib/careerjet";

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

interface AdzunaJob {
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

interface AdzunaResponse {
  count?: number;
  results?: AdzunaJob[];
  exception?: string;
}

function salary(job: AdzunaJob, currency: string) {
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

export async function searchAdzuna(params: SearchParams) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const market = countries[params.country];
  if (!appId || !appKey || !market) return { joblist: [], nextPage: 0 };

  const query = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "20",
    what: [params.query, params.industry === "none" ? "" : params.industry]
      .filter(Boolean).join(" "),
  });
  if (params.location) query.set("where", params.location);
  if (params.type === "p") query.set("permanent", "1");
  if (params.type === "c") query.set("contract", "1");
  if (params.hours === "f") query.set("full_time", "1");
  if (params.hours === "p") query.set("part_time", "1");
  if (params.days) query.set("max_days_old", params.days);

  const page = Math.max(params.page, 1);
  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${market.code}/search/${page}?${query}`,
    { cache: "no-store" }
  );
  const data = await response.json() as AdzunaResponse;
  if (!response.ok) throw new Error(data.exception || "Adzuna search failed");

  return {
    joblist: (data.results || []).map((job) => ({
      _id: `adzuna-${job.id}`,
      url: job.redirect_url,
      title: { en: job.title, kr: "" },
      location: { en: job.location?.display_name || "", kr: "" },
      company: job.company?.display_name || "Company not listed",
      date: job.created,
      salary: salary(job, market.currency),
      category: params.industry === "none" ? "job" : params.industry,
      contracttype: job.contract_type === "permanent" ? "p" :
        job.contract_type === "contract" ? "c" : params.type,
      workHours: job.contract_time === "full_time" ? "f" :
        job.contract_time === "part_time" ? "p" : params.hours,
      source: "Adzuna" as const,
    })),
    nextPage: (data.count || 0) > page * 20 ? 1 : 0,
  };
}
