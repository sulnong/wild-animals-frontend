<template>
  <view>
    <view class="content">
      <!-- <view class="top-area">
        <u-icon name="info-circle" size="60"></u-icon>
        <text class="text-explain" @click="go_to_about">活动说明</text>
      </view> -->
      <view class="bottom-area">
        <button class="btn-answer" @click="start_answer_questions">
          开始答题
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
          <view class="iconfont icon-gift" style="font-size: 80rpx;"></view>
          <text style="font-size: 40rpx;margin-top: 30rpx;">暂无中奖记录</text>
        </view>
        <view v-else class="wined">
          <view class="prize">
            <view class="iconfont icon-lvyoumenpiao" style="font-size: 40rpx;color:greenyellow"></view>
            <text style="font-size: 40rpx;margin: 0 0 0 20rpx;">淮北市动物园门票一张</text>
          </view>
          <view v-if="userInfo.data.contact">
            <view> 中奖凭据 </view>
            <view> {{ userInfo.data.contact.name }}</view>
            <view> {{ userInfo.data.contact.phone }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-fixed"></view>
    <u-toast ref="uToast" />
  </view>
</template>

<script setup lang="ts">

import { onLoad } from '@dcloudio/uni-app'
import { onShow } from '@dcloudio/uni-app'
import { getCurrentInstance, reactive, ComponentInternalInstance } from 'vue'
import { useUserStore } from '@/store/user'
import { cloud } from '@/api/cloud'
import { wx } from '@/config'
import wxjssdk from '@/utils/wxsdk'

import moment from 'moment'

let userInfo = reactive({ data: {} } as any)

let currentInstance = '' as Data || undefined
const { proxy } = getCurrentInstance() as ComponentInternalInstance
onShow(() => {
  currentInstance = proxy?.$refs
})

async function start_answer_questions() {
  // 判断当前是否处于活动有效期
  const res = await cloud.invoke('Get-If-Active', {})
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
  if (userInfo.data.hasOwnProperty(today)) {
	  currentInstance.uToast.show({
	    title: '当日已答过题，一天只能答一次哦',
	    type: 'primary',
	    position: 'top',
	  })
	  return
  }
  console.log('2. User have not answerd at ', today)
  
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

function redirectToWx() {
  // redirect to wx auth
  const wx_auth_url = `
    ${wx.OAUTH_URL}?appid=${wx.APPID}&redirect_uri=${wx.REDIRECT_URI}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
  console.log(`Redirect to ${wx_auth_url}... `)
  window.location.href = wx_auth_url
}

onLoad(async (params) => {
  const userStore = useUserStore()
  userInfo.data = userStore.userInfo
  let target = window.navigator.userAgent.toLowerCase()
  let isWeixin=target.match(/MicroMessenger/i) == 'micromessenger' ? true : false
  
  console.log("isWeixin: ", isWeixin)
  if (!isWeixin) return alert('该活动必须在微信中参与')
  
  wxjssdk.wxconfig()
  wxjssdk.updateAppMessageShareData()
  
  // Check if have storage
  if (userInfo.data.openid && userInfo.data.openid != '') {
    console.log('update userinfo by openid')
    // 更新 local storage
    const { err, err_msg, data } = await cloud.invoke('get-userinfo-by-openid', { openid: userInfo.data.openid })
    if (err) {
      userStore.clearUserinfo()
      return currentInstance.uToast.show({
        title: err_msg,
        type: 'error',
        position: 'top',
      })
    }
    userInfo.data = data
    userStore.setUserinfo(data)
    // Check if redirected
  } else if (params?.code) {
    const code = params.code
    console.log('code: ', code)
    // Get access_token by code
    const { err, err_msg, data } = await cloud.invoke('Get-UserInfo', { code })
    if (err) {
      return currentInstance.uToast.show({
        title: '获取用户信息失败，请退出后重试',
        type: 'primary',
        position: 'top',
      })
    }
    userInfo.data = data
    userStore.setUserinfo(data)
  } else {
    redirectToWx()
  }
})

// const user = useUserStore()
</script>

<style lang="scss">
// card 与屏幕左右两侧的间距
$card-margin-side:10rpx;

.content {
  width: 100vw;
  height: 80vh;
  background-image: url('../../static/background.jpeg');
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
  .card-about {
    position: relative;
    top: -30rpx;
    margin: 0 $card-margin-side;
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
    height: 500rpx;
    margin: 0 $card-margin-side;
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
    
    .wined {
      margin-top: 20rpx;
      display: flex;
      flex-direction: column;

      justify-content: flex-start;
      color: #909909;
      .prize {
        @include flex-row-center;
        justify-content: flex-start;

      }
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
</style>
