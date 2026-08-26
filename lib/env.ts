import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  WEBHOOK_SECRET: z.string().min(1, "Webhook secret is required"),

  // Database
  MONGODB_URL: z.string().url("MongoDB URL must be a valid URL"),

  // Job APIs
  CAREERJET_API_KEY: z.string().min(1, "CareerJet API key is required"),
  CAREERJET_SITE_URL: z.string().url("CareerJet site URL must be valid").optional(),
  CAREERJET_PROXY_URL: z.string().url("CareerJet proxy URL must be valid").optional(),
  CAREERJET_PROXY_TOKEN: z.string().optional(),
  ADZUNA_APP_ID: z.string().min(1, "Adzuna app ID is required"),
  ADZUNA_APP_KEY: z.string().min(1, "Adzuna app key is required"),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"),

  // AdSense (all optional)
  NEXT_PUBLIC_ADSENSE_CLIENT: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_VISACHART_SLOT: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_VISA_FINDER_SLOT: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_VISA_GUIDE_SLOT: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_COUNTRY_SLOT: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_VISA_DETAIL_TOP_SLOT: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_VISA_DETAIL_MID_SLOT: z.string().optional(),

  // Visa Monitor
  VISA_MONITOR_EXTRACTOR_MODEL: z.string().optional(),
  VISA_MONITOR_VERIFIER_MODEL: z.string().optional(),

  // Server Actions Configuration
  ALLOWED_FORWARDED_HOSTS: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Validate environment variables
export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        return `  - ${err.path.join(".")}: ${err.message}`;
      });

      console.error("❌ Invalid environment variables:");
      console.error(missingVars.join("\n"));

      return {
        success: false,
        error: error.errors,
        message: "Environment validation failed. Check the errors above."
      };
    }
    return {
      success: false,
      error,
      message: "Unexpected error during environment validation"
    };
  }
}

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Export validated env (will throw if validation fails in production)
let _env: Env | undefined;

export function getEnv(): Env {
  if (!_env) {
    const result = validateEnv();
    if (!result.success) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Environment validation failed in production");
      }
      console.warn("⚠️  Environment validation failed, but continuing in development mode");
    }
    _env = result.data as Env;
  }
  return _env;
}

// Initialize and validate on import (optional - can be called manually)
export function initEnv() {
  const result = validateEnv();
  if (!result.success && process.env.NODE_ENV === "production") {
    throw new Error("Cannot start application with invalid environment variables");
  }
  return result;
}
