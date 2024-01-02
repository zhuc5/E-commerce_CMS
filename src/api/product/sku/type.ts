//spu 相关ts
// sku基本的返回类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface skuAttrshouji {
  attrId: number | string // 平台属性的id
  valueId: number | string // 平台属性值的id
}
export interface skuSaleAttrshouji {
  saleAttrId: number | string // 销售属性的id
  saleAttrValueId: number | string //销售属性值的id
}
export interface SkuData {
  // 前2个字段 id,isSale都是在sku模块时添加上的
  id?: number
  isSale?: number // // issale 是1 就代表当前处于上架状态
  category3Id: string | number

  spuId: string | number
  tmId: string | number // spu品牌id
  skuName: string
  weight: string | number
  price: string | number
  skuDesc: string

  skuImageList: null
  skuAttrValueList: skuAttrshouji[]
  skuSaleAttrValueList: skuSaleAttrshouji[]
  //   //平台属性的收集
  //   skuAttrValueList?: skuAttrshouji[]
  //   // 销售属性的收集
  //   skuSaleAttrValueList?: skuSaleAttrshouji[]
  skuDefaultImg: string // sku图片地址
}
// 获取sku 接口返回数据的ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}
// 获取（商品详情）接口返回的数据
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
