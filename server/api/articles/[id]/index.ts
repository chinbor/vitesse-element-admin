import { getArticleList } from '..'

export default defineEventHandler((event) => {
  return {
    data: getArticleList({ id: event.context.params.id })[0],
  }
})
