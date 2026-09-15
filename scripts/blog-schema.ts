import { z } from 'zod'

export const BlogPostSchema = z.object({
  title: z.string().min(10).max(60).describe('SEO-friendly title'),
  excerpt: z.string().min(50).max(200).describe('Compelling summary'),
  content: z.string().min(1000).describe('Full markdown content with ## headings'),
  keywords: z.array(z.string()).min(3).max(10).describe('SEO keywords'),
  readTime: z.number().int().min(5).max(20).describe('Estimated read time in minutes'),
  targetAudience: z.enum(['working-holiday', 'student-visa', 'backpacker', 'general']),
  actionItems: z.array(z.string()).min(3).max(8).describe('Key actionable takeaways'),
  relatedTopics: z.array(z.string()).min(2).max(5).describe('Related topics for internal linking'),
  imageKeywords: z.array(z.string()).min(2).max(5).describe('Keywords for stock photo search'),
})

export type BlogPost = z.infer<typeof BlogPostSchema>

export const DEEPSEEK_PROMPT_TEMPLATE = `Write a comprehensive, SEO-optimized blog post about: "{TOPIC}"

Context: VIKB (Australia Working Holiday Jobs) - helping working holiday makers find jobs and settle in Australia.

Requirements:
- 1500-2000 words
- Professional but conversational tone
- Include specific examples, numbers, dates
- Use ## headings and bullet points
- Actionable advice (not generic tips)
- SEO keywords related to Australian working holiday

CRITICAL: Return ONLY valid JSON matching this EXACT schema:

{
  "title": "SEO title 10-60 chars",
  "excerpt": "Compelling 1-2 sentence summary 50-200 chars",
  "content": "Full markdown content with ## headings, - bullets, specific advice",
  "keywords": ["keyword1", "keyword2", "keyword3", "..."],
  "readTime": 8,
  "targetAudience": "working-holiday",
  "actionItems": ["Action 1", "Action 2", "Action 3", "..."],
  "relatedTopics": ["Related topic 1", "Related topic 2", "..."],
  "imageKeywords": ["keyword for photo", "another keyword", "..."]
}

Rules:
- No markdown code blocks, just pure JSON
- Content must use ## for h2, ### for h3
- Include real examples with numbers/dates
- Keywords must be relevant to Australian working holiday
- actionItems: concrete steps readers can take
- relatedTopics: other blog topics we could write about

Return ONLY the JSON object, nothing else.`

export function validatePost(data: unknown): { valid: boolean; post?: BlogPost; errors?: string[] } {
  const result = BlogPostSchema.safeParse(data)

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    }
  }

  return {
    valid: true,
    post: result.data,
  }
}

export function scorePost(post: BlogPost): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Content length
  const wordCount = post.content.split(/\s+/).length
  if (wordCount >= 1500 && wordCount <= 2500) {
    score += 20
    reasons.push(`✓ Good length (${wordCount} words)`)
  } else if (wordCount < 1000) {
    score -= 10
    reasons.push(`✗ Too short (${wordCount} words)`)
  }

  // Heading structure
  const h2Count = (post.content.match(/^## /gm) || []).length
  if (h2Count >= 4 && h2Count <= 8) {
    score += 15
    reasons.push(`✓ Good structure (${h2Count} sections)`)
  } else if (h2Count < 3) {
    score -= 5
    reasons.push(`✗ Too few sections (${h2Count})`)
  }

  // Bullet points
  const bulletCount = (post.content.match(/^- /gm) || []).length
  if (bulletCount >= 10) {
    score += 10
    reasons.push(`✓ Scannable (${bulletCount} bullets)`)
  }

  // Numbers and specificity
  const hasNumbers = /\d+/.test(post.content)
  const hasCurrency = /\$\d+/.test(post.content)
  if (hasNumbers && hasCurrency) {
    score += 15
    reasons.push('✓ Specific with numbers/prices')
  }

  // Keywords quality
  const relevantKeywords = post.keywords.filter(k =>
    k.toLowerCase().includes('australia') ||
    k.toLowerCase().includes('working holiday') ||
    k.toLowerCase().includes('visa') ||
    k.toLowerCase().includes('job')
  )
  if (relevantKeywords.length >= 3) {
    score += 10
    reasons.push(`✓ Relevant keywords (${relevantKeywords.length})`)
  }

  // Action items quality
  if (post.actionItems.length >= 5 && post.actionItems.every(a => a.length > 10)) {
    score += 10
    reasons.push('✓ Clear action items')
  }

  // Title quality
  if (post.title.length >= 30 && post.title.length <= 55) {
    score += 10
    reasons.push('✓ Optimal title length')
  }

  // Excerpt quality
  if (post.excerpt.length >= 100 && post.excerpt.length <= 180) {
    score += 10
    reasons.push('✓ Good excerpt length')
  }

  return { score, reasons }
}
