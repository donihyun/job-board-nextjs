import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { OutboundEventSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await checkRateLimit(request, "moderate");
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response;
  }

  try {
    const body = await request.json().catch(() => null);

    // Validate with Zod
    const validationResult = OutboundEventSchema.safeParse(body);

    if (!validationResult.success) {
      logger.warn("Invalid outbound event received", {
        body,
        errors: validationResult.error.issues,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Invalid event data",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { source, country, jobId, title } = validationResult.data;

    // Track outbound job click events
    logger.jobEvent("outbound_job_click", {
      source,
      country,
      jobId,
      title,
      at: new Date().toISOString(),
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Error processing outbound event", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
