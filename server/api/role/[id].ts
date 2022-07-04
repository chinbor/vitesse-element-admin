import { roleList } from '../role'

export default defineEventHandler((event) => {
  return { data: roleList.find(i => i.id === event.context.params.id) }
})
