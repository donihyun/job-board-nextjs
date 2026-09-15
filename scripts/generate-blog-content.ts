import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.NEXT_SANITY_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  keywords: string[]
  readTime: number
}

async function generateBlogPost(topic: string): Promise<BlogPost> {
  const prompt = `Write a comprehensive, SEO-optimized blog post about: "${topic}"

Context: This is for VIKB (Australia Working Holiday Jobs), a platform helping working holiday makers find jobs and settle in Australia.

Requirements:
- 1500-2000 words
- Professional but friendly tone
- Include actionable tips and real advice
- Use headings (##) and bullet points
- Include specific examples and numbers where relevant
- SEO keywords related to Australian working holiday
- Write in markdown format

Return ONLY a JSON object with this structure:
{
  "title": "SEO-friendly title (max 60 chars)",
  "excerpt": "compelling 1-2 sentence summary (max 200 chars)",
  "content": "full markdown content with ## headings",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "readTime": estimated minutes to read
}`

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer specializing in working holiday and job search content for Australia. Write detailed, helpful, SEO-optimized blog posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/(\{[\s\S]*\})/)
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from response')
  }

  const blogData = JSON.parse(jsonMatch[1])

  return {
    ...blogData,
    slug: blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }
}

function markdownToPortableText(markdown: string) {
  const blocks: any[] = []
  const lines = markdown.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) continue

    // Headings
    if (line.startsWith('## ')) {
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: line.replace('## ', '') }],
      })
    } else if (line.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: line.replace('### ', '') }],
      })
    } else if (line.startsWith('- ')) {
      // Bullet points - collect consecutive items
      const listItems: string[] = [line.replace('- ', '')]
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
        i++
        listItems.push(lines[i].trim().replace('- ', ''))
      }

      // Add as separate blocks (simplified)
      listItems.forEach(item => {
        blocks.push({
          _type: 'block',
          listItem: 'bullet',
          children: [{ _type: 'span', text: item }],
        })
      })
    } else if (line.match(/^\d+\. /)) {
      // Numbered lists
      const listItems: string[] = [line.replace(/^\d+\. /, '')]
      while (i + 1 < lines.length && lines[i + 1].trim().match(/^\d+\. /)) {
        i++
        listItems.push(lines[i].trim().replace(/^\d+\. /, ''))
      }

      listItems.forEach(item => {
        blocks.push({
          _type: 'block',
          listItem: 'number',
          children: [{ _type: 'span', text: item }],
        })
      })
    } else {
      // Regular paragraph - handle bold and italic
      let text = line
      const children: any[] = []

      // Simple text handling (no markdown parsing for now)
      children.push({ _type: 'span', text })

      blocks.push({
        _type: 'block',
        children,
      })
    }
  }

  return blocks
}

async function getUnsplashImage(keyword: string): Promise<string> {
  // Use Unsplash Source API (no auth needed for basic usage)
  return `https://source.unsplash.com/1200x600/?${encodeURIComponent(keyword)},australia,travel`
}

async function publishToSanity(post: BlogPost, categoryId: string, authorId: string) {
  const sanityPost = await sanityClient.create({
    _type: 'post',
    title: post.title,
    slug: {
      _type: 'slug',
      current: post.slug,
    },
    author: {
      _type: 'reference',
      _ref: authorId,
    },
    categories: [
      {
        _type: 'reference',
        _ref: categoryId,
      },
    ],
    publishedAt: new Date().toISOString(),
    excerpt: post.excerpt,
    readTime: post.readTime,
    featured: false,
    body: markdownToPortableText(post.content),
  })

  return sanityPost
}

async function uploadImageFromUrl(url: string): Promise<string> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
    filename: 'blog-image.jpg',
  })
  return asset._id
}

async function main() {
  console.log('🚀 Starting blog content generation...\n')

  // Get or create author
  const authors = await sanityClient.fetch('*[_type == "author"][0]')
  const authorId = authors?._id

  if (!authorId) {
    console.error('❌ No author found. Run seed-sanity.ts first.')
    process.exit(1)
  }

  // Get categories
  const categories = await sanityClient.fetch('*[_type == "category"]')
  const categoryMap: Record<string, string> = {}
  categories.forEach((cat: any) => {
    categoryMap[cat.slug.current] = cat._id
  })

  const topics = [
    {
      topic: 'How to Find Hospitality Jobs in Sydney as a Working Holiday Maker',
      category: 'work-jobs',
    },
    {
      topic: 'Complete Guide to Australian Tax File Number (TFN) for Working Holiday Visa',
      category: 'visa-immigration',
    },
    {
      topic: 'Best Budget Accommodation Options in Melbourne for Backpackers',
      category: 'life-australia',
    },
    {
      topic: 'Regional Work Guide: Mining Jobs in Western Australia',
      category: 'work-jobs',
    },
    {
      topic: 'How to Open a Bank Account in Australia on a Working Holiday Visa',
      category: 'life-australia',
    },
  ]

  for (const { topic, category } of topics) {
    try {
      console.log(`📝 Generating: ${topic}...`)
      const post = await generateBlogPost(topic)

      console.log(`✅ Generated: ${post.title}`)
      console.log(`   Read time: ${post.readTime} mins`)
      console.log(`   Keywords: ${post.keywords.join(', ')}`)

      console.log(`📤 Publishing to Sanity...`)
      await publishToSanity(post, categoryMap[category], authorId)

      console.log(`✅ Published!\n`)

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`❌ Error with topic "${topic}":`, error)
    }
  }

  console.log('🎉 Content generation complete!')
}

main().catch(console.error)
