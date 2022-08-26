<script setup lang="ts">
function hex2rgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

const colorPrimary = useCssVar('--el-color-primary')
const colorPrimaryRgb = useCssVar('--el-color-primary-rgb')
const elColorPrimary = useLocalStorage('--el-color-primary', colorPrimary.value.trim())
watch(elColorPrimary, (val) => {
  colorPrimary.value = val
  colorPrimaryRgb.value = hex2rgb(val)
})

const colorList = [
  '#409EFF',
  '#6366F1',
  '#67C23A',
  '#E6A23C',
  '#909399',
]
</script>

<template>
  <el-popover width="auto">
    <div flex gap-3>
      <div
        v-for="i in colorList" :key="i"
        h-5 w-5 rounded cursor-pointer
        :style="{ 'background': i, 'outline-color': i }" :class="{ 'outline outline-offset-1': elColorPrimary === i }"
        @click="elColorPrimary = i"
      />
    </div>
    <template #reference>
      <button btn text-sm i-fa6-solid:sun dark:i-fa6-solid-moon v-bind="$attrs" @click="toggleDark()" />
    </template>
  </el-popover>
</template>
