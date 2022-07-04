import { merge } from 'lodash-es'
import { roleList } from '../role'

export default defineEventHandler(async (event) => {
  merge(
    roleList.find(i => i.id === event.context.params.id),
    await useBody(event),
  )

  return { data: event.context.params.id }
})
