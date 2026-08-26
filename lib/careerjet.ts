const locales: Record<string, string> = {
  argentina: "es_AR", australia: "en_AU", austria: "de_AT",
  belgium: "fr_BE", canada: "en_CA", czeckia: "cs_CZ",
  denmark: "da_DK", france: "fr_FR", germany: "de_DE",
  hungary: "hu_HU", ireland: "en_IE", netherlands: "nl_NL",
  japan: "ja_JP", newzealand: "en_NZ", poland: "pl_PL", portugal: "pt_PT", spain: "es_ES",
  sweden: "sv_SE", taiwan: "zh_TW", uk: "en_GB",
};

export interface SearchParams {
  country: string;
  industry: string;
  query: string;
  location: string;
  page: number;
  type: string;
  hours: string;
  days: string;
  userIp: string;
  userAgent: string;
}

interface CareerjetJob {
  title: string;
  company: string;
  date: string;
  locations: string;
  salary: string;
  url: string;
}

interface CareerjetResponse {
  type: string;
  pages?: number;
  jobs?: CareerjetJob[];
  error?: string;
}

export async function searchCareerjet(params: SearchParams) {
  const proxyUrl = process.env.CAREERJET_PROXY_URL;
  const proxyToken = process.env.CAREERJET_PROXY_TOKEN;
  if (!proxyUrl || !proxyToken) throw new Error("Careerjet proxy is not configured");

  const query = new URLSearchParams({
    locale_code: locales[params.country] || "en_GB",
    keywords: [params.query, params.industry === "none" ? "" : params.industry]
      .filter(Boolean).join(" "),
    page: String(Math.min(Math.max(params.page, 1), 10)),
    page_size: "20",
    user_ip: params.userIp,
    user_agent: params.userAgent,
  });
  if (params.type) query.set("contract_type", params.type);
  if (params.hours) query.set("work_hours", params.hours);
  if (params.days) query.set("sort", "date");
  if (params.location) query.set("location", params.location);

  const response = await fetch(`${proxyUrl}?${query}`, {
    headers: { Authorization: `Bearer ${proxyToken}` },
    cache: "no-store",
  });
  const data = await response.json() as CareerjetResponse;
  if (!response.ok || data.type !== "JOBS") {
    throw new Error(data.error || "Careerjet search failed");
  }

  return {
    joblist: (data.jobs || []).map((job) => ({
      _id: job.url,
      url: job.url,
      title: { en: job.title, kr: "" },
      location: { en: job.locations, kr: "" },
      company: job.company,
      date: job.date,
      salary: job.salary,
      category: params.industry === "none" ? "job" : params.industry,
      contracttype: params.type,
      workHours: params.hours,
      source: "CareerJet" as const,
    })),
    nextPage: (data.pages || 0) > params.page ? 1 : 0,
  };
}
