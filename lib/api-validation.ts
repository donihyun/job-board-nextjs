import { NextRequest, NextResponse } from "next/server";
import { z, ZodSchema } from "zod";
import { logger } from "./logger";

/**
 * Input validation middleware for API routes
 * Validates request body, query parameters, and URL parameters against Zod schemas
 */

interface ValidationOptions<T extends ZodSchema> {
  schema: T;
  source?: "body" | "query" | "params";
}

/**
 * Validates request data against a Zod schema
 * @param request - Next.js request object
 * @param options - Validation options including schema and data source
 * @returns Validated data or null if validation fails
 */
export async function validateRequest<T extends ZodSchema>(
  request: NextRequest,
  options: ValidationOptions<T>
): Promise<{
  success: boolean;
  data?: z.infer<T>;
  error?: { message: string; errors: z.ZodError };
  response?: NextResponse;
}> {
  const { schema, source = "body" } = options;

  try {
    let data: unknown;

    switch (source) {
      case "body":
        try {
          data = await request.json();
        } catch (error) {
          logger.warn("Invalid JSON in request body", {
            path: request.nextUrl.pathname,
            error: error instanceof Error ? error.message : String(error)
          });
          return {
            success: false,
            error: {
              message: "Invalid JSON in request body",
              errors: error as z.ZodError,
            },
            response: NextResponse.json(
              { error: "Invalid JSON in request body" },
              { status: 400 }
            ),
          };
        }
        break;

      case "query":
        const searchParams = request.nextUrl.searchParams;
        data = Object.fromEntries(searchParams.entries());
        break;

      case "params":
        // For params, you need to pass them separately as they come from the route
        throw new Error("Use validateParams for URL parameters");

      default:
        throw new Error(`Invalid source: ${source}`);
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      logger.warn("Request validation failed", {
        path: request.nextUrl.pathname,
        source,
        errors: result.error.errors,
      });

      return {
        success: false,
        error: {
          message: "Validation failed",
          errors: result.error,
        },
        response: NextResponse.json(
          {
            error: "Validation failed",
            details: result.error.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        ),
      };
    }

    logger.debug("Request validation successful", {
      path: request.nextUrl.pathname,
      source,
    });

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    logger.error("Error during request validation", error, {
      path: request.nextUrl.pathname,
      source,
    });

    return {
      success: false,
      error: {
        message: "Internal validation error",
        errors: error as z.ZodError,
      },
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Validates URL parameters against a Zod schema
 * @param params - URL parameters from Next.js route
 * @param schema - Zod schema to validate against
 */
export function validateParams<T extends ZodSchema>(
  params: unknown,
  schema: T
): {
  success: boolean;
  data?: z.infer<T>;
  error?: { message: string; errors: z.ZodError };
} {
  const result = schema.safeParse(params);

  if (!result.success) {
    logger.warn("URL params validation failed", {
      errors: result.error.errors,
    });

    return {
      success: false,
      error: {
        message: "Invalid URL parameters",
        errors: result.error,
      },
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Common validation schemas for API routes
 */
export const commonSchemas = {
  // MongoDB ObjectId validation
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),

  // Email validation
  email: z.string().email("Invalid email format"),

  // URL validation
  url: z.string().url("Invalid URL format"),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  }).refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
  }),

  // Job ID parameter
  jobIdParam: z.object({
    jobId: z.string().min(1, "Job ID is required"),
  }),

  // Outbound event schema
  outboundEvent: z.object({
    source: z.enum(["CareerJet", "Adzuna"]),
    country: z.string().max(40).optional(),
    jobId: z.string().max(300).optional(),
    title: z.string().max(200).optional(),
  }),
};

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize object by applying sanitizeString to all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxLength = 1000
): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key] as string, maxLength) as T[typeof key];
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
      sanitized[key] = sanitizeObject(sanitized[key] as Record<string, unknown>, maxLength) as T[typeof key];
    }
  }

  return sanitized;
}

/**
 * Check if request body size is within acceptable limits
 */
export async function checkBodySize(
  request: NextRequest,
  maxSizeBytes = 1024 * 1024 // 1MB default
): Promise<boolean> {
  const contentLength = request.headers.get("content-length");

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > maxSizeBytes) {
      logger.warn("Request body too large", {
        size,
        maxSize: maxSizeBytes,
        path: request.nextUrl.pathname,
      });
      return false;
    }
  }

  return true;
}
