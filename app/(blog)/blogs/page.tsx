import Image from "next/image"
import Link from "next/link"
import { BlogCard } from "@/components/blog-card"
import { CategoryFilter } from "@/components/category-filter"
import { Pagination } from "@/components/pagination"
import { getAllPosts, getFeaturedPosts } from "@/lib/sanity.queries"
import { urlFor } from "@/lib/sanity.client"

export default async function BlogPage() {
  const allPosts = await getAllPosts()
  const featuredPost = (await getFeaturedPosts())[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {featuredPost && (
        <section className="relative mt-32 h-[500px]">
          <Image
            src={featuredPost.mainImage ? urlFor(featuredPost.mainImage).width(1920).height(500).url() : "/placeholder.svg?height=500&width=1920"}
            alt={featuredPost.title}
            width={1920}
            height={500}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16 text-white">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold mb-4">{featuredPost.title}</h1>
                {featuredPost.excerpt && (
                  <p className="text-lg opacity-90">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    {featuredPost.author.image && (
                      <Image
                        src={urlFor(featuredPost.author.image).width(32).height(32).url()}
                        alt={featuredPost.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span>{featuredPost.author.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {featuredPost.readTime && <span>{featuredPost.readTime} mins read</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Blog</h2>
          <p className="text-gray-600">
            Here, we share travel tips, destination guides, and stories that inspire your next adventure.
          </p>
        </div>

        <CategoryFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {allPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        <div className="mt-12">
          <Pagination />
        </div>
      </section>
    </div>
  )
}

