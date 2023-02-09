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
    <view class="tip">
		这里是tip
	</view>
	<view class="btn-container">
		<button>抽奖</button>
	</view>
	<u-toast ref="uToast" />
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '../../store/user'
import { onLoad } from '@dcloudio/uni-app'
// import { cloud } from '../../../src/api/cloud'
// import { wx } from '../../config'
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

<style lang="scss">
.main-container {
	width: 100vw;
	height: 100vh;
	background-image: url('../../static/background.jpeg');
	background-size: 100% 100vh;
	background-position: top;
	background-repeat: no-repeat;
	background-attachment: fixed;
	display: flex;
	flex-direction: column;
	.top {
		height: 200rpx;
		border: 2px solid red;
	}
	
	.middle {
		height: 200rpx;
		border: 2px solid red;
	}
	
	.tip {
		height: $uni-img-size-lg;
		border: 2px solid red;
	}
	
	.btn-container {
		height: 80rpx;
		display: flex;
	}
}
</style>
