<template>
  <view class="main-container">
    <!-- 头像 与 昵称 -->
    <view class="avatar-container">
      <u-avatar :src="userInfo.data.headimgurl" size="large"></u-avatar>
      <text style="margin-left: 20rpx;">你好， {{ userInfo.data.nickname }}</text>
    </view>
    <!-- 答题结果展示 -->
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
    <!-- 未全部答对文字提示 -->
    <view v-if="!answer_result.data.is_all_correct" class="tip">
      <text>很遗憾没有全部答对，请明天再来~</text>
    </view>
    <!-- 答对且可抽奖文字提示 -->
    <view v-if="answer_result.data.is_all_correct && !is_wined && !is_raffled" class="tip">
      <text>恭喜您全部答对啦，点击下方按钮抽奖吧~</text>
    </view>
    <!-- 抽奖按钮 -->
    <view v-if="show_raffle_btn" class="btn-container">
      <button class="btn" @click="raffle">抽奖</button>
    </view>
    <!-- 抽中奖品文字提示 -->
    <view v-if="is_wined" class="tip-submit">
      恭喜您抽中奖品：淮北市动物园门票一张。请点击下方填写信息按钮
      填入您的姓名和手机号，便于兑奖。
    </view>
    <!-- 未中奖展示 -->
    <view v-if="is_raffled && !is_wined" class="tip">
      很抱歉，您未中奖，请下次再尝试~
    </view>
    <!-- 中奖后填写信息 -->
    <view v-if="is_wined" class="btn-container">
      <button class="btn" @click="openContactInputModal">填写信息</button>
    </view>
    <!-- 遮罩层演示抽奖等待 -->
    <u-mask :show="show_mask" class="mask" >
    		<view class="warp">
    			<view class="rect" @tap.stop></view>
          <u-loading :show="show_mask" mode="circle" color="#2979ff" size="88"></u-loading>
          正在抽奖...
    		</view>
    </u-mask>
    <!-- 弹出提示 -->
    <u-toast ref="uToast" />
    <!-- 填写中奖信息 -->
    <u-modal v-model="showContactModal" 
          width="90%" 
          show-cancel-button
          border-radius="30" 
          negative-top="450rpx"
          title="填写中奖信息" 
          ref="uModal"
          :title-style="{color: '#2979ff'}"
          @confirm="handleConfirmModal"
          @cancel="handleCancelModal">
          <view class="slot-content">
            <view class="tip"> 请填写姓名和手机号，作为兑换奖品的凭证</view>
            <u-form :model="contactForm" ref="uForm" label-width="150" :label-style="{color: '#909909'}">
              <u-form-item label="姓名" prop="name" required="">
                <u-input v-model="contactForm.name" type="text" placeholder="请输入姓名" border/>
                </u-form-item>
              <u-form-item label="手机号" prop="phone" required>
                <u-input v-model="contactForm.phone" type="number" placeholder="请输入手机号" border/>
                </u-form-item>
            </u-form>
          </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow, onBackPress, onReady } from '@dcloudio/uni-app'
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, nextTick } from 'vue'
import { useUserStore } from '@/store/user'
import { cloud } from '@/api/cloud'
import { wdSubmitContact } from '@/api/wild-animals'
import wxjssdk from '@/utils/wxsdk'

let userInfo = reactive({ data: {} } as any)
let answer_result = reactive({ data: {} as any })
let show_mask = ref(false)
let show_raffle_btn = ref(false)    // 控制展示抽奖按钮
let is_wined = ref(false)           // 控制展示填写信息按钮
let is_raffled = ref(false)         // 是否已抽奖

let showContactModal = ref(false)
let contactForm = reactive({
  name: '',
  phone: ''
})
let formRules = reactive({
  name: [{ 
    required: true, 
    message: '请输入姓名', 
    // 可以单个或者同时写两个触发验证方式 
    trigger: ['blur'] }],
  phone: [{
    required: true,
    min: 11,
    max: 11,
    message: '请输入11位手机号', 
    trigger: 'blur' }]
})

async function openContactInputModal() {
  showContactModal.value = true
  await nextTick()
  currentInstance.uForm.setRules(formRules)
}

let currentInstance = '' as Data || undefined
const { proxy } = getCurrentInstance() as ComponentInternalInstance

onShow(() => {
  currentInstance = proxy?.$refs
  console.log('currentInstance: ', currentInstance)
  console.log(currentInstance.uModal)
})

async function handleConfirmModal() {
  console.log('confirm')
  showContactModal.value = true
  currentInstance.uForm.validate(async (valid: any) => {
    if (!valid) return // 表单输入框不消失，直到用户填对或者手动点击取消为止
    const { err, err_msg } = await wdSubmitContact(contactForm.name, contactForm.phone)
    if (err) {
      console.log(err)
    }
    currentInstance.uToast.show({
      title: '填写成功, 手机号和姓名将作为兑换凭据',
      type: 'success',
      position: 'top',
      duration: 8000
    })
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    }, 8000)
    showContactModal.value = false
  })
}

function handleCancelModal() {
  console.log('Close modal')
  showContactModal.value = false
}

onBackPress(() => {
  console.log('on back press')
  return
})

async function raffle() {
  show_mask.value = true
  const { err, err_msg, is_win } = await cloud.invoke('raffle', { openid: userInfo.data.openid})
  
  show_raffle_btn.value = false
  setTimeout(() => {
    if (err == 0 && is_win) {
      show_mask.value = false
      is_raffled.value = true
      currentInstance.uToast.show({
        title: '恭喜您中奖啦',
        type: 'success',
        position: 'top',
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

onLoad(async (params) => {
  userInfo.data = useUserStore().getUserInfo()
  answer_result.data = JSON.parse(decodeURIComponent(params.param))
  console.log('answer_result', answer_result)
  wxjssdk.wxconfig()
  wxjssdk.hideMenuItems()
  show_raffle_btn.value = answer_result.data.is_all_correct
})

</script>

<style lang="scss">
.main-container {
	width: 100vw;
	height: 100vh;
	background-image: url('/static/background.jpeg');
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
  
  .tip-submit {
    height: 120rpx;
    margin: 8rpx 30rpx;
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
    .warp {
        @include flex-column-center;
    }
  }
  
  .slot-content {
    padding: 0 30rpx;
    .tip {
      margin: 20rpx 0rpx;
      color: #909909;
    }
  }
}
</style>
