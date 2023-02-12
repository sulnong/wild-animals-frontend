<template>
  <view class="main-container">
    <view class="avatar-container">
      <!-- <u-avatar :src="userInfo.data.headimgurl" size="large"></u-avatar>
      <text style="margin-left: 20rpx;">你好， {{ userInfo.data.nickname }}</text> -->
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
    <view v-if="answer_result.data.is_all_correct && !is_wined && !is_raffled" class="tip">
      <text>恭喜您全部答对啦，点击下方按钮抽奖吧~</text>
    </view>
    <view v-if="!answer_result.data.is_all_correct" class="tip">
      <text>很遗憾没有全部答对，请明天再来~</text>
    </view>
    <view v-if="show_raffle_btn" class="btn-container">
      <button class="btn" @click="raffle">抽奖</button>
    </view>
    <view v-if="is_wined" class="tip-submit">
      恭喜您抽中奖品：淮北市动物园门票一张。请点击下方填写信息按钮
      填入您的姓名和手机号，便于兑奖。
    </view>
    <view v-if="is_raffled && !is_wined" class="tip">
      很抱歉，您未中奖，请下次再尝试~
    </view>
    <view v-if="is_wined" class="btn-container">
      <button class="btn">填写信息</button>
    </view>
    <!-- 遮罩层演示抽奖等待 -->
    <u-mask :show="show_mask" class="mask" >
    		<view class="warp">
    			<view class="rect" @tap.stop />
          <u-loading :show="show_mask" mode="circle" color="#2979ff" size="88"></u-loading>
          <text>正在抽奖...</text>
        </view>
    </u-mask>
    <!-- 弹出提示 -->
    <u-toast ref="uToast" />
    <!-- 填写中奖信息: 姓名 和 联系方式 -->
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow, onBackPress } from '@dcloudio/uni-app'
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { wdRaffle, wdSubmitContact } from '@/api/wild-animals'
import { toast } from '@/utils/show'

let userInfo = reactive({ data: {} } as any)
let answer_result = reactive({ data: {} as any })
let show_mask = ref(false)
let show_raffle_btn = ref(false) // 控制展示抽奖按钮
let is_wined = ref(false) // 控制展示填写信息按钮
let is_raffled = ref(false)      // 是否已抽奖

let currentInstance = '' as Data || undefined
const { proxy } = getCurrentInstance() as ComponentInternalInstance
onShow(() => {
  currentInstance = proxy?.$refs
})

onBackPress(() => {
  console.log('on back press')
  return
})

async function raffle() {
  show_mask.value = true
  const { err, is_win } = await wdRaffle()
  show_raffle_btn.value = false
  setTimeout(() => {
    if (err == 0 && is_win) {
      show_mask.value = false
      is_raffled.value = true
      currentInstance.uToast.show({
        title: '恭喜您中奖啦',
        type: 'success',
        position: 'center',
        duration: 5000
      })
      is_wined.value = true
      return
    } else {
      show_mask.value = false
      is_raffled.value = true
      currentInstance.uToast.show({
        title: '很抱歉您未中奖, 请下次再试~',
        type: 'info',
        position: 'top',
        duration: 5000
      })
      return
    }
  }, 1500)
}

onLoad(async (params : any) => {
  userInfo.data = useUserStore().getUserInfo()
  answer_result.data = JSON.parse(decodeURIComponent(params.param))
  console.log('answer_result', answer_result)
  show_raffle_btn.value = answer_result.data.is_all_correct
})

</script>

<style lang="scss">
.main-container {
	width: 100vw;
	height: 100vh;
	background-image: url('https://la8qzk-www.oss.sl-dev.laf.run/background.jpg');
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
		height: 260rpx;
    margin: 40rpx 40rpx;
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
  
  .tip-submit {
    height: 120rpx;
    @include flex-row-center;
    font-size: 36rpx;
    color: #909909;
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
    width: 100vw;
    height: 100vh;
    .warp {
        @include flex-column-center;
        .rect {
          @include flex-column-center;
        }
    }
  }
}
</style>
