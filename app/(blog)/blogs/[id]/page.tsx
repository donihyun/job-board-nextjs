import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CategoryFilter } from "@/components/category-filter"
import { Pagination } from "@/components/pagination"
import { BlogCard } from "@/components/blog-card"
import { getPostBySlug, getRelatedPosts } from "@/lib/sanity.queries"
import { urlFor } from "@/lib/sanity.client"
import { CustomPortableText } from "@/components/portable-text"

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostBySlug(params.id)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post._id, 3)

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto mt-32 px-4 py-8">
        {/* Blog Post Header */}
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <Image
                    src={urlFor(post.author.image).width(48).height(48).url()}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                )}
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <div className="text-sm text-gray-500">
                    <span>{formattedDate}</span>
                    {post.readTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.readTime} mins read</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category._id}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {post.mainImage && (
              <div className="relative h-96 mb-8">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(600).url()}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Blog Post Content */}
          <div className="prose prose-lg max-w-none">
            {post.body && <CustomPortableText value={post.body} />}
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-24 px-10">
            <h2 className="text-2xl font-bold mb-4">More Articles</h2>
            <CategoryFilter />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
              {relatedPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

