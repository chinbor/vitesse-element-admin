import { flatten, uniq } from 'lodash-es'
import { getUserList } from '../api/users'

const exclude = ['/api/login', '/api/settings', '/api']
export default defineEventHandler(async ({ req, context }) => {
  // 不经过权限验证的路由
  if (exclude.includes(req.url!))
    return

  const userStore = await useStorage().getItem(req.headers.authorization)
  if (!userStore?.id || Date.now() - userStore.timeout > 30 * 60 * 1000) {
    // eslint-disable-next-line no-console
    console.log(userStore?.id, Date.now(), userStore?.timeout, '...debug')
    await useStorage().removeItem(req.headers.authorization)
    return createError({ statusCode: 401, message: '认证过期，请重新登陆' })
  }

  const user = getUserList({ id: userStore.id })[0]
  const permissions = uniq(flatten(user.roles?.map((i: any) => i.permissions)))
  let permission = req.url?.replace(/^\/api([^?#]*).*$/, '$1')?.replace(/\d+/g, '[id]')
  if (req.method !== 'GET')
    permission += `/${req.method?.toLowerCase()}`
  else if (permission.endsWith('/[id]'))
    permission = permission.replace(/\/\[id\]$/, '')
  if (req.url !== '/api/user-info' && !permissions.includes(permission))
    return createError({ statusCode: 403, message: '当前用户没有访问权限' })

  await useStorage().setItem(req.headers.authorization, context.user = {
    ...user,
    permissions,
    timeout: Date.now(),
  })
})
