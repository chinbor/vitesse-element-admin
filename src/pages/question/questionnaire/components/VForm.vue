<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import type { Template } from '../../template/api'
import { getTemplateList } from '../../template/api'
import type { QuestionType } from '../../type/api'
import { getQuestionTypeList } from '../../type/api'
import { type Questionnaire, getQuestionnaire, post, put } from '../api'

const { id, ...props } = defineProps<{
  id?: string
  show: boolean
}>()

let row = $ref<Questionnaire>({ status: 1 })
id && ({ data: row } = await getQuestionnaire(id))
watch(() => row.template, (template) => {
  row.title = template?.title
  row.preface = template?.preface
  row.classification = { id: template?.classificationId }
})

let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let typeList = $ref<QuestionType[]>([])
async function fetchTypeList() {
  ({ data: typeList } = await getQuestionTypeList())
}
fetchTypeList()

let templateList = $ref<Template[]>([])
async function fetchTemplateList() {
  ({ data: templateList } = await getTemplateList())
}
fetchTemplateList()

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
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" draggable :title="`${id ? '修改' : '添加'}${$route.meta?.title}`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item label="问卷模版" prop="template">
        <el-select v-model="row.template" :disabled="!!row.id" value-key="id">
          <el-option v-for="i in templateList" :key="i.id" :label="i.title" :value="i" />
        </el-select>
      </el-form-item>

      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="title" label="标题">
        <el-input v-model="row.title" />
      </el-form-item>

      <el-form-item label="类型" prop="classification">
        <el-select v-model="row.classification" value-key="id">
          <el-option v-for="i in typeList" :key="i.id" :label="i.name" :value="i" />
        </el-select>
      </el-form-item>

      <el-form-item label="前言" prop="preface">
        <el-input v-model="row.preface" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
