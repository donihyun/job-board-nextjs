import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's strip-types runner requires the explicit extension.
import { normalizeAge, normalizeMoney, normalizeVisaDuration, normalizeWorkHours, workVisaList } from "../constants/visas.ts";

test("normalizes Korean and English visa durations into months", () => {
  assert.deepEqual(normalizeVisaDuration("Usually 2–3 years; stream rules vary"), { min_months: 24, max_months: 36, basis: "varies" });
  assert.deepEqual(normalizeVisaDuration("계약기간 · 최대 5년"), { min_months: null, max_months: 60, basis: "contract" });
  assert.deepEqual(normalizeVisaDuration("For the approved course period"), { min_months: null, max_months: null, basis: "course" });
});

test("normalizes filter fields without parsing descriptive notes", () => {
  assert.deepEqual(normalizeAge("Usually 35 or under; exceptions apply"), { min_age: null, max_age: 35, varies: true });
  assert.deepEqual(normalizeAge("Applicants over 45 may need pension provision"), { min_age: null, max_age: null, varies: true });
  assert.deepEqual(normalizeWorkHours("Limited hours", ["Generally up to 48 hours per fortnight"]), { type: "Limited", max_hours_per_week: 24 });
  assert.deepEqual(normalizeMoney("EUR 3,960 per month on the checked official page"), { status: "Required", amount: 3960, currency: "EUR", period: "Monthly" });
});

test("classifies permanent-residence relevance for every visa", () => {
  assert.equal(workVisaList.length, 220);
  assert.equal(workVisaList.every((visa) => Boolean(visa.pr_relevance)), true);
  assert.equal(workVisaList.every((visa) => Boolean(visa.pr_relevance_note)), true);
  assert.equal(workVisaList.filter((visa) => visa.pr_relevance === "Conditional").length, 0);
  assert.equal(workVisaList.filter((visa) => visa.job_offer_required === "Varies").length, 0);
  assert.equal(workVisaList.every((visa) => Boolean(visa.job_offer_note)), true);
  assert.equal(workVisaList.every((visa) => Boolean(visa.korean_passport) && Boolean(visa.age_normalized) && Boolean(visa.work_hours_normalized)), true);
  assert.equal(workVisaList.every((visa) => Boolean(visa.metadata_audit.checked_at) && Boolean(visa.application_fee_normalized.status)), true);
  assert.equal(workVisaList.filter((visa) => visa.application_fee_normalized.status === "Verified").length > 0, true);
  assert.equal(workVisaList.find((visa) => visa.country === "Romania" && visa.category === "Student")?.pr_relevance, "Residence partly counts");
  assert.equal(workVisaList.find((visa) => /seasonal|계절/i.test(visa.visa_type))?.pr_relevance, "Does not count");
});
