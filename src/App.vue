<template>
  <div>
    <template v-if="route.path === '/login'">
      <router-view />
    </template>
    <template v-else>
      <el-container style="height: 100vh">
        <el-aside width="160px" style="background: #2d3a4b; color: #fff">
          <div style="padding: 24px; font-size: 20px; font-weight: bold; text-align: center;">博客后台</div>
          <el-menu 
            :default-active="route.path" 
            class="el-menu-vertical-demo" 
            :collapse="isCollapse"
            background-color="#2d3a4b" 
            text-color="#fff" 
            active-text-color="#ffd04b"
          >
            <sidebar-item 
              v-for="route in menuItems" 
              :key="route.path"
              :item="route"
              :base-path="route.path"
            />
          </el-menu>
        </el-aside>
        <el-container>
          <el-header style="background: #fff; box-shadow: 0 2px 8px #f0f1f2; display: flex; align-items: center; justify-content: space-between; padding: 0 24px;">
            <div style="font-size: 18px; font-weight: bold;">个人博客后台管理系统</div>
            <div>
              <el-button @click="handleLogout">退出登录</el-button>
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
import { useRoute, useRouter } from 'vue-router'
import { onMounted, computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import SidebarItem from '@/views/components/SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)  // 控制菜单折叠状态

// 退出登录处理
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 清除本地存储的 token
    localStorage.removeItem('blog_token')
    // 清除 store 中的用户信息
    userStore.clearUser()
    
    // 确保异步操作完成后再跳转
    await router.push('/login')
    // router.replace({ name: 'Login' })

    ElMessage.success('已退出登录')
  } catch (error) {
    // 用户取消退出
    console.log("error:", error);
    console.log('取消退出登录')
  }
}

// const menuItems = [
//   { name: '仪表盘', path: '/' },
//   { name: '文章管理', path: '/articles' },
//   { name: '分类管理', path: '/categories' },
//   { name: '标签管理', path: '/tags' },
//   { name: '评论管理', path: '/comments' },
//   { name: '留言管理', path: '/messages' },
//   { name: '用户管理', path: '/users' },
//   { name: '系统设置', path: '/settings' }
// ]

// 获取路由列表
const menuItems = computed(() => {
  const rootRoute = router.options.routes.find((route) => route.path === "/");
  if (rootRoute && rootRoute.children) {
    return rootRoute.children;
  }
  return [];
});

onMounted(() => {
  // localStorage.removeItem("blog_token");
  console.log( "token:", localStorage.getItem("blog_token"));
})

</script>

<style scoped>
.el-menu-vertical-demo {
  border-right: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

/* 自定义滚动条样式 */
.el-aside {
  overflow-x: hidden;
  overflow-y: auto;
}

.el-aside::-webkit-scrollbar {
  width: 6px;
}

.el-aside::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

.el-aside::-webkit-scrollbar-track {
  background: transparent;
}
</style>
