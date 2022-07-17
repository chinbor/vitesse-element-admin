import { getRoleList } from '..'

export default defineEventHandler((event) => {
  return {
    data: getRoleList({ id: event.context.params.id })[0],
  }
})
