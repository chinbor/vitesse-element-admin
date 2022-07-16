import { getDepartmentList, list } from '.'

export default defineEventHandler(({ context }) => {
  const data = getDepartmentList({ id: context.params.id })[0]

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
      parentIds: getPath(data.id),
    },
  }
})
