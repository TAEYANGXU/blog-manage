
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
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "articles",
        name: "ArticleManage",
        component: () => import("@/views/ArticleManage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "categories",
        name: "CategoryManage",
        component: () => import("@/views/CategoryManage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "tags",
        name: "TagManage",
        component: () => import("@/views/TagManage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "comments",
        name: "CommentManage",
        component: () => import("@/views/CommentManage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "messages",
        name: "MessageManage",
        component: () => import("@/views/MessageManage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "users",
        name: "UserManage",
        component: () => import("@/views/UserManage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        name: "SystemSettings",
        component: () => import("@/views/SystemSettings.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 启用导航守卫
router.beforeEach((to, _from, next) => {
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

  // 处理其他需要认证的页面，使用 matched 检查所有嵌套路由
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log("Route requiresAuth:", requiresAuth);
  if (requiresAuth && !token) {
    console.log("No token found, redirecting to login");
    next("/login");
    return;
  }

  next();
});

export default router;
