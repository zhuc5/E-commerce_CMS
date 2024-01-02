// 用户管理模块
// 用户账号相关
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: null
  roleName?: string
}
// 数组包含全部的用户信息
export type Records = User[]
// 获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    // orders: []
    // optimizeCountSql: true
    // hitCount: false
    // countId: null
    // maxLimit: null
    // searchCount: true
  }
}
// 一个角色的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}
// 全部角色列表
export type AllRole = RoleData[]
// 获取全部职位列表接口 返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}
//// 给已有账户分配角色  接口返回数据
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
