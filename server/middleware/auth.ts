import { flatten, uniq } from 'lodash-es'
import { userList } from '../api/user/index'

const whiteList = ['/api/user/login', '/api/system']

export default defineEventHandler(async ({ req, context }) => {
  const permission = `${req.url?.replace(/^\/api([^?#]*).*$/, '$1')?.replace(/\d+/g, 'id')}${req.method !== 'GET' ? `/${req.method?.toLowerCase()}` : ''}`

  if (whiteList.includes(req.url!))
    return

  let user = await useStorage().getItem(req.headers.authorization)
  if (!user || Date.now() - user.timeout > 30 * 60 * 1000) {
    await useStorage().removeItem(req.headers.authorization)
    return createError({ statusCode: 401, message: '认证过期，请重新登陆' })
  }

  user = userList.find(i => i.username === user.username)
  user.permissions = uniq(flatten(user.roles.map((i: any) => i.permissions)))
  if (req.url !== '/api/user/info' && !user.permissions.includes(permission))
    return createError({ statusCode: 403, message: '当前用户没有访问权限' })

  await useStorage().setItem(req.headers.authorization, { ...user, timeout: Date.now() })
  context.user = user
})
