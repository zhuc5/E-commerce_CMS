<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="gohome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间{{ time }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment'
// 记录当前时间
let time = ref(moment().format('YYYY年MM月DD日 HH:mm:ss'))
// 获取路由器对象
// useRouter是获取整个应用的路由
let $router = useRouter()
// useRoute是获取当前路由
let $route = useRoute()
//点击首页回到home
const gohome = () => {
  $router.push('/home')
}
const timer = ref(0)
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 HH:mm:ss')
  }, 1000)
})
// 在组件销毁之前 删除定时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>
<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  display: flex;
}

.left {
  flex: 1;
  background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
  background-size: 100% 100%;

  .lbtn {
    width: 150px;
    height: 40px;
    float: right;
    background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 40px;
    color: #29fcff;
    font-size: 20px;
  }
}

.center {
  flex: 1;

  .title {
    width: 100%;
    height: 74px;
    background: url(../../images/dataScreen-header-center-bg.png);
    /* 100% 100%  会导致图片比例随之改变，图像可能失真 */
    /* cover 则是背景图扩展至足够大，直至完全覆盖背景区域，图片比例保持不变且不会失真，但某些部分被切割无法显示完整背景图像 */
    background-size: 100% 100%;
    line-height: 74px;
    color: #29fcff;
    text-align: center;
    font-size: 30px;
  }
}

.right {
  flex: 1;
  background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .rbtn {
    float: left;
    width: 150px;
    height: 40px;
    background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 40px;
    color: #29fcff;
    font-size: 20px;
  }

  .time {
    margin-right: 20px;
    color: #29fcff;
  }
}
</style>
