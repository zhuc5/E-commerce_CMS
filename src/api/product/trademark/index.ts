// 书写品牌管理相关模块接口
import { request1 } from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'

// 品牌管理模块接口地址
enum API {
  // 获取已有品牌的接口
  //'/admin/product/baseTrademark/{page}/{limit}'
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌的接口,post
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',

  // 修改已有品牌的接口,put
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除 已有品牌
  // /admin/product/baseTrademark/remove/{id}'
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}
// 获取已有品牌的接口方法, page 获取第几页的数据 , limit 每页记录数
// 箭头函数后面花括号里面只有1行 可以不写花括号(自带return )，但是 写了花括号 就要return
export const reqHasTrademark = (page: number, limit: number) =>
  request1.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加品牌 和修改已有品牌 写成一个， 区别在于添加品牌提交的参数没有id,后者有
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  // console.log('data.id', data.id)
  if (data.id) {
    // console.log('xiugai')
    // 有id 就是修改操作
    return request1.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // console.log('zengjia')
    // 新增品牌
    return request1.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
// 删除某个已有品牌的数据
// id 前面不用加'/', 因为API.DELETE_URL 已经有了/
export const reqDeleteTrademark = (id: number) =>
  request1.delete<any, any>(API.DELETE_URL + id)
