import { getArticleContentList } from '.'

export default defineEventHandler(({ context }) => {
  return {
    data: getArticleContentList({ id: context.params.id })[0],
  }
})
