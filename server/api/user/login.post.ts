import { userList } from '.'

export default eventHandler(async (event) => {
  const { password, username } = await useBody(event)
  const user = userList.find(i => i.username === username)
  if (user?.password !== password)
    return createError({ statusCode: 401, message: '用户名或密码无效' })

  const token = `Basic ${Buffer.from(`${username}:${password}`, 'base64').toString()}`
  await useStorage().setItem(token, { ...user, permissions: [], timeout: Date.now() })
  return {
    data: token,
  }
})
