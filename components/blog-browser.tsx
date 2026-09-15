"use client"

import { useRef, useState } from "react"
import type { Post } from "@/lib/sanity.queries"
import { filterBlogPosts } from "@/lib/blog-filters"
import { BlogCard } from "./blog-card"
import { CategoryFilter } from "./category-filter"
import { Pagination } from "./pagination"
import styles from "./blog.module.css"

export function BlogBrowser({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const results = useRef<HTMLDivElement>(null)
  const categories = Array.from(new Map(posts.flatMap(post => post.categories ?? [])
    .map(item => [item.slug.current, item])).values())
    .sort((a, b) => a.title.localeCompare(b.title))
  const filtered = filterBlogPosts(posts, category, sort)
  const pageSize = 6
  const pageCount = Math.ceil(filtered.length / pageSize)

  return (
    <>
      <CategoryFilter categories={categories} category={category} sort={sort}
        onCategoryChange={value => { setCategory(value); setPage(1) }}
        onSortChange={value => { setSort(value); setPage(1) }} />
      <p className="sr-only" role="status">{filtered.length} articles, page {page} of {Math.max(1, pageCount)}</p>
      <div ref={results} className={styles.grid} tabIndex={-1} aria-label="Blog articles">
        {filtered.slice((page - 1) * pageSize, page * pageSize).map(post => <BlogCard key={post._id} post={post} />)}
      </div>
      {filtered.length === 0 && (
        <div className={styles.empty}>
          <h2>No articles yet</h2>
          <p>{category ? "Try another category to find your next read." : "New working holiday stories will appear here."}</p>
          {category && <button type="button" onClick={() => { setCategory(""); setPage(1) }}>View all articles</button>}
        </div>
      )}
      <Pagination page={page} pageCount={pageCount} onPageChange={value => {
        setPage(value)
        results.current?.focus({ preventScroll: true })
        results.current?.scrollIntoView({ block: "start" })
      }} />
    </>
  )
}
