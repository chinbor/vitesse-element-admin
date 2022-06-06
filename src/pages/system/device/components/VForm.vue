<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { Device } from '../api'
import { post, put } from '../api'

const props = defineProps<{
  show: boolean
  row: Device
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
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}设备`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="名称">
        <el-input v-model="row.name" />
      </el-form-item>

      <div w="3/4" grid="~ cols-2 gap-5">
        <el-form-item label="IP地址" prop="addressIp">
          <el-input v-model="row.addressIp" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="row.port" type="number" />
        </el-form-item>
      </div>
      <div w="3/4" grid="~ cols-2 gap-5">
        <el-form-item prop="loginName" label="登录名">
          <el-input v-model="row.loginName" />
        </el-form-item>
        <el-form-item prop="loginPaw" label="密码">
          <el-input v-model="row.loginPaw" />
        </el-form-item>
      </div>
      <el-form-item prop="address" label="位置">
        <el-input v-model="row.address" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
