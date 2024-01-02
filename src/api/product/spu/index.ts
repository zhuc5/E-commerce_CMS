// SPU 管理模块的接口
// http://139.198.104.58:8209/admin/product/2/12?category3Id=1
import { request1 } from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'
enum API {
  // GET /admin/product/{page}/{limit}
  HASSPU_URL = '/admin/product/',
  // spu 所有品牌
  AllTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取一个已有spu的images
  // '/admin/product/spuImageList/{spuId}',
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取一个已有spu的销售属性
  // GET /admin/product/spuSaleAttrList/{spuId}
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取所有spu销售属性
  // GET /admin/product/baseSaleAttrList
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加一个新的spu
  // post '/admin/product/saveSpuInfo'
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 修改一个已有的spu
  // POST /admin/product/updateSpuInfo
  UPDATESPU_URL = '/admin/product/updateSpuInfo',

  //在spu模块中给一个已有的spu添加一个sku
  // POST
  ///admin/product/saveSkuInfo
  //'/admin/product/updateSkuInfo'
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 在spu模块中查看一个已有的spu的sku列表
  // get ‘/admin/product/findBySpuId/{spuId}’
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除一个spu
  //get '/admin/product/deleteSpu/{spuId}',
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}
// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) => {
  return request1.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
}
// 获取spu 所有品牌
export const reqAllTradeMark = () =>
  request1.get<any, AllTradeMark>(API.AllTRADEMARK_URL)
// 获取一个spu的images
export const reqSpuImageList = (spuId: number) =>
  request1.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
//  获取一个spu的销售属性

export const reqSpuHasSaleAttr = (spuId: number) =>
  request1.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request1.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
// 添加一个新的spu
// 修改一个已有的spu
// 2者 返回的数据都是没有的
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request1.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request1.post<any, any>(API.ADDSPU_URL, data)
  }
}
//在spu模块中给一个已有的spu添加一个sku
export const reqAddSku = (data: SkuData) => {
  return request1.post<any, any>(API.ADDSKU_URL, data)
}
// 在spu模块中查看一个已有的spu的sku列表
export const reqSkuList = (spuId: number | string) =>
  request1.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
//删除 一个spu
export const reqRemovSpu = (spuId: number | string) =>
  request1.delete<any, any>(API.REMOVESPU_URL + spuId)
