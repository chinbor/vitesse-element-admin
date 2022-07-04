<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { type Role, post, put } from '../api'

const { row, ...props } = defineProps<{
  row: Role
  show: boolean
}>()

let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

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
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${row.id ? '修改' : '添加'}角色`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="名称">
        <el-input v-model="row.name" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="row.remark" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
