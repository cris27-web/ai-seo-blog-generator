import { getBlog } from '../../utils/blogStorage'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (
    !slug ||
    slug.length > 120 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid blog URL.',
    })
  }

  const blog = await getBlog(slug)

  if (!blog) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog not found.',
    })
  }

  return blog
})