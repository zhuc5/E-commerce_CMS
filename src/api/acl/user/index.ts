// 用户管理模块的接口
import { request } from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from '@/api/acl/user/type.ts'
// 枚举地址
enum API {
  // 获取全部已有用户账号信息
  // 'GET /admin/acl/user/{page}/{limit}'
  ALLUSER_URL = '/admin/acl/user/',
  // 新增用户 body参数
  // POST /admin/acl/user/save
  ADDUSER_URL = '/admin/acl/user/save',
  //修改用户 body参数
  //PUT /admin/acl/user/update
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部角色 以及 当前账户拥有的角色
  // GET '/admin/acl/user/toAssign/{adminId}'
  ALLROLEURL = '/admin/acl/user/toAssign/',
  // 给当前已有用户 分配角色
  //post
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除一个用户DELETE
  // '/admin/acl/user/remove/{id}'
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除 body参数 idList
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}
//UserResponseData
// 获取用户账号信息的接口
// query参数 根据关键字查询
//http://139.198.104.58:8212/admin/acl/user/1/2?username=a
export const reqUserInfo = (page: number, limit: number, keyword: string) => {
  return request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${keyword}`,
  )
}
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    // 如果已经有id 就是修改用户
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取全部角色以及当前账户的角色
export const reqAllRole = (userId: number) => {
  return request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)
}
// 给已有账户分配角色
export const reqSetUserRole = (data: SetRoleData) => {
  return request.post<any, any>(API.SETROLE_URL, data)
}
// 删除一个用户
export const reqRemoveUser = (userId: number) => {
  return request.delete<any, any>(API.DELETEUSER_URL + userId)
}

// 批量删除，注意 axios.delete传 body 参数 和post不一样 ，必须写{data:参数对象}
export const reqSelectUser = (idList: number[]) => {
  return request.delete(API.DELETEALLUSER_URL, { data: idList })
}
