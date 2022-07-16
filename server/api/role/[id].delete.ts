import { list } from '.'

export default defineEventHandler(({ context: { params } }) => {
  list.splice(params.id, 1)

  return { data: params.id }
})
