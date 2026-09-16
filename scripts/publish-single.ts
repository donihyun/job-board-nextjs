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

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || ''

interface BlogPost {
  title: string
  excerpt: string
  content: string
  keywords: string[]
  readTime: number
  targetAudience: string
  imageKeywords?: string[]
}

const post: BlogPost = {
  "title": "Melbourne CBD Cafe Jobs: Complete Guide for Working Holiday Makers",
  "excerpt": "Land your first Melbourne cafe job with this insider guide covering pay rates, best suburbs, essential certifications, and where to find work in the CBD.",
  "content": "## Your Complete Guide to Melbourne CBD Cafe Jobs for Working Holiday Makers\n\nMelbourne's coffee culture is legendary, and the CBD is packed with cafes desperately seeking reliable staff. If you're a working holiday maker looking to earn while experiencing Australia's cafe capital, you've picked the right city. This guide cuts through the noise with specific pay rates, actual cafe hotspots, and actionable steps to land your first gig.\n\n## Why Melbourne CBD Cafes Are Perfect for Working Holiday Makers\n\nMelbourne runs on coffee. With over 2,000 cafes in the metropolitan area and hundreds concentrated in the CBD alone, the demand for cafe staff is constant. Unlike Sydney's beach culture or Brisbane's laid-back vibe, Melbourne's identity is built around laneway cafes, specialty roasters, and all-day brunch spots.\n\nThe CBD offers unique advantages:\n- **High turnover means constant openings** - backpackers come and go, creating regular vacancies\n- **No car needed** - everything's accessible by tram, train, or foot\n- **Premium pay rates** - CBD venues pay $28-32/hour base rate for casual staff\n- **Flexible shifts** - morning shifts (6am-2pm) suit travelers planning afternoon adventures\n- **English practice** - you'll interact with locals and internationals all day\n\n## Real Pay Rates: What You'll Actually Earn\n\nLet's talk numbers. As of 2026, here's what working holiday makers typically earn in Melbourne CBD cafes:\n\n**Weekday rates (Monday-Friday):**\n- Barista/All-rounder: $28-32/hour casual rate\n- Wait staff: $27-30/hour casual rate  \n- Kitchen hand: $26-29/hour casual rate\n\n**Weekend rates:**\nExpect $35-45/hour on weekends. Casual employees already have a 25% casual loading built into their base rate, so weekend shifts simply pay more without complicated percentage breakdowns.\n\n**What this means in practice:**\nWork four shifts per week (two weekdays, two weekends) averaging 7 hours each, and you're looking at $900-1,100 per week before tax. Not bad for flexible work that doesn't drain your soul.\n\n**Important: Always check Fair Work website for current wages before accepting any job offer.** Rates change, and you deserve to know the legal minimums.\n\n### Understanding Your Pay Slip\n\nYour employer will deduct:\n- **Tax**: Check current working holiday maker tax rates at ato.gov.au - these rates are set by the ATO and updated regularly\n- **Superannuation**: 12% of your gross pay (increased July 1, 2025) goes into a super fund - you can claim this back when you leave Australia\n\nMany cafes pay weekly via bank transfer. Make sure you open an Australian bank account within your first week - ANZ, Commonwealth, and NAB all have working holiday maker accounts.\n\n## Where to Find Jobs: Melbourne CBD Hotspots\n\nNot all CBD areas are created equal. Focus your job search on these high-density cafe zones:\n\n### Degraves Street & Centre Place\nThe tourist heart of Melbourne's laneway culture. Cafes here are constantly hiring because the foot traffic is intense and staff burnout is real. Places like Degraves Espresso Bar and Centre Place cafes prioritize speed and volume over specialty coffee snobbery, making them excellent first jobs.\n\n### Hardware Lane\nOne of Melbourne's most photographed streets, lined with Italian restaurants and Australian cafes. Morning cafe shifts here often transition into lunch service, giving you longer hours. The Hardware Societe area is particularly good for finding all-rounder positions.\n\n### Southbank\nAlong the Yarra River, Southbank cafes serve both office workers and tourists. Venues here (especially around Southgate and Crown complex) are larger operations, which means:\n- More structured hiring processes\n- Better training systems\n- Higher staff numbers (easier to swap shifts)\n- Mix of cafe and restaurant roles\n\n### Docklands\nNewer development with modern cafes serving office workers. Docklands venues often close earlier (4-5pm) compared to CBD cafes, meaning fewer late shifts. The customer base is more corporate, tipping less but expecting efficiency.\n\n### QV Melbourne & Melbourne Central\nShopping precinct cafes offer stable hours and high volume. These venues appreciate working holiday makers because retail-area cafes need weekend warriors who can handle crowds without stress.\n\n### Little Collins Street & Hardware Lane Area\nHome to specialty coffee shops like Market Lane, Dukes, and Patricia Coffee Brewers. These places have higher coffee standards but also invest more in training. Perfect if you want to actually learn coffee skills, not just survive rush hour.\n\n## Essential Certifications: What You Actually Need\n\n**Before you apply anywhere:**\n\n### 1. Responsible Service of Alcohol (RSA)\n**Cost**: $35-50 online  \n**Time**: 3-4 hours  \n**Validity**: Lifelong in Victoria  \n**Why**: Even cafes that only serve breakfast often have a liquor license for mimosas and lunch wine. RSA is non-negotiable.\n\nGet your Victorian RSA through approved providers like Express Online Training or Australian Training Group. Don't waste time with NSW or Queensland RSAs - they're not valid in Victoria. Book the online course your first night in Melbourne and you'll have the certificate within 24 hours.\n\n### 2. Food Safety Certificate\nThis is Victoria-specific and depends on your role. Many cafe positions require a Food Safety Supervisor certificate, but for basic wait staff or barista roles handling packaged food, it's often not mandatory. Ask during your interview what's required. If needed:\n\n**Cost**: $80-120 online  \n**Time**: 6-8 hours  \n**Validity**: 5 years  \n\nProviders: Hygiene Food Safety or Australian Institute of Food Safety offer online courses. You get instant certification.\n\n### 3. Tax File Number (TFN)\n**Cost**: Free  \n**Time**: 10 minutes online, 2-3 weeks to receive  \n**Why**: Without a TFN, employers must withhold 47% tax from your pay\n\nApply through the ATO website the day you arrive. You'll need your passport and Australian address (even a hostel works). The number arrives by mail, but some employers will hire you with proof of application while you wait.\n\n## How to Actually Land the Job\n\n### The Walking Strategy (Most Effective)\nForget online applications for most independent cafes. Melbourne's cafe scene runs on in-person hustle. Here's the playbook:\n\n**Monday-Wednesday, 2pm-4pm**: This is the golden window. Rush is over, staff have time to talk, managers are doing admin.\n\n1. Dress like you already work there: clean black jeans/pants, plain shirt, neat appearance\n2. Bring 20 printed resumes (yes, physical paper still matters here)\n3. Pick a laneway (Hardware Lane or Degraves Street) and hit every cafe\n4. Ask politely: \"Hi, I'm looking for cafe work - are you hiring? I have my RSA and can start immediately.\"\n5. If they say yes, hand over your resume and ask when you can trial\n6. If they say no, ask if they know anywhere nearby that is hiring\n\nYou'll hear \"no\" 15 times. Then someone will say \"actually, can you come in for a trial tomorrow?\" That's how Melbourne cafe hiring works.\n\n### Online Platforms (Secondary Strategy)\n- **Seek.com.au**: Larger cafe chains and corporate venues post here\n- **Indeed.com.au**: Mix of everything, set alerts for \"barista Melbourne CBD\"\n- **Gumtree**: Hit-or-miss, but some independent cafes use it\n- **Facebook Groups**: \"Melbourne Hospitality Jobs\" and \"Working Holiday Melbourne Jobs\" post daily opportunities\n\n### Trial Shifts: What to Expect\nMelbourne cafes almost always do a 3-4 hour paid trial before hiring. This is normal and legal - they must pay you for trial time.\n\nDuring your trial:\n- Arrive 10 minutes early\n- Bring your RSA certificate (physical or digital)\n- Watch everything closely - every cafe has its own system\n- Ask questions: \"How do you prefer I clear tables?\" or \"What's your table numbering system?\"\n- Be fast but not reckless\n- Stay calm during rush periods\n- Don't check your phone\n\nAt the end, they'll either offer you shifts on the spot or say they'll \"be in touch\" (which usually means no).\n\n## Realistic Expectations: The Good and The Challenging\n\n### The Good\n- You'll be working in one of the world's best coffee cities\n- Free/cheap staff meals (most cafes feed you before/after shifts)\n- Morning shifts mean your afternoons are free to explore\n- Quick cash flow - weekly pay keeps your travel fund topped up\n- Social environment - you'll meet other backpackers and locals\n- Easy to find second or third cafe jobs if you want more hours\n\n### The Challenging\n- Early starts (5:30am-6am for opening shifts) are brutal at first\n- Weekend work is mandatory - Friday/Saturday/Sunday are peak days\n- Standing for 6-8 hours straight takes physical adjustment\n- Some managers have zero patience for mistakes during rush\n- First few weeks you'll feel incompetent (this passes)\n- Tips are modest - Melbourne doesn't have strong tipping culture like North America\n\n## Red Flags: Cafes to Avoid\n\nNot all Melbourne cafes are good employers. Walk away if:\n\n- They refuse to pay your trial shift\n- They can't provide a written contract or casual agreement  \n- They pay cash-only with no pay slips (this is tax evasion, and you can't prove income for visa extensions)\n- They pay below minimum wage and justify it with \"you're learning\"\n- They don't ask for your TFN or super fund details within the first week\n- The staff look miserable and the turnover is clearly weekly\n\nMelbourne has too many cafes to waste time in toxic workplaces. If something feels wrong during your trial, trust your gut.\n\n## Beyond the CBD: Other Melbourne Cafe Areas Worth Considering\n\nWhile this guide focuses on CBD work, these nearby areas also have excellent cafe scenes:\n\n- **Fitzroy & Collingwood**: Brunswick Street and Smith Street hipster cafes, younger crowd, creative vibe\n- **South Yarra & Prahran**: Chapel Street cafes, wealthier clientele, slightly higher tips\n- **St Kilda**: Beach suburb with tourist cafes along Acland Street and Fitzroy Street\n- **Carlton**: University area cafes (Lygon Street), student-heavy customer base\n\nAll accessible within 20-30 minutes by tram from the CBD. Some working holiday makers prefer these areas because they're less corporate and more community-focused.\n\n## Tips for Success in Your First Month\n\n**Week 1: Survival Mode**\n- Accept you'll be slow and make mistakes\n- Write down everything - table numbers, coffee codes, menu items\n- Ask the same question twice if you need to\n- Focus on basics: smile, clear tables fast, don't drop things\n\n**Week 2-3: Building Competence**\n- Learn regular customers' orders\n- Anticipate needs (sugar, water, cutlery) without being asked\n- Start timing your movements to the cafe's rhythm\n- Volunteer for extra shifts to build rapport with managers\n\n**Week 4+: Becoming Valuable**\n- You're now a reliable presence\n- Managers will trust you with opening/closing duties\n- You can train newer staff\n- You're positioned to ask for more hours or preferred shifts\n\n## Common Questions from Working Holiday Makers\n\n**Q: Do I need barista experience?**  \nNot for most positions. Melbourne cafes prefer to train you their way rather than undo your bad habits from home. Wait staff, food runners, and kitchen hands need zero coffee skills. If you want to make coffee, tell them you're keen to learn and ask if they train baristas.\n\n**Q: How many hours will I get?**  \nStart with 2-3 shifts per week (15-20 hours). Once you prove yourself, ask for more. Many working holiday makers juggle 2-3 cafe jobs to get 30-40 hours total. This is common and accepted.\n\n**Q: Can I get sponsorship for permanent residency?**  \nUnlikely through cafe work. Hospitality roles rarely qualify for skilled migration visas. However, cafe work is excellent for funding your Australian adventure and networking your way into other opportunities.\n\n**Q: What about public holidays?**  \nYou'll earn 250% of your base rate on public holidays (Melbourne Cup Day, Christmas, etc.). Many working holiday makers fight for these lucrative shifts.\n\n**Q: Will my English improve?**  \nAbsolutely. You'll hear Australian slang, practice customer service language, and read social cues all day. Your English will improve faster working in a cafe than sitting in a classroom.\n\n## Important Disclaimer\n\nCafe names, specific hiring practices, menu prices, and operational details mentioned in this guide reflect information current at time of writing but may change. Melbourne's hospitality scene is dynamic - venues close, rebrand, and change ownership regularly. Always verify current information directly with venues and check official sources (Fair Work, ATO) for wage rates, tax obligations, and visa conditions before making decisions.\n\n## Your Action Plan: First Week in Melbourne\n\n**Day 1-2:**\n- [ ] Apply for Tax File Number online\n- [ ] Open Australian bank account\n- [ ] Find accommodation near a tram line\n\n**Day 3:**\n- [ ] Complete RSA certification online\n- [ ] Print 20 copies of your resume\n- [ ] Scout CBD cafe areas (take the free tram around the CBD)\n\n**Day 4-5:**\n- [ ] Walk Hardware Lane, Degraves Street, and Southbank handing out resumes\n- [ ] Apply online to 10 cafes on Seek and Indeed\n- [ ] Join Melbourne hospitality Facebook groups\n\n**Day 6-7:**\n- [ ] Follow up with cafes that seemed interested\n- [ ] Accept your first trial shift\n- [ ] Buy comfortable black work shoes (you'll need them)\n\nBy week two, you should have your first shifts booked. By week four, you'll be earning steady income and wondering why you were ever nervous about finding cafe work in Melbourne.\n\nThe city's coffee obsession is your opportunity. With 2,000+ cafes and a working holiday maker community that turns over every few months, there's always room for someone willing to show up on time, work hard, and smile at customers. Melbourne CBD cafe work isn't glamorous, but it's the perfect foundation for an incredible Australian working holiday.\n\nNow stop reading and start walking - those resumes won't deliver themselves.",
  "keywords": ["Melbourne cafe jobs", "working holiday maker", "Melbourne CBD jobs", "barista jobs Melbourne", "RSA certificate Victoria", "working holiday Australia", "cafe work Melbourne", "casual hospitality jobs", "Melbourne CBD cafes", "working holiday visa jobs", "Degraves Street jobs", "Hardware Lane cafes", "Southbank hospitality", "Fair Work Australia", "Australian working holiday"],
  "readTime": 8,
  "targetAudience": "working-holiday",
  "imageKeywords": ["Melbourne laneway cafe", "Degraves Street Melbourne", "barista making coffee", "Melbourne CBD laneway", "Hardware Lane cafes"]
}

