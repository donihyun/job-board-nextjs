import { groq } from 'next-sanity'
import { client } from './sanity.client'

// TypeScript interfaces for Sanity data
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: any
  categories?: Category[]
  publishedAt: string
  readTime?: number
  featured?: boolean
  author: Author
  body?: any[]
}

export interface Author {
  _id: string
  name: string
  slug: { current: string }
  image?: any
  bio?: any[]
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

// Queries
const postFields = groq`
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  readTime,
  featured,
  author->{
    _id,
    name,
    slug,
    image
  }
`

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc) {
      ${postFields}
    }`
  )
}

// Get featured posts
export async function getFeaturedPosts(): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      ${postFields}
    }`
  )
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<Post> {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      ${postFields},
      body
    }`,
    { slug }
  )
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      ${postFields}
    }`,
    { categorySlug }
  )
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(
    groq`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  )
}

// Get related posts (same category, exclude current post)
export async function getRelatedPosts(postId: string, limit: number = 3): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post" && _id != $postId] | order(publishedAt desc) [0...$limit] {
      ${postFields}
    }`,
    { postId, limit }
  )
}
