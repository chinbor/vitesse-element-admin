export default eventHandler(async ({ req }) => {
  await useStorage().removeItem(`redis:${req.headers.authorization}`)
  return null
})
