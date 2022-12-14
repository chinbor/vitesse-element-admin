import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = {
    ...await useBody(event),
    id: `${list.length + 1}`,
    index: list.length + 1,
  }
  list.push(body)

  return {
    data: body.id,
  }
})
