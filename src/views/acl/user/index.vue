<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button
        type="primary"
        size="default"
        @click="addUser"
        v-has="`btn.User.add`"
      >
        添加用户
      </el-button>
      <el-button
        type="primary"
        size="default"
        :disabled="selectUserId.length ? false : true"
        @click="deleteSelectUser"
        v-has="`btn.User.removeBatch`"
      >
        批量删除
      </el-button>
      <el-table
        style="margin: 10px 0px"
        border
        :data="userArr"
        @select="handleSelect"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setRole(row)"
              v-has="`btn.User.assgin`"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
              v-has="`btn.User.update`"
            >
              编辑
            </el-button>

            <el-popconfirm
              :title="`你确定删除${row.username}吗`"
              width="200px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                  v-has="`btn.User.remove`"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[1, 3, 5, 7]"
        :background="background"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="changeSize"
        @current-change="getHasUser"
      />

      <el-drawer v-model="drawer">
        <template #header>
          <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <template #default>
          <el-form :model="userParams" ref="ruleFormRef" :rules="rules">
            <el-form-item label="用户姓名" prop="username">
              <el-input
                placeholder="请输入用户姓名"
                v-model="userParams.username"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="name">
              <el-input
                placeholder="请输入用户昵称"
                v-model="userParams.name"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="用户密码"
              prop="password"
              v-if="userParams.id ? false : true"
            >
              <el-input
                placeholder="请输入用户密码"
                v-model="userParams.password"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
          </div>
        </template>
      </el-drawer>
      <el-drawer v-model="drawer1">
        <template #header>
          <h4>{{ 分配角色 }}</h4>
        </template>
        <template #default>
          <el-form>
            <el-form-item label="用户姓名">
              <el-input
                v-model="userParams.username"
                disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="职位列表">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model="userRoles"
                @change="handleCheckedCitiesChange"
              >
                <!-- 以下 label要写item 不能写item.roleName 否则显示不了已有角色 -->
                <el-checkbox
                  v-for="(item, index) in allRoles"
                  :key="item"
                  :label="item"
                >
                  {{ item.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </template>

        <template #footer>
          <div style="flex: auto">
            <el-button @click="drawer1 = false">取消</el-button>
            <el-button type="primary" @click="confirmClick">确定</el-button>
          </div>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  reactive,
  nextTick,
  onUpdated,
} from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user/index.ts'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type.ts'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'
//当前页码
let currentPage = ref<number>(1)
//一页显示几个
let pageSize = ref<number>(3)
// 定义变量接收 每次请求获得的user， 每个元素就是一个user
let userArr = ref<Records>([])
// 用户总个数
let total = ref<number>(0)
// 控制新增用户抽屉显示
let drawer = ref(false)
// 控制分配角色抽屉显示
let drawer1 = ref(false)
// 收集用户输入的关键字
let keyword = ref<string>('')
// 收集新增用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 获取form组件的实例
let ruleFormRef = ref<any>()
// 校验用户名的回调函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  console.log('chualevalue', value)
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度至少5位'))
    // Error里面传入的文字 会当作 红字提示
  }
}
// 校验昵称的回调函数
const validatorName = (rule: any, value: any, callback: any) => {
  console.log('chufalevalue', value)
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('昵称长度至少5位'))
    // Error里面传入的文字 会当作 红字提示
  }
}
// 校验用户密码
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
    // Error里面传入的文字 会当作 红字提示
  }
}
// 校验规则
const rules = {
  name: [{ validator: validatorName, trigger: 'blur', required: true }],
  username: [{ validator: validatorUserName, trigger: 'blur', required: true }],
  password: [{ validator: validatorPassword, trigger: 'blur' }],
}
//

