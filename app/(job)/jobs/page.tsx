export const dynamic = 'force-dynamic';
import { searchCareerjet } from "@/lib/careerjet";
import { searchAdzuna } from "@/lib/adzuna";
import { expandKoreanJobQuery } from "@/lib/job-keywords";
import { workingHolidayJobs } from "@/constants/jobs";
import JobPageClient from "@/components/jobpageclient";
import { Suspense } from "react";
import Loading from "./loading";
import { headers } from "next/headers";

export const revalidate = 0;
interface Category {
  name: string;
  keyword: string;
}

export interface JobFilters {
  country: string;
  industry: string;
  query: string;
  location: string;
  page: number;
  type: string;
  hours: string;
  days: string;
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function JobPage({ searchParams }: PageProps) {
  const filters: JobFilters = {
    country: (searchParams.country as string) ?? "canada",
    industry: (searchParams.category as string) ?? "none",
    query: (searchParams.q as string) ?? "",
    location: (searchParams.location as string) ?? "",
    page: Number(searchParams.page) || 1,
    type: (searchParams.type as string) ?? "",
    hours: (searchParams.hours as string) ?? "",
    days: (searchParams.days as string) ?? ""
  };

  try {
    const requestHeaders = headers();
    const params = {
      country: filters.country,
      industry: filters.industry,
      query: expandKoreanJobQuery(filters.query),
      location: filters.location,
      page: filters.page,
      type: filters.type,
      hours: filters.hours,
      days: filters.days,
      userIp: requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1",
      userAgent: requestHeaders.get("user-agent") || "VIKB",
    };
    const searches = await Promise.allSettled([
      searchCareerjet(params),
      searchAdzuna(params),
    ]);

    // Log any provider failures
    searches.forEach((result, index) => {
      if (result.status === "rejected") {
        const providerName = index === 0 ? 'CareerJet' : 'Adzuna';
        console.error(`${providerName} search failed:`, result.reason);
      }
    });

    const results = searches.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : []
    );
    if (!results.length) throw new Error("All job providers failed");

    const lists = results.map((result) => result.joblist);
    const candidates = Array.from(
      { length: Math.max(0, ...lists.map((list) => list.length)) },
      (_, index) => lists.flatMap((list) => list[index] ? [list[index]] : [])
    ).flat();
    const seen = new Set<string>();
    const joblist = candidates.filter((job) => {
      const key = `${job.title.en}|${job.company}|${job.location.en}`
        .normalize("NFKC").toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const nextPage = results.some((result) => result.nextPage) ? 1 : 0;
    const category = workingHolidayJobs.find(
      (elem) => elem.country === filters.country
    )?.jobList ?? [];

    return (
      <Suspense fallback={<Loading />}>
        <JobPageClient
          initialJobs={joblist ?? []}
          nextPage={nextPage ?? 0}
          initialFilters={filters}
          categories={category}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching job data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error loading jobs. Please try again later.</p>
      </div>
    );
  }
}
