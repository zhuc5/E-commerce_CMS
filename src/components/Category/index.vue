<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- label 显示 每个菜单的选项， value将用户点击的那一项显示到框里 -->
        <el-select
          :disabled="props.scene == 1"
          v-model="categoryStore.c1Id"
          @change="handlec1IdChange"
        >
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="props.scene == 1"
          v-model="categoryStore.c2Id"
          @change="handlec2IdChange"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="props.scene == 1" v-model="categoryStore.c3Id">
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
// 引入分类接口方法
// import { reqC1 } from '@/api/product/attr'
// 引入生命周期函数
import { onMounted } from 'vue'
// 因此分类相关的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

// 接收父组件attr.index vue 传来的数据,scene来控制自己是否禁用下拉菜单(el-select)
let props = defineProps(['scene'])

// 为了使组件共享获得到的分类数据，应该将分类数据储存在store仓库中
// 存储一级分类的数据,一开始是空数组
// let c1Arr = ref < any > ([]);
// 表单中收集的一级分类的id
// let c1Id = ref < number | string > ('');

// 当当前组件一挂载完毕的时候 就去请求一级分类的数据
onMounted(() => {
  getC1()
})
// 获取一级分类的方法
const getC1 = async () => {
  console.log('去获取一级分类数据')
  categoryStore.getC1()
  // let result: any = await reqC1();
  // if(result.code==200){
  //     console.log('一级分类数据', result.data)
  //     c1Arr.value= result.data
  // }else{

  // }
}

// 此方法即为 一级分类下拉菜单的change 事件
//在此方法中得到用户新选择的一级分类，接着去通知store请求二级分类
// 并且附带了参数 就是新选中那项的value,这里就是id
const handlec1IdChange = (val: any) => {
  // console.log('一级菜单变化了', val)

  // 当一级分类变化时， 先清除将2，3 级已选项清除
  categoryStore.$patch({
    c2Id: '',
    c3Arr: [],
    c3Id: '',
  })

  // 获取二级分类
  categoryStore.getC2()
}
//此方法即为 二级分类下拉菜单的change 事件
// handlec2IdChange = (val)=>
const handlec2IdChange = () => {
  // 二级分类重置，就清空三级分类
  // categoryStore.$patch({
  //     c3Id: '',

  // })

  categoryStore.c3Id = ''
  categoryStore.getC3()
}
</script>
<style scoped></style>
