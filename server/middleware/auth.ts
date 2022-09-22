import { flatten, uniq } from 'lodash-es'
import jwt from 'jsonwebtoken'
import { getUserList } from '../api/users'

const exclude = ['/api/login', '/api/settings', '/api']

export const TOKEN_SECRET = '6402d0c79432b0e31fd73ac51b1313485146f875b2d00bd1f8acf407744c1247308cd08ae3bb3d589dd19a947e240ca4a97247384be1262bd2562d3577b08063'

export default defineEventHandler(async ({ req, context }) => {
  try {
    // Routes that do not require permission verification
    if (exclude.includes(req.url!))
      return

    const { id } = jwt.verify(req.headers.authorization, TOKEN_SECRET)

    const user = getUserList({ id })[0]
    const permissions = uniq(flatten(user.roles?.map((i: any) => i.permissions)))
    let permission = req.url?.replace(/^\/api([^?#]*).*$/, '$1')?.replace(/\d+/g, '[id]')
    if (req.method !== 'GET')
      permission += `/${req.method?.toLowerCase()}`
    else if (permission.endsWith('/[id]'))
      permission = permission.replace(/\/\[id\]$/, '')
    if (req.url !== '/api/user-info' && !permissions.includes(permission))
      return createError({ statusCode: 403, message: `当前用户没有"${req.url}"的访问权限` })

    context.user = {
      ...user,
      permissions,
    }
  } catch {
    return createError({ statusCode: 401, message: '认证过期，请重新登陆' })
  }
})