// 获取全部已有的用户信息
const getHasUser = async () => {
  let result: UserResponseData = await reqUserInfo(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  console.log('getHasUser', result)

  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 每页展示个数变化时 重新请求，并且默认展示第一页
const changeSize = () => {
  currentPage.value = 1
  getHasUser()
}

// 获取某个用户的角色
// const getRole()=>
// 组件刚挂载完毕，去发送请求 获取全部已有用户信息
onMounted(() => {
  getHasUser()
})

// 添加用户按钮的回调
const addUser = () => {
  // 清空容器数据
  // 如果表单校验 trigger写了change 而不是blur
  // 如果上次没通过校验 但是点击了取消，此次又点击新增用户打开表单，上次的错误提示还会存在
  // 因为Object.assign将表单清空 还会触发change,错误提示还会有
  // 如果用 了 ruleFormRef.value.resetFields 就可以用change，也不用手动Object.assign清除容器，也不用手动clearValidate了
  //userParams 自动会被清除
  // Object.assign(userParams,
  //     {
  //         username: '',
  //         name: '',
  //         password: ''
  //     }
  // )
  //
  // 全部批量清空
  Object.keys(userParams).forEach((key) => {
    userParams[key] = '' // 或者 obj[key] = undefined;
  })

  /*
        注意 在adduser 中，每次要也要将id清空为0，因为如果上次点击更新用户， 
        本次点击添加用户（userparams还会带着上次的user.id），obj.assign 没有清空id的话, 还会是以 “更新用户”模式显示 form
        */

  // console.log('去消除错误')
  drawer.value = true

  // 清除上一次错误提示
  // 用nexttick因为第一次点击add 的时候，ruleFormRef还不存在

  // 为什么用了nexttick,trigger写change还是不能清除上一次的错误提示?
  // latest 还是object.assign手动清空吧 不用resetFields了

  console.log('formRef.value', ruleFormRef.value)

  console.log('userParams', userParams)
  nextTick(() => {
    console.log('formRef.value', ruleFormRef.value)
    // ruleFormRef.value.resetFields()
    console.log('userParams', userParams)
    ruleFormRef.value.clearValidate('username')
    ruleFormRef.value.clearValidate('name')
    ruleFormRef.value.clearValidate('password')
  })
}

// 编辑用户按钮的回调
const updateUser = (row: User) => {
  drawer.value = true
  // 传给
  Object.assign(userParams, row)
  console.log('updateuserParams', userParams)
  nextTick(() => {
    ruleFormRef.value.clearValidate('username')
    ruleFormRef.value.clearValidate('name')
  })
}
const cancel = () => {
  drawer.value = false
  //关闭了之后 还能拿到嘛
  nextTick(() => {
    console.log('formRef.value', ruleFormRef.value)
  })
}
const save = async () => {
  //要等所有字段校验通过再发送请求
  let checkResult = null
  try {
    checkResult = await ruleFormRef.value.validate()
    console.log('checkResult', checkResult)
  } catch {
    console.log('cuowu')
    return
  }
  let result = await reqAddOrUpdateUser(userParams)

  console.log('addresult', result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })

    // 再次渲染最新列表,如果是在添加用户后 就回到第一页，如果是更新就停留在当前页
    // 不写currentPage.value = 1也可以，因为reload刷新网页 相当于重新mount,还不论修改还是新增都会回到第一页
    // if(!userParams.id){
    //      currentPage.value = 1
    // }
    getHasUser()
    // 让浏览器自动刷新一次
    // 因为如果当前登录用户修改了自己的账户，路由会判断当前正在登录中的账号不存在
    // 会触发 userStore.userLogout 让用户重新返回到登录页
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
  drawer.value = false
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 在用户名框中 显示当前行 用户的名字，并且禁用input，不让修改
  Object.assign(userParams, row)
  console.log('row.id', userParams.id)
  let result: AllRoleResponseData = await reqAllRole(row.id)
  console.log('role', result.data)
  if (result.code == 200) {
    allRoles.value = result.data.allRolesList
    userRoles.value = result.data.assignRoles
    console.log('userRoles', userRoles)
    checkAll.value = userRoles.value === allRoles.value.length
    isIndeterminate.value =
      userRoles.value.length > 0 &&
      userRoles.value.length < allRoles.value.length
  }

  drawer1.value = true
}
// 角色多选框的控制
// 全部角色
const allRoles = ref<AllRole>([])
let isIndeterminate = ref(false)
// 当前用户已有角色
const userRoles = ref<AllRole>([])
const checkAll = ref(false)

const handleCheckAllChange = (val: boolean) => {
  console.log('press all')
  userRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  console.log('当前选中的', value)
  console.log('userRoles', userRoles)
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}
// 提交对某个用户 分配角色的修改
const confirmClick = async () => {
  let data: SetRoleData = {
    roleIdList: userRoles.value.map((item) => {
      return item.id as number
    }),
    userId: userParams.id as number,
  }
  console.log('data', data)
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
  }
  drawer1.value = false
  //关闭抽屉
  // 再次渲染列表
  getHasUser()
}
// 删除某一个用户
const deleteUser = async (userId: number) => {
  console.log('delete', userId)
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 再次渲染列表
    // 判断当前页面还剩几个 如果原本就只有1个就返回上一页
    currentPage.value =
      userArr.value.length > 1 ? currentPage.value : currentPage.value - 1

    getHasUser()
  }
}
let selectUserId = ref<number[]>([])
// 下面选矿状态变化时触发，第一行的全选框不管
const handleSelect = (selection, row) => {
  console.log('变化了')
  console.log('selection', selection)
  console.log('row', row)
  selectUserId.value = selection.map((item) => item.id)
  console.log('selectUserId', selectUserId.value)
}
// 批量删除
const deleteSelectUser = async () => {
  let result = await reqSelectUser(selectUserId.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功',
    })
    currentPage.value =
      userArr.value.length > selectUserId.value.length
        ? currentPage.value
        : currentPage.value - 1

    getHasUser()
  }
  console.log(selectUserId)
}
// 搜索按钮的回调
const search = () => {
  getHasUser()
  // 搜索完后 清空
  keyword.value = ''
}
// 重置按钮
// 获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()

const reset = () => {
  LayOutSettingStore.$patch({
    refresh: LayOutSettingStore.refresh,
  })
  // LayOutSettingStore.refresh=!LayOutSettingStore.refresh
}
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
