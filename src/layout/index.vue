<template>
  <div class="layout_container">
    <!-- <h1>一级路由组件</h1> -->
    <!-- 左侧菜单  动态样式:class里面要放一个对象-->
    <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold }">
      <Logo></Logo>
      <!-- 滚动条 -->
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="LayOutSettingStore.fold"
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
          active-text-color="#ffd04b"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold }">
      <!-- 二级路由组件展示区, 封装为layout/main/index.vue单独组件,不再使用router-view-->
      <Main></Main>
      <!-- <router-view></router-view> -->
    </div>
  </div>
</template>
<script setup lang="ts">
// 引入总路由用于根据当前路由route的path 激活菜单项
// import {useRoute} from 'vue-router'

// 引入logo组件
import Logo from './logo/index.vue'
// 引入专门展示二级路由组件内容的main组件
import Main from './main/index.vue'
// 引入专门展示顶部tabbar组件
import Tabbar from './tabbar/index.vue'
// 引入左侧菜单组件
import Menu from './menu/index.vue'
// 获取用户小仓库，用来路由
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting.ts'
let userStore = useUserStore()
console.log('userStore', userStore)

// 获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()
// console.log('直接获取路由',$route)
</script>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  /* background-color: red; */

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    color: white;
    transition: all, 0.5s;

    /* “&.fold”中& 和. 之间不能有空格，否则 fold 类名指的是 layout_slider 的子类有的fold   */
    /* &.fold {
                width: $base-menu-min-width;
            } */

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    /* position: absolute; */
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all, 0.5s;

    background-color: white;

    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    /* background-color: yellowgreen; */
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    /* 内容多了设置滚动条 */
    overflow: auto;
    transition: all, 0.5s;

    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }

    p {
      background-color: red;
      height: 10000px;
    }
  }
}
</style>
