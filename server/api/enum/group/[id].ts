import { getEnumGroupList } from '.'

export default defineEventHandler((event) => {
  return { data: getEnumGroupList({ id: event.context.params.id })[0] }
})
