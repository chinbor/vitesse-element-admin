<script setup lang="ts">
import type { FormInstance, UploadInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { type DepartmentRow, getDepartmentList } from '../../department/api'
import type { Row } from '../api'
import { post, put } from '../api'
import { request } from '~/composables/request'

const props = defineProps<{
  show: boolean
  row: Row
}>()
const row = $ref(cloneDeep({ ...props.row }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let departmentList = $ref<DepartmentRow[]>()
async function fetchDepartmentList() {
  ({ data: departmentList } = await getDepartmentList({ pageIndex: 1, pageSize: 1000 }))
}
fetchDepartmentList()

const uploadRef = shallowRef<UploadInstance>()
async function submit() {
  const { data } = row.id ? await put(row) : await post(row)
  ElMessage.success(`${row.id ? '修改' : '添加'}人员成功`)
  show = false
  getList()
  row.id = data as string
}
async function onSuccess({ data }: any = {}) {
  const loading = ElLoading.service({ fullscreen: true })
  try {
    data && (row.photoName = data)
    await submit()
    data && await addFacesPerson()
  } finally {
    loading.close()
  }
}

async function addFacesPerson() {
  request(`/device/device/${row.id}`, { method: 'post' })
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-3xl" :title="`${row.id ? '修改' : '添加'}人员信息`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="() => formRef?.validate().then(() => uploadRef?.submit())">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="姓名">
        <el-input v-model="row.name" />
      </el-form-item>
      <div flex gap-3>
        <el-form-item label="部门" :rules="{ required: true, message: '不能为空' }" prop="department.id">
          <el-select v-model="row.department" value-key="id">
            <el-option v-for="i in departmentList" :key="i.id" :label="i.departmentName" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item prop="job" label="职位">
          <el-input v-model="row.job" />
        </el-form-item>
        <el-form-item prop="rank" label="职级">
          <el-input v-model="row.rank" />
        </el-form-item>
      </div>

      <el-form-item label="性别" prop="nickname">
        <el-radio-group v-model="row.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" w="3/4" prop="phone" :rules="[{ pattern: /^\d{11}$/, message: '请输入正确的手机号', trigger: 'blur' }, { required: true, message: '不能为空' }]">
        <el-input v-model="row.phone" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="row.birthday"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <div flex gap-3>
        <el-form-item label="入职时间" prop="birthday">
          <el-date-picker
            v-model="row.entryDate"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="退休时间" prop="birthday">
          <el-date-picker
            v-model="row.retirementDate"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </div>
      <el-form-item prop="address" label="住址">
        <el-input v-model="row.address" type="textarea" />
      </el-form-item>
      <el-form-item prop="photoName" :rules="[{ required: true, message: '不能为空' }]" label="照片">
        <VUpload ref="uploadRef" v-model="row.photoName" :params-type="1" :on-success="onSuccess" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">{{ row.id ? '修改' : '添加' }}并下发人脸</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
