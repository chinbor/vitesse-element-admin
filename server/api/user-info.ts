export default defineEventHandler(async event => ({
  data: event.context.user,
}))
