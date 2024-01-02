<template>
  <el-button
    type="primary"
    size="small"
    icon="Refresh"
    @click="updateRefresh"
    circle
    color="white"
  ></el-button>
  <el-button
    type="primary"
    size="small"
    icon="FullScreen"
    @click="fullScreen"
    circle
    color="white"
  ></el-button>
  <!-- 控制主题设置，暗黑模式 -->
  <!-- title="主题设置" -->
  <el-popover
    placement="bottom"
    :width="200"
    :visible="visible"
    trigger="manual"
    @mouseleave="visible = false"
  >
    <div class="box">
      <!-- // 这里直接放内容 -->
      <el-form :inline="true">
        <el-form-item label="主题颜色">
          <el-color-picker
            v-model="color"
            show-alpha
            :predefine="predefineColors"
            @change="setColor"
          />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <!-- 如果icon 已经是全局组件 就不同:active-icon -->
          <el-switch
            v-model="dark"
            @change="changeDark"
            active-icon="MoonNight"
            inactive-icon="Sunny"
          />
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <el-icon @click="closePop">
        <Close />
      </el-icon>
    </div>
    <template #reference>
      <el-button
        type="primary"
        size="small"
        icon="Setting"
        @click="visible = true"
        circle
        color="white"
      ></el-button>
    </template>
  </el-popover>

  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 最右边是一个包含用户名的下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
// 获取整个应用的路由
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Color from 'color'

// 获取layout的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
// 获取用户小仓库，用来路由
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()

let $router = useRouter()
// 获取当前路由
let $route = useRoute()
// 暗黑模式
const dark = ref(false)
let visible = ref(false)
// 颜色控制
const { color } = storeToRefs(LayOutSettingStore)
// const color = toRef(LayOutSettingStore, "color")
// console.log('color',color)
// const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 刷新按钮点击的回调, 将store的refresh属性取反
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
  console.log('qushuaxin')
}

// 点击切换到全屏模式
const fullScreen = () => {
  // Dom对象的一个属性fullscreenElement 显示 当前是否全屏模式
  // 这里的操作存在浏览器兼容性问题,当前只适用于chrome, 有其他插件可以实现全屏幕
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
//退出登录
const logout = async () => {
  // 第一件事:需要向服务器发送请求，退出登录时告知当前token不要了
  // 第二件事:仓库中的相关数据清空(token|username|avatar)
  // 第三件事: 跳转到登录页
  // alert(123)
  console.log('$router', $router)
  console.log('$route', $route)
  await userStore.userLogout()
  // $router.push({path:'/login'})
  // $router.push('/login');
  $router.push({ path: '/login', query: { redirect: $route.fullPath } })
}
// 暗黑模式切换
const changeDark = () => {
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}
onMounted(() => {
  setColor()
})
// 主题颜色切换
const setColor = () => {
  console.log('颜色切换')
  const el = document.documentElement

  // 设置 css 变量
  el.style.setProperty('--el-color-primary', color.value)
  // el.style.setProperty('--el-color-disabled', color.value)
  // const btn=document.
  // .el - button--inblack.is - disabled
  // --el - button - disabled - bg - color
  console.log('el.style', el.style)
  const buttons = document.getElementsByClassName('is-disabled')

  // // 创建一个数组用于存放符合条件的按钮
  // let filteredButtons = [];
  console.log(buttons)
  // for (let i = 0; i < buttuns.length; i++) {
  //     // 判断当前按钮是否被禁用（disabled）
  //     if (buttons[i].getAttribute("disabled") != null) {
  //         filteredButtons.push(buttons[i]);
  //     }
  // }
  // console.log(filteredButtons)
  for (let i = 1; i < 10; i++) {
    el.style.setProperty(
      `--el-color-primary-light-${i}`,
      Color(color.value).alpha(`${(1 - i * 0.1).toFixed(1)}`),
    )
  }
}
const closePop = () => {
  console.log('关闭')
  visible.value = false
}
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>
<style scoped>
.box {
  display: flex;
  justify-content: space-between;

  .el-icon:hover {
    color: skyblue;
  }
}
</style>
