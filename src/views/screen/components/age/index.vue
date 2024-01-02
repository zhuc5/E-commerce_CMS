<template>
  <div class="box2">
    年龄比例
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 获取charts dom节点
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  let option = {
    title: {
      text: '今日总数', //主标题
      textStyle: {
        //主标题颜色
        color: 'white',
      },
      left: '30%',
      top: 'middle',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '10%',
      right: 0,

      orient: 'vertical',
      textStyle: {
        color: 'white',
      },
    },
    // series 是图的部分
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '85%'],
        avoidLabelOverlap: false,
        right: '20%',
        itemStyle: {
          borderRadius: 10,
          // borderColor: '#fff',
          // borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          shadowColor: 'transparent',
        },
        // emphasis: {
        //     label: {
        //         show: true,
        //         fontSize: 40,
        //         fontWeight: 'bold'
        //     }
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 0.1, name: '10岁以下' },
          { value: 0.2, name: '10-18岁' },
          { value: 0.3, name: '19-30岁' },
          { value: 0.4, name: '30-40岁' },
          { value: 0.2, name: '40-60岁' },
          { value: 0.1, name: '60岁以上' },
        ],
      },
    ],
    // grid: {
    //     left: 0,
    //     top: 0,
    //     right: 0,
    //     bottom: 0,
    // }
  }
  mycharts.setOption(option)
})
</script>
<style scoped>
.box2 {
  width: 100%;
  height: 100%;
  /* background-color: red; */
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-bottom: 10px;

  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    /* // 这里要拿100%-40px 否则会超出 */
    height: calc(100% - 40px);
    /* background-color: red; */
  }
}
</style>
