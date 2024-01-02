<template>
  <!-- 路由组件的出口位置 -->
  <!-- 展示二级路由组件内容的地方 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import { watch, toRef, nextTick, ref } from 'vue'
// 获取layout的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
// 获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()
// 可以在自己的组件中设置新变量 toRef 指向LayOutSettingStore的state对象的refresh字段
// 否则直接监听 LayOutSettingStore.refresh 拿不到新旧值
// 新建变量 控制是否 销毁重建当前组件
let flag = ref(true)
const ifRefresh = toRef(LayOutSettingStore, 'refresh')

watch(
  ifRefresh,
  (newValue, oldValue) => {
    console.log('refresh变化了', newValue, oldValue)
    // 点击刷新按钮；路由组件销毁
    flag.value = false
    // 一定要用  nextTick获取 销毁后的当前组件，再重新渲染当前组件(实际上只有v-if控制的组件变化了)
    nextTick(() => {
      flag.value = true
    })
  },
  { immediate: true },
)
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
<style scoped>
/* 只设置进入的过渡效果，消失时直接消失 */
.fade-enter-active {
  transition: opacity 1s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
