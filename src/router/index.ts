import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      { path: 'articles', name: 'ArticleManage', component: () => import('@/views/ArticleManage.vue') },
      { path: 'categories', name: 'CategoryManage', component: () => import('@/views/CategoryManage.vue') },
      { path: 'tags', name: 'TagManage', component: () => import('@/views/TagManage.vue') },
      { path: 'comments', name: 'CommentManage', component: () => import('@/views/CommentManage.vue') },
      { path: 'messages', name: 'MessageManage', component: () => import('@/views/MessageManage.vue') },
      { path: 'users', name: 'UserManage', component: () => import('@/views/UserManage.vue') },
      { path: 'settings', name: 'SystemSettings', component: () => import('@/views/SystemSettings.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 启用导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('dhmo_token')
  
  // 如果要访问登录页
  if (to.path === '/login') {
    if (token) {
      // 已登录用户重定向到首页
      next('/')
      return
    }
    // 未登录用户可以访问登录页
    next()
    return
  }
  
  // 处理其他需要认证的页面
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  next()
})

export default router 
