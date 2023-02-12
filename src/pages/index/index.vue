<template>
  <view>
    <view class="content">
      <view class="bottom-area">
        <button class="btn-answer" @click="start_answer_questions">
          开始答题
        </button>
        <button class="btn-answer" @click="test">
          测试弹框
        </button>
      </view>
    </view>
    <view class="activity-area">
      <view class="card-about">
        <view class="wd-wrap">
          <u-icon name="order" size="36"></u-icon>
          <text class="wd-label">活动说明</text>
        </view>

        <view class="label">活动时间</view>
        <view class="text">2023年2月27日-2023年3月2日</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动规则</view>
        <view class="text">活动期间全部答对即可参与抽奖，一天只能参与一次答题。</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动说明</view>
        <view class="text">活动共举行5天，总计 500 份奖品，每天抽出 100 份奖品，抽完即止。</view>
        <view class="text">每个人最多可中奖1次。</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动奖品</view>
        <view class="text">淮北市动物园门票一张</view>
        <view class="text">门票使用时限为 3月3日 至 3月12日</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">兑换方式与时间</view>
        <view class="text">凭姓名和手机号前往淮北市相山动物园进行兑换。</view>
        <view class="text">兑换时限为 3月3日 至 3月12日</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">主办单位</view>
        <view class="text" style="color: #2979ff;"
          >淮北市林业局</view
        >
        <u-line borderStyle="dashed" color="#909399"></u-line>
      </view>
      <view class="card-gift">
        <view class="wd-wrap">
          <u-icon name="gift" size="36"></u-icon>
          <text class="wd-label">我的奖品</text>
        </view>
        <view v-if="!userInfo.data.is_win" class="never-win">
          <view class="iconfont icon-gift" style="font-size: 120rpx;"></view>
          <text style="font-size: 40rpx;margin-top: 30rpx;">暂无中奖记录</text>
        </view>
      </view>
    </view>

    <view class="bottom-fixed"></view>
    <u-toast ref="uToast" />
    <u-modal v-model="showContactModal" 
      title="填写中奖信息" 
      negative-top="450rpx" 
      width="90%" 
      border-radius="30" 
      :title-style="{color: '#2979ff'}">
      <view class="slot-content">
        <view class="tip"> 请填写姓名和手机号，作为兑换奖品的凭证</view>
        <u-form :model="contactForm" ref="winnerContactForm" label-width="150" :label-style="{color: '#909909'}">
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

import { onLoad, onShow } from '@dcloudio/uni-app'
import { getCurrentInstance, reactive, ComponentInternalInstance, ref } from 'vue'
import { useUserStore } from '@/store/user'
import moment from 'moment'
import { wdGetActive } from '@/api/wild-animals'
import { getUserinfoByOpenid, getUserinfoByCode } from '@/api/user'
import { toast } from '@/utils/show'

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
function test() {
  showContactModal.value = true
}

let userInfo = reactive({ data: {} } as any)
let currentInstance = '' as Data || undefined
const { proxy } = getCurrentInstance() as ComponentInternalInstance
onShow(() => {
  currentInstance = proxy?.$refs
  currentInstance.winnerContactForm.setRules(formRules);
})

async function start_answer_questions() {
  console.log('userinfo: ', userInfo.data)
  // 判断当前是否处于活动有效期
  const res = await wdGetActive()
  console.log(res)
  if (!res.is_active) {
    currentInstance.uToast.show({
      title: res.tip,
      type: 'error',
      position: 'top',
    })
    return
  }
  console.log('1. Acitivity enabled: true')
  
  // 判断当天是否已经答过题
  const today = moment().format('YYYY-MM-DD')
  // if (userInfo.data.hasOwnProperty(today)) return toast(currentInstance.uToast, 'primary', '当日已答过题，一天只能答一次哦', 'top')
  // console.log('2. User have not answerd at ', today)
  
  // 判断用户是否已授权
  console.log('userInfo: ', userInfo.data)
  if (!userInfo.data.openid) {
    console.log('3. Get user info success: false')
    currentInstance.uToast.show({
      title: '您必须授权才能答题~',
      type: 'primary',
      position: 'top',
    })
    return
  }
  console.log('Everything correct, start answer...')
  uni.redirectTo({
    url: '/pages/answer-questions/answer-questions',
  })
}

onLoad(async (params) => {
  const userStore = useUserStore()
  userInfo.data = userStore.getUserInfo() 
  // Check if have storage
  if (userInfo.data.openid && userInfo.data.openid != '') {
    const openid = userInfo.data.openid
    console.log('Update userinfo by openid: ', openid)
    const { err, err_msg, data } = await getUserinfoByOpenid(openid)
    if (err) return console.log(err_msg) 
    // 更新 local storage
    userInfo.data = data
    userStore.setUserinfo(data)
    return
  }
  // start login and ger userinfo
  const loginRes = await wx.login()
  // login faild
  if (!loginRes.code) {
    toast(currentInstance.uToast, 'error', 'wx.login() error', 'top')
    return console.log('Call wx.login() error: ', loginRes.errMsg)
  }
  // get userinfo by code - just openid can got...
  const { err, err_msg, user } = await getUserinfoByCode(loginRes.code)
  if (err) return console.log(err_msg)
  // set userinfo to storage
  userInfo.data = user
  userStore.setUserinfo(user)
})

</script>

<style lang="less">
.content {
  width: 100vw;
  height: 80vh;
  background-image: url('https://la8qzk-www.oss.sl-dev.laf.run/background.jpeg');
  background-size: 100% 80vh;
  // background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  // background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .top-area {
    padding: 10px 10px;
    height: 15vh;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;

    .text-explain {
      margin-left: 15rpx;
      font-size: 40rpx;
    }
  }

  .bottom-area {
    height: 15vh;
    flex-direction: row;
    justify-content: center;

    .btn-answer {
      width: 400rpx;
      height: 100rpx;
      background-color: royalblue;
      color: white;
    }
  }
}

.activity-area {
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  flex-direction: column;
  font-family: "阿里妈妈数黑体 Bold";
  .card-about {
    position: relative;
    top: -30rpx;
    margin: 0 10rpx;
    padding: 30rpx 10rpx 20rpx 30rpx;
    border-radius: 30rpx;
    background-color: white;

    .wd-wrap {
      display: flex;
      align-items: center;

      .wd-label {
        margin-left: 10rpx;
        font-size: 36rpx;
        font-weight: 600;
      }
    }

    .label {
      font-size: 30rpx;
      font-weight: 600;
      margin-top: 30rpx;
    }

    .text {
      color: #909909;
      margin: 20rpx 0;
    }
  }

  .card-gift {
    height: 600rpx;
    margin: 0 10rpx;
    padding: 30rpx 10rpx 20rpx 30rpx;
    border-radius: 30rpx;
    background-color: white;
    .wd-wrap {
      display: flex;
      align-items: center;

      .wd-label {
        margin-left: 10rpx;
        font-size: 36rpx;
        font-weight: 600;
      }
    }

    .never-win {
      margin-top: 100rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #909399;
    }
  }
}

.bottom-fixed {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 80rpx;
  background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
  opacity: 0.6;
}

.slot-content {
  padding: 0 30rpx;
  .tip {
    margin: 20rpx 0rpx;
    color: #909909;
  }
}
</style>
