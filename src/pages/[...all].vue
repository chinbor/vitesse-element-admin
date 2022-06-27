<template>
  <div class="h-screen w-screen bg-blue text-white text-center flex flex-col items-center">
    <div text="20vh">
      404
    </div>

    <div class="text-lg" style="opacity: 0.7;">
      Oops. Nothing here...
    </div>

    <button
      mt-3 b="1 gray-200 rounded" px-3 py-1
      @click="$router.push('/')"
    >
      首 页
    </button>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
