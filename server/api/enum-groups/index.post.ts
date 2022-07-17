import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = {
    ...await useBody(event),
    id: `${list.length}`,
    index: list.length,
  }
  list.push(body)

  return {
    data: body.id,
  }
})
