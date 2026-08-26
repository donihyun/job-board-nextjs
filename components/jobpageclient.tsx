"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import JobsearchBar from "@/components/jobsearchbar";
import ComboboxForm from "@/components/comboboxforjob";
import { BreadcrumbDemo } from "@/components/breadcrumbs";
import ToKorean from "@/components/tokorean";
import { BackgroundGradientDemo } from "@/components/cta";
import { CareerJetCta } from "@/components/careerjetcta";
import JobList from "@/components/joblist";
import { JobKeyword, jobIconsMap } from "@/components/jobiconsmap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Types
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
interface FilterUpdate {
  key: keyof JobFilters;
  value: string | number;  
}

interface Category {
  name: string;
  keyword: string;
}

interface JobPageClientProps {
  initialJobs: any[];
  nextPage: number;
  initialFilters: JobFilters;
  categories: Category[];
}
interface ActiveFiltersProps {
  filters: JobFilters;
  onClear: (key: keyof JobFilters, filter:JobFilters, router:AppRouterInstance) => void;
  router:AppRouterInstance
}
const WORK_TYPES = [
  { name: "All", type: "" },
  { name: "Permanent", type: "p" },
  { name: "Contract", type: "c" }
] as const;
const WORK_HOURS = [
  { name: "All", value: "" },
  { name: "Full-time", value: "f" },
  { name: "Part-time", value: "p" },
] as const;
const POSTED_WITHIN = [
  { name: "Any time", value: "" },
  { name: "Past 24 hours", value: "1" },
  { name: "Past 3 days", value: "3" },
  { name: "Past 7 days", value: "7" },
] as const;

// Filter Tag Components
interface FilterTagProps {
  label: string;
  onClear: () => void;
}
function FilterTag({ label, onClear }: FilterTagProps) {
  return (
    <div className="mb-5 min-w-[100px] py-2 bg-indigo-200 flex justify-center px-2 w-max relative group text-sm text-indigo-600 shadow-lg rounded-md">
      {label}
      <button
        onClick={onClear}
        className="absolute top-0 right-0 p-[0.5px] w-4 h-4 rounded-full flex justify-center items-center bg-indigo-700 hover:cursor-pointer group-hover:scale-110 duration-300 translate-x-1/4 -translate-y-1/4 text-white text-sm"
      >
        <X className="group-hover:scale-110" />
      </button>
    </div>
  );
}
function BreadCrumb({country,countryName}:{country:string,countryName:string}){
  return(
    <BreadcrumbDemo
        prev={[{ href: ["japan", "portugal"].includes(country) ? "/" : `/${country}`, name: countryName }]}
        now={{
          href: `/jobs/?country=${country}`,
          name: "Jobs"
        }}
        classname="mt-32 pt-7 ml-10"
      />
  )
}
const isValidJobKeyword = (keyword: string): keyword is JobKeyword => {
  return Object.keys(jobIconsMap).includes(keyword);
};

function NewFilters(newfilter:FilterUpdate, filters:JobFilters){
  return{
    ...filters,
    [newfilter.key]:newfilter.value
  }
}
function replaceRouter(newfilter:FilterUpdate, initialFilters:JobFilters, router:AppRouterInstance){
    const params = new URLSearchParams();
    Object.entries(NewFilters(newfilter, initialFilters)).forEach(([key, value]) => {
      if (value && value !== 'none') {
        const paramKey = key === 'industry' ? 'category' : key;
        params.set(paramKey, String(value));
      }
    });
  
    return router.replace(`?${params.toString()}`);
  }
function clearFilter(keyword:string,initialFilters:JobFilters, router:AppRouterInstance){
  if(keyword == "industry"){
    replaceRouter({key:keyword,value:"none"}, initialFilters, router)
  }
  if(keyword == "query"){
    replaceRouter({key:keyword,value:""}, initialFilters, router)
  }
  if(keyword == "type"){
    replaceRouter({key:keyword,value:""}, initialFilters, router)
  }
  if(keyword == "location"){
    replaceRouter({key:keyword,value:""}, initialFilters, router)
  }
  if(keyword == "hours" || keyword == "days"){
    replaceRouter({key:keyword,value:""}, initialFilters, router)
  }
  else{
    return
  }
}
function ActiveFilters({ filters, onClear,router}: ActiveFiltersProps) {
  if (!filters) return null;

  return (
    <>
      {filters.industry !== "none" && (
        <FilterTag
          label={filters.industry.charAt(0).toUpperCase() + filters.industry.slice(1)}
          onClear={() => onClear("industry",filters, router)}
        />
      )}
      {filters.query && (
        <FilterTag
          label={`"${filters.query}" Jobs`}
          onClear={() => onClear("query",filters, router)}
        />
      )}
      {filters.type && (
        <FilterTag
          label={filters.type === "p" ? "Permanent" : "Contract"}
          onClear={() => onClear("type",filters,router)}
        />
      )}
      {filters.location && (
        <FilterTag
          label={filters.location}
          onClear={() => onClear("location", filters, router)}
        />
      )}
      {filters.hours && (
        <FilterTag
          label={filters.hours === "f" ? "Full-time" : "Part-time"}
          onClear={() => onClear("hours", filters, router)}
        />
      )}
      {filters.days && (
        <FilterTag
          label={`Past ${filters.days === "1" ? "24 hours" : `${filters.days} days`}`}
          onClear={() => onClear("days", filters, router)}
        />
      )}
    </>
  );
}

