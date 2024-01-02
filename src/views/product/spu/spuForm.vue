<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择品牌" v-model="SpuParams.tmId">
        <el-option
          v-for="(item, index) in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item type="textarea" label="SPU描述">
      <el-input
        placeholder="请输入描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- action 是向服务器发送请求上传图片 
                并且请求收到成功 就能立马显示 不用再get了
                list-type 是类型  当前picture-card是照片墙
                on-preview 是点击预览图片时触发的勾子
            -->
      <el-upload
        v-model:file-list="imgList"
        action="/api1/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <!-- v-model控制 el-dialog 是否显示-->
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- placeholder需要动态提示剩下还有几个销售属性没选择 -->
      <!-- 用户选择下拉菜单的一项后， 点击添加属性，我们需要得到 属性id&属性名，所以这2者需要收集 -->
      <!-- 所以每一个option value要展示id+name -->
      <el-select
        v-model="saleAttrIdAndValue"
        :placeholder="
          unSelectSaleAttr.length
            ? `还剩${unSelectSaleAttr.length}项选择`
            : '无'
        "
      >
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValue ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- table展示销售属性 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="80"
          align="center"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值" align="center">
          <!-- row是每一个销售属性 -->
          <template #="{ row, $index }">
            <!-- 以下key 好像不对 不能row. -->
            <!-- 以下每一个item都是一个属性的其中一个属性值 -->
            <el-tag
              style="margin: 0px 5px"
              effect="light"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              <!-- 以上表示删除就直接splice删了 -->
              {{ item.saleAttrValueName }}
            </el-tag>
            <!-- v-model="row.saleAttrValue" -->
            <el-input
              v-if="row.flag"
              placeholder="输入属性值"
              size="small"
              style="width: 100px"
              v-model="row.saleAttrValue"
              @keyup.enter="handleInputConfirm(row, $index)"
              @blur="handleInputConfirm(row, $index)"
            ></el-input>

            <el-button
              @click="toEdit(row)"
              v-else
              style="margin: 0px 5px"
              class="button-new-tag ml-1"
              size="small"
            >
              + 添加属性值
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template #="{ row, $index }">
            <!-- 直接获取到当前的属性index删除,row是每一个属性 -->
            <el-button
              type="primary"
              size="default"
              @click="saleAttr.splice($index, 1)"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import type { SpuData } from '@/api/product/spu/type'
import { ref, computed, nextTick } from 'vue'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  Trademark,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

