<template>
  <div>
    <template v-if="route.path === '/login'">
      <router-view />
    </template>
    <template v-else>
      <el-container style="height: 100vh">
        <el-aside width="200px" style="background: #2d3a4b; color: #fff">
          <div style="padding: 24px; font-size: 20px; font-weight: bold; text-align: center;">博客后台</div>
          <el-menu :default-active="route.path" class="el-menu-vertical-demo" background-color="#2d3a4b" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" @click="$router.push(item.path)">
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header style="background: #fff; box-shadow: 0 2px 8px #f0f1f2; display: flex; align-items: center; justify-content: space-between; padding: 0 24px;">
            <div style="font-size: 18px; font-weight: bold;">个人博客后台管理系统</div>
            <div>
              <el-button type="text" @click="$router.push('/login')">退出登录</el-button>
            </div>
          </el-header>
          <el-main style="background: #f5f5f5;">
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const menuItems = [
  { name: '仪表盘', path: '/' },
  { name: '文章管理', path: '/articles' },
  { name: '分类管理', path: '/categories' },
  { name: '标签管理', path: '/tags' },
  { name: '评论管理', path: '/comments' },
  { name: '留言管理', path: '/messages' },
  { name: '用户管理', path: '/users' },
  { name: '系统设置', path: '/settings' }
]
</script>

<style scoped>
.el-menu-vertical-demo {
  border-right: none;
}
</style>
