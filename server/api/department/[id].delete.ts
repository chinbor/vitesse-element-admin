import { list } from '.'

export default defineEventHandler(({ context: { params } }) => {
  const index = list.findIndex(i => i.id === params.id)
  list.splice(index, 1)
  return { data: params.id }
})
