<template>
  <div>
    <h2>分类管理</h2>
    <el-table :data="categoryList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>
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
import { ref, reactive, onMounted } from 'vue'
import { getCategoryList, type Category } from '@/api/category'

const categoryList = ref<Category[]>([])
const loading = ref(false)
const total = ref(0)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await getCategoryList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize
    })
    if (res.code === 200 && res.data) {
      categoryList.value = res.data.list
      total.value = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  queryParams.pageNum = 1
  fetchCategories()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  fetchCategories()
}

onMounted(() => {
  fetchCategories()
})
</script>
<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
