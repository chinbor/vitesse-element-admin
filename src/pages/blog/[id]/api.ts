import type { Blog } from '../api'

export interface BlogContent {
  id?: string
  title?: string
  content?: string
  blog?: Blog
  index?: number
  status?: boolean
}

export function getBlogContentList({ blog, ...params }: BlogContent) {
  return request<BlogContent[]>(`/blogs/${blog?.id}/contents`, {
    params: { status: true, ...params },
  })
}

export function getBlogContent({ id, blog }: BlogContent) {
  return request<BlogContent>(`/blogs/${blog?.id}/contents/${id}`)
}

export function put(body: BlogContent) {
  return request(`/blogs/${body.blog?.id}/contents/${body.id}`, {
    method: 'put',
    body,
  })
}

export function post(body: BlogContent) {
  return request(`/blogs/${body.blog?.id}/contents`, {
    method: 'post',
    body,
  })
}

export function drop(id: string, blog: Blog) {
  return request(`/blogs/${blog.id}/contents/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
