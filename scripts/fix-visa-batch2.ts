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

async function fixBatch2() {
  console.log('🔧 Fixing batch #2 visa issues...\n')

  // 1. Germany EU Blue Card - Add salary thresholds
  console.log('1. Germany EU Blue Card...')
  const deVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "germany-eu-blue-card"][0]`
  )

  if (deVisa) {
    await sanityClient
      .patch(deVisa._id)
      .set({
        financial_proof_required: 'EUR 50,700 gross annual (EUR 45,934.20 for shortage occupations)',
        financial_normalized: {
          status: 'Required',
          amount: 50700,
          currency: 'EUR',
          period: 'Total',
        },
        restrictions: [
          ...(deVisa.restrictions || []),
          'Salary threshold: €50,700 (standard) or €45,934.20 (IT, engineering, natural sciences, mathematics, medicine, recent graduates)',
          'Korean citizens can enter visa-free for 90 days and apply at local Foreigners\' Authority',
        ],
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Added salary thresholds\n')
  }

  // 2. NZ AEWV - Fix korean_passport
  console.log('2. New Zealand AEWV...')
  const nzVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "new-zealand-accredited-employer-work-visa-aewv"][0]`
  )

  if (nzVisa) {
    await sanityClient
      .patch(nzVisa._id)
      .set({
        korean_passport: 'Eligible',
        eligible_passports: 'Most nationalities, subject to eligibility',
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Fixed korean_passport to Eligible\n')
  }

  // 3. Ireland Critical Skills - Update salary thresholds
  console.log('3. Ireland Critical Skills...')
  const ieVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "ireland-critical-skills-employment-permit"][0]`
  )

  if (ieVisa) {
    await sanityClient
      .patch(ieVisa._id)
      .set({
        financial_proof_required: 'EUR 36,849 (graduate), EUR 40,909 (with degree), or EUR 68,911 (without degree) annual salary',
        financial_normalized: {
          status: 'Required',
          amount: 36849,
          currency: 'EUR',
          period: 'Total',
        },
        restrictions: [
          ...(ieVisa.restrictions || []).filter((r: string) => !r.includes('salary')),
          '2026 salary thresholds: €36,849 (Critical Skills Graduate), €40,909 (with relevant degree), €68,911 (without degree)',
          'Critical Skills Occupations List updated May 29, 2026',
        ],
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Updated 2026 salary thresholds\n')
  }

  // 4. France Student - Add Campus France note
  console.log('4. France Student visa...')
  const frStudentVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "france-student-student"][0]`
  )

  if (frStudentVisa) {
    await sanityClient
      .patch(frStudentVisa._id)
      .set({
        restrictions: [
          ...(frStudentVisa.restrictions || []),
          'Korean students must complete "Études en France" platform procedure through Campus France before visa application',
          'Work limit: 964 hours per year (approximately 60% of full-time)',
        ],
        official_link: 'https://www.campusfrance.org/en/student-long-stay-visa',
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Added Campus France procedure note\n')
  }

  // 5. France Seasonal Worker - Clarify visa requirement
  console.log('5. France Seasonal Worker...')
  const frSeasonalVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "france-temporary-work-seasonal-worker"][0]`
  )

  if (frSeasonalVisa) {
    await sanityClient
      .patch(frSeasonalVisa._id)
      .set({
        job_offer_note: 'Work visa required. Korean citizens have visa-free Schengen access for tourism but MUST obtain work visa for employment.',
        restrictions: [
          'Work visa and seasonal worker residence permit required',
          'Maximum 6 months within consecutive 12-month period',
          'Minimum 3-month contract length',
          'Permit valid for 3 years (renewable)',
          'Application fee: €150 initial, €100 renewal',
        ],
        official_link: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F21516',
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Clarified visa requirement\n')
  }

  console.log('✨ Batch #2 fixes complete!')
}

fixBatch2().catch(console.error)
