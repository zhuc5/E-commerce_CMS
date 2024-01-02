// 这里书写属性相关的API
import { request1 } from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

enum API {
  // 获取已有的商品
  //get '/admin/product/list/{page}/{limit}'
  SKU_URL = '/admin/product/list/',
  // 上架 get '/admin/product/onSale/{skuId}'
  SALE_URL = '/admin/product/onSale/',
  // 下架 get '/admin/product/cancelSale/{skuId}'
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口
  // get /admin/product/getSkuInfo/{skuId}
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除商品的接口
  //  /admin/product/deleteSku/{skuId}
  DELETESKU_URL = '/admin/product/deleteSku/',
}
// 获取商品sku接口
export const reqSkuList = (page: number, limit: number) =>
  request1.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 上架
export const reqSaleSku = (skuId: number) =>
  request1.get<any, any>(API.SALE_URL + skuId)
// 下架
export const reqCancelSale = (skuId: number) =>
  request1.get<any, any>(API.CANCELSALE_URL + skuId)
// 获取商品详情的接口
export const reqSkuInfo = (skuId: number) =>
  request1.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
// 删除1个已有商品
export const reqRemoveSku = (skuId: number) =>
  request1.delete<any, any>(API.DELETESKU_URL + skuId)
