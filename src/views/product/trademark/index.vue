<template>
  <el-card class="box-card">
    <!-- 添加卡片内容 -->
    <el-button
      type="primary"
      icon="Plus"
      @click="addTrademark"
      v-has="`btn.Trademark.add`"
    >
      添加品牌
    </el-button>
    <!-- 表格组件 -->
    <!-- table:---border:可以设置表格纵向是否有边框
         table-column:---label:某一个列表 ---width:设置这列宽度 ---align:设置这一列对齐方式    
        -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        align="center"
        prop="tmName"
      ></el-table-column>
      <!-- prop底层 用的是div装的每一个tmName -->
      <el-table-column label="品牌LOGO" align="center">
        <!-- row 是数组里的每一个元素，也就是一个obj对象 -->
        <!-- 当 不用div时 就要插槽 -->
        <template #="{ row, column, $index }">
          <img :src="row.logoUrl" alt="" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作" align="center">
        <template #="{ row, column, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
            v-has="`btn.Trademark.update`"
          ></el-button>

          <el-popconfirm
            :title="`确定删除品牌 ${row.tmName}吗`"
            width="250px"
            icon="Delete"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                v-has="`btn.Trademark.remove`"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 分页器组件
            pagination
                v-model:current-page:设置分页器当前页码
                v-model:page-size:设置每一个展示数据条数
                page-sizes:用于设置下拉菜单数据
                background:设置分页器按钮的背景颜色
                layout:可以设置分页器六个子组件布局调整， 其中-> 表示将该符号的右侧部分 右对齐
        -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :small="small"
      :disabled="disabled"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>

  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    width="30%"
    :before-close="handleClose"
  >
    <!-- :model表示数据收集在哪里，rules表示规则是什么 -->
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" lable-width="100px" required prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="品牌logo"
        lable-width="100px"
        required
        prop="logoUrl"
      >
        <!-- 将图片上传至服务器的请求路径加上/api1/, 否则代理不了 -->
        <el-upload
          class="avatar-uploader"
          action="/api1/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  Trademark,
} from '@/api/product/trademark/type'

// 获取el-form 组件实例
let formRef = ref()
const dialogFormVisible = ref(false)
// 当前页码
let pageNo = ref<number>(1)
// 每页显示条数
let pageSize = ref<number>(10)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据,是一个数组
let trademarkArr = ref<Records>([])
// 用来在对话框中展示已经成功上传的图片
// const imageUrl = ref('')

// 定义收集新增品牌的容器(object)
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
  id: '',
})

// 上传新品牌的logo之前的勾子函数，先检查
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log('rawFile', rawFile)
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('Avatar picture must be JPG/png/gif format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
  // console.log('rawFile',rawFile)
}

// 图片上传成功的勾子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  console.log('chenggong', response)
  console.log('uploadFile', uploadFile)
  trademarkParams.logoUrl = response.data
  //如果图片上传成功， 清除掉对应图片校验的错误提示
  formRef.value.clearValidate('logoUrl')
}
// 校验validatorTmName, 每一个字段的校验方法要写在rules前面
const validatorTmName = (rule: any, value: any, callback: any) => {
  // value是表单元素的值
  // callback是回调函数，
  console.log('validatorTmName')
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称长度要大于等于2'))
  }
}
const validatorlogoUrl = (rule: any, value: any, callback: any) => {
  // value是img的地址,如果上传图片成功了，一定会有值
  // callback是回调函数，
  console.log('validatorlogoUrl')
  console.log('validatorlogoUrlvalue1', rule)
  console.log('validatorlogoUrlvalue', value)
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片要上传'))
  }
}

//表单校验规则对象
const rules = {
  tmName: [{ required: true, validator: validatorTmName, trigger: 'blur' }],
  // 图片上传 用trigger没用
  logoUrl: [{ required: true, validator: validatorlogoUrl }],
  // age: [{ validator: checkAge, trigger: 'blur' }]
}

// 当更改当前页码时，子组件 pagination 给父组件传了 val 也就是跳转后的页码
// 这里我们不需要用到val，以为current-page已经是v-model

