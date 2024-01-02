<template>
  <!-- <el-input v-model="input" type="password" placeholder="Please input password" show-password /> -->

  <div>
    <!-- 引入全局组件三级分类 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
          v-has="`btn.Attr.add`"
        >
          添加属性
        </el-button>
        <el-table style="margin: 10px 0px" border :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            align="center"
            width="120"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" align="left">
            <template #="{ row, $index }">
              <!-- row 就是每个属性对象,里面的attrValueList是一个数组 -->
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
                v-has="`btn.Attr.update`"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}吗`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    v-has="`btn.Attr.remove`"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 属性编辑界面 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          ref="btn"
          @click="addAttrValue"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
        >
          添加属性值
        </el-button>
        <!-- 下面的取消按钮点击了就会回到列表界面 -->
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          ref="table"
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
          ></el-table-column>
          <!-- <el-table-column label="属性值名称" prop="valueName"></el-table-column> -->
          <el-table-column label="属性值名称">
            <!-- 还是要用temp(row,index) 否则拿不到attrValueList的每一个属性值对象的所有字段(里面了属性id,属性值id,属性值) -->
            <!-- row是每一个属性值对象(其valuename刚开始是空，用input v-model收集用户输入值)，是attrParams.attrValueList的每一个元素,-->
            <template #="{ row, $index }">
              <!-- ref="refInput" -->
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                size="small"
                v-if="row.showInput"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值"
                v-model="row.valueName"
              ></el-input>
              <!-- 用户输入完属性值 blur后 使得input消失，使得刚才添加的数据直接显示在table里 -->
              <span v-if="!row.showInput" @click="toEdit(row, $index)">
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="default"
                @click="attrParams.attrValueList.splice($index, 1)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>

        <el-button type="primary" size="default">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  beforeCreate() {
    console.log('beforecreate')
    // immediate: true 导致watch比beforeCreate还要进行
  },
}
</script>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  onBeforeUnmount,
  watchEffect,
  nextTick,
  ref,
  reactive,
  watch,
  onMounted,
  onBeforeMount,
} from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, AttrList, Attr } from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()
let refInput = ref(null)
let table = ref(null)
const inputArr = ref([])
let btn = ref(null)
const input = ref('')

//存储已有的属性&属性值
let attrArr = ref<AttrList>([])
// 定义 控制card组件内容切换的变量
//scene=0 展示属性/属性值列表，1展示添加/修改属性的编辑界面，v-show
let scene = ref<number>(0)
// 控制编辑模式与查看模式的切换 input/span
let showInput = ref<Boolean>(false)

//收集新增的属性的数据
// 每次打开编辑属性的界面 只能对一个（当前的）属性 添加/删除属性值
let attrParams = reactive<Attr>({
  attrName: '', // 新属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', // 已有属性归属于三级分类的哪个类的id
  categoryLevel: 3, // 属性都是属于三级分类的
})

// 组合api watch
// 只有当c3id 有了值或者变化是才会触发
// 注意 一定要用patch 修改store.state才能保证每次数据变化 都被监视到
// setInterval(()=>{
//     console.log('使用const的categoryStore', categoryStore.c3Id)
// },1000)
// 因为immediate: true导致watc

console.log('setup')
// console.log('my1',my1)
// setTimeout(()=>{
//     console.log('my1',my1)
// },2000)
const my1 = 1
const my1f = () => {
  console.log('dayin')
  console.log('my1', my1)
}
my1f()

//  注意箭头函数 是函数表达式 ，没有 变量提升

watch(
  () => categoryStore.c3Id,
  (newValue, oldValue) => {
    // 一旦三级分类变化，就去清空attrArr
    attrArr.value = []
    console.log(
      ' categoryStore.c3Id变化了',
      'newValue:',
      newValue,
      'oldValue:',
      oldValue,
    )
    console.log('categoryStore.c3Id', categoryStore.c3Id)
    // 获取分类的id
    // 想以下这样直接解构，没有响应式，不过这里不需要响应式
    // old
    getAttr()
    // 删掉immediate: true，初始化时就不会调用，初始化时就不会getAttr 因此不会报错
    // 也是因为getAttr 用的是const， 没有变量提升，导致watch初始化时不知道getAttr 是什么
    // 如果设置了immediate: true watch的回调会比beforecreate还要早执行 newvalue='', oldvaulue undefined
    // , immediate: true
  },
  { deep: true },
)
// 如果把watch immediate: true 改成onMounted ，定义在getAttr()前面也不会出错
// onMounted(()=>{
//     console.log('onm')
//     getAttr();
// })

// 获取已有的属性与属性值的方法
const getAttr = async () => {
  console.log('zhixingle')
  const { c1Id, c2Id, c3Id } = categoryStore
  // 一定要确保三个级别分类 都有值了，才发送请求
  if (c1Id && c2Id && c3Id) {
    const result = await reqAttr(c1Id, c2Id, c3Id)
    console.log('获取已有的属性与属性值', result)
    if (result.code == 200) {
      attrArr.value = result.data
      // 这里因为属性值比较多， 可以给axios超时时间设置长一点
      console.log('attrArr)', result.data)
    }
  }
}
// 添加属性按钮的回调
const addAttr = () => {
  // 每次点击添加属性后
  // 先清空 attrParams
  // Object.assign 批量赋值
  Object.assign(attrParams, {
    attrName: '', // 新属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: '', // 已有属性归属于三级分类的哪个类的id
    categoryLevel: 3, // 属性都是属于三级分类的
  })
  // 要清空inputArr，确保每次点击添加属性后，inputArr一开始的长度为0
  // el-input已经使用v-if为何要手动清空inputArr？
  // inputArr.value=[]

  console.log('inputArr在每次击添加属性后 attrValueList改变后', inputArr.value)
  setTimeout(() => {
    // attrValueList已经清空
    console.log('attrParams在每次击添加属性后', attrParams.attrValueList)
    console.log(
      'inputArr在每次击添加属性后 attrValueList改变后1ms',
      inputArr.value,
    )
  }, 1000)

  // 切换到添加/编辑属性界面，第2个div
  scene.value = 1
  // 用户点击添加属性 就要把三级分类id 赋值给 attrParams的categoryId
  attrParams.categoryId = categoryStore.c3Id
  console.log(' attrParams.categoryId ', attrParams.categoryId)
}
// 编辑属性按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 编辑属性和添加属性逻辑基本一样
  // 只不过要将当前row(一个属性对象 赋值给attrParams(让编辑界面一开始就有属性值展示), 并且是深拷贝
  // 因为attrParams的attrValueList是一个数组，如果是浅拷贝 会导致 编辑界面的attrParams的attrValueList
  // 直接影响row(当前行的属性对象)的属性值导致用户不用点保存(提交) 也能直接成功修改属性了
  // 应当让row，attrParams 保持独立，只有点击了保存后，attrParams提交最新数据到服务器，

  //row 因为调用getAttr()而展示最新属性/值 才对
  // 深拷贝 loadash 也可以
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 取消按钮点击了 就回到列表界面
const cancel = () => {
  scene.value = 0
}
// 用户输入了新增属性名称(确保有值)，然后点击了 “添加属性”的按钮，该函数执行
const addAttrValue = () => {
  // 一旦用户点击 添加属性值，就显示input
  // 用户blur后 ，隐藏input， 刚才添加的属性值 显示在span里
  showInput.value = true
  console.log('去添加属性值')
  attrParams.attrValueList.push({
    // attrId: 1,
    // id: 2,
    valueName: '',
    // 属性值一开始是编辑模式(显示input)
    showInput: true,
    refInput: 'ri',
  })
  //一开始就显示input,并且自动 让input获取焦点
  nextTick(() => {
    // 虽然直接ref-input 也可以，但还是ref inputArr好
    //  refInput.value.focus()
    // 这里的index 不要用inputArr.value本身的长度-1 了，会出错
    inputArr.value[attrParams.attrValueList.length - 1].focus()
    setTimeout(() => {
      console.log('inputArr.value 在每次添加属性值后 2s', inputArr.value)
    }, 2000)
  })
  // 跳出 填写属性值的输入框
  // 获取用户输入属性值
  //table中呈现
}
//属性值input框blur 触发 切换到查看模式
const toLook = (row, $index) => {
  //如果用 v-if inputArr.value 是一个数组 长度正确，但是每一个元素打印是空值
  // v-show就正常
  // 为什么 切换到 查看模式之前 showinput是true啊，el-input节点还存在并且value也有啊

  console.log('inputArr.value', inputArr.value)
  // const btn=ref()
  console.log('table', table.columns)

  // 非法情况1： 不允许输入空的属性值
  if (row.valueName.trim() == '') {
    // 输入为空就删掉当前行
    // $index 刚好就是attrValueList的index
    attrParams.attrValueList.splice($index, 1)

    // 提示信息

    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    nextTick(() => {
      console.log('删除空行后', inputArr.value)
      console.log(
        '删除空行后attrParams.attrValueList',
        attrParams.attrValueList,
      )
    })
    return
  }
  // 非法情况2： 不允许输入重复的属性值（只限于在当前valuelist查找）
  // 以后再写
  console.log('失去焦点的行', row)
  row.showInput = false
}
const toEdit = (row, $index) => {
  console.log('获取焦点的行', row)
  ;(row.showInput = true),
    //接着 显示input, 并且自动 让input获取焦点

    nextTick(() => {
      // refInput.value.focus()
      // // refInput是空值？
      // setTimeout(()=>{
      //     console.log('查看refInput', refInput)
      // },3000)
      //  console.log('查看refInput', refInput)
      //  console.log('查看refarr', refarr)
      console.log('$index', $index)
      inputArr.value[$index].focus()
    })
}
// const setRefFocus=(el)=>{
//     console.log('el', el)
//     if(el?.ref!==undefined){
//         console.log('focus le ')
//         el.ref.focus()
//     }

// }

// 删除属性
const deleteAttr = async (id: number) => {
  let result: any = await reqRemoveAttr(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取最新列表
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//保存按钮的回调，一旦用户点击保存，发送post 请求 ，更新数据到服务器
const save = async () => {
  console.log('保存前查看attrParams', attrParams)
  // 发送请求前 先检查一下
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
  } else {
    // 提示失败信息
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
  // 切换到属性列表界面
  scene.value = 0
  // 获取最新的所有属性&属性值，并展示
  getAttr()
}

onMounted(() => {
  console.log('onMounted')
  watchEffect(() => {
    console.log('inputArr变化了', inputArr.value.length)
  })
})

console.log('setup结束') // 这句打印完了，写在setup里的onmounted 的回调函数还没执行

// 路由切换出去的时候 在销毁组件之前 要清空store
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style scoped></style>
