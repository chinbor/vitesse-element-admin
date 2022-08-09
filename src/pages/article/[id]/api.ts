import type { Article } from '../api'

export interface ArticleContent {
  id?: string
  title?: string
  content?: string
  article?: Article
  sort?: number
  status?: boolean
}

export function getArticleContentList({ article, ...params }: ArticleContent) {
  return request<ArticleContent[]>(`/articles/${article?.id}/contents`, {
    params: { status: true, ...params },
  })
}

export function getArticleContent({ id, article }: ArticleContent) {
  return request<ArticleContent>(`/articles/${article?.id}/contents/${id}`)
}

export function put(body: ArticleContent) {
  return request(`/articles/${body.article?.id}/contents/${body.id}`, {
    method: 'put',
    body,
  })
}

export function post(body: ArticleContent) {
  return request(`/articles/${body.article?.id}/contents`, {
    method: 'post',
    body,
  })
}

export function drop(id: string, article: Article) {
  return request(`/articles/${article.id}/contents/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
