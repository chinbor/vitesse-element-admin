import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  srcDir: './server',
  storage: {
    redis: {
      driver: 'redis',
      url: 'zmjs.ml:6379',
    },
  },
})
