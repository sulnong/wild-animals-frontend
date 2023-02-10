<template>
  <view class="main-container">
    <view class="avatar-container">
      <u-avatar :src="userInfo.data.headimgurl" size="large"></u-avatar>
      <text style="margin-left: 20rpx;">你好， {{ userInfo.data.nickname }}</text>
    </view>
    <view class="middle">
      <view class="result-wrap">
        <text class="content">5</text>
        <text class="label">总题数</text>
      </view>
      <view class="result-wrap">
        <text class="content"> {{ answer_result.data.correctNums }}</text>
        <text class="label">答对题数</text>
      </view>
      <view class="result-wrap">
        <text class="content"> {{ 5 - answer_result.data.correctNums }}</text>
        <text class="label">总错题数</text>
      </view>
      <view class="result-wrap">
        <text class="content"> {{ answer_result.data.time_spends }}</text>
        <text class="label">耗时(秒)</text>
      </view>
    </view>
    <view v-if="answer_result.data.is_all_correct" class="tip">
      <text>恭喜您全部答对啦，点击下方按钮抽奖吧~</text>
    </view>
    <view v-else class="tip">
      <text>很遗憾没有全部答对，请明天再来~</text>
    </view>
    <view v-if="answer_result.data.is_all_correct" class="btn-container">
      <button class="btn" @click="raffle">抽奖</button>
    </view>
    <!-- 弹出提示 -->
    <u-toast ref="uToast" />
    <!-- 遮罩层演示抽奖等待 -->
    <u-mask :show="show_mask" class="mask" >
    		<view class="warp">
    			<view class="rect" @tap.stop></view>
          <u-loading :show="show_mask" mode="circle" color="#2979ff" size="88"></u-loading>
          正在抽奖...
    		</view>
    </u-mask>
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
let show_mask = ref(false)

async function raffle() {
  show_mask.value = true
  setTimeout(() => {
    show_mask.value = false
  }, 2000)
}

onMounted(() => {
  currentInstance = getCurrentInstance()
})

onLoad(async (params) => {
  console.log(params)
  userInfo.data = useUserStore().getUserInfo()
  answer_result.data = JSON.parse(decodeURIComponent(params.param))
  console.log('answer_result', answer_result)
  
})
</script>

<style lang="scss">
.main-container {
	width: 100vw;
	height: 100vh;
	background-image: url('../../static/background.jpg');
	background-size: 100% 100vh;
	background-position: top;
	background-repeat: no-repeat;
	background-attachment: fixed;
	display: flex;
	flex-direction: column;
	.avatar-container {
	  margin: 160rpx 0 30rpx 60rpx;
	  font-size: 40rpx;
	  display: flex;
	  align-items: center;
	}
	
	.middle {
		height: 200rpx;
    margin: 20rpx 20rpx;
    padding: 0 35rpx;
    border-radius: 25rpx;
    background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%);
    @include flex-row-between;
    .result-wrap {
      @include flex-column-center;
      .label {
        margin-top: 10rpx;
        // font-weight: bold;
        font-size: 25rpx;
      }
      .content {
        color: red;
        font-weight: bold;
        font-size: 48rpx;
      }
    }
	}
	
	.tip {
		height: 100rpx;
    @include flex-row-center;
    font-size: 30rpx;
	}
	
	.btn-container {
		height: 100rpx;
    margin-top: 20rpx;
		@include flex-row-center;
    .btn {
      background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      width: 300rpx;
    }
	}
  
  .mask {
    @include flex-column-center;
    .warp {
        @include flex-column-center;
    }
  }
}
</style>
