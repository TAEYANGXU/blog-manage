import httpClient from '@/http';
import type { Article, ArticleQueryParams, PaginationData } from '@/types/article';
import type { ApiResponse } from '@/http';

export const getArticleList = (params: ArticleQueryParams): Promise<ApiResponse<PaginationData<Article>>> => {
  return httpClient.get('/admin/articles/list', { params });
};
