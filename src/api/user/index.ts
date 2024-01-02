//统一管理咱们项目用户相关的接口

import { request } from '@/utils/request'

import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from './type'

// //项目用户相关的请求地址

// enum API {
//   LOGIN_URL = '/user/login',

//   USERINFO_URL = '/user/info',

//   // LOGOUT_URL = '/admin/acl/index/logout',
// }
// //登录接口, 定义了自己配置的aixos实例
// export const reqLogin = (data: loginFormData) =>
//   request.post<any, loginResponseData>(API.LOGIN_URL, data)
// //获取用户信息

// export const reqUserInfo = () =>
//   request.get<any, userResponseData>(API.USERINFO_URL)

// //退出登录

// // export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)

//2023/11/29 用真实接口替换mock
//2023/12/18 又换回去
enum API {
  // LOGIN_URL = '/user/login',
  LOGIN_URL = '/admin/acl/index/login',
  // USERINFO_URL = '/user/info',
  USERINFO_URL = '/admin/acl/index/info',

  LOGOUT_URL = '/admin/acl/index/logout',
}
// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

//用户信息接口
export const reqUserInfo = () =>
  //request.get<返回数据类型（code）,返回数据类型(data)>(API.USERINFO_URL)
  // 这里不用参数 是在请求拦截器中 在header中加入了token
  request.get<any, userInfoResponseData>(API.USERINFO_URL)

//退出登录

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
