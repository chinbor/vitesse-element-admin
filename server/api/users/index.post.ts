import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  if (body.roles)
    body.roles = body.roles.map(i => i.id)
  if (body.department)
    body.department = body.department.id

  const data = {
    ...body,
    id: `${list.length + 1}`,
  }
  list.push(data)

  return {
    data: data.id,
  }
})