export default function JobPageClient({
  initialJobs,
  nextPage,
  initialFilters,
  categories
}: JobPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const filters = initialFilters;
  const countryName = filters.country.charAt(0).toUpperCase() + filters.country.slice(1);
  const handleFilterChange = useCallback(async (newFilter: FilterUpdate) => {
    setIsLoading(true);
    
    try {
      await replaceRouter(newFilter, initialFilters, router);
    } finally {
      setIsLoading(false);
    }
  }, [initialFilters, router]);
  return (
    <section className="min-h-screen w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
      <BreadCrumb country={filters.country} countryName={countryName}/>
      <div className="grid items-center gap-4 lg:grid-cols-4">
        <div className="flex w-full pt-5 lg:col-span-1">
          <div className="mt-5 flex h-max w-full justify-center rounded-md border border-zinc-200 bg-white p-2">
            <ComboboxForm
              defaultValue={filters.country}
              onChange={
                (value) => {
                  router.replace(`?${new URLSearchParams({ country: value })}`);
                }
              }
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex w-full flex-col justify-start pb-8 pt-3 lg:col-span-3 lg:pl-4">
          <h1 className="font-bold text-xl ml-1">Job Search</h1>
          <div className="bg-zinc-100 border-2 border-zinc-200 p-3 flex flex-col lg:flex-row gap-y-5 items-center gap-x-5 py-5 w-full mt-3 ml-1 rounded-lg">
            <JobsearchBar
              countrykey={filters.country}
              category={filters.industry}
              query={filters.query}

            />
            <ToKorean />
          </div>
        </div>
      </div>

      <div className="grid w-full items-start gap-6 lg:grid-cols-4">
        {/* Filters Section */}
        <aside className="lg:col-span-1">
          {/* Categories */}
          <h2 className="mt-1 text-xl font-bold">Category</h2>
          <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <div className="mt-5 flex text-foreground font-semibold flex-col">
              {categories.map((cat) => {
                const IconComponent = isValidJobKeyword(cat.keyword)
                  ? jobIconsMap[cat.keyword]
                  : null;

                return (
                  <button
                    key={cat.keyword}
                    onClick={() => handleFilterChange({key:"industry", value:cat.keyword})}
                    className={cn(
                      filters.industry === cat.keyword
                        ? "bg-black text-white hover:text-white hover:bg-black"
                        : "hover:bg-zinc-200 active:bg-zinc-300",
                      "py-3 pl-2 flex items-center rounded-md hover:cursor-pointer gap-x-3 w-full text-left"
                    )}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <h2 className="mt-8 text-xl font-bold">Job type</h2>
          <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            {WORK_TYPES.map((work) => (
              <button
                key={work.type}
                onClick={() => handleFilterChange({key:"type", value:work.type})}
                className={cn(
                  filters.type === work.type
                    ? "bg-black text-white hover:text-white hover:bg-black"
                    : "hover:bg-zinc-200",
                  "py-3 pl-2 flex font-bold items-center rounded-md hover:cursor-pointer gap-x-3 w-full text-left"
                )}
              >
                {work.name}
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-bold">Hours</h2>
          <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            {WORK_HOURS.map((item) => (
              <button
                key={item.value}
                onClick={() => handleFilterChange({ key: "hours", value: item.value })}
                className={cn(
                  filters.hours === item.value ? "bg-black text-white" : "hover:bg-zinc-200",
                  "flex w-full items-center rounded-md py-3 pl-2 text-left font-bold"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-bold">Posted within</h2>
          <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            {POSTED_WITHIN.map((item) => (
              <button
                key={item.value}
                onClick={() => handleFilterChange({ key: "days", value: item.value })}
                className={cn(
                  filters.days === item.value ? "bg-black text-white" : "hover:bg-zinc-200",
                  "flex w-full items-center rounded-md py-3 pl-2 text-left font-bold"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="mt-10 hidden lg:block">
            <BackgroundGradientDemo />
          </div>
          <div className="mt-10 hidden lg:block">
            <CareerJetCta />
          </div>
        </aside>

        {/* Jobs List Section */}
        <main className="min-w-0 lg:col-span-3">
          <div className="flex items-center gap-x-10 flex-wrap">
            <h1 className="ml-5 mb-5 text-xl font-bold">
              {filters.industry === "none"
                ? "Jobs"
                : `${
                    filters.industry.charAt(0).toUpperCase() +
                    filters.industry.slice(1)
                  } Jobs`}
            </h1>

            {/* Active Filters */}
            <ActiveFilters filters={filters} onClear={clearFilter} router={router} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : (
            <JobList
              key={`${initialFilters.country}-${initialFilters.industry}-${initialFilters.query}-${initialFilters.location}-${initialFilters.page}-${initialFilters.type}-${initialFilters.hours}-${initialFilters.days}`}
              joblist={initialJobs}
              nextPage={nextPage}
              country={initialFilters.country}
              industry={initialFilters.industry}
              s={initialFilters.query}
              location={initialFilters.location}
              pageNum={String(initialFilters.page)}
              type={initialFilters.type}
              hours={initialFilters.hours}
              days={initialFilters.days}
            />
          )}
        </main>
      </div>
    </section>
  );
}
