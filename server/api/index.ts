export const links = [
  '/roles', '/roles/post', '/roles/[id]/put', '/roles/[id]/delete', '/roles/[id]/permissions', '/roles/[id]/permissions/put',
  '/users', '/users/post', '/users/[id]/put', '/users/[id]/delete',
  '/departments', '/departments/[id]/put', '/departments/post', '/departments/[id]/delete',
  '/enum-groups', '/enum-groups/post', '/enum-groups/[id]/put', '/enum-groups /[id]/delete',
  '/enums', '/enums/post', '/enums/[id]/put', '/enums/[id]/delete',
]

export default eventHandler(() => {
  return {
    links,
  }
})
