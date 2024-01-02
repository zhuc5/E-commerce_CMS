<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb />
    </div>
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>
<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>
<style scoped lang="scss">
.tabbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  /* background-color: yellow; */

  .tabbar_left,
  .tabbar_right {
    width: 30%;
  }

  .tabbar_left {
    display: flex;
    /* background-color: cyan; */
    align-items: center;
    margin-left: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    justify-content: end;
  }
}
</style>
