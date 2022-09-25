import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  if (body.blog)
    body.blog = body.blog.id

  const data = {
    ...body,
    id: `${list.length + 1}`,
    index: list.length + 1,
  }
  list.push(data)

  return {
    data: data.id,
  }
})
