import assert from "node:assert/strict"
import test from "node:test"
// @ts-expect-error Node's strip-types runner requires the explicit extension.
import { filterBlogPosts } from "./blog-filters.ts"
import type { Post } from "./sanity.queries"

test("blog filters and date sorting keep all category matches without mutating posts", () => {
  const posts = [
    { _id: "older", publishedAt: "2026-08-01", categories: [{ slug: { current: "work" } }] },
    { _id: "uncategorized", publishedAt: "2026-09-01" },
    { _id: "newer", publishedAt: "2026-08-20", categories: [{ slug: { current: "life" } }, { slug: { current: "work" } }] },
  ] as Post[]
  const ids = (items: Post[]) => items.map(post => post._id)
  assert.deepEqual(ids(filterBlogPosts(posts, "", "newest")), ["uncategorized", "newer", "older"])
  assert.deepEqual(ids(filterBlogPosts(posts, "work", "oldest")), ["older", "newer"])
  assert.deepEqual(filterBlogPosts(posts, "missing", "newest"), [])
  assert.deepEqual(filterBlogPosts([], "", "newest"), [])
  assert.deepEqual(ids(posts), ["older", "uncategorized", "newer"])
})
