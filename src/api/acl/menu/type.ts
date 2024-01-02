export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface Permission {
  id?: number
  createTime?: string
  updateTime?: string
  pid?: number
  name: string
  code: null
  toCode: null
  type?: number
  status: null
  level?: number
  children?: PermissionList
  select?: boolean
}
export type PermissionList = Permission[]
//// 全部菜单接口返回数据类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}
//提交 添加/修改菜单的参数 数据类型
export interface MenuParamsTs {
  // 如果是新增的菜单，id 没有
  id?: number
  // code是权限值
  code: string
  // 菜单等级
  level: 0
  name: string
  // pid是当前菜单的父菜单id
  pid: 0
}
