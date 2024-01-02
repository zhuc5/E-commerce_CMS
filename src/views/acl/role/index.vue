<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="角色搜索">
          <el-input placeholder="请输入角色名" v-model="keyword"></el-input>
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
        icon="Plus"
        @click="addRole"
        v-has="`btn.Role.add`"
      >
        添加角色
      </el-button>
      <el-table border style="margin: 10px 0px" :data="allRoleList">
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="职位名称"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setPermission(row)"
              v-has="`btn.Role.assgin`"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateRole(row)"
              v-has="`btn.Role.update`"
            >
              编辑
            </el-button>

            <el-popconfirm
              :title="`你确定删除${row.roleName}吗`"
              width="200px"
              @confirm="deleteRole(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                  v-has="`btn.Role.remove`"
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
        :page-sizes="[5, 10, 20]"
        :background="background"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="changeSize"
        @current-change="getHasRole"
      />
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="RoleParams.id ? '更新职位' : '添加职位'"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="RoleParams" ref="ruleFormRef" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请输入职位名称"
            v-model="RoleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 抽屉组件 用来给职位去分配权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <!-- default-expand-all -->
        <el-tree
          ref="tree"
          :data="aclArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="hasAclArr"
          :props="defaultProps1"
        />
        <!-- <el-tree :data="data" show-checkbox node-key="id" default-expand-all :default-checked-keys="[5,6]"
                    :props="defaultProps"  @check-change="seetree"/> -->
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="comfirmSetRole">确定</el-button>
        </div>
      </template>
    </el-drawer>
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
import type {
  RoleResponseData,
  RoleData,
  MenuList,
  setRoleTs,
} from '@/api/acl/role/type.ts'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role/index.ts'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'

// 收集用户输入的关键字
let keyword = ref<string>('')
//当前页码
let currentPage = ref<number>(1)
//一页显示几个
let pageSize = ref<number>(5)

// 用户总个数
let total = ref<number>(0)
// 存储已有角色
let allRoleList = ref<RoleData[]>([])
//控制对话框的显示
let dialogVisible = ref<boolean>(false)
// 收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: '',
})
// 获取form组件的实例
let ruleFormRef = ref<any>()
// 控制权限抽屉显示
let drawer = ref(false)
// 控制tree
const defaultProps = {
  children: 'children',
  label: 'label',
}
//自己的树
const defaultProps1 = {
  children: 'children',
  label: 'name',
}
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]

// 组件一挂载就去请求角色列表 或者用户点击搜索时
const getHasRole = async () => {
  let result: RoleResponseData = await reqAllRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    console.log('juese', result.data)
    total.value = result.data.total
    allRoleList.value = result.data.records
  }
}
onMounted(() => {
  getHasRole()
})
// 每页展示个数变化时 重新请求，并且默认展示第一页
const changeSize = () => {
  currentPage.value = 1
  getHasRole()
}
// 搜索按钮的回调
const search = () => {
  getHasRole()
  // 搜索完后 清空
  keyword.value = ''
}
// 重置按钮
// 获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()

const reset = () => {
  LayOutSettingStore.$patch({
    refresh: !LayOutSettingStore.refresh,
  })
  // LayOutSettingStore.refresh=!LayOutSettingStore.refresh
}

// 添加/编辑角色表单校验

// 校验用户名的回调函数
const validatorRoleName = (rule: any, value: any, callback: any) => {
  console.log('chualevalue', value)
  if (value.trim().length > 0) {
    callback()
  } else {
    callback(new Error('用户名长度至少1位'))
    // Error里面传入的文字 会当作 红字提示
  }
}
// 校验规则
const rules = {
  roleName: [{ validator: validatorRoleName, trigger: 'blur', required: true }],
}

