<script setup lang="ts">
function hex2rgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

const colorList = [
  '#409EFF',
  '#6366f1',
  '#67C23A',
  '#E6A23C',
  '#909399',
]

let colorPrimary = $(useCssVar('--el-color-primary', document.documentElement))
let colorPrimaryRgb = $(useCssVar('--el-color-primary-rgb', document.documentElement))
const color = $(useLocalStorage('color', colorPrimary))
watch(() => color, () => {
  colorPrimary = color
  colorPrimaryRgb = hex2rgb(color)
}, { immediate: true })
</script>

<template>
  <el-popover width="auto">
    <div flex gap-3>
      <div
        v-for="i in colorList" :key="i"
        h-5 w-5 rounded cursor-pointer
        :style="{ 'background': i, 'outline-color': i }" :class="{ 'outline outline-offset-1': color.trim() === i }"
        @click="color = i"
      />
    </div>
    <template #reference>
      <button btn text-sm fa6-solid:palette />
    </template>
  </el-popover>
</template>
