<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
onLaunch(() => {
  
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
  
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import './uni_modules/vk-uview-ui/index.scss';
@import url('./common/iconfont.css');
</style>
