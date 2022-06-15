<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import type { RepairType } from '../../type/api'
import { getRepairTypeList } from '../../type/api'
import { type Repair, getRepair, post, put, repairStatusList } from '../api'

const { id, ...props } = defineProps<{
  id: string
  show: boolean
}>()

let row = $ref<Repair>({})
id && getRepair(id).then(({ data }) => {
  row = data
})

let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let typeList = $ref<RepairType[]>([])
async function fetchTypeList() {
  ({ data: typeList } = await getRepairTypeList())
}
fetchTypeList()

async function submit() {
  await formRef?.validate()
  const loading = ElLoading.service({ fullscreen: true })
  try {
    // row.classificationId = row.classification
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
  <el-dialog v-model="show" draggable append-to-body :close-on-click-modal="false" custom-class="!w-2xl" :title="`${id ? '修改' : '添加'}${$route.meta.title}`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="repairsContent" label="标题">
        <el-input v-model="row.repairsContent" />
      </el-form-item>
      <el-form-item label="类型" prop="classification">
        <el-select v-model="row.classification" value-key="id">
          <el-option v-for="i in typeList" :key="i.id" :label="i.name" :value="i" />
        </el-select>
      </el-form-item>
      <div grid="~ cols-2" gap-5>
        <el-form-item label="申请人" prop="contacts">
          <el-input v-model="row.contacts" />
        </el-form-item>
        <el-form-item label="申请人电话" prop="contactsPhone">
          <el-input v-model="row.contactsPhone" />
        </el-form-item>
      </div>
      <el-form-item label="申请人部门" prop="department">
        <el-input v-model="row.department" />
      </el-form-item>
      <div grid="~ cols-2" gap-5>
        <el-form-item label="处理人" prop="handler">
          <el-input v-model="row.handler" />
        </el-form-item>
        <el-form-item label="处理人电话" prop="handlerPhone">
          <el-input v-model="row.handlerPhone" />
        </el-form-item>
      </div>
      <el-form-item label="状态" prop="status">
        <el-select v-model="row.status" @change="row.result || (row.result = repairStatusList.find(i => i.value === row.status)?.label)">
          <el-option v-for="i in repairStatusList" :key="i.value" v-bind="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理结果" prop="result">
        <el-input v-model="row.result" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

