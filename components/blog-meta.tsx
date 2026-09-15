import Image from "next/image"
import type { Post } from "@/lib/sanity.queries"
import { urlFor } from "@/lib/sanity.image"
import { blogDate } from "@/lib/blog"
import styles from "./blog.module.css"

export function BlogAuthor({ author }: { author: Post["author"] }) {
  const name = author?.name || "VIKB Team"
  return (
    <div className={styles.author}>
      {author?.image?.asset ? (
        <Image src={urlFor(author.image).width(80).height(80).url()} alt="" width={36} height={36} />
      ) : (
        <span className={styles.avatar} aria-hidden="true">{name.slice(0, 1)}</span>
      )}
      <span>{name}</span>
    </div>
  )
}

export function BlogDate({ post }: { post: Post }) {
  return (
    <div className={styles.meta}>
      <time dateTime={post.publishedAt}>{blogDate(post.publishedAt)}</time>
      {Boolean(post.readTime) && <><span aria-hidden="true">·</span><span>{post.readTime} min read</span></>}
    </div>
  )
}
