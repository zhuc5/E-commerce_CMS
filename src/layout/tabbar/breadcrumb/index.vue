<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <!-- <Expand /> -->
    <!-- 使用component 动态显示 折叠icon组件 -->
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <!-- 分隔符 ArrowRight  -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展示当前地址栏匹配到的一级，二级路由 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
    <!-- <el-breadcrumb-item>权限管理</el-breadcrumb-item> -->
    <!-- <el-breadcrumb-item>角色管理</el-breadcrumb-item> -->
    <!-- <button @click="handler">获取匹配到的路由</button> -->
  </el-breadcrumb>
</template>
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
// import { useRoute } from 'vue-router'
// 获取当前组件的路由
// let $route = useRoute()
// 获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()

// 定义变量控制折叠图标的切换

// 点击图标可切换图标
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}

// const handler = () => {
//     console.log('route', $route)

// }
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>
<style scoped></style>
