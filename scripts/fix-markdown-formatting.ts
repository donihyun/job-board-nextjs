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

function parseInlineMarks(text: string): any[] {
  const children: any[] = []
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|([^*]+)/g
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      children.push({
        _type: 'span',
        text: match[2],
        marks: ['strong'],
      })
    } else if (match[4]) {
      children.push({
        _type: 'span',
        text: match[4],
        marks: ['em'],
      })
    } else if (match[5]) {
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

function fixBlock(block: any): any {
  if (!block.children || block.children.length === 0) {
    return block
  }

  // Check if block has only one child with plain text containing markdown
  const firstChild = block.children[0]
  if (
    block.children.length === 1 &&
    firstChild._type === 'span' &&
    typeof firstChild.text === 'string' &&
    (firstChild.text.includes('**') || firstChild.text.includes('*'))
  ) {
    return {
      ...block,
      children: parseInlineMarks(firstChild.text),
    }
  }

  return block
}

async function main() {
  console.log('🔧 Fixing markdown formatting in existing posts...\n')

  const posts = await sanityClient.fetch('*[_type == "post" && defined(body)]{ _id, title, body }')

  console.log(`Found ${posts.length} posts\n`)

  for (const post of posts) {
    const fixedBody = post.body.map(fixBlock)

    // Check if anything changed
    const hasChanges = JSON.stringify(fixedBody) !== JSON.stringify(post.body)

    if (hasChanges) {
      console.log(`📝 Fixing: ${post.title}`)
      await sanityClient.patch(post._id).set({ body: fixedBody }).commit()
      console.log(`   ✅ Updated\n`)
    } else {
      console.log(`⏭️  Skipping: ${post.title} (no markdown to fix)\n`)
    }
  }

  console.log('🎉 Migration complete!')
}

main().catch(console.error)
