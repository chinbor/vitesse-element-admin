import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../middleware/auth'
import { list } from './users'

export default eventHandler(async (event) => {
  const { password, username } = await useBody(event)

  const user = list.find(i => i.username === username)
  if (user?.password !== password)
    return createError({ statusCode: 401, message: '用户名或密码无效' })

  return {
    data: jwt.sign(user, TOKEN_SECRET, { expiresIn: '1800s' }),
  }
})
