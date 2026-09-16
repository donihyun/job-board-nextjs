# Blog Content Pipeline with Codex Agents

Full orchestration with Codex agents for generation + review.

## Usage

User provides topics:
```
Generate blog posts:
1. "How to get RSA in Sydney" | work-jobs
2. "Best share houses Melbourne" | life-australia  
```

## Workflow

For each topic:

1. **Spawn Generator** - Codex agent creates blog post
   - Given: topic, category, target audience
   - Output: title, excerpt, content (markdown), keywords, actionItems, imageKeywords, readTime

2. **Spawn Reviewer** - Codex agent reviews content
   - Given: generated post + topic
   - Reviews: accuracy, value, safety, tone
   - Output: approved/rejected + issues/suggestions

3. **Publish** - If approved, convert to Sanity format and publish
   - Markdown → Portable Text
   - Fetch Pexels image
   - Upload to Sanity

4. **Report** - Summary of what was published/rejected

## Generator Agent Brief

"Create a comprehensive blog post about: {topic}

Context: VIKB helps working holiday makers in Australia find jobs and settle.

Target: {audience} (working-holiday/backpacker/etc)
Category: {category}

Requirements:
- 1500-2000 words
- Professional but friendly tone
- Specific examples, numbers, dates
- Actionable advice (not generic)
- Proper markdown (## headings, bullets)
- SEO keywords for Australian working holiday

Return JSON:
{
  title: string (10-60 chars),
  excerpt: string (50-200 chars),
  content: string (markdown),
  keywords: string[] (3-10),
  readTime: number (5-20 mins),
  targetAudience: string,
  actionItems: string[] (3-8),
  relatedTopics: string[] (2-5),
  imageKeywords: string[] (2-5)
}"

## Reviewer Agent Brief

"Review this AI-generated blog post for publication.

Topic: {topic}
Post: {generated JSON}

Check:
1. Factual accuracy (Australian visa/jobs/life)
2. Practical value (actionable tips)
3. Safety (no harmful advice - legal/financial/safety)
4. Tone (appropriate for backpackers)
5. Completeness (covers topic adequately)

Return JSON:
{
  approved: boolean,
  score: number (0-100),
  issues: string[],
  suggestions: string[]
}"

## Coordinator Flow

```typescript
for each topic:
  // 1. Generate
  generator = spawn_agent("generator", generatorBrief)
  content = await generator.result()
  
  // 2. Review
  reviewer = spawn_agent("reviewer", reviewerBrief(content))
  review = await reviewer.result()
  
  // 3. Decide
  if (review.approved):
    // 4. Publish
    image = fetchPexels(content.imageKeywords)
    sanity.create(convertToSanity(content, image))
    report("✅ Published: " + content.title)
  else:
    report("❌ Rejected: " + review.issues.join(", "))
```

No external APIs needed (except Pexels for images).
Pure Codex orchestration.
