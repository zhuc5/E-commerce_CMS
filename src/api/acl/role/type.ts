// 角色管理模块

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 一个角色
export interface RoleData {
  id?: number | string
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}
export type Records = RoleData[]
//全部角色列表接口返回数据类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
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
// 菜单与按钮数据
export interface MenuData {
  id: number
  createTime?: string
  updateTime?: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  childeren: MenuList
  select?: boolean
}

export type MenuList = MenuData[]
// 菜单权限与按钮权限接口返回数据ts类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
//给一个职位分配权限需要的body参数 ts类型
export interface setRoleTs {
  permissionIdList: number[]
  roleId: number
}
