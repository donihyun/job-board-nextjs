import type { Metadata } from "next"
import { BlogBrowser } from "@/components/blog-browser"
import { BlogCover } from "@/components/blog-cover"
import { getAllPosts } from "@/lib/sanity.queries"
import styles from "@/components/blog.module.css"

export const metadata: Metadata = {
  title: "Blog — VIKB",
  description: "Working holiday stories, practical guides, and life in Australia.",
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const featured = posts.filter(post => post.featured).slice(0, 3)

  return (
    <main className={styles.page}>
      <BlogCover posts={featured.length ? featured : posts.slice(0, 3)} />
      <section className={styles.listing} aria-labelledby="blog-heading">
        <div className={styles.sectionHeading}>
          <h1 id="blog-heading">Blog</h1>
          <p>Working holiday stories, practical guides, and a little inspiration for your next chapter.</p>
        </div>
        <BlogBrowser posts={posts} />
      </section>
    </main>
  )
}
