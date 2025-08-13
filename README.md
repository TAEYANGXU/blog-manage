# Blog Manage

一个基于 Vue 3 + Vite 构建的博客后台管理系统，支持文章、分类、标签、用户等多模块管理，适合个人或团队博客的内容管理需求。

## 在线演示

- 访问地址：[http://124.70.211.197/](http://124.70.211.197/)
- 演示账号：`admin`
- 演示密码：`123456`

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)（状态管理）
- [Vue Router](https://router.vuejs.org/)（路由管理）
- [pnpm](https://pnpm.io/)（包管理）

## 项目结构

```
blog-manage/
├── index.html                # 项目入口 HTML
├── package.json              # 项目依赖及脚本
├── vite.config.ts            # Vite 配置
├── public/                   # 公共资源
├── src/                      # 源码目录
│   ├── api/                  # 接口请求模块
│   ├── assets/               # 静态资源
│   ├── http/                 # HTTP 封装
│   ├── models/               # 数据模型
│   ├── router/               # 路由配置
│   ├── store/                # 状态管理
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数
│   ├── views/                # 页面视图
│   │   └── components/       # 视图组件
│   ├── App.vue               # 根组件
│   └── main.ts               # 入口文件
```

## 安装与运行

1. 克隆项目
   ```bash
   git clone https://github.com/TAEYANGXU/blog-manage.git
   cd blog-manage
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 启动开发环境
   ```bash
   pnpm dev
   ```

4. 构建生产环境
   ```bash
   pnpm build
   ```

## 主要功能

- 用户登录与权限管理
- 文章管理（增删改查）
- 分类管理
- 标签管理
- 评论管理
- 消息管理
- 系统设置

## 贡献

欢迎提交 Issue 或 Pull Request 进行功能完善和问题修复。

## License

MIT
