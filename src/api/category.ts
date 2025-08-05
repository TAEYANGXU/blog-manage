import httpClient from '@/http/index'
import type { ApiResponse } from '@/http/index'

export interface Category {
  id: number
  name: string
  description: string
  createTime: string
}

export interface CategoryListResponse {
  total: number
  pageSize: number
  list: Category[]
  pageNum: number
}

export const getCategoryList = (params?: any): Promise<ApiResponse<CategoryListResponse>> => {
  return httpClient.get<CategoryListResponse>('/admin/categories/list', { params })
}