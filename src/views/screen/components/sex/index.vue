<template>
  <div class="box1">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="sex">
      <div class="man">
        <p>男士</p>
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="woman">
        <p>女士</p>

        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p class="man_text">男士 58%</p>
      <p class="woman_text">女士 42%</p>
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
  //初始化 echarts节点
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    //组件标题
    title: {
      text: '男女比例', //主标题
      textStyle: {
        //主标题颜色
        color: 'skyblue',
      },
      left: '40%',
    },
    //x|y
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: '10%',
      top: 0,
      right: '10%',
      bottom: 0,
    },
  })
})
</script>
<style scoped lang="scss">
.box1 {
  margin: 20px 0;
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;

  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }

  .sex {
    margin-top: 40px;
    display: flex;

    justify-content: space-between;
    align-items: center;
    /* flex-flow: row wrap; */

    .man {
      margin-left: 80px;
      /* 宽高按照背景图片大小来 */
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png);
      background-size: 100% 100%;
      /* 以下设置让img在div中居中 */
      display: flex;
      flex-direction: column;
      /* justify-content: space-around; */
      align-items: center;

      /* line-height: 115px; */
      p {
        color: white;
      }

      img {
        margin-top: 20px;
      }
    }

    .woman {
      flex-direction: column;
      /* float: right; */
      margin-right: 80px;
      /* 宽高按照背景图片大小来 */
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png);
      background-size: 100% 100%;
      display: flex;

      align-items: center;

      p {
        color: white;
      }

      img {
        margin-top: 20px;
      }
    }
  }

  .rate {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .man_text {
      margin-left: 80px;
      color: white;
    }

    .woman_text {
      margin-right: 80px;
      color: white;
    }
  }

  .charts {
    height: 100px;
  }
}
</style>
