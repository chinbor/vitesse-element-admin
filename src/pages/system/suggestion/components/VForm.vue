<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { type Suggestion, getSuggestion, post, put } from '../api'

const { id, ...props } = defineProps<{
  id: string
  show: boolean
}>()

let row = $ref<Suggestion>({ status: 1 })
id && getSuggestion(id).then(({ data }) => {
  row = data
})
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

async function submit() {
  await formRef?.validate()
  const loading = ElLoading.service({ fullscreen: true })
  try {
    id ? await put(row) : await post(row)
    ElMessage.success('操作成功')
    show = false
    getList()
  } finally {
    loading.close()
  }
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${id ? '修改' : '添加'}意见`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="suggestion" label="名称">
        <el-input v-model="row.suggestion" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="row.remark" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="图片">
        <el-image v-for="i in row.pictures" :key="i.id" :src="i.url" class="avatar" width="300px" height="30px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
