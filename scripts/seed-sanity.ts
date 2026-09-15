import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.NEXT_SANITY_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

async function seedContent() {
  try {
    // Create Author
    const author = await client.create({
      _type: 'author',
      name: 'VIKB Team',
      slug: {
        _type: 'slug',
        current: 'vikb-team',
      },
      bio: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Working holiday experts helping travelers find jobs and settle in Australia.',
            },
          ],
        },
      ],
    })
    console.log('✅ Author created:', author._id)

    // Create Categories
    const categoryWork = await client.create({
      _type: 'category',
      title: 'Work & Jobs',
      slug: {
        _type: 'slug',
        current: 'work-jobs',
      },
      description: 'Job hunting tips and working holiday advice',
    })
    console.log('✅ Category created:', categoryWork._id)

    const categoryLife = await client.create({
      _type: 'category',
      title: 'Life in Australia',
      slug: {
        _type: 'slug',
        current: 'life-australia',
      },
      description: 'Living tips and cultural insights',
    })
    console.log('✅ Category created:', categoryLife._id)

    const categoryVisa = await client.create({
      _type: 'category',
      title: 'Visa & Immigration',
      slug: {
        _type: 'slug',
        current: 'visa-immigration',
      },
      description: 'Visa guides and immigration updates',
    })
    console.log('✅ Category created:', categoryVisa._id)

    // Create Posts
    const post1 = await client.create({
      _type: 'post',
      title: 'Complete Guide to Finding Farm Jobs in Australia',
      slug: {
        _type: 'slug',
        current: 'guide-finding-farm-jobs-australia',
      },
      author: {
        _type: 'reference',
        _ref: author._id,
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryWork._id,
        },
      ],
      publishedAt: new Date().toISOString(),
      excerpt: 'Everything you need to know about farm work in Australia - from finding jobs to maximizing your second-year visa eligibility.',
      readTime: 8,
      featured: true,
      body: [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Why Farm Work?' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Farm work is one of the most popular ways to qualify for a second-year working holiday visa in Australia. Not only does it help you extend your stay, but it also offers unique experiences in regional areas.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Best Regions for Farm Work' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Popular farming regions include Queensland (fruit picking), Victoria (grape harvesting), and South Australia (wine regions). Each region has peak seasons - research timing before you travel.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Finding Jobs' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Use platforms like Harvest Trail, Gumtree, and Facebook groups. Always verify employer details and accommodation before committing. Some hostels also help arrange farm work.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Tips for Success' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '1. Keep all payslips and work records for visa applications. 2. Join local Facebook groups for insider tips. 3. Be prepared for physical work and early mornings. 4. Save money - farm work can be seasonal and unpredictable.',
            },
          ],
        },
      ],
    })
    console.log('✅ Featured post created:', post1._id)

    const post2 = await client.create({
      _type: 'post',
      title: 'Working Holiday Visa Guide: Everything You Need to Know',
      slug: {
        _type: 'slug',
        current: 'working-holiday-visa-guide-australia',
      },
      author: {
        _type: 'reference',
        _ref: author._id,
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryVisa._id,
        },
      ],
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      excerpt: 'A comprehensive guide to applying for and maintaining your Australian Working Holiday visa (subclass 417).',
      readTime: 10,
      featured: false,
      body: [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Eligibility Requirements' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'You must be between 18-30 years old (or 18-35 for certain countries), hold a valid passport from an eligible country, and not have previously held a 417 visa.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Application Process' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Apply online through ImmiAccount. You will need proof of funds (AUD $5,000), health insurance, and may need to complete health examinations. Processing typically takes 1-4 weeks.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Second and Third Year Extensions' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Complete 88 days of specified work in regional Australia for a second year. For a third year, complete 6 months of specified work during your second year visa.',
            },
          ],
        },
      ],
    })
    console.log('✅ Post 2 created:', post2._id)

    const post3 = await client.create({
      _type: 'post',
      title: 'Top 10 Cities for Working Holiday Makers in Australia',
      slug: {
        _type: 'slug',
        current: 'top-cities-working-holiday-australia',
      },
      author: {
        _type: 'reference',
        _ref: author._id,
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryLife._id,
        },
        {
          _type: 'reference',
          _ref: categoryWork._id,
        },
      ],
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      excerpt: 'From Sydney to Perth, discover the best Australian cities for working holiday makers based on job opportunities, lifestyle, and cost of living.',
      readTime: 12,
      featured: false,
      body: [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: '1. Sydney, NSW' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The most popular destination with abundant job opportunities in hospitality, retail, and construction. High cost of living but excellent public transport and beaches.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: '2. Melbourne, VIC' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Known for its coffee culture and arts scene. Great for hospitality jobs, slightly cheaper than Sydney. Four seasons in one day!',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: '3. Brisbane, QLD' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Warm weather year-round, lower cost of living than Sydney/Melbourne. Gateway to Gold Coast and Sunshine Coast.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Other Notable Cities' }],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Perth (high wages, mining jobs), Adelaide (wine region, affordable), Gold Coast (tourism, beach life), Cairns (tourism, diving), Darwin (tropical, mining proximity), Hobart (scenic, relaxed pace).',
            },
          ],
        },
      ],
    })
    console.log('✅ Post 3 created:', post3._id)

    console.log('\n🎉 Sanity seeding complete!')
    console.log('\nVisit:')
    console.log('- http://localhost:3001/blogs (blog list)')
    console.log('- http://localhost:3001/studio (CMS)')
  } catch (error) {
    console.error('❌ Error seeding:', error)
    throw error
  }
}

seedContent()
