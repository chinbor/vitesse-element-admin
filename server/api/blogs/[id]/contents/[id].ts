import { getBlogContentList } from '.'

export default defineEventHandler(({ context }) => {
  return {
    data: getBlogContentList({ id: context.params.id })[0],
  }
})
