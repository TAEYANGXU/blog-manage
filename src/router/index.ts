
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: { requiresAuth: false, title: '登录',icon: 'SetUp' },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true,title: '首页',icon: 'SetUp' },
    children: [
      {
        path: "articles",
        name: "ArticleManage",
        component: () => import("@/views/ArticleManage.vue"),
        meta: { requiresAuth: true, title: '文章管理',icon: 'SetUp' },
      },
      {
        path: "categories",
        name: "CategoryManage",
        component: () => import("@/views/CategoryManage.vue"),
        meta: { requiresAuth: true ,title: '分类管理' ,icon: 'SetUp'},
      },
      {
        path: "tags",
        name: "TagManage",
        component: () => import("@/views/TagManage.vue"),
        meta: { requiresAuth: true, title: '标签管理' ,icon: 'SetUp'},
      },
      {
        path: "comments",
        name: "CommentManage",
        component: () => import("@/views/CommentManage.vue"),
        meta: { requiresAuth: true, title: '评论管理',icon: 'SetUp' },
      },
      {
        path: "messages",
        name: "MessageManage",
        component: () => import("@/views/MessageManage.vue"),
        meta: { requiresAuth: true, title: '留言管理',icon: 'SetUp'},
      },
      {
        path: "users",
        name: "UserManage",
        component: () => import("@/views/UserManage.vue"),
        meta: { requiresAuth: true, title: '用户管理' ,icon: 'SetUp'},
      },
      {
        path: "settings",
        name: "SystemSettings",
        component: () => import("@/views/SystemSettings.vue"),
        meta: { requiresAuth: true, title: '系统设置',icon: 'SetUp' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem("blog_token");
  
  // 如果要访问登录页
  if (to.path === "/login") {
    if (token) {
      // 已登录用户重定向到首页
      next("/");
      return;
    }
    // 未登录用户可以访问登录页
    next();
    return;
  }

  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !token) {
    // 保存要访问的页面路径
    const redirect = to.fullPath;
    next({
      path: '/login',
      query: { redirect }  // 将要访问的页面路径作为参数传递
    });
    return;
  }

  next();
});

export default router;
