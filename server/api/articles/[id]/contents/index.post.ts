import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  if (body.article)
    body.article = body.article.id

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
