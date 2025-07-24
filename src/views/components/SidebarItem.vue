<template>
  <div v-if="!item.meta?.hidden">
    <!-- If has children and not a leaf node (has grandchildren) -->
    <template v-if="hasChildren(item.children) && !isLeafNode(item)">
      <el-sub-menu :index="resolvePath(item.path)">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="getIconComponent(item.meta.icon)" />
          </el-icon>
          <span class="menu-title">{{ item.meta?.title }}</span>
        </template>
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
      </el-sub-menu>
    </template>

    <!-- If is leaf node or doesn't have children -->
    <template v-else>
      <el-menu-item
        :index="resolvePath(item.path)"
        v-if="!item.hidden"
        @click="handleRoute(resolvePath(item.path))"
      >
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="getIconComponent(item.meta.icon)" />
        </el-icon>
        <template #title>
          <span class="menu-title">{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { isExternal } from "@/utils/validate";
import type { RouteItemType } from "@/types/sidebar";
import {
  HomeFilled,
  Monitor,
  User,
  Document,
  Setting,
  SetUp,
} from "@element-plus/icons-vue";
import type { Component } from "vue";

const router = useRouter();

interface Props {
  item: RouteItemType;
  basePath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  basePath: "",
});

// 图标名称映射
interface IconMap {
  [key: string]: Component;
}

// 路由跳转处理
const handleRoute = (path: string) => {
  if (isExternalLink(path)) {
    window.open(path, "_blank");
  } else {
    router.push(path);
  }
};

const iconMap: IconMap = {
  dashboard: HomeFilled,
  device: Monitor,
  user: User,
  document: Document,
  setting: Setting,
  SetUp: SetUp,
};

// 根据名称获取图标组件
const getIconComponent = (iconName: string): Component => {
  return iconMap[iconName] || Setting; // 默认返回设置图标
};

// Check if it is an external link
const isExternalLink = (path: string): boolean => {
  return isExternal(path);
};

// Check if the route has visible children
const hasChildren = (children: RouteItemType[] = []): boolean => {
  if (!children) return false;
  const showingChildren = children.filter((item) => {
    return !item.meta?.hidden;
  });
  return showingChildren.length > 0;
};

// Check if it's a leaf node (no valid children to display)
const isLeafNode = (route: RouteItemType): boolean => {
  return (
    !route.children ||
    route.children.length === 0 ||
    !hasChildren(route.children) ||
    (route.children.length === 1 && route.path === route.children[0].path)
  );
};

// 自定义的路径解析函数，替代 path.resolve
const resolvePath = (routePath: string): string => {
  // 外部链接直接返回
  if (isExternalLink(routePath)) {
    return routePath;
  }

  // 对于绝对路径，直接返回
  if (routePath.startsWith("/")) {
    return routePath;
  }

  // 如果是根路由的子路由，直接返回 /${routePath}
  if (props.basePath === "/") {
    return `/${routePath}`;
  }

  // 对于其他情况，返回 basePath
  return props.basePath || routePath;
};
</script>

<style scoped>
/* 确保折叠时文字正确隐藏 */
.el-menu--collapse .menu-title {
  display: none;
}
</style>
