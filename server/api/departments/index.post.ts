import { list } from '.'

export default defineEventHandler(async (event) => {
  const row = await useBody(event)
  const body = {
    ...await useBody(event),
    parentId: row.parentId || '',
    id: `${list.length}`,
  }
  list.push(body)

  return {
    data: body.id,
  }
})
