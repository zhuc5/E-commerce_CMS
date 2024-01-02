//商品分类全局组件的小仓库
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { defineStore } from 'pinia'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'
let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 存储一级分类数据
      // 收集服务器返回的一级分类的所有选项
      c1Arr: [],
      // 收集用户选择的一级分类的id
      c1Id: '',

      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类的方法
    async getC1() {
      // 发送请求获取一级分类
      let result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    //获取二级分类的方法
    async getC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id)
      console.log('二级分类', result)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      let result: CategoryResponseData = await reqC3(this.c2Id)
      console.log('三级分类', result)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
})
export default useCategoryStore
