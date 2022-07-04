import { roleList } from '..'
export default defineEventHandler((event) => {
  return {
    data: roleList.find(i => i.id === event.context.params.id)?.permissions,
  }
})
