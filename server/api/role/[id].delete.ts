import { list } from '.'

export default defineEventHandler(({ context, res }) => {
  list.splice(context.params.id, 1)

  res.statusCode = 204
  return true
})
