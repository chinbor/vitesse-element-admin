import { roleList } from '../role'

export default defineEventHandler(async (event) => {
  const body = {
    ...await useBody(event),
    id: `${roleList.length}`,
  }
  roleList.push(body)

  return {
    data: body.id,
  }
})