// 添加角色
const addRole = () => {
  // 全部批量清空
  Object.keys(RoleParams).forEach((key) => {
    RoleParams[key] = '' // 或者 obj[key] = undefined;
  })
  nextTick(() => {
    console.log('formRef.value', ruleFormRef.value)

    ruleFormRef.value.clearValidate('roleName')
  })
  dialogVisible.value = true
}
// 编辑角色
const updateRole = (row: RoleData) => {
  Object.assign(RoleParams, row)
  nextTick(() => {
    console.log('formRef.value', ruleFormRef.value)

    ruleFormRef.value.clearValidate('roleName')
  })
  dialogVisible.value = true
}
// 确定添加/编辑角色的确定按钮
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
  let result: any = await reqAddOrUpdateRole(RoleParams)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })

    // 再次渲染最新列表,如果是在添加用户后 就回到第一页，如果是更新就停留在当前页
    // 不写currentPage.value = 1也可以，因为reload刷新网页 相当于重新mount,还不论修改还是新增都会回到第一页
    // 如果是添加 就返回第一页，更新留在当页
    if (!RoleParams.id) {
      currentPage.value = 1
    }
    getHasRole()

    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '更新失败' : '添加失败',
    })
  }
  dialogVisible.value = false
}
// 存放按钮的数组
const aclArr = ref<MenuList>([])

// 权限修改
// 收集 select=true的所有按钮 放入hasAclArr数组
const hasAclArr = ref([])
const setPermission = async (row: RoleData) => {
  hasAclArr.value = []
  drawer.value = true
  console.log('权限修改', row.id)
  // 收集当前被分配权限的role的数据
  Object.assign(RoleParams, row)

  let result = await reqAllMenuList(row.id)
  //result.data 是一个数组
  console.log('获取全部权限', result.data)
  aclArr.value = result.data
  console.log('aclArr.value', aclArr.value)
  // aclArr.value本身已经是个数组 并且只有1个总元素
  //以下筛选出按钮为select=true的过程还可以用递归！
  // 多层for 循环
  // aclArr.value.forEach((c1) => {
  //     // console.log('c1',c1)
  //     c1.children.forEach((c2) => {
  //         c2.children.forEach((c3) => {
  //             // console.log('c3',c3)
  //             // if (c3.select == true) {
  //             //     // c3才是每个功能按钮
  //             //     hasAclArr.value.push(c3.id)

  //             // }
  //             c3.children.forEach((c4) => {
  //                 console.log('c4', c4)
  //                 if (c4.select == true) {
  //                     // c3才是每个功能按钮
  //                     hasAclArr.value.push(c4.id)
  //                 }

  //             })

  //         })
  //     })
  // })
  //如果用递归法
  hasAclArr.value = filterSelectArr(aclArr.value, [])
  console.log('shouji', hasAclArr)
}
// 递归法筛选出label=4(按钮层) select=4 的按钮
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    // 只筛选功能按钮是否select=true,前面3级不管
    if (item.select && item.level == 4) {
      console.log('有权限,', item.name)
      initArr.push(item.id)
    }
    // 递归children
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
// 提交角色权限的修改
const tree = ref()
const comfirmSetRole = async () => {
  console.log('提交的权限修改的职位id', RoleParams.id)
  // 需要用到tree的api，就要先获取tree实例 ，用ref
  // body参数格式
  // {
  //     "permissionIdList": [
  //         22
  //     ],
  //         "roleId": 8726
  // }
  // console.log('tree.value.getCheckedKeys', tree.value.getCheckedKeys())
  // console.log('修改提交的职位id', tree.value.getCheckedKeys())
  let arr = tree.value.getCheckedKeys()
  // 权选的节点 和半选的节点都要提交，否则只有按钮没有路由菜单！
  let arr1 = tree.value.getHalfCheckedKeys()
  let result = await reqSetPermission({
    permissionIdList: arr.concat(arr1),
    roleId: RoleParams.id,
  })
  console.log('修改结果', result)
  if ((result.code = 200)) {
    ElMessage({
      type: 'success',
      message: '修改权限成功',
    })
    // 还是要刷新一次，因为有可能修改了自己的权限
    window.location.reload()
  }

  drawer.value = false
}
// const seetree = (currentnode, treenodeAtt, treenode) => {
//     console.log('chufa')
//     //该节点所对应的对象
//     console.log('currentnode', currentnode)
//     //节点本身是否被选中
//     console.log('treenodeAtt', treenodeAtt)
//     //节点的子树中是否有被选中的节点
//     console.log('treenode', treenode)

// }
// 删除角色
const deleteRole = async (roleId: number) => {
  let result = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '修改权限成功',
    })
    currentPage.value =
      allRoleList.length > 1 ? currentPage.value : currentPage.value - 1

    getHasRole()
  }
}
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
