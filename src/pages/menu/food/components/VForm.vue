<script setup lang="ts">
import type { FormInstance, UploadInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { FoodTypeRow } from '../../food-type/api'
import { getFoodTypeList } from '../../food-type/api'
import type { FoodRow } from '../api'
import { post, put } from '../api'
import VUpload from '~/components/VUpload.vue'

const props = defineProps<{
  show: boolean
  row: FoodRow
}>()
const row = $ref(cloneDeep({ ...props.row }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let foodTypeList = $ref<FoodTypeRow[]>()
async function fetchFoodTypeList() {
  ({ data: foodTypeList } = await getFoodTypeList({ pageIndex: 1, pageSize: 1000 }))
}
fetchFoodTypeList()

const uploadRef = shallowRef<UploadInstance>()
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
function onSuccess({ data }: any = {}) {
  if (data)
    row.photoName = data
  submit()
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}菜品`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="formRef?.validate().then(uploadRef?.submit)">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="名称">
        <el-input v-model="row.name" />
      </el-form-item>

      <el-form-item label="类型" :rules="{ required: true, message: '不能为空' }" prop="foodEnums">
        <el-select v-model="row.foodEnums" multiple value-key="id">
          <el-option v-for="i in foodTypeList" :key="i.id" :label="i.enumName" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="能量" w="3/4" prop="calorie">
        <el-input v-model="row.calorie" type="number" />
      </el-form-item>

      <el-form-item prop="photoName" label="图片">
        <VUpload ref="uploadRef" v-model="row.photoName" :on-success="onSuccess" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
