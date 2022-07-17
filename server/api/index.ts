export const links = [
  '/role', '/role/post', '/role/[id]/put', '/role/[id]/delete', '/role/[id]/permission', '/role/[id]/permission/put',
  '/user', '/user/post', '/user/[id]/put', '/user/[id]/delete',
  '/department', '/department/[id]/put', '/department/post', '/department/[id]/delete',
  '/enum/group', '/enum/group/post', '/enum/group/[id]/put', '/enum/group /[id]/delete',
  '/enum', '/enum/post', '/enum/[id]/put', '/enum/[id]/delete',
]

export default eventHandler(() => {
  return {
    links,
  }
})
