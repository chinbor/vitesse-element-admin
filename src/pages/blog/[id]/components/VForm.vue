<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import type { Blog } from '../../api'
import { getBlogList } from '../../api'
import { type BlogContent, getBlogContent, post, put } from '../api'

const props = defineProps<{
  row: BlogContent
  modelValue: boolean
}>()

let row = $ref(props.row)
onMounted(async () => {
  if (!row.id)
    return
  const { close } = ElLoading.service()
  ;({ data: row } = await getBlogContent(row).finally(close))
})

let show = $(useVModel(props, 'modelValue'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let BlogList = $ref<Blog[]>([])
async function fetchBlogList() {
  ({ data: BlogList } = await getBlogList())
}
fetchBlogList()

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
  <el-dialog v-model="show" draggable append-to-body :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}文章管理`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="title" label="标题">
        <el-input v-model="row.title" />
      </el-form-item>
      <el-form-item label="类型" prop="classification">
        <el-select v-model="row.blog" value-key="id">
          <el-option v-for="i in BlogList" :key="i.id" :label="i.name" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Editor v-model="row.content" :init="{ skin: isDark ? 'oxide-dark' : 'oxide', content_css: isDark ? 'dark' : 'default', branding: false, menubar: false }" />
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
