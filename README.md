# VIKB

Working-holiday country guides and job search built with Next.js, Clerk, and MongoDB.

## Local development

1. Copy `.env.example` to `.env` and fill in the required credentials.
2. Install dependencies with `corepack pnpm install`.
3. Start the app with `corepack pnpm dev`.

## Checks

```bash
corepack pnpm lint
corepack pnpm build
```

## Data sources

Country guides are maintained in this repository. Job search currently reads from MongoDB; the next integration target is Careerjet Publisher API v4 using `CAREERJET_API_KEY`.

Never commit `.env` or production credentials.
