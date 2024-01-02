import { createApp } from 'vue'
// import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
import gloablComponent from './components/index'
import '@/styles/index.scss'
// import axios from 'axios'
import router from './router'
import pinia from './store'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

// axios({
//   url: '/api/user/login', //请求地址
//   method: 'post', //请求方式,
//   data: {
//     username: 'admin',
//     password: '111111'
//   },
// })

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(gloablComponent)
app.use(pinia)
app.use(router)
// import也就是执行一次改文件里面的代码
import './permission'
import 'default-passive-events'
//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
app.mount('#app')
console.log = function () {}

//还没有二次封装axios 时，测试axios是否正常使用
// axios({å
//   url: '/api/user/login', //请求地址
//   method: 'post', //请求方式,
//   data: {
//     username: 'admin',
//     password: '111112',
//   },
// })
// console.log(import.meta.env);
