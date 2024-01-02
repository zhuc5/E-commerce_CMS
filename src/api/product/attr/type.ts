// 分类相关数据ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 每一个分类的ts
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
// 相应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}
// 属性与属性值的ts类型

// 一个属性值对象的ts类型
export interface AttrValue {
  // 因为添加/编辑属性的接口都要用到这个ts,然后后者在发送请求时 没有attrId，id，所以这2个加？
  attrId?: number

  id?: number

  valueName: string
  // showInput 用于控制编辑属性界面中 每一个属性值是编辑模式还是查看模式
  showInput?: boolean
  refInput?: string
}
// 存储一组属性值的数组
export type AttrValueList = AttrValue[]
// 一个属性对象
export interface Attr {
  attrName: 'string'

  attrValueList: AttrValueList
  //因为添加/编辑属性的接口都要用到这个ts,起始值给的空字符串,所以用number | string
  categoryId: number | string
  categoryLevel: number
  //因为添加/编辑属性的接口都要用到这个ts,然后后者在发送请求时 没有属性id，所以加？
  id?: number
  // 时间都不要写了
  //   updateTime: '2023-12-03T04:19:42.640Z',
  //   createTime: '2023-12-03T04:19:42.640Z'
}

// 包含多个属性对象的数组
export type AttrList = Attr[]

// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
