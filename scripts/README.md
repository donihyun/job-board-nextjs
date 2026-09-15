# Blog Content Generation Pipeline

AI-powered blog content generation using DeepSeek API.

## Setup

1. Ensure environment variables are set in `.env.local`:
```env
DEEPSEEK_API_KEY=your-key
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_SANITY_TOKEN=your-token
```

2. Seed initial data (run once):
```bash
pnpm blog:seed
```

## Usage

### Generate Single Post

```bash
pnpm blog:generate "How to get RSA in Sydney" work-jobs
```

Parameters:
- Topic: Blog post topic (required)
- Category: `work-jobs`, `life-australia`, or `visa-immigration` (default: work-jobs)

### Batch Generation

1. Create topics file (see `topics.example.txt`):
```txt
How to Get Your RSA Certificate | work-jobs
Best Share Houses in Melbourne | life-australia
```

2. Run batch:
```bash
pnpm blog:generate --batch topics.txt
```

### Help

```bash
pnpm blog:generate --help
```

## Output

Each generated post includes:
- 1500-2000 words of SEO-optimized content
- Actionable tips and real advice
- Proper markdown formatting (headings, lists)
- SEO keywords
- Estimated read time
- Automatic publishing to Sanity CMS

## Automation

### Cron Job (Daily)

Add to crontab:
```bash
0 9 * * * cd /path/to/project && pnpm blog:generate --batch topics.txt >> logs/content-gen.log 2>&1
```

### GitHub Actions

Create `.github/workflows/generate-content.yml`:
```yaml
name: Generate Blog Content

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9am
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm blog:generate --batch scripts/topics.txt
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
          NEXT_SANITY_TOKEN: ${{ secrets.SANITY_TOKEN }}
```

## Cost Estimation

DeepSeek API pricing (approximate):
- Input: $0.14 per 1M tokens
- Output: $0.28 per 1M tokens

Per 2000-word post: ~$0.01-0.02

## Tips

- Use specific, actionable topics
- Include location/year for better SEO ("Sydney 2025")
- Vary categories for diverse content
- Review generated content before publishing
- Update topics.txt regularly with trending queries
