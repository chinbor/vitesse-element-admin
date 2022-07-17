import { getEnumList } from '.'

export default defineEventHandler((event) => {
  return {
    data: getEnumList({ id: event.context.params.id })[0],
  }
})
