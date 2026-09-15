#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { BlogPost, BlogPostSchema, DEEPSEEK_PROMPT_TEMPLATE, validatePost, scorePost } from './blog-schema'

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
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || ''

interface GenerationResult {
  version: number
  raw: string
  parsed?: BlogPost
  valid: boolean
  errors?: string[]
  score?: number
  scoreReasons?: string[]
}

async function generateVersion(topic: string, versionNum: number): Promise<GenerationResult> {
  const prompt = DEEPSEEK_PROMPT_TEMPLATE.replace('{TOPIC}', topic)

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
          content: 'You are a professional content writer. Return ONLY valid JSON, no markdown blocks, no extra text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7 + (versionNum * 0.1), // Vary temperature for diversity
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }

  const data = await response.json()
  const raw = data.choices[0].message.content

  // Try to extract JSON
  let jsonStr = raw.trim()

  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```')) {
    const match = jsonStr.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
    if (match) {
      jsonStr = match[1]
    }
  }

  try {
    const parsed = JSON.parse(jsonStr)
    const validation = validatePost(parsed)

    if (validation.valid && validation.post) {
      const { score, reasons } = scorePost(validation.post)
      return {
        version: versionNum,
        raw,
        parsed: validation.post,
        valid: true,
        score,
        scoreReasons: reasons,
      }
    }

    return {
      version: versionNum,
      raw,
      valid: false,
      errors: validation.errors,
    }
  } catch (error: any) {
    return {
      version: versionNum,
      raw,
      valid: false,
      errors: [`JSON parse error: ${error.message}`],
    }
  }
}

async function generateMultipleVersions(topic: string, count: number = 3): Promise<GenerationResult[]> {
  console.log(`\n📝 Generating ${count} versions for: "${topic}"\n`)

  const results: GenerationResult[] = []

  for (let i = 1; i <= count; i++) {
    console.log(`   Version ${i}/${count}...`)
    try {
      const result = await generateVersion(topic, i)
      results.push(result)

      if (result.valid) {
        console.log(`   ✅ Valid (score: ${result.score}/100)`)
      } else {
        console.log(`   ❌ Invalid:`, result.errors?.[0])
      }

      // Rate limit
      if (i < count) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`)
      results.push({
        version: i,
        raw: '',
        valid: false,
        errors: [error.message],
      })
    }
  }

  return results
}

function selectBestVersion(results: GenerationResult[]): GenerationResult | null {
  const validResults = results.filter(r => r.valid && r.score !== undefined)

  if (validResults.length === 0) {
    return null
  }

  // Sort by score descending
  validResults.sort((a, b) => (b.score || 0) - (a.score || 0))

  return validResults[0]
}

async function fetchPexelsImage(keywords: string[]): Promise<{ url: string; photographer: string } | null> {
  if (!PEXELS_API_KEY) {
    console.log('   ⚠️  No Pexels API key, skipping image')
    return null
  }

  const query = keywords.join(' ')

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.log('   ⚠️  Pexels API error, skipping image')
      return null
    }

    const data = await response.json()

    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0]
      return {
        url: photo.src.large2x,
        photographer: photo.photographer,
      }
    }

    return null
  } catch (error) {
    console.log('   ⚠️  Failed to fetch image, skipping')
    return null
  }
}

async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: 'blog-image.jpg',
    })
    return asset._id
  } catch (error) {
    console.log('   ⚠️  Failed to upload image to Sanity')
    return null
  }
}

function parseInlineMarks(text: string): any[] {
  const children: any[] = []
  let remaining = text

  // Parse **bold**, *italic*, and plain text
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|([^*]+)/g
  let match

  while ((match = regex.exec(remaining)) !== null) {
    if (match[2]) {
      // Bold
      children.push({
        _type: 'span',
        text: match[2],
        marks: ['strong'],
      })
    } else if (match[4]) {
      // Italic
      children.push({
        _type: 'span',
        text: match[4],
        marks: ['em'],
      })
    } else if (match[5]) {
      // Plain text
      const plainText = match[5].trim()
      if (plainText) {
        children.push({
          _type: 'span',
          text: plainText,
        })
      }
    }
  }

  return children.length > 0 ? children : [{ _type: 'span', text }]
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
        children: parseInlineMarks(line.replace('## ', '')),
      })
    } else if (line.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: parseInlineMarks(line.replace('### ', '')),
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
          children: parseInlineMarks(item),
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
          children: parseInlineMarks(item),
        })
      })
    } else {
      blocks.push({
        _type: 'block',
        children: parseInlineMarks(line),
      })
    }
  }

  return blocks
}

