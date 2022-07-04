import { roleList } from '../role'

export default defineEventHandler(({ context: { params } }) => {
  roleList.splice(params.id, 1)
  return { data: params.id }
})
