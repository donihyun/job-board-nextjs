import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";

const { CAREERJET_API_KEY, CAREERJET_PROXY_TOKEN, CAREERJET_SITE_URL } = process.env;

if (!CAREERJET_API_KEY || !CAREERJET_PROXY_TOKEN || !CAREERJET_SITE_URL) {
  throw new Error("Missing Careerjet proxy environment variables");
}

const allowedParams = [
  "locale_code", "keywords", "location", "contract_type", "work_hours",
  "fragment_size", "sort", "offset", "page", "page_size", "radius",
  "user_ip", "user_agent",
];

const authorized = (header = "") => {
  const actual = Buffer.from(header.replace(/^Bearer /, ""));
  const expected = Buffer.from(CAREERJET_PROXY_TOKEN);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

createServer(async (request, response) => {
  if (request.method !== "GET" || !authorized(request.headers.authorization)) {
    response.writeHead(401).end();
    return;
  }

  const incoming = new URL(request.url, "http://localhost");
  if (incoming.pathname !== "/careerjet") {
    response.writeHead(404).end();
    return;
  }

  const target = new URL("https://search.api.careerjet.net/v4/query");
  for (const name of allowedParams) {
    const value = incoming.searchParams.get(name);
    if (value) target.searchParams.set(name, value);
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CAREERJET_API_KEY}:`).toString("base64")}`,
        Referer: CAREERJET_SITE_URL,
      },
      signal: AbortSignal.timeout(10_000),
    });
    response.writeHead(upstream.status, { "content-type": "application/json" });
    response.end(await upstream.text());
  } catch {
    response.writeHead(502, { "content-type": "application/json" });
    response.end(JSON.stringify({ type: "ERROR", error: "Careerjet unavailable" }));
  }
}).listen(Number(process.env.PORT || 8080), "0.0.0.0");
