//spu 相关ts
// 基本的返回类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// SPU数据的ts类型，也就是一个品牌的信息
export interface SpuData {
  // 如果是新增的spu,id没有
  // spu的id
  id?: number
  spuName: string
  // trademark品牌id
  tmId: number | string
  description: string
  category3Id: string | number

  // 以下2个属性 以后会有
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
  //   spuName:
  //   spuPosterList:
  //   updateTime
  //   createTime
}
// 数组： 元素都是已有的spu数据类型(每一个元素 就是一个品牌)
export type Records = SpuData[]
// 定义获取已有的spu  接口的返回的数据ts
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    hitCount: boolean
    current: number
    pages: number
    searchCount: true
    size: number
    total: number
  }
}
// 一个spu品牌数据的ts 类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的数据ts
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}
// 一个image数据
export interface SpuImg {
  // 以下2个字段 新增spu的新增的图片没有的
  id?: number
  spuId?: number
  createTime?: string
  updateTime?: string

  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
// 一个spu的image数据
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}
// 一个spu的销售属性数据
// 从小到大 ，先定义销售属性值 再定义销售属性

export interface SaleAttrValue {
  // 某一个spu的一个销售属性的某一个属性值的id
  // 因为用户可新增某个属性的属性值，所以不一定有属性值的id
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  // 在save的时候销售属性baseSaleAttrId,一定要有，也一定会有 因为属性都是列表有的
  baseSaleAttrId?: number
  saleAttrValueName: string
  saleAttrName: string
  isChecked?: null
}
// 销售属性值数组
export type SpuSaleAttrValueList = SaleAttrValue[]

// 一个销售属性
export interface SaleAttr {
  // flag用来控制 在编辑属性界面 中每一个属性 的属性值一栏 展示输入框input 还是“添加属性值”按钮
  flag?: boolean
  //有可能新增属性
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  // 用来收集 spuform中 每一个属性每次在input中新添的属性
  saleAttrValue?: string
}

//销售属性接口返回数据
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}
// 已有全部销售属性接口返回的数据
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
// 为了skudata
// 平台属性
export interface skuAttrshouji {
  attrId: number | string // 平台属性的id
  valueId: number | string // 平台属性值的id
}
export interface skuSaleAttrshouji {
  saleAttrId: number | string // 销售属性的id
  saleAttrValueId: number | string //销售属性值的id
}
export interface SkuData {
  category3Id: string | number

  spuId: string | number
  tmId: string | number // spu品牌id
  skuName: string
  weight: string | number
  price: string | number
  skuDesc: string
  //平台属性的收集
  skuAttrValueList?: skuAttrshouji[]
  // 销售属性的收集
  skuSaleAttrValueList?: skuSaleAttrshouji[]
  skuDefaultImg: string // sku图片地址
}

export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
