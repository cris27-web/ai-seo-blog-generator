import type {
  CompanyRow,
  calculateStatistics,
} from '../utils/companies'

export type BlogCopy = {
  title: string
  metaDescription: string
  introduction: string
  sections: Array<{
    heading: string
    body: string
  }>
}

export type SavedBlog = {
  slug: string
  topic: string
  createdAt: string
  copy: BlogCopy
  statistics: ReturnType<typeof calculateStatistics>
  companies: CompanyRow[]
}