#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { workVisaList } from '../constants/visas'

dotenv.config({ path: '.env.local' })

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.NEXT_SANITY_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

async function migrateVisas() {
  console.log(`\n📊 Migrating ${workVisaList.length} visas to Sanity...\n`)

  let successCount = 0
  let errorCount = 0
  const errors: string[] = []

  for (const visa of workVisaList) {
    try {
      // Transform visa data to Sanity format
      const sanityVisa = {
        _type: 'visa',
        country: visa.country,
        visa_type: visa.visa_type,
        category: visa.category,
        slug: {
          _type: 'slug',
          current: visa.slug,
        },
        duration: visa.duration,
        duration_normalized: visa.duration_normalized,
        work_scope: visa.work_scope,
        job_offer_required: visa.job_offer_required,
        job_offer_note: visa.job_offer_note || '',
        eligible_passports: visa.eligible_passports,
        korean_passport: visa.korean_passport,
        age_range: visa.age_range,
        age_normalized: visa.age_normalized,
        pr_relevance: visa.pr_relevance,
        pr_relevance_note: visa.pr_relevance_note || '',
        processing_time: visa.processing_time,
        processing_normalized: visa.processing_normalized,
        financial_proof_required: visa.financial_proof_required,
        financial_normalized: visa.financial_normalized,
        application_fee_normalized: visa.application_fee_normalized,
        work_hours_normalized: visa.work_hours_normalized,
        family_allowed: visa.family_allowed,
        application_process: visa.application_process,
        application_process_ko: visa.application_process_ko || '',
        restrictions: visa.restrictions || [],
        restrictions_ko: visa.restrictions_ko || [],
        official_link: visa.official_link,
        last_verified: visa.last_verified,
        source_status: visa.source_status,
        metadata_audit: visa.metadata_audit,
        is_temporary: visa.is_temporary,
        detail_available: visa.detail_available,
      }

      // Check if visa already exists
      const existing = await sanityClient.fetch(
        `*[_type == "visa" && slug.current == $slug][0]`,
        { slug: visa.slug }
      )

      if (existing) {
        // Update existing
        await sanityClient
          .patch(existing._id)
          .set(sanityVisa)
          .commit()
        console.log(`   ✅ Updated: ${visa.country} - ${visa.visa_type}`)
      } else {
        // Create new
        await sanityClient.create(sanityVisa)
        console.log(`   ✅ Created: ${visa.country} - ${visa.visa_type}`)
      }

      successCount++
    } catch (error: any) {
      errorCount++
      const errorMsg = `${visa.country} - ${visa.visa_type}: ${error.message}`
      errors.push(errorMsg)
      console.log(`   ❌ Error: ${errorMsg}`)
    }
  }

  console.log(`\n📈 Migration Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)

  if (errors.length > 0) {
    console.log(`\n❌ Error Details:`)
    errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`))
  }

  console.log(`\n✨ Migration complete!`)
}

migrateVisas().catch(console.error)
