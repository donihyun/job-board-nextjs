import assert from "node:assert/strict";
import test from "node:test";
import { isChangeCandidate, isVerdict, normalizeHtml, sha256, validateEvidence, validateSource } from "./visa-monitor.mjs";

test("normalization removes executable and navigation content", () => {
  const html = "<header>Menu</header><main><h1>Visa</h1><p>Work &amp; travel</p><script>ignore()</script></main>";
  assert.equal(normalizeHtml(html), "Visa Work & travel");
});

test("hash is stable after irrelevant whitespace changes", () => {
  assert.equal(sha256(normalizeHtml("<p>Work   allowed</p>")), sha256(normalizeHtml("<p>Work allowed</p>")));
});

test("evidence must occur verbatim in the matching snapshots", () => {
  const valid = {
    has_material_change: true,
    changes: [{ old_value: "30", new_value: "35", old_evidence: "aged 18 to 30", new_evidence: "aged 18 to 35" }],
  };
  assert.equal(validateEvidence(valid, "Applicants aged 18 to 30 may apply.", "Applicants aged 18 to 35 may apply."), true);
  assert.equal(validateEvidence(valid, "Applicants aged 18 to 30 may apply.", "No age information."), false);
});

test("source validation rejects non-HTTPS URLs", () => {
  assert.throws(() => validateSource({ id: "x", country: "X", visaName: "X", url: "http://example.com" }), /HTTPS/);
});

test("local schemas reject malformed LLM output", () => {
  assert.equal(isChangeCandidate({ has_material_change: true, changes: [] }), false);
  assert.equal(isVerdict({ verdict: "probably" }), false);
  assert.equal(isVerdict({
    verdict: "manual_review",
    evidence_supported: true,
    meaning_preserved: false,
    contradictions: [],
    missing_conditions: ["work-hour exception"],
    confidence: 0.8,
  }), true);
});
