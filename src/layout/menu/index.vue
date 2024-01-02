<template>
  <div>
    <!-- 动态生成菜单
        <p>{{menuList}}</p> -->

    <template v-for="item in menuList" :key="item.path">
      <!-- v-if="!item.meta.hidden" -->
      <template v-if="!item.children">
        <!-- 没有子路由的， 直接展示不再设置子目录 -->
        <el-menu-item
          v-if="!item.meta.hidden"
          :index="item.path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <template v-if="item.children && item.children.length == 1">
        <!-- 如果只有1个子路由直接展示子路由，不显示自己的名字 , item.children[0].meta.hidden 不要children[0] 更好？-->
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <template v-if="!item.meta.hidden">
        <el-sub-menu
          v-if="item.children && item.children.length > 1"
          :index="item.path"
        >
          <!-- 如果有2个或者以上子路由，要设置sub-menu -->
          <template #title>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
          <!-- 当呈现 二级路由时，用递归 -->
          <Menu :menuList="item.children"></Menu>
        </el-sub-menu>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// 获取父组件传递过来的路由
let props = defineProps(['menuList'])
console.log('props', props)
console.log('menuList', props.menuList) // 是一个proxy(array)

// 获取路由器对象
// useRouter是获取整个应用的路由
let $router = useRouter()
// useRoute是获取当前路由
let $route = useRoute()
//点击每一项菜单 回调函数执行返回 当前路由组件实例
const goRoute = (vc: any) => {
  console.log('vc', vc)
  console.log('vc.index', vc.index)
  console.log('$router', $router)
  console.log('$route', $route)
  // 点击组件，实现路由跳转
  $router.push(vc.index)
} // vc.index对应组件的路由的地址
</script>

<script lang="ts">
// 2个都要ts
// 想要用递归，必须给当前组件先取名字
export default {
  name: 'Menu',
}
</script>
<style scoped>
div {
  color: white;
}
</style>
