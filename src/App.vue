<script setup lang="ts">
// import HelloWorld from '@/components/HelloWorld.vue'
// import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
// import test from '@/components/test.vue'
// 将svg封装为一个组件, 全局注册后就不用 import了
// import SvgIcon from '@/components/SvgIcon/index.vue'
// 可以获取到当前的环境
// console.log(import.meta.env);
// import { request } from '@/utils/request.ts'
// import { reqLogin } from './api/user'
// import { onMounted } from 'vue'

// 测试二次封装axios的实例request是否正常工作

// onMounted(()=>{
//  request({
//     // url: '/api/user/login', //请求地址
//     //二次封装的axios实例request已经有了一个base_url:/dev-api
//     url: '/user/login', //请求地址
//     method: 'post', //请求方式,
//     data: {
//       username: 'admin',
//       password: '111111',
//     },
//   }).then(res=>{
//     console.log('测试二次封装的axios实例request发送成功')
//     console.log(res)
//   }).catch(error=>{
//     console.log(error)})
// })
//测试 api接口统一管理的是否配置成功
// onMounted(() => {

//   reqLogin({
//     username: 'admin',
//     password: '111111',
//   }).then(res => {
//          console.log('测试 api接口统一管理的是否配置成功')
//         console.log(res)
//       }).catch(error=>{
//         console.log(error)})
//     })
</script>

<template>
  <router-view></router-view>
  <!-- <div>
    <h1>测试axios二次封装</h1>
  </div>

  <test></test>
  <div>
    <h1>测试sass</h1>
  </div> -->
  <!-- <div>
    <h1>我是app</h1>
    <SvgIcon name="search" width="100px" height="100px" color="pink"></SvgIcon> -->
  <!-- <svg style="width: 30px;height:20px;">
      <use xlink:href="#icon-search" fill="red"></use>
    </svg> -->
  <!-- <h1>新增标题</h1>
    <el-button type="primary" :icon="Edit">编辑按钮</el-button>
    <br>
    <br>
    <Pagination></Pagination>
    <div class="demo-pagination-block">
      <div class="demonstration">跳转到</div>
      <el-pagination v-model:current-page="currentPage3" v-model:page-size="pageSize3" :small="small"
        :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="1000"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div> -->
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped lang="scss">
div {
  h1 {
    color: $color;
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
