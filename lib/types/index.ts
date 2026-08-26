import { ObjectId } from "mongoose";
import { z } from "zod";

// ============================================================
// BASE JOB TYPES
// ============================================================

export interface LocalizedString {
  en: string;
  kr: string;
}

export interface JobType {
  _id: ObjectId | string;
  country: string;
  category: string;
  title: string | LocalizedString;
  location: string | LocalizedString;
  date: string;
  salary: string;
  url: string;
  company: string;
  description?: string;
  contracttype?: string;
  workHours?: string;
  source?: "MongoDB" | "CareerJet" | "Adzuna";
}

// ============================================================
// API JOB TYPES (for external APIs)
// ============================================================

export interface CareerJetJob {
  _id: string;
  url: string;
  title: LocalizedString;
  location: LocalizedString;
  company: string;
  date: string;
  salary: string;
  category: string;
  contracttype?: string;
  workHours?: string;
  source: "CareerJet";
}

export interface AdzunaJob {
  _id: string;
  url: string;
  title: LocalizedString;
  location: LocalizedString;
  company: string;
  date: string;
  salary: string;
  category: string;
  contracttype?: string;
  workHours?: string;
  source: "Adzuna";
}

// Unified job type that can come from any source
export type UnifiedJob = JobType | CareerJetJob | AdzunaJob;

// ============================================================
// USER TYPES
// ============================================================

export interface MidType {
  job: ObjectId;
  status: number;
}

export interface UserType {
  clerkId: string;
  email: string;
  username?: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  savedJobs?: MidType[];
}

export interface MidTypePopulate {
  job: JobType;
  status: number;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface JobSearchResponse {
  joblist: UnifiedJob[];
  nextPage: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================
// CLERK WEBHOOK TYPES
// ============================================================

export interface ClerkUserData {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo: string;
}

// ============================================================
// SEARCH PARAMS TYPES
// ============================================================

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

// ============================================================
// ZOD SCHEMAS FOR RUNTIME VALIDATION
// ============================================================

// CareerJet API Response Schema
export const CareerJetJobSchema = z.object({
  title: z.string(),
  company: z.string(),
  date: z.string(),
  locations: z.string(),
  salary: z.string(),
  url: z.string(),
});

export const CareerJetResponseSchema = z.object({
  type: z.string(),
  pages: z.number().optional(),
  jobs: z.array(CareerJetJobSchema).optional(),
  error: z.string().optional(),
});

// Adzuna API Response Schema
export const AdzunaJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  redirect_url: z.string(),
  created: z.string(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  contract_type: z.string().optional(),
  contract_time: z.string().optional(),
  company: z.object({
    display_name: z.string().optional(),
  }).optional(),
  location: z.object({
    display_name: z.string().optional(),
  }).optional(),
});

export const AdzunaResponseSchema = z.object({
  count: z.number().optional(),
  results: z.array(AdzunaJobSchema).optional(),
  exception: z.string().optional(),
});

// MongoDB Job Schema
export const MongoDBJobSchema = z.object({
  _id: z.union([z.string(), z.custom<ObjectId>()]),
  country: z.string(),
  category: z.string(),
  title: z.union([
    z.string(),
    z.object({
      en: z.string(),
      kr: z.string(),
    }),
  ]),
  location: z.union([
    z.string(),
    z.object({
      en: z.string(),
      kr: z.string(),
    }),
  ]),
  date: z.string(),
  salary: z.string(),
  url: z.string(),
  company: z.string(),
  description: z.string().optional(),
  contracttype: z.string().optional(),
});

// Job Filters Schema
export const JobFiltersSchema = z.object({
  country: z.string(),
  industry: z.string(),
  query: z.string(),
  location: z.string(),
  page: z.number(),
  type: z.string(),
  hours: z.string(),
  days: z.string(),
});

// Search Params Schema
export const SearchParamsSchema = JobFiltersSchema.extend({
  userIp: z.string(),
  userAgent: z.string(),
});

// User Creation Schema
export const CreateUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  photo: z.string(),
});

// Job Save Schema
export const SaveJobSchema = z.object({
  userId: z.string(),
  jobId: z.string(),
});

// API Request/Response Schemas
export const OutboundEventSchema = z.object({
  source: z.enum(["CareerJet", "Adzuna"]),
  country: z.string().max(40),
  jobId: z.string().max(300),
  title: z.string().max(200),
});

export const JobStatusUpdateSchema = z.object({
  jobId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),
  status: z.number().int().min(0).max(3),
});

export const DeleteJobResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// ============================================================
// TYPE GUARDS
// ============================================================

export function isLocalizedString(value: unknown): value is LocalizedString {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "kr" in value &&
    typeof (value as LocalizedString).en === "string" &&
    typeof (value as LocalizedString).kr === "string"
  );
}

export function isMongoDBJob(job: UnifiedJob): job is JobType {
  return !("source" in job) || job.source === "MongoDB";
}

export function isCareerJetJob(job: UnifiedJob): job is CareerJetJob {
  return "source" in job && job.source === "CareerJet";
}

export function isAdzunaJob(job: UnifiedJob): job is AdzunaJob {
  return "source" in job && job.source === "Adzuna";
}

// ============================================================
// HELPER TYPES
// ============================================================

export type JobId = string | ObjectId;

export type FilterUpdate = {
  key: keyof JobFilters;
  value: string | number;
};

export type JobCategory = {
  name: string;
  keyword: string;
};

// ============================================================
// CHECKLIST TYPES
// ============================================================

export interface ChecklistItem {
  title: string;
  description: string;
}

export interface CountryChecklistData {
  country: string;
  eligibility: ChecklistItem[];
  documents: ChecklistItem[];
  employment: ChecklistItem[];
  living: ChecklistItem[];
}

export type ChecklistCategory = 'eligibility' | 'documents' | 'employment' | 'living';
