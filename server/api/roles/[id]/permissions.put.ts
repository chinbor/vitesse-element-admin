import { list } from '..'

export default defineEventHandler(async (event) => {
  const role = list.find(i => i.id === event.context.params.id)
  role && ({ permissions: role.permissions } = await useBody<{ permissions: string[] }>(event))

  return {
    data: role?.id,
  }
})
