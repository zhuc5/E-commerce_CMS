// 小仓库： 管理layout 组件布局配置
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 控制菜单是否折叠
      refresh: false, // 仓库这个属性用于控制刷新页面
      color: 'rgba(255, 69, 0, 0.68)',
    }
  },
})
export default useLayOutSettingStore
