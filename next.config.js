/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['img.clerk.com'],
    },
    experimental: {
		serverActions: {
			allowedForwardedHosts: process.env.ALLOWED_FORWARDED_HOSTS
				? process.env.ALLOWED_FORWARDED_HOSTS.split(',')
				: ['localhost'],
			allowedOrigins: process.env.ALLOWED_ORIGINS
				? process.env.ALLOWED_ORIGINS.split(',')
				: ['localhost:3000']
		},
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on'
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload'
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block'
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin'
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()'
					},
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://www.googletagmanager.com",
							"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
							"img-src 'self' data: https: blob:",
							"font-src 'self' data: https://fonts.gstatic.com",
							"connect-src 'self' https://clerk.com https://*.clerk.accounts.dev https://api.careerjet.com https://api.adzuna.com https://api.openai.com https://*.google-analytics.com https://pagead2.googlesyndication.com",
							"frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
							"worker-src 'self' blob:",
							"object-src 'none'",
							"base-uri 'self'",
							"form-action 'self'",
							"frame-ancestors 'self'",
							"upgrade-insecure-requests"
						].join('; ')
					}
				]
			}
		];
	}
};

module.exports = nextConfig;
