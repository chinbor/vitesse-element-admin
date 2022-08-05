<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { type EnumGroup, getEnumGroupList } from '../../group/api'
import { type Enum, getEnum, post, put } from '../api'

const props = defineProps<{
  row: Enum
  modelValue: boolean
}>()

let row = $ref(props.row)
onMounted(async () => {
  if (!row.id)
    return
  const { close } = ElLoading.service()
  ;({ data: row } = await getEnum(row.id).finally(close))
})

let show = $(useVModel(props, 'modelValue'))
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

let enumGroupList = $ref<EnumGroup[]>([])
async function fetchEnumGroupList() {
  ({ data: enumGroupList } = await getEnumGroupList())
}
fetchEnumGroupList()
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${row.id ? '修改' : '添加'}${$route.meta.title}`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="名称">
        <el-input v-model="row.name" />
      </el-form-item>
      <el-form-item label="代码组" :rules="[{ message: '不能为空', required: true }]" prop="group">
        <el-select v-model="row.group" value-key="id">
          <el-option v-for="i in enumGroupList" :key="i.id" :label="i.name" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="row.description" />
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
