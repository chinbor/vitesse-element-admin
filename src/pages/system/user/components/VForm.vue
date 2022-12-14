<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import type { Role } from '../../role/api'
import { getRoleList } from '../../role/api'
import type { User } from '../api'
import { getUser, post, put } from '../api'
import { getDepartmentList } from '~/pages/department/api'

const props = defineProps<{
  row: User
  modelValue: boolean
}>()

let row = $ref<User>(props.row)
onMounted(async () => {
  if (!row.id)
    return
  const { close } = ElLoading.service()
  ;({ data: row } = await getUser(row.id).finally(close))
})

let show = $(useVModel(props, 'modelValue'))
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

let roleList = $ref<Role[]>([])
async function fetchRoleList() {
  ({ data: roleList } = await getRoleList({ page: 1, pageSize: 100 }))
}
fetchRoleList()

async function fetchDepartmentList(node: any, resolve: any) {
  if (node.level === 0)
    return resolve(await getDepartmentList({ page: 1, pageSize: 99999 }).then(i => i.data))
  if (!node.data.hasChildren)
    return resolve([])
  const { data } = await getDepartmentList({ parentId: node.data.id, page: 1, pageSize: 99999 })
  resolve(data)
}

async function submit() {
  await formRef?.validate()
  const loading = ElLoading.service({ fullscreen: true })
  try {
    row.id ? await put(row) : await post(row)
    ElMessage.success('操作成功')
    getList()
    user.getUserInfo()
    show = false
  } finally {
    loading.close()
  }
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${row.id ? '修改' : '添加'}用户`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="username" label="账号">
        <el-input v-model="row.username" />
      </el-form-item>

      <div grid="~ cols-2" gap-5>
        <el-form-item label="密码" :rules="[{ message: '不能为空', required: !row.id }]" prop="password">
          <el-input v-model="row.password" :disabled="row.id === '1'" :placeholder="row.id === '1' ? '不能修改管理员密码' : ''" type="password" show-password autocomplete="new-password" />
        </el-form-item>
        <el-form-item label="确认密码" :rules="[{ message: '不能为空', required: !row.id }, { validator: validatePass, trigger: 'blur' }]" prop="confirmPassword">
          <el-input v-model="row.confirmPassword" :disabled="row.id === '1'" type="password" show-password autocomplete="new-password" />
        </el-form-item>
      </div>

      <el-form-item :rules="[{ message: '不能为空', required: true, trigger: 'blur' }]" prop="roles" label="角色">
        <el-select v-model="row.roles" multiple value-key="id">
          <el-option v-for="i in roleList" :key="i.id" :label="i.name" :value="i" />
        </el-select>
      </el-form-item>

      <el-form-item prop="department" :rules="[{ message: '不能为空', required: !row.id }]" label="部门">
        <el-tree-select
          v-model="row.department" value-key="id" collapse-tags :render-after-expand="false"
          :props="{ label: 'name', isLeaf: (data:any) => !data.hasChildren }" :load="fetchDepartmentList" lazy
          :default-expanded-keys="row.department?.path"
        >
          <template #default="{ data }">
            <div v-if="data.hasChildren">{{ data.name }}</div>
            <el-option v-else :label="data.name" :value="data" />
          </template>
        </el-tree-select>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="row.name" />
      </el-form-item>

      <el-form-item label="手机号" w="1/2" :rules="[{ max: 12, message: '请输入正确的手机号', trigger: 'blur' }]" prop="phone">
        <el-input v-model="row.phone" />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="row.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
