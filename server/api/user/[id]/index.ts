import { userList } from '..'

export default defineEventHandler(async event => ({
  data: userList.find(i => i.id === event.context.params.id),
}))
