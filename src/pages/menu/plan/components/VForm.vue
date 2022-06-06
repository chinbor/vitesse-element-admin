<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { FoodRow } from '../../food/api'
import { getFoodList } from '../../food/api'
import type { Plan } from '../api'
import { post, put } from '../api'

const props = defineProps<{
  show: boolean
  row: Plan
}>()
const row = $ref(cloneDeep({ ...props.row }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let foodList = $ref<FoodRow[]>()
async function fetchFoodList() {
  ({ data: foodList } = await getFoodList({ pageIndex: 1, pageSize: 100 }))
}
fetchFoodList()

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
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}菜单`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="row.date" :disabled="!!row.id" value-format="YYYY-MM-DD" type="date" placeholder="选择时间" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="row.mealType" :disabled="!!row.id" class="ml-4">
          <el-radio :label="1">早餐</el-radio>
          <el-radio :label="2">午餐</el-radio>
          <el-radio :label="3">晚餐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :rules="[{ message: '不能为空', required: true, trigger: 'blur' }]" prop="foodInfo" label="菜品">
        <el-select v-model="row.foodInfo" flex-1 value-key="id" multiple>
          <el-option v-for="i in foodList" :key="i.id" :label="i.name" :value="i" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
