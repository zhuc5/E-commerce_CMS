import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from '@/store/modules/user'
import { setActivePinia, createPinia } from 'pinia'
import setting from './setting'

// 但是为了保证所有组件 共享到同一个pinia， 就必须把pinia实例传给userstore
// 方法1: useUserStore写在路由的外面，此时pinia必须作为参数传入usestore
// let userStore = useUserStore(pinia)
// 方法3 也不好，原因以后再了解
//// 创建一个新 pinia，并使其处于激活状态，这样它就会被任何 useStore() 调用自动接收
// 而不需要手动传递：
// `useStore(pinia)`
//  setActivePinia(createPinia())
let userStore = useUserStore(pinia)
// console.log('sp', userStore)
// console.log('spp', pinia)
router.beforeEach(async (to, from, next) => {
  // to,from相当于一个route,
  // next路由旅行函数
  // 这样做是可行的，因为路由器是在其被安装之后开始导航的，
  // 而此时 Pinia 也已经被安装。
  // 方法2: useUserStore写在路由里面，此时pinia不用传入usestore
  // 但是这样拿到的可能是另外一个pinia实例的store
  //   let userStore = useUserStore()
  // console.log('全局前置')
  // console.log('permission中 store.token', userStore.token)
  nprogress.start()
  // 获取token
  let token = userStore.token
  // console.log('token1130', userStore.token)
  // 获取用户名字
  // let username = userStore.username
  // console.log('to', to)

  if (token) {
    // 用户已经登录了
    // 就不能在跳转到login, 自动去到首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // console.log('查看username', userStore.username)
      if (userStore.username) {
        // console.log('跳转之前所有路由1223', router.getRoutes())
        next()
      } else {
        // 依然在登录状态时 ，可以去访问其余路由（login 除外）
        try {
          // userStore.userInfo会发送一个promise
          // 这里需要知道userStore.userInfo请求的promise 是否成功
          // 所以要去再修改store.userInfo()方法
          // console.log('token', userStore.token)
          await userStore.userInfo()
          // 同时解决了 token 存在时，在非首页页面 刷新页面 用户头像丢失的问题
          // console.log('token right')

          // next()
          // flag 不要用了
          // 如果直接写next()万一 addroute 还没把异步路由加入路由 就会出现白屏
          // next({...to,replace:true})
          // console.log('查看查看router.getRoutes()', router.getRoutes())
          // if (router.getRoutes().length<15) {
          //   console.log('没跳转之前所有路由', router.getRoutes())
          //   // next()
          //   // next({ ...to, replace: true })
          // } else {
          //   console.log('跳转之前所有路由', router.getRoutes())
          //   next()
          // }
          // console.log('user.flag', userStore.flag)
          next({ ...to, replace: true })
        } catch (error) {
          //可能发生error的情况
          // 1. token过期了
          // 2. 用户手动修改了本地token
          //  我们应该清空用户数据(store.userlogout)
          // 回到登录页面
          await userStore.userLogout()

          next({
            path: '/login',
            query: { redirect: to.path },
          })
        }
      }
    }
  } else {
    // 用户未登录判断
    // 如果未登录，to是login,直接放行
    if (to.path == '/login') {
      // console.log('退出router',router.getRoutes())
      next()
    } else {
      // 如果未登录，想去其他地址，不给去，直接去login页面,但是记下来 想去的地址
      next({ path: '/login', query: { redirect: to.path } })
    }
  }

  // return true
})
router.afterEach((to, from, next) => {
  console.log('全局后置')
  // 更改标签名
  document.title = setting.title + '-' + to.meta.title
  nprogress.done()

  // return true
})

// 第1个问题，任意路由的切换都要调出进度条，需安装nprogress
// 第2个问题，路由鉴权（路由组件的访问权限设置）
// 全部路由组件一共7个：登录login｜任意组件｜404｜首页(layout跳转的)｜数据大屏｜权限管理(三个子路由)｜商品管理（四个子路由）
// 用户未登录：可以访问login, 其余6个路由不能访问(指向login)
// 用户登录后： 不能访问login(立即跳转到首页),其他6个一级路由均可访问

// 那么如何知道用户此时此刻 是否处于已登录状态
// 引入pinia ,引入user相关仓库，获取store.token
