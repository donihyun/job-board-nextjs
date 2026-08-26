import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's strip-types runner requires the explicit extension.
import { filterJobs } from "./job-filters.ts";
// @ts-expect-error Node's strip-types runner requires the explicit extension.
import { expandKoreanJobQuery } from "./job-keywords.ts";

const jobs = [
  { source: "CareerJet", salary: "", date: "2026-08-17" },
  { source: "Adzuna", salary: "$30", date: "2026-08-19" },
  { source: "CareerJet", salary: "$25", date: "2026-08-18" },
];

test("filters by source and salary, then sorts newest first", () => {
  assert.deepEqual(filterJobs(jobs, "CareerJet", true, "newest"), [jobs[2]]);
  assert.deepEqual(filterJobs(jobs, "all", false, "newest"), [jobs[1], jobs[2], jobs[0]]);
});

test("filters by posting age", () => {
  assert.deepEqual(filterJobs(jobs, "all", false, "mixed", "1", Date.parse("2026-08-19T23:00:00Z")), [jobs[1]]);
});

test("expands common Korean job searches", () => {
  assert.equal(expandKoreanJobQuery(" 주방 보조 "), "kitchen hand");
  assert.equal(expandKoreanJobQuery("호텔 프론트"), "hotel receptionist");
  assert.equal(expandKoreanJobQuery("피커 패커"), "picker packer");
  assert.equal(expandKoreanJobQuery("자동차 정비"), "automotive mechanic");
  assert.equal(expandKoreanJobQuery("노인 돌봄"), "aged care worker");
  assert.equal(expandKoreanJobQuery("software engineer"), "software engineer");
});
