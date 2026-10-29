import { randomUUID } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import {
  calculateStatistics,
  type CompanyRow,
} from '~~/shared/utils/companies'
import type { BlogCopy, SavedBlog } from '~~/shared/types/blog'



function blogStore() {
  return getStore({
    name:
      process.env.CONTEXT === 'deploy-preview'
        ? 'generated-blogs-preview'
        : process.env.CONTEXT === 'branch-deploy'
          ? 'generated-blogs-branch'
          : 'generated-blogs',
    consistency: 'strong',
  })
}

export async function saveBlog(
  topic: string,
  copy: BlogCopy,
  companies: CompanyRow[],
): Promise<SavedBlog> {
  const topicSlug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/, '')

  const slug = `${topicSlug || 'company-insights'}-${randomUUID()}`

  const blog: SavedBlog = {
    slug,
    topic,
    createdAt: new Date().toISOString(),
    copy,
    statistics: calculateStatistics(companies),
    companies,
  }

  await blogStore().setJSON(slug, blog)

  return blog
}

export async function getBlog(slug: string): Promise<SavedBlog | null> {
  return blogStore().get(slug, { type: 'json' })
}