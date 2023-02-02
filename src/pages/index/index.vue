
<template>
  <view class="content">
    <view class="top-area">
      这里放活动声明，关闭声音按钮
    </view>
    <view class="middle-area">
      还没想好放啥
    </view>
    <view class="bottom-area">
      放个开始答题的按钮，跳转答题
      <button @click="test">click me</button>
    </view>
  </view>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
// import { useUserStore } from '../../store/user'
import {  onShow  } from '@dcloudio/uni-app'
import { cloud } from '../../../src/api/cloud'

async function test() {
  cloud.invokeFunction('common-module', {}).then((res) => {
    console.log(res)
  })
}
onShow(() => {
  console.log('on-show')
})


// const user = useUserStore()

</script>

<style lang="less">
  .content {
    width: 100vw;
    height: 99vh;
    background-image: url("../../static/background.jpeg");
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;

  .top-area {
    height: 10vh;
    border: 2px solid red;
  }
  
  .middle-area {
    height: 40vh;
    border: 2px solid red;
  }
  
  .bottom-area {
    height: 45vh;
    border: 2px solid red;
  }
  
  


}
</style>
