import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
let router = createRouter({
  // 路由模式 hash
  history: createWebHashHistory(),
  routes: constantRoute,

  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
// router.beforeEach((to, from, next) => {
//     console.log('全局前置')
//     next()
//     // return true
// })
// router.afterEach((to, from, next) => {
//     console.log('全局后置')

//     // return true
// })
export default router