async function fetchPexelsImage(keywords: string[]): Promise<{ url: string; photographer: string } | null> {
  if (!PEXELS_API_KEY) return null

  const query = keywords.join(' ')

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { 'Authorization': PEXELS_API_KEY } }
    )

    if (!response.ok) return null

    const data = await response.json()
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0]
      return { url: photo.src.large2x, photographer: photo.photographer }
    }

    return null
  } catch (error) {
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
    return null
  }
}

function parseInlineMarks(text: string): any[] {
  const children: any[] = []
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|([^*]+)/g
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      children.push({ _type: 'span', text: match[2], marks: ['strong'] })
    } else if (match[4]) {
      children.push({ _type: 'span', text: match[4], marks: ['em'] })
    } else if (match[5]) {
      const plainText = match[5].trim()
      if (plainText) {
        children.push({ _type: 'span', text: plainText })
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
    } else {
      blocks.push({
        _type: 'block',
        children: parseInlineMarks(line),
      })
    }
  }

  return blocks
}

async function main() {
  console.log('📤 Publishing to Sanity...\n')

  const author = await sanityClient.fetch('*[_type == "author"][0]')
  const categories = await sanityClient.fetch('*[_type == "category"]')
  const category = categories.find((c: any) => c.slug.current === 'work-jobs')

  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  let mainImageAssetId: string | null = null
  if (post.imageKeywords && post.imageKeywords.length > 0) {
    console.log(`🖼️  Fetching image: ${post.imageKeywords.join(', ')}`)
    const image = await fetchPexelsImage(post.imageKeywords)
    if (image) {
      console.log(`📸 Found by ${image.photographer}`)
      mainImageAssetId = await uploadImageToSanity(image.url)
      if (mainImageAssetId) {
        console.log(`✅ Image uploaded`)
      }
    }
  }

  const sanityPost = await sanityClient.create({
    _type: 'post',
    title: post.title,
    slug: { _type: 'slug', current: slug },
    author: { _type: 'reference', _ref: author._id },
    categories: [{ _type: 'reference', _ref: category._id }],
    publishedAt: new Date().toISOString(),
    excerpt: post.excerpt,
    readTime: post.readTime,
    featured: false,
    body: markdownToPortableText(post.content),
    ...(mainImageAssetId && {
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: mainImageAssetId },
      },
    }),
  })

  console.log(`\n✅ Published!`)
  console.log(`Title: ${sanityPost.title}`)
  console.log(`Slug: ${sanityPost.slug.current}`)
  console.log(`Post ID: ${sanityPost._id}`)
}

main().catch(console.error)
