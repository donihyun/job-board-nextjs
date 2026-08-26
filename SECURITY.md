# Security Documentation

This document outlines the security measures implemented in this Next.js job board application.

## Table of Contents

1. [Environment Variable Management](#environment-variable-management)
2. [Rate Limiting](#rate-limiting)
3. [Security Headers](#security-headers)
4. [Logging and Monitoring](#logging-and-monitoring)
5. [API Security](#api-security)
6. [Best Practices](#best-practices)
7. [Additional Recommendations](#additional-recommendations)

---

## Environment Variable Management

### Validation with Zod

All environment variables are validated at runtime using Zod schemas in `/lib/env.ts`. This ensures:

- Required variables are present before the application starts
- Variables conform to expected formats (URLs, strings, etc.)
- Type safety throughout the application
- Clear error messages for missing or invalid configuration

**Usage:**
```typescript
import { getEnv } from "@/lib/env";

const env = getEnv();
const apiKey = env.OPENAI_API_KEY; // Type-safe access
```

**Validation:**
- In production: Application will fail to start if environment validation fails
- In development: Warnings are logged, but the application continues to run

### Configuration Security

**next.config.js**: Hardcoded values removed and replaced with environment variables:
- `ALLOWED_FORWARDED_HOSTS`: Comma-separated list of allowed forwarded hosts
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

This prevents exposure of internal URLs (like GitHub Codespaces) in production builds.

---

## Rate Limiting

### Implementation

Rate limiting is implemented using an in-memory store (`/lib/rate-limit.ts`) to prevent abuse and DDoS attacks.

### Rate Limit Tiers

| Tier | Limit | Window | Use Case |
|------|-------|--------|----------|
| Very Strict | 5 requests | 1 minute | Webhooks, sensitive operations |
| Strict | 10 requests | 1 minute | Write operations (POST, PUT, DELETE) |
| Moderate | 30 requests | 1 minute | General API routes |
| Relaxed | 100 requests | 1 minute | Read operations (GET) |

### API Routes with Rate Limiting

- `/api/mongodb/[jobId]` - Strict (10/min)
- `/api/webhooks/clerk` - Very Strict (5/min)
- `/api/events/outbound` - Moderate (30/min)

### Usage

```typescript
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResult = await checkRateLimit(request, "strict");
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response;
  }
  // Your route logic here
}
```

### Production Considerations

The current implementation uses in-memory storage, which:
- Works well for single-instance deployments
- Does NOT persist across restarts
- Does NOT work with multiple server instances

**For production at scale, consider:**
- Redis-based rate limiting (e.g., `upstash/ratelimit`)
- Edge rate limiting (e.g., Vercel Edge Middleware with KV)
- CDN-level rate limiting (e.g., Cloudflare)

---

## Security Headers

The following security headers are automatically added to all responses via `next.config.js`:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-DNS-Prefetch-Control` | `on` | Enables DNS prefetching for better performance |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS connections |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Enables browser XSS protection |
| `Referrer-Policy` | `origin-when-cross-origin` | Controls referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restricts browser features |
| `Content-Security-Policy` | See below | Prevents XSS and data injection attacks |

### Content Security Policy (CSP)

**Implemented** - The following CSP directives are configured:

- `default-src 'self'` - Only allow resources from same origin by default
- `script-src` - Allow scripts from self, Clerk, Cloudflare, and Google services
- `style-src` - Allow styles from self and Google Fonts
- `img-src` - Allow images from self, data URIs, HTTPS, and blob
- `font-src` - Allow fonts from self and Google Fonts
- `connect-src` - Allow connections to API services (Clerk, CareerJet, Adzuna, OpenAI, Analytics)
- `frame-src` - Allow frames from Cloudflare, Google, and ad services
- `worker-src` - Allow web workers from self and blob
- `object-src 'none'` - Block Flash and other plugins
- `base-uri 'self'` - Prevent base tag injection
- `form-action 'self'` - Restrict form submission targets
- `frame-ancestors 'self'` - Prevent embedding in other sites
- `upgrade-insecure-requests` - Automatically upgrade HTTP to HTTPS

---

## Logging and Monitoring

### Centralized Logger

Replaced all `console.log` statements with a centralized logging utility (`/lib/logger.ts`).

### Features

- **Environment-aware**: Only logs warnings/errors in production
- **Structured logging**: JSON-formatted context for easier parsing
- **Categorized logs**: Different methods for different purposes
  - `logger.authEvent()` - Authentication events
  - `logger.dbOperation()` - Database operations
  - `logger.jobEvent()` - Job-related events
  - `logger.apiRequest()` / `logger.apiResponse()` - API calls

### Usage

```typescript
import { logger } from "@/lib/logger";

// Simple logging
logger.info("User logged in", { userId: "123" });
logger.error("Database connection failed", error, { context: "startup" });

// Specialized logging
logger.authEvent("User authenticated", { userId, method: "oauth" });
logger.dbOperation("update user", "users", { userId, field: "email" });
```

### Production Monitoring Recommendations

- **Error tracking**: Integrate Sentry or similar service
- **Log aggregation**: Use services like Datadog, LogRocket, or Vercel Analytics
- **Alerts**: Set up alerts for error rates, failed authentications, etc.

---

## API Security

### Authentication

- All protected routes use Clerk authentication middleware
- Webhook endpoints verify signatures using `svix`
- User identity is verified before database operations
- Rate limiting prevents brute force attacks

### Input Validation

A comprehensive input validation system is implemented in `/lib/api-validation.ts`:

**Features:**
- Zod-based schema validation for all API inputs
- Request body, query parameters, and URL parameter validation
- Automatic error responses with detailed validation messages
- Input sanitization to prevent XSS and injection attacks
- Request body size limits (1MB default)

**Common Schemas:**
- MongoDB ObjectId validation
- Email format validation
- URL format validation
- Pagination parameters
- Date range validation
- Job event validation

**Usage Example:**
```typescript
import { validateRequest, commonSchemas } from "@/lib/api-validation";

export async function POST(request: NextRequest) {
  const validation = await validateRequest(request, {
    schema: commonSchemas.outboundEvent,
    source: "body",
  });

  if (!validation.success) {
    return validation.response; // Returns 400 with error details
  }

  const data = validation.data; // Type-safe validated data
}
```

**Implemented Validations:**
- `/api/events/outbound` - Validates outbound event schema
- `/api/mongodb/[jobId]` - Validates MongoDB ObjectId format
- `/api/webhooks/clerk` - Validates Svix webhook signatures

### Error Handling

- Detailed error messages are logged but NOT exposed to clients
- Generic error responses prevent information leakage
- Proper HTTP status codes for different error types
- All errors logged with context for debugging

### CORS and Origin Validation

- Server actions validate forwarded hosts and origins via environment variables
- Clerk middleware handles authentication flows securely
- CSP headers restrict allowed origins for scripts and connections

---

## Best Practices

### ✅ Implemented

- Environment variable validation with Zod (`/lib/env.ts`)
- Rate limiting on all API routes (`/lib/rate-limit.ts`)
- Comprehensive security headers including CSP (`next.config.js`)
- Centralized logging with structured context (`/lib/logger.ts`)
- Input validation middleware with Zod schemas (`/lib/api-validation.ts`)
- Webhook signature verification (Clerk webhooks)
- Proper error handling without information leakage
- MongoDB ObjectId validation to prevent injection
- Request body size limits
- Input sanitization for XSS prevention
- Production/development environment awareness

### ⚠️ To Consider

1. **SQL/NoSQL Injection**: Always use parameterized queries (currently done with Mongoose)
2. **Dependency Scanning**: Run `npm audit` regularly
3. **HTTPS Only**: Enforce HTTPS in production (done via HSTS header)
4. **Session Management**: Clerk handles this, but review session timeout settings
5. **File Upload Security**: If implementing file uploads, validate file types and sizes
6. **Console.log Removal**: All console.log statements have been replaced with the logger utility

---

## Additional Recommendations

### Immediate Priorities

1. **Database Connection Security**
   - Use MongoDB connection string with authentication
   - Enable IP whitelisting on MongoDB Atlas
   - Use TLS/SSL for database connections

2. **Secret Management**
   - Never commit `.env` files to version control
   - Rotate API keys and secrets regularly
   - Use environment-specific secrets

3. **Dependency Security**
   ```bash
   npm audit fix
   npm outdated
   ```

4. **Production Checklist**
   - [x] Environment variables validated and secured
   - [x] Rate limiting configured for production load
   - [ ] Error tracking service integrated (e.g., Sentry)
   - [ ] Database backups configured
   - [ ] HTTPS enforced (automatic on Vercel)
   - [x] Security headers verified
   - [x] CSP headers added
   - [x] Console.log statements removed from production code
   - [x] Input validation implemented on all API routes
   - [ ] Regular dependency updates scheduled

### Long-term Improvements

1. **Redis Rate Limiting**: For multi-instance deployments
2. **API Keys**: Implement API key authentication for third-party integrations
3. **Request Signing**: Add request signing for sensitive operations
4. **Data Encryption**: Encrypt sensitive data at rest
5. **Audit Logging**: Log all security-relevant events (logins, data changes, etc.)
6. **Penetration Testing**: Regular security audits
7. **DDoS Protection**: Use Cloudflare or similar CDN

---

## Security Contacts

For security issues, please:
1. Do NOT open a public GitHub issue
2. Contact the security team directly (add your contact here)
3. Allow 48 hours for initial response

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial security implementation |
| 1.1.0 | 2024-08 | Added CSP headers, input validation middleware, removed console.log statements |

---

**Last Updated**: August 2024
**Review Frequency**: Quarterly
