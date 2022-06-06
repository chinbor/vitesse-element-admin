<script setup lang="ts">
import type { UploadInstance, UploadProps } from 'element-plus'
import { ElLoading } from 'element-plus'
import { getHeaders } from '~/composables/request'

interface Props extends Partial<UploadProps> {
  modelValue?: string
  onSuccess: (_?: any) => void
  paramsType?: 0 | 1
}
const { onSuccess, paramsType = 0, modelValue } = defineProps<Props>()
const emit = defineEmits(['update:model-value'])

let file = $ref<any>()
let model = $computed<string>({
  set(val) {
    emit('update:model-value', val)
  },
  get() {
    return file ? modelValue! : (modelValue! && `/api/file${modelValue}`)
  },
})
function onChange({ raw }: any) {
  file = raw
  model = URL.createObjectURL(raw)
}

let loading: any
function beforeUpload() {
  loading = ElLoading.service({ fullscreen: true })
}
function onError() {
  loading?.close()
}

const headers = getHeaders()
const uploadRef = $shallowRef<UploadInstance>()
defineExpose({
  submit: () => file ? uploadRef?.submit?.() : onSuccess(),
  abort: uploadRef?.abort,
  handleStart: uploadRef?.handleStart,
})
</script>

<template>
  <el-upload
    ref="uploadRef"
    class="avatar-uploader"
    :action="`/api/image/easyUpload?type=${paramsType}`"
    :headers="headers"
    icon="el-icon-upload"
    :show-file-list="false"
    :auto-upload="false"
    transition
    b="~ dashed gray-300 rounded hover:primary"
    cursor-pointer
    :on-change="onChange"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    :on-error="onError"
  >
    <el-image v-if="model" :src="model" class="avatar" width="300px" height="30px" />
    <el-icon v-else class="avatar-uploader-icon"><i class="ep:plus" text-3xl /></el-icon>
  </el-upload>
</template>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    display: flex;
  }

  .avatar {
    display: block;
    width: 178px;
    height: 178px;
  }

  .el-icon.avatar-uploader-icon {
    width: 178px;
    height: 178px;

    // font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
