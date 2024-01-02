<template>
  <div class="box4" ref="map"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的json数据
import chinaJSON from './china.json'
let map = ref()
// 注册中国地图
echarts.registerMap('china', chinaJSON)
onMounted(() => {
  let mychart = echarts.init(map.value)
  mychart.setOption({
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的效果
      //地图的位置调试
      left: 30,
      top: 100,
      right: 30,
      zoom: 1,
      bottom: 0,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        color: 'white',
        fontSize: 14,
      },

      itemStyle: {
        //每一个多边形的样式
        show: true,
        normal: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#1B4487', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#0B244F', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          borderColor: '#3fdaff',
          borderWidth: 2,
          shadowColor: 'rgba(63, 218, 255, 0.5)',
          shadowBlur: 30,
        },
        emphasis: {
          areaColor: '#2B91B7',
        },
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: 'skyblue',
        },
        label: {
          fontSize: 40,
        },
      },
    },
    //布局位置
    grid: {
      left: 0,
      top: '10%',
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines', //航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 1,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'yellow',
              width: 1,
            },
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          period: 4, //箭头指向速度，值越小速度越快
          trailLength: 0.1, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: 'arrow', //箭头图标
          symbolSize: 10, //图标大小
        },
        lineStyle: {
          normal: {
            width: 1, //尾迹线条宽度
            opacity: 1, //尾迹线条透明度
            curveness: 0.3, //尾迹线条曲直度
          },
        },
      },
    ],
  })
})
</script>
<style scoped></style>
