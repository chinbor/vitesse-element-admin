<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { DepartmentRow } from '../api'
import { post, put } from '../api'

const props = defineProps<{
  show: boolean
  row: DepartmentRow
}>()
const row = $ref(cloneDeep({ ...props.row }))
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
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}部门`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="departmentName" label="名称">
        <el-input v-model="row.departmentName" />
      </el-form-item>
      <el-form-item label="电话号码" :rules="[{ max: 11, message: '请输入正确的手机号', trigger: 'blur' }]" prop="phone">
        <el-input v-model="row.phone" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="row.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
