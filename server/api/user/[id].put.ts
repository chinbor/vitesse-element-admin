import { merge } from 'lodash-es'
import { userList } from '.'

export default defineEventHandler(async (event) => {
  merge(
    userList.find(i => i.id === event.context.params.id),
    await useBody(event),
  )

  return { data: event.context.params.id }
})
