export function download(data: any, fileName: string) {
  if (!data)
    return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data]))
  a.download = fileName
  a.click()
  URL.revokeObjectURL(a.href)
}
