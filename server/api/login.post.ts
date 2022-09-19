import { tokenMap } from '../middleware/auth'
import { list } from './users'

export default eventHandler(async (event) => {
  const { password, username } = await useBody(event)

  const user = list.find(i => i.username === username)
  if (user?.password !== password)
    return createError({ statusCode: 401, message: '用户名或密码无效' })

  const token = `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`
  tokenMap.set(token, { ...user, timeout: Date.now() })

  return {
    data: token,
  }
})
