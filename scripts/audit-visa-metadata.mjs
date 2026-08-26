import { writeFile } from "node:fs/promises";
import { workVisaList } from "../constants/visas.ts";

const stripHtml = (html) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&euro;/gi, "€")
  .replace(/&pound;/gi, "£")
  .replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCodePoint(Number.parseInt(hex || dec, hex ? 16 : 10)))
  .replace(/\s+/g, " ")
  .trim();

const excerpts = (text, pattern) => {
  const found = [];
  for (const match of text.matchAll(pattern)) {
    const excerpt = text.slice(Math.max(0, match.index - 120), Math.min(text.length, match.index + 260));
    if (!found.includes(excerpt)) found.push(excerpt);
    if (found.length === 12) break;
  }
  return found;
};

const currencyOf = (token) => token.includes("€") || /EUR/i.test(token) ? "EUR"
  : token.includes("£") || /GBP/i.test(token) ? "GBP"
    : /NZD/i.test(token) ? "NZD" : /CAD/i.test(token) ? "CAD" : /AUD/i.test(token) ? "AUD" : /USD/i.test(token) ? "USD" : null;

const moneyCandidate = (items, kind) => {
  const text = items.join(" ");
  const patterns = kind === "fee"
    ? [/(?:application (?:costs|fee)|visa fee|permit fee|fee (?:of|is)|cost from|this application costs)[^€£$\d]{0,25}?((?:AUD|CAD|NZD|USD|EUR|GBP)?\s*[€£$]?\s*[\d,.]+)/i,
      /pay (?:the )?((?:AUD|CAD|NZD|USD|EUR|GBP)?\s*[€£$]\s*[\d,.]+) application fee/i]
    : [/(?:at least|minimum|required|financial means[^.]{0,40}|funds[^.]{0,40})\s*((?:AUD|CAD|NZD|USD|EUR|GBP)\s*[€£$]?\s*[\d,.]+|[€£$]\s*[\d,.]+)/i];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const token = match[1];
    const raw = token.match(/[\d,.]+/)?.[0] || "";
    const normalized = /,\d{2}$/.test(raw) ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(/,/g, "");
    const amount = Number(normalized);
    const currency = currencyOf(token);
    if (amount > 0 && currency) return { amount, currency, period: /per month|monthly/i.test(match[0]) ? "Monthly" : "Total" };
  }
  return null;
};

const processingCandidate = (items) => {
  const text = items.join(" ");
  const match = text.match(/(?:processing time|decision|processed|takes?)[^.]{0,100}?(?:within|up to)?\s*(\d+(?:\.\d+)?)\s*(business days?|working days?|days?|weeks?|months?)/i);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  return Math.ceil(value * (unit.includes("month") ? 30 : unit.includes("week") ? 7 : 1));
};

const audit = async (visa) => {
  try {
    const response = await fetch(visa.official_link, { headers: { "user-agent": "VisaChart metadata audit/1.0" }, signal: AbortSignal.timeout(20_000), redirect: "follow" });
    const text = stripHtml(await response.text());
    return {
      slug: visa.slug,
      country: visa.country,
      visa_type: visa.visa_type,
      source: visa.official_link,
      http_status: response.status,
      checked_at: new Date().toISOString().slice(0, 10),
      financial: excerpts(text, /(?:proof of funds|financial (?:means|resources|requirement)|sufficient (?:funds|resources|means)|subsistence|living expenses|enough money)/gi),
      fees: excerpts(text, /(?:application fee|visa fee|permit fee|costs?|fees?)(?:\s|:)/gi),
      processing: excerpts(text, /(?:processing time|decision within|processed within|takes? up to|within \d+ (?:days?|weeks?|months?))/gi),
    };
  } catch (error) {
    return { slug: visa.slug, country: visa.country, visa_type: visa.visa_type, source: visa.official_link, http_status: 0, checked_at: new Date().toISOString().slice(0, 10), error: String(error), financial: [], fees: [], processing: [] };
  }
};

const output = [];
for (let index = 0; index < workVisaList.length; index += 8) {
  output.push(...await Promise.all(workVisaList.slice(index, index + 8).map(audit)));
  process.stderr.write(`\r${output.length}/${workVisaList.length}`);
}
await writeFile("/tmp/visa-metadata-audit.json", JSON.stringify(output, null, 2));
const compact = Object.fromEntries(output.map((item) => {
  const failed = item.http_status < 200 || item.http_status >= 400;
  const financial = moneyCandidate(item.financial, "financial");
  const fee = moneyCandidate(item.fees, "fee");
  const maxDays = processingCandidate(item.processing);
  const status = (items, value) => failed ? "Fetch failed" : value ? "Verified" : items.length ? "Varies or not numeric" : "Not published on source";
  return [item.slug, {
    checked_at: item.checked_at,
    source_http_status: item.http_status,
    financial: { status: status(item.financial, financial), ...financial },
    fee: { status: status(item.fees, fee), ...fee },
    processing: { status: status(item.processing, maxDays), max_days: maxDays },
  }];
}));
await writeFile("data/visa-metadata-audit.json", JSON.stringify(compact, null, 2));
process.stderr.write("\n");
console.log(JSON.stringify({
  records: output.length,
  fetched: output.filter((item) => item.http_status >= 200 && item.http_status < 400).length,
  failed: output.filter((item) => item.http_status < 200 || item.http_status >= 400).length,
  withFinancial: output.filter((item) => item.financial.length).length,
  withFees: output.filter((item) => item.fees.length).length,
  withProcessing: output.filter((item) => item.processing.length).length,
}));
