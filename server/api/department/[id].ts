import { list } from '.'

export default defineEventHandler(({ context }) => {
  const data = list.find(i => i.id === context.params.id)

  function getPath(id, result = []) {
    const item = list.find(item => item.id === id)
    result = [...result, id]
    if (item.parentId)
      result = getPath(item.parentId, result)
    return result
  }

  return {
    data: {
      ...data,
      parent: list.find(item => item.id === data.parentId),
      hasChildren: !!list.find(item => item.parentId === data.id),
      parentIds: getPath(data.id),
    },
  }
})