const dialogImageUrl = ref<string>('')
const dialogVisible = ref(false)
let $emit = defineEmits(['changeScene'])
//存储已有的SPU这些数据
// 全部品牌
let AllTradeMark = ref<Trademark[]>([])
//spu图片
let imgList = ref<SpuImg[]>([])
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//存储已有的SPU对象 将来在本组件中展示
let SpuParams = ref<SpuData>({
  // id？新增的没有
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

//将来用户点击剩余未选择的销售属性下拉菜单时， 用el-seletc model收集用户的每一次的选项(value: id+name)
let saleAttrIdAndValue = ref<string>('')

// 子组件书写一个方法 暴露给父组件
const initHasSpuData = async (spu: SpuData) => {
  console.log('子组件的initHasSpuData方法')
  //存储已有的SPU对象,将来在模板中展示
  SpuParams.value = spu
  //spu:即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  console.log('获取全部品牌的数据', result.data)
  //获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  console.log('获取某一个品牌旗下全部售卖商品的图片', result1.data)
  //获取已有的SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储全部品牌的数据
  AllTradeMark.value = result.data
  // //SPU对应商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // //存储已有的SPU的销售属性
  console.log('服务器的', result2.data)
  saleAttr.value = result2.data
  console.log('result2.data', result2.data)
  console.log('saleAttr.value', saleAttr.value)
  // //存储全部的销售属性
  allSaleAttr.value = result3.data
}
// 点击预览图片时触发时 应当 显示dialog 该回调函数有一个参数
const handlePictureCardPreview = (uploadFile) => {
  console.log('查看照片')
  console.log('uploadFile', uploadFile)
  dialogVisible.value = true
  dialogImageUrl.value = uploadFile.url
}
const handleRemove = () => {
  console.log('删除照片')
}
const handleUpload = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('picture must be JPG/png/gif format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 3) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
// 对比 当前table 已有的销售属性 与全部销售属性 computed出还剩余可选的销售属性 放入select菜单中
let unSelectSaleAttr = computed(() => {
  let hsaleAttr = saleAttr.value.map((item) => item.saleAttrName)
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return !hsaleAttr.includes(item.name)
  })

  console.log('unSelectAttr', unSelectAttr)
  return unSelectAttr
})
// 用户点击“添加属性”按钮的回调
const addSaleAttr = () => {
  // 往 saleAttr数组中push新的属性（数据来源 saleAttrIdAndValue）
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValue.value.split(':')

  //  准备一个新的销售属性 对象 存放用户添加的属性
  let newSaleAttr: SaleAttr = {
    // 这里前2个 键和值同名 采用了es6简洁的写法
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  console.log('收集到的addSaleAttr', newSaleAttr)
  // 添加
  saleAttr.value.push(newSaleAttr)
  // 添加完后 得清空收集容器变量saleAttrIdAndValue
  saleAttrIdAndValue.value = ''
}
// row 是saleAttr数组里面的每一个销售属性
// “添加属性值”按钮的点击事件
const toEdit = (row: saleAttr) => {
  row.flag = true
  //每次添加前先清空input框
  row.saleAttrValue = ''
  // 获取焦点
  //  nextTick(() => {

  // })
}
//用来接收用户新增的属性值
// let inputValue = ref('')
const handleInputConfirm = (row, $index) => {
  console.log('row', row)
  // 如果同时多个行会怎么样，会导致当前正在编辑的input value 把值传给了其他行的input
  // 所以必须设置row.saleAttrValue，不能单单只用inputvalue
  // console.log('inputValue', inputValue)

  // 把新属性值放入 saleAttr数组对应$index的spuSaleAttrValueList列表中去
  // 创建房新增属性值的容器
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrValueName: row.saleAttrValue,
    saleAttrName: row.saleAttrName,
  }
  console.log('newSaleAttrValue', newSaleAttrValue)
  // row.spuSaleAttrValueList.push(newSaleAttrValue)
  // saleAttr.value[$index].SpuSaleAttrValueList.push(newSaleAttrValue)
  console.log('saleAttr.value', saleAttr.value)
  console.log('index', $index)
  console.log('saleAttr.value[$index]', saleAttr.value[$index])

  // 非法情况1 非空
  console.log('非空', row.saleAttrValue)
  if (row.saleAttrValue.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    row.flag = false
    return
  }
  // 非法情况2 判断是否与当前属性中的已有属性值重复
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == row.saleAttrValue
  })
  if (repeat) {
    // 不需要splice，因为此时 input中的属性值还没有push到数据源saleAttr
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    row.flag = false
    return
  }
  console.log('repeat', repeat)

  // push对象是push了对象的地址值
  console.log(
    'saleAttr.value[$index].spuSaleAttrValueList',
    saleAttr.value[$index].spuSaleAttrValueList,
  )
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //  直接以下用也可以
  //  saleAttr.value[$index].spuSaleAttrValueList.push(newSaleAttrValue)
  // 不能清空newSaleAttrValue 否则会影响到已经push到
  //saleAttr.value[$index].spuSaleAttrValueList的值，2者是同一个对象
  // Object.assign(newSaleAttrValue, {
  //     saleAttrValueName: '',
  //     saleAttrName: ''

  // })
  row.flag = false
}
const save = async () => {
  console.log('imgList', imgList)
  // 整理 数据 ，全部填入 SpuParams中
  // 1. 照片墙的数据
  // 因为服务器要求字段名imgName，imgUrl, 而照片墙容器 字段是name，url 所以还要转换
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      // 如果已经save过就直接用url， 还没有save过 就用response的data(其url是本地，不能拿来填上去)
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2. 整理销售属性的数据,saleAttr 是单独处理销售属性的容器
  console.log('saleAttr.value', saleAttr.value)
  console.log('SpuParams', SpuParams)
  SpuParams.value.spuSaleAttrList = saleAttr.value
  // 发送请求 把 SpuParams 带给服务器

  let result = await reqAddOrUpdateSpu(SpuParams.value)
  console.log('save', result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      //如果有id，那就说明是编辑属性
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 如果更新成功 就去切换场景
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      //如果有id，那就说明是编辑属性
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
const initAddSpu = async (c3Id: number | string) => {
  // 每次编辑 新的spu属性之前，先清空容器
  Object.assign(SpuParams.value, {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 还要清空照片墙和table中的数据
  imgList.value = []
  saleAttr.value = []
  // 清空el-select销售属性已选项
  saleAttrIdAndValue.value = ''

  // 接收父组件传来的三级分类id
  console.log('添加spu')
  //     category3Id: "",//收集三级分类的ID
  // spuName: "",//SPU的名字
  //     description: "",//SPU的描述
  //         tmId: '',//品牌的ID
  //             spuImageList: [],
  //                 spuSaleAttrList: [],
  // 现在只要从父组件获得 以上的 category3Id，其他都在本组件内获得
  // 全部销售属性& 品牌还是要发请求获得
  let result: AllTradeMark = await reqAllTradeMark()
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  AllTradeMark.value = result.data
  allSaleAttr.value = result3.data
  SpuParams.value.category3Id = c3Id
}

defineExpose({ initHasSpuData, initAddSpu })
</script>
<style scoped></style>
