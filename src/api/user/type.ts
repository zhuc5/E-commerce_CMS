//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

// //定义全部接口返回数据都拥有ts类型
// export interface ResponseData {
//   code: number
//   message: string
//   ok: boolean
// }
// export interface dataType {
//   // 不一定存在，所以加个?
//   token?: string
//   message?: string
// }

// //定义登录接口返回数据类型
// export interface loginResponseData {
//   code: number,
//   data: dataType
// }

// export interface userInfo {
//     userId: number,
//     avatar: string,
//     username: string,
//     password: string,
//     desc: string,
//     roles: string[],
//     buttons: string[],
//     routes: string[],
//     token:string

// }

// export interface user {
//     checkUser: userInfo
// }
// //定义获取用户信息返回数据类型
// export interface userResponseData {
//     code: number,
//     data:user

// }

//11.30 使用真实接口后 更改数据类型
// info,login,logout接口返回的数据都有code, message,ok
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 定义登录接口返回的数据类型
export interface loginResponseData extends ResponseData {
  // 返回的data就是token
  data: string
}
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    avatar: string
    name: string
  }
}
