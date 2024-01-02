import { request } from '@/utils/request'
import type {
  PermissionResponseData,
  MenuParamsTs,
} from '@/api/acl/menu/type.ts'
// 菜单管理相关
enum API {
  //获取全部菜单与按钮的标识数据
  //GET /admin/acl/permission
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 给某一级菜单 新增一个子菜单
  // POST
  ADDMENU_URL = '/admin/acl/permission/save',
  // PUT /admin/acl/permission/update
  UPDATEMENU_URL = '/admin/acl/permission/update',
  // 删除已有菜单
  // DELETE /admin/acl/permission/remove/{id}
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}
// 获取全部菜单数据
export const reqAllPermission = () => {
  return request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
}
// 添加/更新菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParamsTs) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}
// 删除某个已有的菜单
export const reqRemoveMenu = (id: number) => {
  return request.delete<any, any>(API.DELETEMENU_URL + id)
}
