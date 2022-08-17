export const links = [
  '/settings', '/settings/[id]/put',
  '/roles', '/roles/post', '/roles/[id]/put', '/roles/[id]/delete', '/roles/[id]/permissions', '/roles/[id]/permissions/put',
  '/users', '/users/post', '/users/[id]/put', '/users/[id]/delete',
  '/departments', '/departments/post', '/departments/[id]/put', '/departments/[id]/delete',
  '/enum-groups', '/enum-groups/post', '/enum-groups/[id]/put', '/enum-groups/[id]/delete',
  '/enums', '/enums/post', '/enums/[id]/put', '/enums/[id]/delete',
  '/blogs', '/blogs/post', '/blogs/[id]/put', '/blogs/[id]/delete',
  '/blogs/[id]/contents', '/blogs/[id]/contents/post', '/blogs/[id]/contents/[id]/put', '/blogs/[id]/contents/[id]/delete',
]

export default eventHandler(() => {
  return {
    links,
  }
})
