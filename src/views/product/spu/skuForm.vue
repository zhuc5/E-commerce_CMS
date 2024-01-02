<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="重量(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性" class="pingtai">
      <!-- 里面还是一个form 但是 行内form -->
      <!-- 这里可以用el-row, column控制每行放几个 -->
      <!-- 平台属性里面有几个子item 应该和attrArr里面的属性相对应 -->
      <el-form :line="true">
        <!-- item 是每一个属性 -->
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <!-- 每一个option 的value需要收集属性id和属性值id,整理形式为字符串"属性id:属性值id" -->
            <el-option
              v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form>
        <el-form-item
          :label="item.saleAttrName"
          v-for="(item, index) in saleArr"
          :key="item.id"
        >
          <el-select placeholder="请选择品牌" v-model="item.saleIdAndValueId">
            <el-option
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
              :label="saleAttrValue.saleAttrValueName"
              :key="saleAttrValue.id"
              :value="`${item.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table" @select="handleselect">
        <!-- 有一列的是勾选框 -->
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, reactive } from 'vue'
// 引入请求的api
// 获取对应分类下已有的属性与属性值 api
import { reqAttr } from '@/api/product/attr/index.ts'
//SkuData
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 获取该spu下的已有销售属性，图片 接口
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
// 获取图片表格实例
let table = ref(null)
// 创建变量 来储存数据
// 平台属性数组，每一个元素是平台属性
let attrArr = ref<any>([])
// 该spu 已有销售属性
let saleArr = ref<any>([])
// 该spu 已有images
let imgArr = ref<any>([])
// 收集sku参数
let skuParams = reactive<SkuData>({
  // 前3个数父组件传过来的
  category3Id: '',
  spuId: '',
  tmId: '', // spu品牌id
  // 以下4个用v-model收集
  skuName: '',
  weight: '',
  price: '',
  skuDesc: '',
  //平台属性的收集
  skuAttrValueList: [
    // 数组就先空着
    // {
    //     'attrId': "",// 平台属性的id
    //     'valueId': ""// 平台属性值的id
    // }
  ],
  // 销售属性的收集
  skuSaleAttrValueList: [
    // {
    //     'saleAttrId': "",// 销售属性的id
    //     'saleAttrValueId': ""//销售属性值的id
    // }
  ],
  skuDefaultImg: '', // sku图片地址
})

// 场景切换
let $emit = defineEmits(['changeScene'])

// 当前子组件的方法对外暴露，让父组件调用自己的方法(用户按下添加sku按钮时)
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 先清空skuparams
  // 每次编辑 新的spu属性之前，先清空容器
  Object.assign(skuParams, {
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',
    weight: '',
    price: '',
    skuDesc: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: '',
  })
  console.log('skuParams', skuParams)
  console.log('获取添加SKU需要的数据在这发请求')
  console.log(c1Id, c2Id, spu.category3Id)

  // 收集父组件传来的3个字段
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  // 获取属性管理模块的 平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  console.log(result)
  // 获取当前spu的已有销售属性,spu.id是spu的id
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  console.log(result1)
  // 获取当前spu的图片
  let result2: any = await reqSpuImageList(spu.id)
  console.log(result2)
  // 容器变量接收数据,平台属性
  attrArr.value = result.data
  // 该spu 已有销售属性
  saleArr.value = result1.data
  // 该spu 已有images
  imgArr.value = result2.data
  console.log('imgArr', imgArr)
}

// 设置默认图片的方法 回调
const handler = (row: any) => {
  // row 就是每一个图片对象
  console.log('图片', row)

  console.log('skuParams', skuParams)
  // 让 当前行的勾选框 勾选上
  // 并且 一个sku只能选一张图
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })

  table.value.toggleRowSelection(row, true)
  // 收集当前选中的img url
  skuParams.skuDefaultImg = row.imgUrl
}
// // 当用户 点击某个勾选框 也可以设置默认图片,这个函数在当前点击的行被选中以后
const handleselect = (selection, row) => {
  console.log('row变化了', row)

  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })

  table.value.toggleRowSelection(row, true)

  //用户本次点击的图片存入skuparam
  skuParams.skuDefaultImg = row.imgUrl
  // nextTick(()=>{
  //     console.log('selection', selection)
  // 这里每次section的长度都是2个，因为这个section是在前1个还没被删掉，本次这个已经加入时获取到的
  // })
}
const cancel = () => {
  // 通知 父组件去切换场景，收起skuForm，显示spu列表
  // params不用带参数，就留在本页
  $emit('changeScene', { flag: 0, params: '' })
}
const save = async () => {
  // 如果 把自己临时放在容器变量(attrArr,saleArr,imgArr)中(收集用户输入的) 的数据传给 skuParams
  //1. 平台属性attrArr数组里面的attrIdAndValueId 处理放入skuParams.skuAttrValueList
  // 搞一个临时变量 接收 reduce返回的结果，init_value=[]
  let attrArrs = attrArr.value.reduce((prev: any, next: any) => {
    // console.log('next',next)
    // console.log('next.attrIdAndValueId', next.attrIdAndValueId)
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      console.log('{attrId,valueId}', [attrId, valueId])
      prev.push({ attrId: Number(attrId), valueId: Number(valueId) })
      // prev.push({ attrId),"valueId": Number(valueId)})
      console.log('prev', prev)
    }
    return prev
  }, [])
  console.log('attrArrs', attrArrs)
  skuParams.skuAttrValueList = attrArrs // 也可以不借助 中间变量 attrArrs
  // 2. 销售属性saleArr数组里面的saleIdAndValueId 处理放入skuParams.skuSaleAttrValueList
  let saleArrs = saleArr.value.reduce((prev: any, next: any) => {
    // console.log('next',next)
    // console.log('next.attrIdAndValueId', next.attrIdAndValueId)
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      console.log('{saleAttrId,saleAttrValueId}', [saleAttrId, saleAttrValueId])
      prev.push({
        saleAttrId: Number(saleAttrId),
        saleAttrValueId: Number(saleAttrValueId),
      })
      // prev.push({ attrId),"valueId": Number(valueId)})
      console.log('prev', prev)
    }
    return prev
  }, [])
  skuParams.skuSaleAttrValueList = saleArrs
  skuParams.price = Number(skuParams.price)
  skuParams.weight = Number(skuParams.weight)
  // 发送添加sku的请求
  let result = await reqAddSku(skuParams)
  console.log('发送添加sku的请求', result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件切换场景为零，收起skuForm，显示spu列表
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}
defineExpose({ initSkuData })
</script>
<style scoped>
/* .el-form-item[label="平台属性"] */
.el-form-item.pingtai .el-form-item {
  margin: 10px 20px;
}
</style>
