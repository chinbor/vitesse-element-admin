import { getKnowledgeList } from '..'

export default defineEventHandler((event) => {
  return {
    data: getKnowledgeList({ id: event.context.params.id })[0],
  }
})
