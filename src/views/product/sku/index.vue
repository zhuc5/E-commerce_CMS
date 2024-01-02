<template>
  <!-- sku页面不再需要category -->
  <el-card>
    <el-table border style="margin: 10px" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        prop="skuName"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="skuDesc"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            style="width: 100px; height: 100px"
            alt=""
          />
        </template>
      </el-table-column>

      <el-table-column
        label="重量"
        prop="weight"
        width="150px"
      ></el-table-column>
      <el-table-column
        label="价格"
        prop="price"
        width="150px"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="250px">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
            v-has="`btn.Sku.updown`"
          ></el-button>
          <!-- <el-button type="primary" size="small" icon="Bottom"></el-button> -->
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            v-has="`btn.Sku.update`"
            @click="updateSku"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
            v-has="`btn.Sku.detail`"
          ></el-button>

          <el-popconfirm
            :title="`你确定删除${row.skuName}吗`"
            width="200px"
            @confirm="deleteSku(row.id)"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                v-has="`btn.Sku.remove`"
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
      :page-sizes="[10, 15, 20, 30]"
      :background="background"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="changeSize"
      @current-change="getHasSku"
    />
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="(item, index) in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="(item, index) in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" heigh="200px">
              <el-carousel-item
                v-for="(item, index) in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" alt="" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku/index.ts'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/product/sku/type.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
// 控制商品详情抽屉显示
let drawer = ref(false)
const radio1 = ref('Option 1')
//当前页码
let currentPage = ref<number>(1)
//一页显示几个
let pageSize = ref<number>(10)
// 定义变量接收 每次请求获得的spu数据，是一个数组，每一个元素是一个spu品牌信息
let skuArr = ref<SkuData[]>([])
let total = ref<number>(0)
// 获取商品详情需要的skuinfo容器
let skuInfo = ref<SkuData>({})

// 组件挂载完毕时就去请求sku数据
onMounted(() => {
  getHasSku()
})
const changeSize = () => {
  currentPage.value = 1
  getHasSku()
}
const getHasSku = async () => {
  let result = await reqSkuList(currentPage.value, pageSize.value)
  console.log('getHasSku', result)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
    console.log('skuArr', skuArr)
  }
}

//商品上下架管理
const updateSale = async (row) => {
  console.log('checksalerow', row)
  // 如果当前商品的isSale==1, 说明商品处于上架状态=》应该更新为下架
  // 否则相反
  if (row.isSale == 1) {
    let result = await reqCancelSale(row.id)
    if (result.code == 200) {
      ElMessage({ type: 'success', message: '下架成功' })
      getHasSku()
    }
  } else {
    let result = await reqSaleSku(row.id)
    if (result.code == 200) {
      ElMessage({ type: 'success', message: '上架成功' })
      getHasSku()
    }
  }
}
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员正在研发中' })
}
const findSku = async (row) => {
  // 打开商品详情抽屉
  drawer.value = true
  console.log('findskurow', row)

  // 发请求，获取商品详情
  let result: SkuInfoData = await reqSkuInfo(row.id)
  console.log('findsku result', result)
  skuInfo.value = result.data
  console.log('skuInfo', skuInfo)
}
const deleteSku = async (skuId: number) => {
  let result = await reqRemoveSku(skuId)
  console.log('deleteSku', result)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    currentPage.value =
      skuArr.value.length > 1 ? currentPage.value : currentPage.value - 1
    currentPage.value = Math.max(currentPage.value, 1)
    getHasSku()
  } else {
    ElMessage({ type: 'error', message: '系统数据不能删除' })
  }
}
// function cancelClick() {
//     drawer.value = false
// }
// function confirmClick() {
//     ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
//         .then(() => {
//             drawer.value = false
//         })
//         .catch(() => {
//             // catch error
//         })
// }
</script>
<style scoped>
.el-row {
  margin: 10px 0px;
}

.el-tag {
  margin: 5px;
}

.el-carousel__item img {
  /* color: #475669; */
  /* opacity: 0.75; */
  /* line-height: 100px; */
  width: 100%;
  height: 100%;

  margin: 0;
  /* text-align: center; */
}

/* .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
    } */
</style>
