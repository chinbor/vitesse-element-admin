<script setup lang="ts">
window.open('https://vitesse-element-admin.netlify.app/docs/')
tagsView.dropView()
useRouter().go(-1)
</script>

<route lang="yaml">
meta:
  order: 2
  title: 文档
  icon: mi:external-link
</route>
