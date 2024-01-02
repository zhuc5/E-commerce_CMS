<template>
  <!-- default-expand-all -->
  <el-table
    :data="PermissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="code" label="权限值"></el-table-column>
    <el-table-column prop="updateTime" label="修改时间"></el-table-column>
    <el-table-column align="center" label="操作" width="300px">
      <template #="{ row, $index }">
        <el-button
          type="primary"
          size="small"
          icon="User"
          :disabled="row.level == 4 ? true : false"
          @click="addMenu(row)"
          v-has="`btn.Permission.add`"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="Edit"
          :disabled="row.level == 1 ? true : false"
          @click="updateMenu(row)"
          v-has="`btn.Permission.update`"
        >
          编辑
        </el-button>

        <el-popconfirm
          :title="`你确定删除${row.name}吗`"
          width="200px"
          @confirm="deleteMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              :disabled="row.level == 1 ? true : false"
              v-has="`btn.Permission.remove`"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件，用来添加或者更新已有的菜单数据结构 -->
  <el-dialog
    v-model="dialogVisible"
    :title="MenuParams.id ? '编辑菜单' : '添加菜单'"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="MenuParams" ref="ruleFormRef" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请输入菜单名称"
          v-model="MenuParams.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input placeholder="请输入权限" v-model="MenuParams.code"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu/index.ts'
import type {
  PermissionResponseData,
  PermissionList,
  MenuParamsTs,
  Permission,
} from '@/api/acl/menu/type.ts'
import { ElMessage } from 'element-plus'

// 收集某个菜单的数据
let MenuParams = reactive<MenuParamsTs>({
  // code是权限值
  code: '',
  // 菜单等级
  level: 0,
  name: '',
  // pid是当前菜单的父菜单id
  pid: 0,
})
//
let dialogVisible = ref(false)
// 组件挂载完毕就获取所有菜单
onMounted(() => {
  getHasPermission()
})
// 存放所有 菜单的数组
let PermissionArr = ref([])
//获取所有菜单
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission()
  if (result.code == 200) {
    console.log('all menu', result.data)
    PermissionArr.value = result.data
  }
}
const addMenu = (row: Permission) => {
  // 全部批量清空
  Object.keys(MenuParams).forEach((key) => {
    MenuParams[key] = '' // 或者 obj[key] = undefined;
  })
  //因为添加菜单的话还需要 父菜单的id 作为pid, 以及其level+1作为子菜单的id
  MenuParams.pid = row.id
  MenuParams.level = row.level + 1
  console.log('row', row)
  console.log(' MenuParams', MenuParams)
  dialogVisible.value = true
}
const updateMenu = (row) => {
  console.log('update_row', row)
  Object.keys(MenuParams).forEach((key) => {
    MenuParams[key] = '' // 或者 obj[key] = undefined;
  })
  Object.assign(MenuParams, row)
  dialogVisible.value = true
}
//提交菜单修改
const save = async () => {
  // 新增或者更新已有菜单
  let result = await reqAddOrUpdateMenu(MenuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: MenuParams.id ? '更新成功' : '添加成功',
    })
  }
  dialogVisible.value = false
  // 再次渲染最新列表
  getHasPermission()
}
const deleteMenu = async (id: number) => {
  let result = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 再次渲染最新列表
    getHasPermission()
  }
}
</script>
<style scoped></style>