// 每次点击 选择展示某一页按钮时，获取点击的页码，获取每， 并发送axios请求
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val},page-size: ${pageSize.value}`)

  getHasTrademark()
}

// 每当 每页显示的条数发生改变时,就默认显示第一页，子组件 pagination 给父组件传了 val 也就是跳转后的每页条数
// 这里我们不需要用到val，以为page-size已经是v-model
const handleSizeChange = async (val: number) => {
  console.log(`${val} items per page`)
  pageNo.value = 1
  getHasTrademark()
}
// 获取 已有品牌的接口封装为一个函数：在任何情况下获取数据，调用该函数即可
const getHasTrademark = async () => {
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    pageSize.value,
  )
  console.log('fenye1', result.data)
  if (result.code == 200) {
    //   存储已有品牌总个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
  // return res
}
const addTrademark = () => {
  // 每次操作之前 清空上次收集到的数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = null
  dialogFormVisible.value = true

  //第一次点击"添加品牌"调用，dialogFormVisible刚刚转为true,函数还在执行中，还没有去渲染模版,v-if 控制 el-form元素还不存在
  // el-form 此时用formref 还拿不到,直接使用formRef.value.clearValidate会报错
  // console.log('formRef.value',formRef.value)
  //解决办法1: 用ts的写法 加一个?，当formRef.value存在时，再删掉上次的错误提示
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  // 解决办法2: 使用nexttick, 等addTrademark函数执行完更新模板之后，再获取formref
  nextTick(() => {
    console.log('formRef.value', formRef.value)
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// row 是edit选中的数据obj
const updateTrademark = (row) => {
  // 清空校验规则的错误提示
  nextTick(() => {
    console.log('formRef.value', formRef.value)
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  console.log('本次要修改的数据', row)
  // 每次操作之前 清空上次收集到的数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = null
  dialogFormVisible.value = true
  // 展示已有品牌的数据(本次要修改的数据)
  // 使用es6语法 快速把row的属性值都赋值给trademarkParams
  Object.assign(trademarkParams, row)
  // trademarkParams.tmName =row.tmName
  // trademarkParams.logoUrl= row.logoUrl
  // trademarkParams.id = row.id
}

const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  //因为logourl没法用trigger 时机校验，只能当用户点击确认时，触发校验
  // formRef.value.validate返回一个promise对象，如果校验都通过 则fullfilled, 否则reject
  // await 只会当得到成功的promise才会继续往下执行
  // 控制台 出现error没捕捉怎么办，用下面的方法防止console态出现红色error
  let checkResult = null
  try {
    checkResult = await formRef.value.validate()
    console.log('checkResult', checkResult)
  } catch {
    console.log('cuowu')
    return
  }

  // 如果用try catch， 又阻塞不了

  // checkResult.then(
  // ()=>{
  //     console.log('输入正确')
  // }
  // ).catch(()=>{
  //     console.log('输入异常')
  // })
  console.log('继续执行了')
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  console.log('result1202', result)
  // 添加品牌成功
  dialogFormVisible.value = false
  if (result.code == 200) {
    // 关闭对话框

    // 提出提示框，提示成功/失败
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })

    getHasTrademark()
    // 操作完之后应该清空收集到的数据trademarkParams， 放在每次操作之前
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}

//删除功能的按钮
// 点击删除框的确定按钮 触发了confirm事件 改事件绑定了removeTradeMark 函数
const removeTradeMark = async (id: number) => {
  console.log('去删除id', id)
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 如果删除成功还要重新去获取全部数据，展示列表
    // 从服务器获取全部的新数据，重新渲染列表
    // 但是如果在删除之前当前页只有1条记录，更新后就显示前一页(更改pageNo)
    trademarkArr.value.length > 1 ? pageNo.value : (pageNo.value -= 1)
    console.log('pageNo.value', pageNo.value)
    getHasTrademark()
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}

//组件一挂载  就去请求第一页的数据
onMounted(() => {
  console.log('guazai')
  // 直接调用函数就行了
  getHasTrademark()
  console.log('diaoyong')
  // let res=getHasTrademark();
  // res.then((value)=>{
  //     console.log('value',value.data.records)

  // }).catch(error)(()=>{
  //     console.log('error,',error.message)
  // })
})
// const removeTradeMark=(id)=>{
//     console.log('row.id')
// }
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
