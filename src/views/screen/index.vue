<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- top做成一个组件 -->
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left_1">
          <div class="left">
            <Tourist class="tourist"></Tourist>
            <Sex class="sex"></Sex>

            <Age class="age"></Age>
          </div>
        </div>

        <div class="center">
          <!-- 中国地图 -->
          <!-- map -->
          <Map class="map"></Map>
          <Line class="line"></Line>
          <!-- line -->
        </div>
        <div class="right1">
          <div class="right">
            <Rank class="rank"></Rank>
            <Year class="year"></Year>
            <Counter class="counter"></Counter>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'
let screen = ref()
onMounted(() => {
  console.log('比例', getScale())
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
// 定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  console.log('window.innerWidth', window.innerWidth)
  console.log('window.innerHeight', window.innerHeight)
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  // 要取小的， 保证box的全部内容能够在当前视口内全部展示，否则box 会超出 viewport
  return ww < wh ? ww : wh
}
// 监听屏幕变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 3000px;
}

.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    /* 我的 电脑width只有1500duo ，会超出去 */
    width: 1920px;
    height: 1080px;
    /* background-color: red; */
    /* opacity: 0.2; */
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
  }

  .top {
    width: 100%;
    height: 40px;
    /* background: cyan; */
  }

  .bottom {
    display: flex;

    .right1 {
      flex: 1;
      height: 1040px;
      /* background-color: pink; */
      padding-bottom: 10px;

      .right {
        margin-left: 150px;
        margin-right: 30px;
        height: 100%;
        /* background-color: green; */
        display: flex;
        flex-direction: column;

        .rank {
          flex: 1;
          /* background-color: gray; */
        }

        .year {
          flex: 1;
          /* background-color: yellow; */
        }

        .counter {
          flex: 1;
          /* background-color: orange; */
        }
      }
    }

    .left_1 {
      flex: 1;
      /* background-color: pink; */
      /* 高度 1080-40=1040 1080 就是设计稿的高度 */
      height: 1040px;
      box-sizing: border-box;
      padding-bottom: 10px;

      /* padding-right: 150px; */
      /* overflow: hidden; */

      .left {
        /* 这里不要设置宽度 ，因为设置了margin,而且为了父亲盒子不能被撑大，为了和“首页”对齐 */
        height: 100%;
        /* width: 600px; */
        margin-left: 30px;
        margin-right: 150px;
        display: flex;
        flex-direction: column;

        h1 {
          color: white;
        }

        .tourist {
          /* height: 500px; */
          flex: 1;
          /* background-color: green; */
        }

        .sex {
          /* height: 500px; */
          flex: 1;
          /* background-color:gray; */
        }

        .age {
          /* height: 500px; */
          flex: 1;
          /* background-color: purple; */
          margin-bottom: 10px;
        }
      }
    }

    .center {
      height: 1040px;
      padding-bottom: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      .map {
        flex: 4;
        margin-left: -100px;
        margin-right: -100px;
      }

      .line {
        flex: 1;
        margin-left: -100px;
        margin-right: -100px;
        margin-top: 100px;
      }
    }
  }
}
</style>
