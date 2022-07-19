import { getKnowledgeContentList } from '.'

export default defineEventHandler(({ context }) => {
  return {
    data: getKnowledgeContentList({ id: context.params.id })[0],
  }
})
