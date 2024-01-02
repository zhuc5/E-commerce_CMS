// 用户管理模块的接口
// 角色管理接口

import { request } from '@/utils/request'
import type {
  RoleResponseData,
  RoleData,
  MenuResponseData,
  setRoleTs,
} from '@/api/acl/role/type.ts'
enum API {
  // 获取角色列表
  //GET /admin/acl/role/{page}/{limit}
  ALLROLE_URL = '/admin/acl/role/',
  //新增角色POST /admin/acl/role/save
  ADDROLE_URL = '/admin/acl/role/save',
  //  更新角色
  //PUT /admin/acl/role/update
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部的菜单与按钮数据
  //get '/admin/acl/permission/toAssign/{roleId}'
  ALLPERMISSION = '/admin/acl/permission/toAssign/',
  // 给一个职位 分配权限
  // POST参数
  SETPERMISSION_URL = '/admin/acl/permission/doAssignAcl',
  // 删除角色
  //GET /admin/acl/role/remove/{id}
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}
//获取角色列表

export const reqAllRoleList = (
  page: number,
  limit: number,
  roleName: string,
) => {
  return request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )
}
//  更新/添加角色
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
// 获取全部的菜单与按钮数据
export const reqAllMenuList = (roleId: number) => {
  return request.get<any, MenuResponseData>(API.ALLPERMISSION + roleId)
}
//  给一个职位 分配权限
export const reqSetPermission = (setobj: setRoleTs) => {
  return request.post<any, any>(API.SETPERMISSION_URL, setobj)
}
// 删除角色
export const reqRemoveRole = (roleId: number) => {
  return request.delete(API.REMOVEROLE_URL + roleId)
}
