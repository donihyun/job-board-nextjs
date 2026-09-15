import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"
import { BlogCard } from "@/components/blog-card"
import { BlogCover } from "@/components/blog-cover"
import { BlogAuthor } from "@/components/blog-meta"
import { BlogArticleSidebar } from "@/components/blog-article-sidebar"
import { getBlogArticleContent } from "@/lib/blog-headings"
import { getPostBySlug, getRelatedPosts } from "@/lib/sanity.queries"
import { CustomPortableText } from "@/components/portable-text"
import styles from "@/components/blog.module.css"

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostBySlug(params.id)
  if (!post) notFound()
  const { body: rawBody, ...coverPost } = post
  const { body, headings } = getBlogArticleContent(rawBody ?? [])
  const relatedPosts = await getRelatedPosts(post._id, 3)

  return (
    <main className={styles.page}>
      <nav className={styles.backNav} aria-label="Blog navigation">
        <Link href="/blogs"><ArrowLeft size={16} />All articles</Link>
        <span>VIKB Journal</span>
      </nav>
      <article>
        <BlogCover posts={[coverPost]} detail />
        <div className={styles.articleLayout}>
          <BlogArticleSidebar headings={headings} />
          <div className={styles.articleBody}>
            {body && <CustomPortableText value={body} />}
            <footer className={styles.articleFooter}>
              <BlogAuthor author={post.author} />
              <Link href="/blogs">Back to the blog<ArrowRight size={16} /></Link>
            </footer>
          </div>
        </div>
      </article>
      {relatedPosts.length > 0 && (
        <section className={styles.related} aria-labelledby="more-articles">
          <div className={styles.relatedHeading}>
            <div><h2 id="more-articles">Keep exploring</h2><p>More stories for your working holiday.</p></div>
            <Link href="/blogs">View all articles<ArrowRight size={16} /></Link>
          </div>
          <div className={styles.grid}>
            {relatedPosts.map(relatedPost => <BlogCard key={relatedPost._id} post={relatedPost} />)}
          </div>
        </section>
      )}
    </main>
  )
}
