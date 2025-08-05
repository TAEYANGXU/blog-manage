<template>
  <div>
    <h2>分类管理</h2>
    <el-table :data="categoryList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryList, type Category } from '@/api/category'

const categoryList = ref<Category[]>([])
const loading = ref(false)

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await getCategoryList()
    if (res.code === 200 && res.data) {
      categoryList.value = res.data.list
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
