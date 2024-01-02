<template>
  <!-- <svg style="width: 30px;height:20px;"></svg> -->
  <svg :style="{ width, height }">
    <!-- 注意 如果xlink:href里面是一个js表达式前面要加： -->
    <!-- <use xlink:href="#icon-search" :fill="color"></use> -->

    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
  <!-- <h2>{{prefix+name}}</h2> -->
  <!-- <svg style="width: 30px;height:20px;">
              <use xlink:href="#icon-search" fill="red"></use>
            </svg> -->
</template>
<script setup lang="ts">
// 接手父组件传来的参数
let props = defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: {
    type: String,
    default: 'search',
  },
  color: {
    type: String,
    default: 'red',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
// console.log('props', props.prefix)
// console.log('name', props.name)
</script>
