export type JobView = "all" | "CareerJet" | "Adzuna";
export type JobSort = "mixed" | "newest";

export function filterJobs<T extends { source: string; salary: string; date: string }>(
  jobs: T[], source: JobView, salaryOnly: boolean, sort: JobSort,
  days = "", now = Date.now()
) {
  const cutoff = days ? now - Number(days) * 86_400_000 : 0;
  const filtered = jobs.filter((job) =>
    (source === "all" || job.source === source) &&
    (!salaryOnly || Boolean(job.salary)) &&
    (!cutoff || Date.parse(job.date) >= cutoff)
  );
  return sort === "newest"
    ? filtered.slice().sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
    : filtered;
}
