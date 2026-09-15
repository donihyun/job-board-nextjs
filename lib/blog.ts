import type { Post } from "./sanity.queries"
import { urlFor } from "./sanity.image"

// Existing travel photography is a fallback until an editor adds a cover in Sanity.
const covers: Record<string, string> = {
  "how-to-open-a-bank-account-in-australia-on-a-working-holiday-visa": "/australia/documents.jpg",
  "mining-jobs-in-western-australia-regional-work-guide": "/canada/construction.jpg",
  "budget-accommodation-in-melbourne-for-backpackers": "/australia/hotel.jpg",
  "hospitality-jobs-in-sydney-working-holiday-guide-2025": "/australia/cafe.jpg",
  "work-jobs": "/australia/farm.jpg",
  "visa-immigration": "/australia/documents.jpg",
  "life-australia": "/australia/bg.jpg",
}

export function blogImage(post: Post, width: number, height: number) {
  return post.mainImage?.asset
    ? urlFor(post.mainImage).width(width).height(height).fit("crop").auto("format").url()
    : covers[post.slug.current] ?? covers[post.categories?.[0]?.slug.current ?? ""] ?? "/australia/bg.jpg"
}

export function blogDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  })
}
