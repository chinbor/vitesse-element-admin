<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404',
})
</script>

<template>
  <div class="h-screen w-screen bg-blue text-white text-center flex flex-col items-center">
    <div text="20vh">
      404
    </div>

    <div class="text-lg" style="opacity: 0.7;">
      Oops. Nothing here...
    </div>
    <router-view />

    <el-button
      mt-3
      size="large"
      @click="$router.go(-1)"
    >
      返 回
    </el-button>
  </div>
</template>
