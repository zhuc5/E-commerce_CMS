//进行axios的二次封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { GET_TOKEN } from '@/utils/token'
// 第一步：利用axios对象的create方法
export let request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
// 第2步： request实例 添加请求拦截器 与响应拦截器
//请求拦截器
request.interceptors.request.use((config) => {
  let userStore = useUserStore()
  if (userStore.token) {
    // userStore.token的token 未必是最新的
    // console.log('112+', userStore.token)
    // config.headers.token = userStore.token
    //获取实时本地token, 如果用户手动更改token ,跳转路由时只能回登录页
    console.log('cun1218', GET_TOKEN())
    config.headers.token = GET_TOKEN()
  }

  console.log('请求拦截器config', config)
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response) => {
    console.log('response', response)
    console.log('response.data', response.data)
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export let request1 = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API1, // 基础路径会携带 "/dev-api"
  timeout: 30000,
})

request1.interceptors.response.use(
  (response) => {
    console.log('response1', response)
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    let status = error.response?.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
