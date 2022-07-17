import { merge } from 'lodash-es'
import { list } from '.'

export default defineEventHandler(async (event) => {
  merge(
    list.find(i => i.id === event.context.params.id),
    await useBody(event),
  )

  return { data: event.context.params.id }
})
