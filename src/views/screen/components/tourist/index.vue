<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts">
      <!-- 该盒子将来展示图形图表echarts -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
let people = ref('216908人')
console.log('echarts', echarts)
let charts = ref()
onMounted(() => {
  // 获取echarts 的实例
  let mycharts = echarts.init(charts.value)
  // 设置实例的配置项
  mycharts.setOption({
    title: {
      text: '水球图',
    },
    //x，y轴系列
    xAxis: {},
    yAxis: {},
    // 系列：决定你展示什么样的图形图表
    series: {
      type: 'liquidFill',
      data: [0.6],
      radius: '80%',
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>
<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    /* margin-left: 20px; */

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 20px;

      span {
        color: yellow;
      }
    }
  }

  .number {
    /* background-color: orange; */
    margin-top: 30px;
    display: flex;
    padding: 20px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png);
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .charts {
    width: 100%;
    /* height 250 为了与下面留出一定空隙*/
    height: 260px;
  }
}
</style>
