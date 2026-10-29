import { parseCompanies } from '~~/shared/utils/companies'
import { generateBlogCopy } from '../../utils/generateBlogCopy'
import { saveBlog } from '../../utils/blogStorage'

export default defineEventHandler(async (event) => {
  const body: unknown = await readBody(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a topic and CSV dataset.',
    })
  }

  const input = body as Record<string, unknown>

  if (
    typeof input.topic !== 'string' ||
    !input.topic.trim() ||
    input.topic.trim().length > 100
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a topic between 1 and 100 characters.',
    })
  }

  if (
    typeof input.csv !== 'string' ||
    !input.csv.trim()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please upload a non-empty CSV file.',
    })
  }

  if (new TextEncoder().encode(input.csv).length > 1_000_000) {
    throw createError({
      statusCode: 413,
      statusMessage: 'The CSV must be smaller than 1 MB.',
    })
  }

  const topic = input.topic.trim()

  const companies = (() => {
    try {
      return parseCompanies(input.csv as string)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'The CSV dataset is invalid.',
        data: {
          reason:
            error instanceof Error
              ? error.message
              : 'Check the CSV format.',
        },
      })
    }
  })()

  if (companies.length > 1000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please upload no more than 1,000 companies.',
    })
  }

  const config = useRuntimeConfig(event)

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Blog generation is not configured.',
    })
  }

  const copy = await generateBlogCopy(
    companies,
    topic,
    config.geminiApiKey,
  )

   const blog = await saveBlog(topic, copy, companies)

  return {
    slug: blog.slug,
    url: `/blog/${blog.slug}`,
  }
})