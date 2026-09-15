#!/usr/bin/env tsx
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
      const listItems: string[] = [line.replace('- ', '')]
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
        i++
        listItems.push(lines[i].trim().replace('- ', ''))
      }
      listItems.forEach(item => {
        blocks.push({
          _type: 'block',
          listItem: 'bullet',
          children: [{ _type: 'span', text: item }],
        })
      })
    } else if (line.match(/^\d+\. /)) {
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
      blocks.push({
        _type: 'block',
        children: [{ _type: 'span', text: line }],
      })
    }
  }

  return blocks
}

async function publishToSanity(post: BlogPost, categorySlug: string, authorId: string) {
  const categories = await sanityClient.fetch('*[_type == "category"]')
  const category = categories.find((c: any) => c.slug.current === categorySlug)

  if (!category) {
    throw new Error(`Category ${categorySlug} not found`)
  }

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
        _ref: category._id,
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

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
📝 Blog Content Generator

Usage:
  pnpm generate-content <topic> [category]
  pnpm generate-content --batch <file>
  pnpm generate-content --help

Examples:
  pnpm generate-content "How to get RSA in Sydney" work-jobs
  pnpm generate-content "Best backpacker apps" life-australia
  pnpm generate-content --batch topics.txt

Categories: work-jobs, life-australia, visa-immigration
    `)
    process.exit(0)
  }

  const author = await sanityClient.fetch('*[_type == "author"][0]')
  if (!author) {
    console.error('❌ No author found. Run seed-sanity.ts first.')
    process.exit(1)
  }

  if (args[0] === '--batch') {
    const fs = require('fs')
    const file = args[1]
    if (!file) {
      console.error('❌ Batch file required')
      process.exit(1)
    }

    const topics = fs.readFileSync(file, 'utf-8')
      .split('\n')
      .filter((l: string) => l.trim() && !l.startsWith('#'))
      .map((l: string) => {
        const [topic, category] = l.split('|').map((s: string) => s.trim())
        return { topic, category: category || 'work-jobs' }
      })

    console.log(`📚 Processing ${topics.length} topics...\n`)

    for (const { topic, category } of topics) {
      try {
        console.log(`📝 Generating: ${topic}...`)
        const post = await generateBlogPost(topic)
        console.log(`✅ ${post.title} (${post.readTime} mins)`)

        console.log(`📤 Publishing...`)
        await publishToSanity(post, category, author._id)
        console.log(`✅ Published!\n`)

        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error: any) {
        console.error(`❌ Error: ${error.message}\n`)
      }
    }

    console.log('🎉 Batch complete!')
  } else {
    const topic = args[0]
    const category = args[1] || 'work-jobs'

    console.log(`📝 Generating post about: ${topic}\n`)

    try {
      const post = await generateBlogPost(topic)
      console.log(`✅ Generated: ${post.title}`)
      console.log(`   Read time: ${post.readTime} mins`)
      console.log(`   Keywords: ${post.keywords.join(', ')}\n`)

      console.log(`📤 Publishing to Sanity...`)
      await publishToSanity(post, category, author._id)
      console.log(`✅ Published!`)
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`)
      process.exit(1)
    }
  }
}

main()
