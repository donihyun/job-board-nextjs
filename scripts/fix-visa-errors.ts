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

async function fixVisas() {
  console.log('🔧 Fixing visa errors found by review...\n')

  // 1. Fix Australia: Wrong subclass (462 → 417)
  console.log('1. Australia Working Holiday visa...')
  const ausVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "australia-work-and-holiday-visa-subclass-462"][0]`
  )

  if (ausVisa) {
    await sanityClient
      .patch(ausVisa._id)
      .set({
        visa_type: 'Working Holiday visa (subclass 417)',
        age_range: '18-35',
        age_normalized: {
          min_age: 18,
          max_age: 35,
          varies: false,
        },
        slug: {
          _type: 'slug',
          current: 'australia-working-holiday-visa-subclass-417',
        },
        official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417',
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Fixed: subclass 462 → 417, age 18-35\n')
  }

  // 2. Fix Canada IEC: Conditional → Eligible, add missing data
  console.log('2. Canada IEC Young Professionals...')
  const canVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "canada-iec-young-professionals"][0]`
  )

  if (canVisa) {
    await sanityClient
      .patch(canVisa._id)
      .set({
        korean_passport: 'Eligible',
        age_range: '18-35',
        age_normalized: {
          min_age: 18,
          max_age: 35,
          varies: false,
        },
        duration: 'Maximum 12 months',
        duration_normalized: {
          min_months: null,
          max_months: 12,
          basis: 'fixed',
        },
        financial_proof_required: 'CAN$2,500 minimum',
        financial_normalized: {
          status: 'Required',
          amount: 2500,
          currency: 'CAD',
          period: 'Total',
        },
        restrictions: [
          'Paid work for the named employer and location',
          'Must be TEER 0-3 position (or TEER 4 if in applicant\'s field of study)',
          'Self-employment is not allowed',
          'Health insurance required',
          'Maximum 12 months duration',
        ],
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Fixed: korean_passport, age, duration, financial requirements\n')
  }

  // 3. Fix UK Graduate: Duration change, extension clarification
  console.log('3. UK Graduate visa...')
  const ukVisa = await sanityClient.fetch(
    `*[_type == "visa" && slug.current == "united-kingdom-graduate-visa"][0]`
  )

  if (ukVisa) {
    await sanityClient
      .patch(ukVisa._id)
      .set({
        duration: '18 months (from Jan 2027), 2 years (until Dec 2026), or 3 years for PhD',
        duration_normalized: {
          min_months: 18,
          max_months: 36,
          basis: 'varies',
        },
        restrictions: [
          'Professional sport is not allowed',
          'Cannot be extended (may switch to Skilled Worker visa)',
          'Duration: 18 months for applications from 1 Jan 2027 (2 years until 31 Dec 2026, 3 years for PhD holders)',
        ],
        last_verified: '2026-09-16',
      })
      .commit()
    console.log('   ✅ Fixed: duration change (18 months from 2027), extension clarification\n')
  }

  console.log('✨ All fixes applied!')
}

fixVisas().catch(console.error)
