import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/sanity.queries"
import { blogImage } from "@/lib/blog"
import { BlogAuthor, BlogDate } from "./blog-meta"
import styles from "./blog.module.css"

export function BlogCard({ post }: { post: Post }) {
  return (
    <article className={styles.card}>
      <Link href={`/blogs/${post.slug.current}`} className={styles.cardLink}>
        <div className={styles.cardImage}>
          <Image src={blogImage(post, 800, 520)} alt={post.mainImage?.alt || ""} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
          {post.categories?.[0] && <span className={styles.imageBadge}>{post.categories[0].title}</span>}
        </div>
        <BlogDate post={post} />
        <h3>{post.title}</h3>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      </Link>
      <BlogAuthor author={post.author} />
    </article>
  )
}
