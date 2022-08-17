import { getBlogList } from '..'

export default defineEventHandler((event) => {
  return {
    data: getBlogList({ id: event.context.params.id })[0],
  }
})
