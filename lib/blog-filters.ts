import type { Post } from "./sanity.queries"

export function filterBlogPosts(posts: Post[], category: string, sort: string) {
  return posts
    .filter(post => !category || post.categories?.some(item => item.slug.current === category))
    .sort((a, b) => (sort === "oldest" ? 1 : -1) *
      (Date.parse(a.publishedAt) - Date.parse(b.publishedAt)))
}
