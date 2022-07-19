import { merge } from 'lodash-es'
import { list } from '.'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)

  merge(
    list.find(i => i.id === event.context.params.id),
    body,
  )

  return {
    data: event.context.params.id,
  }
})
