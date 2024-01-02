<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好呀 {{ userStore.username }}</h3>
        <p class="subtitle">好物甄选平台</p>
      </div>
    </div>
  </el-card>
  <div class="bp">
    <SvgIcon name="welcome" width="500px" height="500px"></SvgIcon>
  </div>
</template>
<script setup lang="ts">
import { getTime } from '@/utils/time'
import { onMounted } from 'vue'
import useUserStore from '../../store/modules/user.ts'
// 获取用户相关仓库
let userStore = useUserStore()
// 一旦home首页加载完毕 就去发送请求 获取用户信息， 一定要在request(axios的实例)中的headers设置token带给服务器(在请求拦截器中设置)
onMounted(() => {
  userStore.userInfo()
})
</script>
<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: grey;
    }
  }
}
.bp {
  display: flex;
  justify-content: center;
}
</style>
