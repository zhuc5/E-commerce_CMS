<template>
  <div>
    <!-- 用到三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
          v-has="`btn.Spu.add`"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0px" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <!-- show-overflow-tooltip 隐藏多余文字 -->
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <!-- 因为有四个按钮所以必须用template -->
            <template #="{ row, $index }">
              <!-- button 不写innertext了直接写title -->
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                v-has="`btn.Spu.addsku`"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="编辑SPU"
                v-has="`btn.Spu.update`"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                v-has="`btn.Spu.skus`"
                @click="findSku(row)"
              ></el-button>

              <el-popconfirm
                :title="`你确定删除${row.spuName}吗`"
                width="200px"
                @confirm="deleteSpu(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                    v-has="`btn.Spu.delete`"
                  ></el-button>
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
          :small="small"
          :background="background"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="changeSize"
          @current-change="getHasSpu"
        />
      </div>
      <!-- v-show v-if  都可以 但前者只需要挂载1次 -->
      <!-- changeScene 是绑定子组件身上的切换场景自定义事件，如果子组件去触发了该事件就让本父组件关闭spuform的显示 -->
      <SpuForm
        ref="spu"
        @changeScene="changeScene"
        v-show="scene == 1"
      ></SpuForm>
      <SkuForm
        ref="sku"
        @changeScene="changeScene"
        v-show="scene == 2"
      ></SkuForm>
      <!-- 展示sku列表 -->
      <!-- el-dialog 的model 直接控制显示与否 -->
      <el-dialog v-model="showSkuList" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名称" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
                alt=""
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqSkuList, reqHasSpu, reqRemovSpu } from '@/api/product/spu'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import type {
  HasSpuResponseData,
  SpuDat,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
// 获取子组件实例spuForm
let spu = ref<any>(null)
// 获取子组件实例skuForm
let sku = ref<any>(null)
// scene 0:显示已有spu,1:添加或者修改已有spu,2:添加sku
let scene = ref<number>(0)
//当前页码
let currentPage = ref<number>(1)
//一页显示几个
let pageSize = ref<number>(3)
// 定义变量接收 每次请求获得的spu数据，是一个数组，每一个元素是一个spu品牌信息
let records = ref<Records>([])
let total = ref<number>(0)
//存储全部的sku数据,用来“查看sku”列表展示
let skuArr = ref<SkuData[]>([])
// 变量控制 展示 sku列表 的el-dialog显示与否
let showSkuList = ref<boolean>(false)

watch(
  () => categoryStore.c3Id,
  (newValue, oldValue) => {
    console.log('categoryStore.c3Id变化了', newValue)
    // 务必保证c3id不为空
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 一旦三级分类id变化或者分页器页数变化 就重新发送 请求 获取spu数据
// 所以把请求 spu数据 封装为一个函数
const getHasSpu = async () => {
  let result = await reqHasSpu<any, HasSpuResponseData>(
    currentPage.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 每页展示个数变化时 重新请求，并且默认展示第一页
const changeSize = () => {
  currentPage.value = 1
  getHasSpu()
}
// 添加新的spu按钮的回调
const addSpu = () => {
  // 点击该按钮 场景切换到编辑spu界面
  scene.value = 1
  //新增加spu 需要获得所有品牌，所有销售属性，其他的都是空
  // 父组件调用子组件的方法，去让子组件去 调取所有销售属性，所有品牌
  // 这里父组件要将c3id 三级分类传给子组件
  spu.value.initAddSpu(categoryStore.c3Id)
}
//修改已有spu按钮的回调
const updateSpu = (row: SpuData) => {
  // 点击该按钮切换到编辑spu
  scene.value = 1
  console.log('row', row)
  // 如果我们用的是v-if 那么点击updateSpu要用nexttick 才能拿到ref子组件的实例
  console.log('spu.value', spu.value)
  // 就可以用该vc实例去调用其方法
  // 父组件中获得了子组件实例 然后调用该实例的方法
  //父组件决定何时调用 子组件 ，并且向其传spu数据
  spu.value.initHasSpuData(row)
}

// 子组件spuForm 绑定了自定义事件changeScene： 目的让子组件在编辑spu信息完成后通知父组件去切换场景
// 并且在父组件中 重新获得渲染全部数据
const changeScene = (obj: any) => {
  // 传了一个对象 包含flag场景,params告知父组件是添加属性还是更新属性
  scene.value = obj.flag

  console.log('obj.params', obj.params)
  if (obj.params == 'add') {
    // 如果是添加属性后，就回到第一页
    // 如果是更新就渲染当前页
    currentPage.value = 1
  }
  getHasSpu()
}
// 点击添加sku的按钮， addSku时要切换到场景2 scene=2 显示skuForm组件
const addSku = (row: SpuData) => {
  scene.value = 2
  //调用子组件的方法初始化添加sku数据
  // 因为平台属性(需要三个级别的id), 本spu的销售属性和图片需要(当前spu数据)
  // 平台属性 就是属性管理里面的
  // 需要父组件向子组件传数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
const findSku = async (row: SpuData) => {
  console.log('skurow', row)
  let result: SkuInfoData = await reqSkuList(row.id as number)
  // reqSkuList
  console.log('SkuInfoData', result)
  if (result.code == 200) {
    skuArr.value = result.data
    // 把对话框显示出来
    showSkuList.value = true
  }
}
// 删除已有spu
const deleteSpu = async (spuId: number) => {
  let result: any = await reqRemovSpu(spuId)
  console.log('delete spu', result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取最新spu数据 更新列表
    // 回到哪一页 如果 当前页本来就只有1 个就回到商业，就回到上一页；否则留在本页
    //
    currentPage.value =
      records.value.length > 1 ? currentPage.value : currentPage.value - 1
    currentPage.value = Math.max(currentPage.value, 1)
    getHasSpu()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由切换出去的时候 在销毁组件之前 要清空store
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style scoped></style>
