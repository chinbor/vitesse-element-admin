<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '~/stores/user'
import { toggleDark } from '~/composables'

const user = useUserStore()

const username = $ref('')
const password = $ref('')

const formRef = $ref<FormInstance>()
async function submit() {
  await formRef.validate()
  await user.login({ username, password })
  ElMessage.success('登录成功')
}

const autocomplete = useLocalStorage('autocomplete', 'new-password')
function reload() {
  if (!password)
    location.reload()
}
</script>

<template>
  <div flex="~ col" w-screen h-screen bg="zinc-50 dark:zinc-900">
    <button absolute right-5 top-5 btn fa6-solid:sun dark:fa6-solid-moon @click="toggleDark()" />
    <el-form
      ref="formRef"
      size="large"
      :model="{ username, password }"
      m-auto p-10 bg="white dark:zinc-800" w-sm flex="~ col" box-content rounded-lg shadow-lg
      @submit.prevent="submit"
    >
      <div flex items-center gap-3>
        <img src="/logo.png" h-15 select-none>
        <div>
          <div tracking-widest whitespace-nowrap font-extrabold text="4xl gray-700 dark:gray-100">
            菜谱预点餐系统
          </div>
          <p text="sm gray-400">
            Recipe pre-order management system
          </p>
        </div>
      </div>
      <div text="center sm gray-400" mt-3 mb-7>—— 登陆界面 ——</div>

      <el-form-item :rules="{ required: true, message: '不能为空' }" prop="username">
        <el-input v-model="username" placeholder="用户名">
          <template #prefix>
            <i ep:user />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :rules="{ required: true, message: '不能为空' }" prop="password">
        <el-input v-model="password" type="password" :autocomplete="autocomplete" show-password placeholder="密码">
          <template #prefix>
            <i ep:lock />
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="autocomplete" mt="-3" true-label="on" false-label="new-password" label="记住密码" @click="reload" />
      <el-button type="primary" z-1 native-type="submit">登录</el-button>
    </el-form>

    <div class="mx-auto my-10 tracking-widest text-gray-400 text-sm font-medium">CopyRight©2022 广东东为信息技术有限公司</div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
  layout: home
</route>
