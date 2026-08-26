import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !["CareerJet", "Adzuna"].includes(body.source)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  // ponytail: log storage is enough for launch; move to analytics when retention matters.
  console.info("outbound_job_click", {
    source: body.source,
    country: String(body.country || "").slice(0, 40),
    jobId: String(body.jobId || "").slice(0, 300),
    title: String(body.title || "").slice(0, 200),
    at: new Date().toISOString(),
  });
  return new NextResponse(null, { status: 204 });
}
