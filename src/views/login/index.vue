<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          ref="ruleFormRef"
          class="login_form"
          :model="loginForm"
          :rules="rules"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="loginForm.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login(ruleFormRef)"
            >
              登陆
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
// import type { FormInstance, FormRules } from 'element-plus'

import { getTime } from '@/utils/time'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 引入路由
import { useRouter, useRoute } from 'vue-router'
const $router = useRouter() // 整个应用的route
const $route = useRoute()

//定义变量控制 按钮加载效果
let loading = ref(false)
// const route = useRoute()//本组件的route
// console.log('router',router)
// console.log('route', route)
let userStore = useUserStore()
// 收集账号与密码数据
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })
// let loginForm = reactive({ username: 'admin', password: '111111' })
// 登陆按钮回调
const ruleFormRef = ref()
//与表单 ref属性值 同名的变量才能获取表单实例

const login = async () => {
  //等到自定义校验写好后 再完善

  // console.log(ruleFormRef.value)
  if (!ruleFormRef.value) return

  // ruleFormRef.value.validate是一个async函数,返回一个promise对象
  ruleFormRef.value.validate().then(
    () => {
      //开始加载效果
      loading.value = true
      console.log('go to login')
      // 点击登录按钮 以后干什么？
      // 通知仓库store(把input的loginForm发送给store仓库 )调用用户登录的方法，发登录请求，pinia
      // 由pinia的user_store真正发起axios请求
      // 请求成功-》首页展示
      // 请求失败，如用户名/密码不对，提示失败信息

      //  userLogin()返回一个promise对象
      const res = userStore.userLogin(loginForm)
      res
        .then((result) => {
          //加载效果消失
          loading.value = false
          console.log(result)
          //前进到home主页
          // 此处设置 进入到上次用户退出的位置
          // 位置(路由已经在地址栏中,用$route.query.redirect获取到退出前的位置)
          console.log('登陆前$router', $router)
          console.log('登陆前$route', $route)
          let redirect = $route.query.redirect

          // 如果有 $route.query.redirect就回到原来的位置，没有就回到首页
          $router.push({ path: redirect || '/' })
          ElNotification.success({
            title: `HI, ${getTime()}好`,
            duration: 3000,
            message: '欢迎回来',
          })

          // 提示信息框
        })
        .catch((error) => {
          //加载效果消失
          loading.value = false
          ElNotification({
            message: error.message,
            type: 'error',
          })
          console.log('error.message', error.message)
        })
    },
    (error) => {
      return
    },
  )
}

//封装一个函数：获取 一个结果：早上｜上午｜下午｜晚上

// 自定义校验规则函数

const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule:是校验规则对象
  // value是表单的当前字段值
  //callback:是一个内部封装好的函数，如果校验通过就写callback()，否则 callback(new Error)
  // console.log('value',value)
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度至少5位'))
    // Error里面传入的文字 会当作 红字提示
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
    // Error里面传入的文字 会当作 红字提示
  }
}

//定义表单校验需要的配置对象
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    { validator: validatorUserName, trigger: 'change' },
  ],
  password: [{ validator: validatorPassword, trigger: 'change' }],
}
</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
