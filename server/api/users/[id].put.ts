import { merge } from 'lodash-es'
import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  if (body.roles)
    body.roles = body.roles.map(i => i.id)
  if (body.department)
    body.department = body.department.id

  body.password = body.password || undefined
  merge(
    list.find(i => i.id === event.context.params.id),
    body,
  )

  return { data: event.context.params.id }
})
