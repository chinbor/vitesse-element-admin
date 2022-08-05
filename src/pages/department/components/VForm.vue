<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { type Department, getDepartment, post, put } from '../api'

const props = defineProps<{
  row: Department
  modelValue: boolean
  treeKey: number
}>()

let row = $ref(props.row)
onMounted(async () => {
  if (!row.id)
    return
  const { close } = ElLoading.service()
  ;({ data: row } = await getDepartment(row.id).finally(close))
})

let show = $(useVModel(props, 'modelValue'))
let treeKey = $(useVModel(props, 'treeKey'))
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
    treeKey++
  } finally {
    loading.close()
  }
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${row.id ? '修改' : '添加'}部门`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="名称">
        <el-input v-model="row.name" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="row.remark" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="row.status" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
