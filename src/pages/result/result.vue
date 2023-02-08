<template>
  <view class="main-container">
    <view class="top"> </view>
    <view class="middle">
      <text class="label">总计</text>
      <text class="content"></text>
      <text class="label">答对</text>
      <text class="content"></text>
      <text class="label">用时</text>
      <text class="content"></text>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '../../store/user'
import { onLoad } from '@dcloudio/uni-app'
import { cloud } from '../../../src/api/cloud'
import { wx } from '../../config'
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
let currentInstance = ''
let userInfo = reactive({ data: {} } as any)
let answer_result = reactive({ data: {} as any })

onMounted(() => {
  currentInstance = getCurrentInstance()
})

onLoad(async (params) => {
  console.log(params)
  answer_result.data = JSON.parse(decodeURIComponent(params.param))
  console.log(answer_result)
  const userStore = useUserStore()
  userInfo.data = userStore.userInfo
})
</script>

<style lang="less">
.main-container {
}
</style>
