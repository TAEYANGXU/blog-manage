import httpClient from '@/http/index'
import type { ApiResponse } from '@/http/index'

export interface Tag {
  id: number
  name: string
  createTime: string
}

export interface TagListResponse {
  total: number
  pageSize: number
  list: Tag[]
  pageNum: number
}

export const getTagList = (params?: any): Promise<ApiResponse<TagListResponse>> => {
  return httpClient.get<TagListResponse>('/admin/tag/list', { params })
}