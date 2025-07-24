<template>
  <div class="article-manage">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="queryParams.title"
            placeholder="搜索文章标题"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="success" @click="handleAdd">新增文章</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 文章列表 -->
    <el-table
      v-loading="loading"
      :data="articleList"
      style="width: 100%"
      border
    >
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleEdit(row)">
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" width="100" />
      <el-table-column label="标签" width="200">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag.id"
            class="mx-1"
            size="small"
          >
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据统计" width="150">
        <template #default="{ row }">
          <el-tooltip content="浏览量" placement="top">
            <el-icon><View /></el-icon>
            <span class="ml-1">{{ row.viewCount }}</span>
          </el-tooltip>
          <el-divider direction="vertical" />
          <el-tooltip content="点赞数" placement="top">
            <el-icon><Star /></el-icon>
            <span class="ml-1">{{ row.likeCount }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Star } from '@element-plus/icons-vue'
import { getArticleList } from '@/api/article'
import type { Article } from '@/types/article'
import { ArticleStatus } from '@/types/article'

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: ''
})

// 数据相关
const loading = ref(false)
const total = ref(0)
const articleList = ref<Article[]>([])

// 获取文章列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getArticleList(queryParams)
    articleList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.pageNum = 1
  getList()
}

// 分页相关
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  getList()
}

// 状态相关
const getStatusType = (status: ArticleStatus) => {
  const map: Record<ArticleStatus, string> = {
    [ArticleStatus.PUBLISHED]: 'success',
    [ArticleStatus.DRAFT]: 'warning',
    [ArticleStatus.ARCHIVED]: 'info'
  }
  return map[status]
}

const getStatusText = (status: ArticleStatus) => {
  const map: Record<ArticleStatus, string> = {
    [ArticleStatus.PUBLISHED]: '已发布',
    [ArticleStatus.DRAFT]: '草稿',
    [ArticleStatus.ARCHIVED]: '已归档'
  }
  return map[status]
}

// 操作相关
const handleAdd = () => {
  ElMessage.info('新增文章功能开发中...')
}

const handleEdit = (row: Article) => {
  ElMessage.info(`编辑文章: ${row.id}`)
}

const handleDelete = (row: Article) => {
  ElMessageBox.confirm(
    `确定要删除文章《${row.title}》吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.info(`删除文章: ${row.id}`)
  })
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped>
.article-manage {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-tag {
  margin-right: 5px;
}

.ml-1 {
  margin-left: 4px;
}
</style>
