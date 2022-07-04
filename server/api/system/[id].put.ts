import { merge } from 'lodash-es'
import { systemList } from './index'

export default defineEventHandler(async (event) => {
  merge(
    systemList.find(i => i.id === event.context.params.id),
    await useBody(event),
  )

  return { data: event.context.params.id }
})
