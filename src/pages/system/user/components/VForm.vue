<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { RoleRow } from '../../role/api'
import { getRoleList } from '../../role/api'
import type { Row } from '../api'
import { getRolesByUserId, post, put } from '../api'

const props = defineProps<{
  show: boolean
  row: Row
}>()
const row = $ref(cloneDeep({ ...props.row, password: '' }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

const validatePass = (_: any, value: any, callback: any) => {
  if (row.id && !row.password && !value)
    return callback()
  if (value !== row.password)
    callback(new Error('两次密码不一致'))
  else
    callback()
}

let roleList = $ref<RoleRow[]>()
async function fetchRoleList() {
  ({ data: roleList } = await getRoleList({ pageIndex: 1, pageSize: 100 }))
}
fetchRoleList()

row.id && getRolesByUserId(row.id).then(({ data }) => {
  row.roleIds = data.map(i => i.id!)
})

async function submit() {
  await formRef?.validate()
  const loading = ElLoading.service({ fullscreen: true })
  try {
    row.id ? await put(row) : await post(row)

    ElMessage.success('操作成功')
    show = false
    getList()
  } finally {
    loading.close()
  }
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}用户`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item
        :rules="[
          { message: '不能为空', required: true },
          // { type: 'email', message: '无效的邮箱格式', trigger: 'blur' },
        ]"
        prop="username" label="账号"
      >
        <el-input v-model="row.username" />
      </el-form-item>
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="roleIds" label="角色">
        <el-select v-model="row.roleIds" multiple>
          <el-option v-for="i in roleList" :key="i.id" :label="i.roleNameZh" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="nickname">
        <el-input v-model="row.nickname" />
      </el-form-item>
      <div grid="~ cols-2" gap-5>
        <el-form-item label="密码" :rules="[{ message: '不能为空', required: !row.id }, { min: 8, message: '密码长度不能低于8位', trigger: 'blur' }]" prop="password">
          <el-input v-model="row.password" type="password" show-password autocomplete="new-password" />
        </el-form-item>
        <el-form-item label="确认密码" :rules="[{ message: '不能为空', required: !row.id }, { validator: validatePass, trigger: 'blur' }]" prop="confirmPassword">
          <el-input v-model="row.confirmPassword" type="password" show-password autocomplete="new-password" />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
