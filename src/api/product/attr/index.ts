// 这里书写属性相关的API
import { request1 } from '@/utils/request'
//引入 返回的分类数据的类型ts
import type { CategoryResponseData, AttrResponseData } from './type'
// 属性管理模块接口地址
enum API {
  //获取一二三级分类数据接口地址，都是get请求
  // 获取一级分类
  C1_URL = '/admin/product/getCategory1',

  // 获取二级分类
  //'/admin/product/getCategory2/{category1Id}'
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类
  //'/admin/product/getCategory3/{category2Id}'
  C3_URL = '/admin/product/getCategory3/',
  // '/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}'
  ATTR_URL = '/admin/product/attrInfoList/',
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  //'/admin/product/deleteAttr/{attrId}'
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}
// 获取分类的接口方法
export const reqC1 = () => request1.get<any, CategoryResponseData>(API.C1_URL)
// 获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) =>
  request1.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 获取三级分类的接口方法
export const reqC3 = (category2Id: number) =>
  request1.get<any, CategoryResponseData>(API.C3_URL + category2Id)

// 获取对应分类下已有的属性与属性值
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) => {
  return request1.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )
}

// 新增或者修改已有属性接口,2个请求都用这个接口(区别在于新增属性少属性id，属性值id)
// post请求参数 放在body里面 ，不是拼接在path中！
export const reqAddOrUpdateAttr = (data: Attr) =>
  request1.post<any, any>(API.ADDORUPDATEATTR_URL, data)

// 删除属性
export const reqRemoveAttr = (attrId: number) =>
  request1.delete<any, any>(API.DELETEATTR_URL + attrId)
