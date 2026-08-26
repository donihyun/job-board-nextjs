"use client"

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn, checkNullandCall, formatDate } from "@/lib/utils";
import { filterJobs, type JobSort, type JobView } from "@/lib/job-filters";
import { getContractTypeLabel, getWorkHoursLabel } from "@/lib/enums";

interface Job {
  _id: string;
  url: string;
  title: {
    en: String;
    kr: String;
  };
  location: {
    en: String;
    kr: String;
  };
  company: string;
  date: string;
  salary: string;
  category: string;
  contracttype?: string;
  workHours?: string;
  source: "CareerJet" | "Adzuna";
}

interface JobListProps {
  joblist: Job[];
  nextPage: number;
  country: string;
  industry: string;
  s: string;
  location: string;
  pageNum: string;
  type: string;
  hours: string;
  days: string;
}

function trackOutbound(job: Job, country: string) {
  fetch("/api/events/outbound", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ source: job.source, country, jobId: job._id, title: job.title.en }),
    keepalive: true,
  }).catch(() => {});
}

const JobCard = ({ job, country }: { job: Job; country: string }) => {
  return (
    <li className="mb-5 min-h-[150px] w-full rounded-md border-2 border-zinc-200 bg-zinc-100">
      <div className="flex flex-col gap-6 px-4 pb-5 pt-5 sm:flex-row sm:justify-between sm:items-start">
        <div className="min-w-0 flex flex-col">
          <div className="flex items-start group gap-x-4">
            <h1 className="font-bold text-lg max-w-[500px]">{job.title.en}</h1>
          </div>
          <div className="flex items-center mt-5 gap-x-5">
            <div className="text-primary rounded-full bg-white p-1 px-2 text-sm w-max">
              {formatDate(job.date)}
            </div>
            {job.salary && (
              <div className="text-pink-600 rounded-full bg-white p-1 px-2 text-sm w-max">
                {job.salary}
              </div>
            )}
          </div>
          <div className="flex items-center mt-5 gap-x-5">
            <div className="text-indigo-600 rounded-full bg-white p-1 px-2 text-sm w-max">
              {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
            </div>
            {job.contracttype && <div
              className={cn(
                job.contracttype === "p" ? "text-violet-600" : "text-amber-600",
                "rounded-full bg-white p-1 px-2 text-sm w-max"
              )}
            >
              {getContractTypeLabel(job.contracttype)}
            </div>}
            {job.workHours && (
              <div className="w-max rounded-full bg-white p-1 px-2 text-sm text-emerald-700">
                {getWorkHoursLabel(job.workHours)}
              </div>
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-y-4 text-muted-foreground sm:w-[38%] lg:w-[32%]">
          <div className="flex gap-x-2 items-center">
            <Image src="/business.svg" width={20} height={20} alt="company" />
            <h2 className="font-medium">{job.company}</h2>
          </div>
          <div className="flex gap-x-2 items-center">
            <Image src="/location.svg" width={20} height={20} alt="location" />
            <p className="font-medium">{job.location.en}</p>
          </div>
          <Link
            href={job.url}
            onClick={() => trackOutbound(job, country)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="flex w-fit max-w-full items-center gap-x-1 whitespace-nowrap rounded-md border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:bg-indigo-600 hover:text-white"
          >
            Continue with {job.source}
            <MoveRight className="h-5 w-5" />
          </Link>
          {job.source === "Adzuna" && (
            <Link
              href="https://www.adzuna.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[23px] min-w-[116px] w-fit items-center justify-center text-xs font-semibold text-muted-foreground underline"
            >
              Jobs by Adzuna
            </Link>
          )}
        </div>
      </div>
    </li>
  );
};

export default function JobList({
  joblist,
  nextPage,
  country,
  industry,
  s,
  location,
  pageNum,
  type,
  hours,
  days,
}: JobListProps) {
  const pageNumInt = parseInt(pageNum, 10);
  const [source, setSource] = useState<JobView>("all");
  const [salaryOnly, setSalaryOnly] = useState(false);
  const [sort, setSort] = useState<JobSort>("mixed");
  const visibleJobs = useMemo(
    () => filterJobs(joblist, source, salaryOnly, sort, days),
    [joblist, source, salaryOnly, sort, days]
  );
  const sourceCount = (name: Job["source"]) => joblist.filter((job) => job.source === name).length;

  if (joblist.length === 0) {
    return (
      <div className="text-primary w-full flex justify-center mt-16 text-3xl font-semibold">
        No results found
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 ml-5 flex flex-wrap items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 text-sm">
        <label className="font-medium" htmlFor="job-source">Source</label>
        <select
          id="job-source"
          value={source}
          onChange={(event) => setSource(event.target.value as JobView)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2"
        >
          <option value="all">All ({joblist.length})</option>
          <option value="CareerJet">CareerJet ({sourceCount("CareerJet")})</option>
          <option value="Adzuna">Adzuna ({sourceCount("Adzuna")})</option>
        </select>
        <label className="ml-1 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={salaryOnly}
            onChange={(event) => setSalaryOnly(event.target.checked)}
            className="h-4 w-4 accent-black"
          />
          Salary listed
        </label>
        <label className="ml-auto font-medium" htmlFor="job-sort">Sort</label>
        <select
          id="job-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as JobSort)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2"
        >
          <option value="mixed">Mixed sources</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      {visibleJobs.length === 0 && (
        <p className="ml-5 rounded-md bg-zinc-100 p-6 text-center text-muted-foreground">
          No jobs match these filters.
        </p>
      )}
      <ul className="mb-1 ml-5">
        {visibleJobs.map((job) => (
          <JobCard key={job._id} job={job} country={country} />
        ))}
      </ul>

      <Pagination className="mt-10 mb-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?${checkNullandCall({
                country,
                page: String(pageNumInt - 1),
                industry,
                s,
                location,
                type,
                hours,
                days,
              })}`}
              className={cn(
                pageNum === "1" ? "hidden" : "",
                "text-center min-w-[100px] bg-indigo-200 rounded-lg p-2 hover:bg-indigo-500 hover:text-white"
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`?${checkNullandCall({
                country,
                page: String(pageNumInt + 1),
                industry,
                s,
                location,
                type,
                hours,
                days,
              })}`}
              className={cn(
                nextPage === 0 ? "hidden" : "",
                "text-center min-w-[100px] bg-indigo-200 rounded-lg p-2 hover:bg-indigo-500 hover:text-white"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
