export interface Blog {
  id: string
  index: number
  name: string
  description: string
  description1: string
  description2: string
  createTime: string
  status: boolean
}

export function getBlogList(params?: object) {
  return request<Blog[]>('/blogs', {
    params: { status: true, ...params },
  })
}

export function getBlog(id: Blog['id']) {
  return request<Blog>(`/blogs/${id}`)
}

export function put({ id, ...body }: Partial<Blog>) {
  return request(`/blogs/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Blog) {
  return request('/blogs', {
    method: 'post',
    body,
  })
}

export function drop(id: Blog['id']) {
  return request(`/blogs/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
