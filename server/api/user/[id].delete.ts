import { userList } from '.'

export default defineEventHandler(({ context: { params } }) => {
  userList.splice(params.id, 1)
  return { data: params.id }
})
