// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口（自己配置的aixos实例）
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import { createRouter, createWebHashHistory } from 'vue-router'

import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
//引入state数据类型
import type { UserState } from './types/type.ts'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import router from '@/router/index.ts'

// 引入路由(常量路由,异步路由,任意路由)
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes'

const filtcr = (allcr, newarr) => {
  allcr.forEach((item) => {
    newarr.push(item.name)
    if (item.children && item.children.length > 0) {
      filtcr(item.children, newarr)
    }
  })
}

function filterRoutes(asnycRoute, userHasRoutes) {
  return asnycRoute.filter((item) => {
    // console.log('userHasRoutes', userHasRoutes)
    // console.log('item.name', item.name)
    if (userHasRoutes.includes(item.name)) {
      console.log('包含了', item.name)
      // 只包含了acl
      if (item.children && item.children.length > 0) {
        let res = filterRoutes(item.children, userHasRoutes)
        item.children = res
        //  console.log('res',res)
      }
      return true
    }
  })
}
// 创建用户小仓库
let useUserstore = defineStore('User', {
  // 小仓库存储数据地方
  //这里使用配置option的方式创建store
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token
      // 使用utils中封装好的方法
      //用户唯一标识token
      // 定义生成菜单的路由
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      flag: false,
      buttons: [],
    }
  },

  // 异步, 方法
  actions: {
    // 用户登录的方法
    // 定义参数，规定数据类型
    //data: loginFormData
    //let result: loginResponseData = await reqLogin(data)
    async userLogin(data: loginFormData) {
      // view/user传过来用户input输入的{name, password}
      console.log('data_1129', data)
      //真正发起aixos登录请求（异步）
      let result: loginResponseData = await reqLogin(data)
      console.log('1129', result)
      //   if(result.code)
      if (result.code == 200) {
        // (result.data.token as string)表示断言，只有是string 的时候才赋值
        // action 的方法里访问 state定义的token，可直接this.token
        console.log('result.data', result.data)
        // this.token = result.data as string //1218
        this.token = result.data
        console.log('result.data1218', result.data)
        // 本地储存持久化 一份 改回mock 1218
        // localStorage.setItem('TOKEN', result.data as string)
        // 使用utils中封装好 存储方法
        SET_TOKEN(result.data as string)
        //  SET_TOKEN(result.data.token)// 1218
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 获取用户资料的方法
    async userInfo() {
      this.flag = false
      console.log('this.flag', this.flag)
      console.log('获取用户资料')
      // 获取头像，名字
      let result: userInfoResponseData = await reqUserInfo()
      console.log('result', result)
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 第一次登录请求 info就获取button
        // 以后只要token,username在，路由跳转的时候 就不再发info
        this.buttons = result.data.buttons
        console.log('查看buttons', result.data.buttons)
        // 返回字符串就被认为是成功的promise
        // 计算当前用户有权限的异步路由
        // let skbarr = JSON.parse(JSON.stringify(asnycRoute));

        let userAsyncRoute = filterRoutes(asnycRoute, result.data.routes)
        console.log('筛选', userAsyncRoute)
        console.log('add之前查看router', router.getRoutes())
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 在router中注册 异步路由和任意路由
        ;[...userAsyncRoute, anyRoute].forEach((route: any) =>
          router.addRoute(route),
        )
        this.flag = true
        // console.log()

        // 打印当前用户拥有权限路由
        console.log('当前用户拥有权限路由', router.getRoutes())
        // 但是有问题 1当登录网站后，在异步路由处刷新 网页，啥都没了
        // 问题2 登陆超级管理员 再登陆普通人，再登陆超级管理员发现 管理员的菜单少了（深拷贝异步路由可以解决）

        return 'ok'
      } else {
        return Promise.reject('有token,但获取用户信息失败')
      }
    },
    // 退出登录
    async userLogout() {
      let result: any = await reqLogout()
      console.log('退出', result)
      if (result.code == 200) {
        let newarr: any = []
        filtcr(constantRoute, newarr)

        router.getRoutes().forEach((r: any) => {
          console.log('清空cr', newarr)
          console.log('清空r.name', r.name)

          if (!newarr.includes(r.name)) {
            //路由不属于白名单,则删除
            router.removeRoute(r.name)
          }
        })
        console.log('清空后的router', router.getRoutes())

        // 目前没有mock的退出接口
        this.token = ''
        this.username = ''
        this.avatar = ''
        this.buttons = []
        //清除localStorage的token
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
})

export default useUserstore
