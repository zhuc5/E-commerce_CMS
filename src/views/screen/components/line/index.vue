<template>
  <div class="box5">
    <div class="title">
      <p>未来30天游客数量趋势</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="line">123</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let line = ref()
onMounted(() => {
  let mycharts = echarts.init(line.value)
  // 设置配置项
  mycharts.setOption({
    title: {
      text: '访问量',
    },
    xAxis: {
      type: 'category',
      // x轴两侧不留白
      boundaryGap: false,
      splitLine: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      // max: function (value) {
      //     return value.max + 500;
      // }
    },
    grid: {
      left: 20,
      top: 0,
      right: 20,
      bottom: 30,
    },
    series: {
      type: 'line',
      data: [120, 240, 66, 88, 99, 200, 300],
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#84734D', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#12144B', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  })
})
</script>
<style scoped lang="scss">
.box5 {
  /* width: 100%; */
  margin-top: 10px;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  /* margin-bottom: 80px; */

  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);

    /* height: 390px; */
    /* background-color: red; */
  }
}
</style>
