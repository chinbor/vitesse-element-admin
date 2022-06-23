export function download(data: any, fileName: string) {
  if (!data)
    return
  const a = document.createElement('a') // 创建a标签
  a.href = URL.createObjectURL(new Blob([data])) // 创建下载的链接
  a.download = fileName
  a.click() // 点击下载
  URL.revokeObjectURL(a.href) // 释放掉blob对象
}
