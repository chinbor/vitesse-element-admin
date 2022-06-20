<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { type Question, getQuestion, post, put } from '../api'
import { questionTypeList } from '~/pages/question/template/[id]/api'

const { id, params, ...props } = defineProps<{
  id?: string
  params: object
  show: boolean
}>()

let row = $ref<Question>({ ...params, status: 1, questionFlag: 0, required: 0, options: [] })

id && getQuestion(id).then(({ data }) => {
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
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${id ? '修改' : '添加'}问题`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="content" label="内容">
        <el-input v-model="row.content" type="textarea" />
      </el-form-item>
      <el-form-item :rules="[{ message: '不能为空', required: true }]" label="类型" prop="type">
        <el-select v-model="row.type" @change="row.type === 4 && (row.questionFlag = 1)">
          <el-option v-for="i in questionTypeList" :key="i.value" :value="i.value" :label="i.label" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="[1, 2].includes(row.type!)" prop="options" label="选项">
        <div flex="~ 1 col" gap-3>
          <div v-for="(i, index) in row.options" :key="index" flex gap-3 items-center>
            <el-input v-model="i.optionValue" :placeholder="`选项 ${index + 1}`" />
            <div flex gap-2>
              <i fa6-regular:copy btn text="gray-400 sm" @click="row.options?.splice(index, 0, { ...i })" />
              <i fa6-regular:trash-can btn text="gray-400 sm" @click="row.options?.splice(index, 1)" />
            </div>
          </div>
          <div
            b="1 dashed gray-300 rounded" hover="b-primary text-primary" text-gray-400 cursor-pointer flex gap-1 justify-center items-center
            @click="row.options?.push({ optionValue: '' })"
          >
            <i ep:plus />添加选项
          </div>
        </div>
      </el-form-item>
      <el-form-item label="是否必填" prop="status">
        <el-switch v-model="row.required" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
