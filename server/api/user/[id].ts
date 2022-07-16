import { getUserList } from '.'

export default defineEventHandler(async event => ({
  data: getUserList({ id: event.context.params.id })[0],
}))
