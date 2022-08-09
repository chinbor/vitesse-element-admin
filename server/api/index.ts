export const links = [
  '/settings', '/settings/[id]/put',
  '/roles', '/roles/post', '/roles/[id]/put', '/roles/[id]/delete', '/roles/[id]/permissions', '/roles/[id]/permissions/put',
  '/users', '/users/post', '/users/[id]/put', '/users/[id]/delete',
  '/departments', '/departments/post', '/departments/[id]/put', '/departments/[id]/delete',
  '/enum-groups', '/enum-groups/post', '/enum-groups/[id]/put', '/enum-groups/[id]/delete',
  '/enums', '/enums/post', '/enums/[id]/put', '/enums/[id]/delete',
  '/articles', '/articles/post', '/articles/[id]/put', '/articles/[id]/delete',
  '/articles/[id]/contents', '/articles/[id]/contents/post', '/articles/[id]/contents/[id]/put', '/articles/[id]/contents/[id]/delete',
]

export default eventHandler(() => {
  return {
    links,
  }
})
