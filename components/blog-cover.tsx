"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/sanity.queries"
import { blogImage } from "@/lib/blog"
import { BlogAuthor, BlogDate } from "./blog-meta"
import styles from "./blog.module.css"

export function BlogCover({ posts, detail = false }: { posts: Post[]; detail?: boolean }) {
  const [active, setActive] = useState(0)
  const post = posts[active] ?? posts[0]
  if (!post) return null
  const Heading = detail ? "h1" : "h2"

  return (
    <section className={`${styles.cover} ${detail ? styles.detailCover : ""}`} aria-label={detail ? "Article cover" : "Featured articles"}>
      <Image src={blogImage(post, 1920, 1000)} alt={post.mainImage?.alt || ""} fill priority sizes="(max-width: 1440px) 100vw, 1440px" className={styles.coverImage} />
      <div className={styles.coverShade} />
      <div className={styles.coverContent}>
        <div className={styles.coverRow}>
          <div className={styles.coverCopy} aria-live="polite" aria-atomic="true">
            {post.categories?.[0] && <span className={styles.imageBadge}>{post.categories[0].title}</span>}
            <Heading>
              {detail ? post.title : <Link href={`/blogs/${post.slug.current}`}>{post.title}</Link>}
            </Heading>
            {post.excerpt && <p>{post.excerpt}</p>}
          </div>
          <div className={styles.coverByline}>
            <BlogAuthor author={post.author} />
            <BlogDate post={post} />
          </div>
        </div>
        {posts.length > 1 && (
          <div className={styles.dots} aria-label="Choose featured article">
            {posts.map((item, index) => (
              <button key={item._id} type="button" onClick={() => setActive(index)} aria-label={`Show article ${index + 1}: ${item.title}`} aria-pressed={active === index}><span /></button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
