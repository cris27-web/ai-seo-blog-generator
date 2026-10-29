import { listBlogs } from '../../utils/blogStorage'

export default defineEventHandler(async () => {
  return listBlogs()
})