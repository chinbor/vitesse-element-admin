export interface Article {
  id?: string
  name?: string
  description?: string
  status?: boolean
  sort?: number
}

export function getArticleList(params?: object) {
  return request<Article[]>('/articles', {
    params: { status: true, ...params },
  })
}

export function getArticle(id: Article['id']) {
  return request<Article>(`/articles/${id}`)
}

export function put({ id, ...body }: Article) {
  return request(`/articles/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Article) {
  return request('/articles', {
    method: 'post',
    body,
  })
}

export function drop(id: Article['id']) {
  return request(`/articles/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
