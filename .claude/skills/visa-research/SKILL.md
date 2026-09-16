---
name: visa-research
description: Research and add new visas to Sanity CMS via Codex orchestration
---

# Visa Research Pipeline with Codex Agents

Orchestrated research pipeline for discovering and adding new visa programs to VisaChart.

## Usage

User provides visa to research:
```
Research and add:
- "Finland working holiday visa for South Korea"
- "Italy digital nomad visa"
- "Spain student visa work rights"
```

## Workflow

For each visa:

1. **Spawn Researcher** - Codex agent researches visa online
   - Web search for official government sources
   - Extract: duration, age limits, work scope, requirements, official link
   - Return structured JSON matching Visa schema

2. **Spawn Reviewer** - Codex agent verifies research
   - Check: official source validity, data accuracy, completeness
   - Verify: dates, numbers, requirements match official docs
   - Output: approved/rejected + issues/corrections

3. **Publish** - If approved, add to Sanity
   - Transform to Sanity visa document
   - Upload with all normalized fields
   - Generate slug

4. **Report** - Summary of added/rejected visas

## Researcher Agent Brief

"Research the following visa program: {visa_name}

Task: Find official government immigration page and extract complete visa information.

**Required Information:**
- Country
- Visa type (official name)
- Category (Working holiday, Student, Graduate, Employer-sponsored, Job seeker, Digital nomad, Self-employed, or Temporary work)
- Duration (e.g., "Up to 12 months", "2-3 years")
- Age range (e.g., "18-30", "No age limit")
- Work scope (Open, Employer-specific, Occupation-specific, Remote foreign work, Limited hours, or Varies)
- Job offer required (Yes, No, or Varies)
- Eligible passports/nationalities
- Korean passport eligibility (Eligible, Ineligible, or Conditional)
- Processing time
- Financial proof requirements
- Application process summary
- Restrictions (array of key limitations)
- Official government link (MUST be .gov or official immigration domain)

**Research Guidelines:**
- ONLY use official government immigration websites
- Verify dates are current (2024-2026)
- Include specific numbers (amounts, hours, months)
- Note any South Korea-specific rules
- Skip if official source not found

Return JSON:
{
  \"country\": \"Finland\",
  \"visa_type\": \"Working Holiday Permit\",
  \"category\": \"Working holiday\",
  \"duration\": \"Up to 12 months\",
  \"age_range\": \"18-30\",
  \"work_scope\": \"Open\",
  \"job_offer_required\": \"No\",
  \"eligible_passports\": \"Agreement countries including South Korea\",
  \"korean_passport\": \"Eligible\",
  \"processing_time\": \"2-4 weeks\",
  \"financial_proof_required\": \"EUR 2,000\",
  \"family_allowed\": \"No dependent children\",
  \"application_process\": \"Apply online via Finnish Immigration Service with required documents...\",
  \"restrictions\": [\"Maximum 6 months with one employer\", \"Study limited to 3 months\"],
  \"official_link\": \"https://migri.fi/...\",
  \"pr_relevance\": \"Does not count\",
  \"pr_relevance_note\": \"Working holiday time does not count toward residence requirements\",
  \"last_verified\": \"2026-09-15\",
  \"source_status\": \"Official source checked\"
}

If no official source found, return:
{
  \"error\": \"No official government source found\",
  \"searched\": [\"list of URLs checked\"]
}"

## Reviewer Agent Brief

"Review this researched visa data for accuracy and completeness.

Visa: {visa_name}
Researched Data: {json}

Verification Checklist:
1. **Official Source** - Is official_link a genuine .gov or official immigration domain?
2. **Data Accuracy** - Do numbers, dates, requirements match the official page?
3. **Completeness** - Are all required fields present and specific (not generic)?
4. **Currency** - Is information current (2024-2026) or outdated?
5. **South Korea** - If claiming Korean eligibility, verify Korea is explicitly listed

Return JSON:
{
  \"approved\": true or false,
  \"confidence\": 0-100,
  \"issues\": [\"issue 1\", \"issue 2\"],
  \"corrections\": [\"suggested fix 1\", \"suggested fix 2\"],
  \"source_verified\": true or false
}"

## Coordinator Flow

```typescript
for each visa_request:
  // 1. Research
  researcher = spawn_agent("researcher", researcherBrief(visa_request))
  data = await researcher.result()
  
  if (data.error):
    report("❌ Not found: " + visa_request)
    continue
  
  // 2. Review
  reviewer = spawn_agent("reviewer", reviewerBrief(visa_request, data))
  review = await reviewer.result()
  
  // 3. Decide
  if (review.approved && review.confidence >= 80):
    // 4. Publish to Sanity
    sanity.create(transformToSanityVisa(data))
    report("✅ Added: " + data.country + " - " + data.visa_type)
  else:
    report("❌ Rejected: " + review.issues.join(", "))
    if (review.corrections):
      report("💡 Suggestions: " + review.corrections.join(", "))
```

## Notes

- Researcher needs WebSearch/WebFetch tools
- Reviewer validates against official sources
- Only add if confidence >= 80%
- Manual review recommended for rejected high-value visas
- Batch processing: research multiple visas in parallel
