# Sanity CMS Setup Guide

## Setup Steps

### 1. Create a Sanity Account
Visit [sanity.io](https://www.sanity.io/) and create a free account.

### 2. Create a New Project
```bash
# Install Sanity CLI globally (if not already installed)
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize Sanity in the project (this will use existing config)
# Or create a new project at sanity.io dashboard
```

### 3. Get Your Project Credentials
After creating your project at sanity.io:

1. Go to your project dashboard
2. Click on "API" in the left sidebar
3. Find your **Project ID**
4. Your **Dataset** is usually `production` (default)

### 4. Update Environment Variables
Add your Sanity credentials to `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 5. Access Sanity Studio
Once configured, you can access the Sanity Studio at:
```
http://localhost:3000/studio
```

### 6. Add Content
In Sanity Studio, you can:
- Create **Authors** (name, bio, image)
- Create **Categories** (title, description)
- Create **Posts** (title, content, images, etc.)

## Schema Overview

### Post Schema
- **title**: Post title
- **slug**: URL-friendly slug
- **author**: Reference to author
- **mainImage**: Featured image
- **categories**: Array of category references
- **publishedAt**: Publication date
- **excerpt**: Short description (max 200 chars)
- **body**: Rich text content with images
- **readTime**: Estimated reading time in minutes
- **featured**: Mark as featured (shows in hero section)

### Author Schema
- **name**: Author name
- **slug**: URL-friendly slug
- **image**: Profile picture
- **bio**: Rich text biography

### Category Schema
- **title**: Category name
- **slug**: URL-friendly slug
- **description**: Category description

## Pages Created

### Blog List Page
`/blogs` - Displays all blog posts with featured post hero section

### Individual Blog Post
`/blogs/[slug]` - Dynamic route for individual blog posts

### Sanity Studio
`/studio` - CMS interface for content management

## Features Implemented

- Full CMS integration with Sanity
- Dynamic blog listing with featured posts
- Rich text rendering with Portable Text
- Image optimization with Sanity's Image URL builder
- Category filtering
- Related posts
- Responsive design
- SEO-friendly slugs

## Next Steps

1. Update the `.env.local` file with your Sanity credentials
2. Restart the development server
3. Visit `/studio` to add your first blog post
4. Mark a post as "featured" to show it in the hero section
