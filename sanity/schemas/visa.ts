import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'visa',
  title: 'Visa',
  type: 'document',
  fields: [
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visa_type',
      title: 'Visa Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Working Holiday', value: 'Working holiday' },
          { title: 'Student', value: 'Student' },
          { title: 'Graduate', value: 'Graduate' },
          { title: 'Employer-sponsored', value: 'Employer-sponsored' },
          { title: 'Job Seeker', value: 'Job seeker' },
          { title: 'Digital Nomad', value: 'Digital nomad' },
          { title: 'Self-employed', value: 'Self-employed' },
          { title: 'Temporary Work', value: 'Temporary work' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => `${doc.country}-${doc.visa_type}`.toLowerCase(),
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (original)',
      type: 'string',
      description: 'Original duration text',
    }),
    defineField({
      name: 'duration_normalized',
      title: 'Duration (normalized)',
      type: 'object',
      fields: [
        { name: 'min_months', type: 'number', title: 'Min Months' },
        { name: 'max_months', type: 'number', title: 'Max Months' },
        { name: 'basis', type: 'string', title: 'Basis', options: {
          list: ['fixed', 'course', 'contract', 'permit', 'varies']
        }},
      ],
    }),
    defineField({
      name: 'work_scope',
      title: 'Work Scope',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'Open' },
          { title: 'Employer-specific', value: 'Employer-specific' },
          { title: 'Occupation-specific', value: 'Occupation-specific' },
          { title: 'Remote foreign work', value: 'Remote foreign work' },
          { title: 'Limited hours', value: 'Limited hours' },
          { title: 'Varies', value: 'Varies' },
        ],
      },
    }),
    defineField({
      name: 'job_offer_required',
      title: 'Job Offer Required',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'Yes' },
          { title: 'No', value: 'No' },
          { title: 'Varies', value: 'Varies' },
        ],
      },
    }),
    defineField({
      name: 'job_offer_note',
      title: 'Job Offer Note',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'eligible_passports',
      title: 'Eligible Passports',
      type: 'string',
    }),
    defineField({
      name: 'korean_passport',
      title: 'Korean Passport Eligibility',
      type: 'string',
      options: {
        list: [
          { title: 'Eligible', value: 'Eligible' },
          { title: 'Ineligible', value: 'Ineligible' },
          { title: 'Conditional', value: 'Conditional' },
        ],
      },
    }),
    defineField({
      name: 'age_range',
      title: 'Age Range (original)',
      type: 'string',
    }),
    defineField({
      name: 'age_normalized',
      title: 'Age Range (normalized)',
      type: 'object',
      fields: [
        { name: 'min_age', type: 'number', title: 'Min Age' },
        { name: 'max_age', type: 'number', title: 'Max Age' },
        { name: 'varies', type: 'boolean', title: 'Varies' },
      ],
    }),
    defineField({
      name: 'pr_relevance',
      title: 'PR Relevance',
      type: 'string',
      options: {
        list: [
          'Direct pathway',
          'Residence counts',
          'Residence partly counts',
          'Work experience',
          'Long residence',
          'Does not count',
          'Conditional',
        ],
      },
    }),
    defineField({
      name: 'pr_relevance_note',
      title: 'PR Relevance Note',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'processing_time',
      title: 'Processing Time',
      type: 'string',
    }),
    defineField({
      name: 'processing_normalized',
      title: 'Processing Time (normalized)',
      type: 'object',
      fields: [
        { name: 'max_days', type: 'number', title: 'Max Days' },
        { name: 'status', type: 'string', title: 'Status', options: {
          list: ['Known', 'Unknown']
        }},
      ],
    }),
    defineField({
      name: 'financial_proof_required',
      title: 'Financial Proof Required',
      type: 'string',
    }),
    defineField({
      name: 'financial_normalized',
      title: 'Financial Proof (normalized)',
      type: 'object',
      fields: [
        { name: 'status', type: 'string', title: 'Status', options: {
          list: ['Required', 'Not required', 'Unknown']
        }},
        { name: 'amount', type: 'number', title: 'Amount' },
        { name: 'currency', type: 'string', title: 'Currency' },
        { name: 'period', type: 'string', title: 'Period', options: {
          list: ['Total', 'Monthly']
        }},
      ],
    }),
    defineField({
      name: 'application_fee_normalized',
      title: 'Application Fee (normalized)',
      type: 'object',
      fields: [
        { name: 'status', type: 'string', title: 'Status' },
        { name: 'amount', type: 'number', title: 'Amount' },
        { name: 'currency', type: 'string', title: 'Currency' },
      ],
    }),
    defineField({
      name: 'work_hours_normalized',
      title: 'Work Hours (normalized)',
      type: 'object',
      fields: [
        { name: 'type', type: 'string', title: 'Type', options: {
          list: ['Unlimited', 'Limited', 'Conditional']
        }},
        { name: 'max_hours_per_week', type: 'number', title: 'Max Hours/Week' },
      ],
    }),
    defineField({
      name: 'family_allowed',
      title: 'Family Allowed',
      type: 'string',
    }),
    defineField({
      name: 'application_process',
      title: 'Application Process',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'application_process_ko',
      title: 'Application Process (Korean)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'restrictions',
      title: 'Restrictions',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'restrictions_ko',
      title: 'Restrictions (Korean)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'official_link',
      title: 'Official Link',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'last_verified',
      title: 'Last Verified',
      type: 'string',
      description: 'Date when this data was last verified',
    }),
    defineField({
      name: 'source_status',
      title: 'Source Status',
      type: 'string',
      options: {
        list: [
          'Official source checked',
          'Official overview checked',
        ],
      },
    }),
    defineField({
      name: 'metadata_audit',
      title: 'Metadata Audit',
      type: 'object',
      fields: [
        { name: 'checked_at', type: 'string', title: 'Checked At' },
        { name: 'source_http_status', type: 'number', title: 'HTTP Status' },
        { name: 'financial', type: 'string', title: 'Financial Status' },
        { name: 'fee', type: 'string', title: 'Fee Status' },
        { name: 'processing', type: 'string', title: 'Processing Status' },
      ],
    }),
    defineField({
      name: 'is_temporary',
      title: 'Is Temporary',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'detail_available',
      title: 'Detail Available',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'visa_type',
      subtitle: 'country',
      category: 'category',
    },
    prepare(selection) {
      const { title, subtitle, category } = selection
      return {
        title,
        subtitle: `${subtitle} · ${category}`,
      }
    },
  },
})
