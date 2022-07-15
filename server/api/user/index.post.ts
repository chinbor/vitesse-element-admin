import { userList } from '.'

export default defineEventHandler(async (event) => {
  const body = {
    ...await useBody(event),
    id: `${userList.length}`,
  }
  userList.push(body)

  return {
    data: body.id,
  }
})
