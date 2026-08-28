import Image from "next/image"
import Link from "next/link"
import { Post } from "@/lib/sanity.queries"
import { urlFor } from "@/lib/sanity.client"

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-48">
        <Image
          src={post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : "/placeholder.svg?height=300&width=400"}
          alt={post.title}
          fill
          className="object-cover"
        />
        {post.categories && post.categories.length > 0 && (
          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-sm">
            {post.categories[0].title}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/blogs/${post.slug.current}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.author.image ? (
              <Image
                src={urlFor(post.author.image).width(32).height(32).url()}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            <span className="text-sm text-gray-600">{post.author.name}</span>
          </div>
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
  )
}