async function publishToSanity(post: BlogPost, categorySlug: string) {
  const author = await sanityClient.fetch('*[_type == "author"][0]')
  if (!author) {
    throw new Error('No author found')
  }

  const categories = await sanityClient.fetch('*[_type == "category"]')
  const category = categories.find((c: any) => c.slug.current === categorySlug)

  if (!category) {
    throw new Error(`Category ${categorySlug} not found`)
  }

  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Fetch and upload image
  let mainImageAssetId: string | null = null
  if (post.imageKeywords && post.imageKeywords.length > 0) {
    console.log(`   🖼️  Fetching image: ${post.imageKeywords.join(', ')}`)
    const image = await fetchPexelsImage(post.imageKeywords)
    if (image) {
      console.log(`   📸 Found by ${image.photographer}`)
      mainImageAssetId = await uploadImageToSanity(image.url)
      if (mainImageAssetId) {
        console.log(`   ✅ Image uploaded`)
      }
    }
  }

  const sanityPost = await sanityClient.create({
    _type: 'post',
    title: post.title,
    slug: {
      _type: 'slug',
      current: slug,
    },
    author: {
      _type: 'reference',
      _ref: author._id,
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
    ...(mainImageAssetId && {
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: mainImageAssetId,
        },
      },
    }),
  })

  return sanityPost
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
📝 AI Blog Generator with Selection

Usage:
  pnpm blog:smart <topic> [category] [versions]
  pnpm blog:smart --batch <file>

Examples:
  pnpm blog:smart "How to get RSA in Sydney" work-jobs 3
  pnpm blog:smart "Best backpacker apps" life-australia
  pnpm blog:smart --batch topics.txt

Categories: work-jobs, life-australia, visa-immigration
Versions: 2-5 (default: 3)
    `)
    process.exit(0)
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
        const [topic, category, versions] = l.split('|').map((s: string) => s.trim())
        return {
          topic,
          category: category || 'work-jobs',
          versions: parseInt(versions || '3'),
        }
      })

    console.log(`📚 Processing ${topics.length} topics...\n`)

    for (const { topic, category, versions } of topics) {
      try {
        const results = await generateMultipleVersions(topic, versions)
        const best = selectBestVersion(results)

        if (!best || !best.parsed) {
          console.log(`\n❌ No valid version generated for: ${topic}`)
          console.log(`   All versions failed validation\n`)
          continue
        }

        console.log(`\n🏆 Best version: #${best.version} (score: ${best.score}/100)`)
        console.log(`   Title: ${best.parsed.title}`)
        console.log(`   Reasons:`)
        best.scoreReasons?.forEach(r => console.log(`      ${r}`))

        console.log(`\n📤 Publishing to Sanity...`)
        await publishToSanity(best.parsed, category)
        console.log(`✅ Published!\n`)

        await new Promise(resolve => setTimeout(resolve, 3000))
      } catch (error: any) {
        console.error(`❌ Error: ${error.message}\n`)
      }
    }

    console.log('🎉 Batch complete!')
  } else {
    const topic = args[0]
    const category = args[1] || 'work-jobs'
    const versionCount = parseInt(args[2] || '3')

    const results = await generateMultipleVersions(topic, versionCount)
    const best = selectBestVersion(results)

    if (!best || !best.parsed) {
      console.log(`\n❌ No valid version generated`)
      console.log(`\nAll versions:`)
      results.forEach(r => {
        console.log(`\nVersion ${r.version}:`)
        if (r.valid) {
          console.log(`  ✅ Valid (score: ${r.score})`)
        } else {
          console.log(`  ❌ Invalid:`)
          r.errors?.forEach(e => console.log(`     ${e}`))
        }
      })
      process.exit(1)
    }

    console.log(`\n🏆 Selected version #${best.version} (score: ${best.score}/100)`)
    console.log(`\nTitle: ${best.parsed.title}`)
    console.log(`Excerpt: ${best.parsed.excerpt}`)
    console.log(`Read time: ${best.parsed.readTime} mins`)
    console.log(`Keywords: ${best.parsed.keywords.join(', ')}`)
    console.log(`\nScoring:`)
    best.scoreReasons?.forEach(r => console.log(`  ${r}`))

    console.log(`\n📤 Publishing to Sanity...`)
    await publishToSanity(best.parsed, category)
    console.log(`✅ Published!`)
  }
}

main().catch(console.error)
