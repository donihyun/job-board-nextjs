import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
})

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
