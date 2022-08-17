import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  if (body.blog)
    body.blog = body.blog.id

  const data = {
    ...body,
    id: `${list.length}`,
    index: list.length,
  }
  list.push(data)

  return {
    data: data.id,
  }
})
