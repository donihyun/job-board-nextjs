import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
interface Param{
  country:string
  industry?:string | "none",
  s?: string | "",
  page?:string | "1",
  type?:string,
  location?:string,
  hours?: string,
  days?: string,
};

interface Param {
  country: string;
  industry?: string;
  s?: string;
  page?: string;
  type?: string;
  location?: string;
}

export function checkNullandCall(param: Param): URLSearchParams {
  const paramMap = new Map<string, string>();
  
  // Always include country
  paramMap.set("country", param.country);
  
  // Only include industry/category if it exists and isn't "none"
  if (param.industry && param.industry !== "none") {
    paramMap.set("category", param.industry);
  }
  
  // Only include search query if it exists and isn't empty
  if (param.s && param.s.trim() !== "") {
    paramMap.set("q", param.s);
  }
  
  // Only include page if it exists and isn't "1"
  if (param.page && param.page !== "1") {
    paramMap.set("page", param.page);
  }
  
  // Only include type if it exists and isn't empty
  if (param.type && param.type !== "") {
    paramMap.set("type", param.type);
  }
  if (param.location && param.location !== "") {
    paramMap.set("location", param.location);
  }
  if (param.hours) paramMap.set("hours", param.hours);
  if (param.days) paramMap.set("days", param.days);
  
  return new URLSearchParams(Object.fromEntries(paramMap));
}
export function formatDate(input: string): string {
  // Create a Date object from the input string
  const date = new Date(input);

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short'
  };

  // Format the date using the options
  const formattedDate = date.toLocaleDateString('en-GB', options); // 'en-GB' gives "01 Aug", 'en-US' would give "Aug 01"

  return formattedDate;
}
export const formatCountry = (country: string): string => country.toLowerCase().trim();
