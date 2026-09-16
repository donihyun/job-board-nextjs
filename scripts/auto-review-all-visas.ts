#!/usr/bin/env tsx
/**
 * Automated Visa Review Script
 *
 * Spawns Codex reviewer agents to verify all visas in Sanity
 * Generates report of issues and suggested fixes
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

interface ReviewResult {
  visa: {
    country: string
    visa_type: string
    slug: string
    official_link: string
  }
  status: 'pending' | 'approved' | 'needs_update' | 'failed'
  confidence?: number
  changes_found?: string[]
  needs_update?: any[]
  error?: string
}

const ALREADY_REVIEWED = [
  'australia-working-holiday-visa-subclass-417',
  'canada-iec-young-professionals',
  'united-kingdom-graduate-visa',
  'germany-eu-blue-card',
  'new-zealand-accredited-employer-work-visa-aewv',
  'ireland-critical-skills-employment-permit',
  'france-student-student',
  'france-temporary-work-seasonal-worker',
]

async function getAllUnreviewedVisas() {
  const visas = await sanityClient.fetch<any[]>(
    `*[_type == "visa" && !(slug.current in $reviewed)] | order(country asc) {
      country,
      visa_type,
      category,
      korean_passport,
      official_link,
      last_verified,
      "slug": slug.current
    }`,
    { reviewed: ALREADY_REVIEWED }
  )

  return visas
}

async function generateReviewPrompt(visa: any): Promise<string> {
  return `Verify visa accuracy: ${visa.country} - ${visa.visa_type}

Official source: ${visa.official_link}
Last verified: ${visa.last_verified || 'Unknown'}

Current data:
- Category: ${visa.category}
- Korean passport: ${visa.korean_passport}

Quick verification:
1. Official link active?
2. Korea still eligible? (check for ${visa.korean_passport})
3. Any major requirement changes since last verification?
4. Critical updates needed?

Return JSON (concise):
{
  "approved": true/false,
  "confidence": 0-100,
  "changes_found": ["brief change 1", "brief change 2"],
  "needs_update": [{"field": "name", "issue": "brief issue", "fix": "brief fix"}],
  "checked_date": "2026-09-16"
}

If source 404/moved or Korea ineligible: approved=false, confidence=100.
If minor updates: approved=true, list in needs_update.
If unchanged: approved=true, empty arrays.`
}

async function main() {
  console.log('🤖 Automated Visa Review System\n')
  console.log('📊 Fetching unreviewed visas...\n')

  const visas = await getAllUnreviewedVisas()
  console.log(`Found ${visas.length} visas to review\n`)

  const results: ReviewResult[] = []
  const BATCH_SIZE = 10
  const batches = []

  // Split into batches
  for (let i = 0; i < visas.length; i += BATCH_SIZE) {
    batches.push(visas.slice(i, i + BATCH_SIZE))
  }

  console.log(`Processing ${batches.length} batches of ${BATCH_SIZE} visas each\n`)
  console.log('⚠️  NOTE: This script generates review prompts.')
  console.log('    For actual Codex agent orchestration, use the main Claude session.\n')
  console.log('📝 Generating review plan...\n')

  // Generate review plan for each visa
  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx]
    console.log(`\nBatch ${batchIdx + 1}/${batches.length}:`)

    for (const visa of batch) {
      console.log(`  - ${visa.country}: ${visa.visa_type}`)
      console.log(`    Link: ${visa.official_link}`)
      console.log(`    Last verified: ${visa.last_verified || 'Never'}`)

      results.push({
        visa: {
          country: visa.country,
          visa_type: visa.visa_type,
          slug: visa.slug,
          official_link: visa.official_link,
        },
        status: 'pending',
      })
    }
  }

  // Generate output report
  const report = {
    generated_at: new Date().toISOString(),
    total_visas: visas.length,
    batches: batches.length,
    batch_size: BATCH_SIZE,
    visas_by_country: visas.reduce((acc, v) => {
      acc[v.country] = (acc[v.country] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    review_queue: results,
    instructions: {
      note: 'This is a review plan. Execute reviews using Codex agents in main session.',
      next_steps: [
        '1. Use this plan to spawn reviewer agents in batches',
        '2. Each reviewer agent checks: source active, Korea eligible, changes, updates',
        '3. Collect results and update this report',
        '4. Generate fix scripts for issues found',
      ],
    },
  }

  // Save report
  const reportPath = path.join(__dirname, '..', 'visa-review-plan.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log(`\n✅ Review plan generated: ${reportPath}`)
  console.log(`\n📊 Summary:`)
  console.log(`   Total visas: ${visas.length}`)
  console.log(`   Batches: ${batches.length}`)
  console.log(`   Countries: ${Object.keys(report.visas_by_country).length}`)
  console.log(`\n   Top countries:`)
  Object.entries(report.visas_by_country)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([country, count]) => {
      console.log(`     ${country}: ${count}`)
    })

  console.log(`\n💡 Next: Execute reviews in main Claude session using Codex agents`)
}

main().catch(console.error)
