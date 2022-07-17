import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const data = {
    ...body,
    id: `${list.length}`,
    index: list.length,
    group: body.group.id,
  }
  list.push(data)

  return {
    data: data.id,
  }
})
