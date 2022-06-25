<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'

import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import type { KnowledgeType } from '../../api'
import { getKnowledgeTypeList } from '../../api'
import { type KnowledgeContent, getKnowledgeContent, post, put } from '../api'

const { id, ...props } = defineProps<{
  id: string
  show: boolean
}>()

let row = $ref<KnowledgeContent>({})
id && getKnowledgeContent(id).then(({ data }) => {
  row = data
})

let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let typeList = $ref<KnowledgeType[]>([])
async function fetchTypeList() {
  ({ data: typeList } = await getKnowledgeTypeList())
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
  <el-dialog v-model="show" draggable append-to-body :close-on-click-modal="false" custom-class="!w-2xl" :title="`${id ? '修改' : '添加'}问卷模版`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="title" label="标题">
        <el-input v-model="row.title" />
      </el-form-item>
      <el-form-item label="类型" prop="classification">
        <el-select v-model="row.knowledgeBase" value-key="id">
          <el-option v-for="i in typeList" :key="i.id" :label="i.title" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="前言" prop="preface">
        <el-input v-model="row.preface" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Editor v-model="row.content" :init="{ skin: isDark.value ? 'oxide-dark' : 'oxide', content_css: isDark.value ? 'dark' : 'default', branding: false, menubar: false }" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style>
.tox-tinymce-aux {
  z-index: 2100 !important;
}

.tox-notification {
  display: none !important;
}
</style>
