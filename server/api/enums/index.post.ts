import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const data = {
    ...body,
    id: `${list.length + 1}`,
    index: list.length + 1,
    group: body.group.id,
  }
  list.push(data)

  return {
    data: data.id,
  }
})
