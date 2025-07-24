// 文章状态枚举
export enum ArticleStatus {
  DRAFT = 'DRAFT',         // 草稿
  PUBLISHED = 'PUBLISHED', // 已发布
  ARCHIVED = 'ARCHIVED'    // 已归档
}

// 标签类型
export interface Tag {
  id: number;
  name: string;
}

// 文章类型
export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  status: ArticleStatus;
  categoryId: number;
  categoryName: string;
  cover: string | null;
  viewCount: number;
  likeCount: number;
  createTime: string;
  updateTime: string;
  tags: Tag[];
}

// 分页请求参数
export interface ArticleQueryParams {
  pageNum: number;
  pageSize: number;
  title?: string;
}

// 分页响应结构
export interface PaginationData<T> {
  total: number;
  pageSize: number;
  pageNum: number;
  list: T[];
}
