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
        <view class="text">活动期间总参与机会共1次，一天只能参与1次。</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动说明</view>
        <view class="text"
          >规则： 根据题目选择正确的答案，全部答对后可获得一次抽奖机会。
          活动共举行5天，总计 500 份奖品，每天放出 100 份奖品，放完即止。
          每个人最多可中奖1次。
        </view>
        <view class="text">
          中奖后，需您提供姓名和手机号以供兑奖。
        </view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动奖品</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">兑换方式</view>
        <view class="text">凭姓名和手机号前往淮北市相山动物园进行兑换。</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">主办单位</view>
        <view class="text" style="color: #2979ff;"
          >淮北市林业局、淮北市相山动物园</view
        >
        <u-line borderStyle="dashed" color="#909399"></u-line>
      </view>
      <view class="card-gift">
        <view class="wd-wrap">
          <u-icon name="gift" size="36"></u-icon>
          <text class="wd-label">我的奖品</text>
        </view>
        <view v-if="userInfo.data.is_win" class="never-win">
          <view class="iconfont icon-gift" style="font-size: 120rpx;"></view>
          <text style="font-size: 40rpx;margin-top: 30rpx;">暂无中奖记录</text>
        </view>
      </view>
    </view>

    <view class="bottom-fixed"></view>
    <u-toast ref="uToast" />
  </view>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { useUserStore } from '../../store/user'
import { onLoad } from '@dcloudio/uni-app'
import { cloud } from '../../../src/api/cloud'
import { wx } from '../../config'
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
let currentInstance = ''
let userInfo = reactive({ data: {} } as any)

onMounted(() => {
  currentInstance = getCurrentInstance()
})

function test() {
  window.location.href =
    'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA3NDk4MDQ0MQ==&scene=110#wechat_redirect'
}


async function start_answer_questions() {
  // 判断当前是否处于活动有效期
  const res = await cloud.invoke('Get-If-Active', {})
  if (!res.is_active) {
    currentInstance.ctx.$refs.uToast.show({
      title: res.tip,
      type: 'error',
      position: 'top',
    })
    return
  }
  uni.redirectTo({
    url: '/pages/answer-questions/answer-questions',
  })
}

onLoad(async (params) => {
  const userStore = useUserStore()
  userInfo.data = userStore.userInfo
  console.log('UserInfo: ', userInfo)
  // Check if have storage
  if (userInfo.data.openid && userInfo.data.openid != '') {
    console.log('open id: ', userInfo.data.openid)
    // Check if redirected
  } else if (params?.code) {
    // Get access_token by code
    const code = params.code
    console.log('code: ', code)
    const res = await cloud.invokeFunction('Get-UserInfo', {
      code,
    })
    console.log(res)
    if (res.err !== 0) {
      // get openid failed
      return
    }
    userStore.setUserinfo(res)
  } else {
    // redirect to wx oauth to get code
    const wx_auth_url = `
      ${wx.OAUTH_URL}?appid=${wx.APPID}&redirect_uri=${wx.Redirect_Uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    console.log(`Redirect to ${wx_auth_url}... `)
    window.location.href = wx_auth_url
  }
})

// const user = useUserStore()
</script>

<style lang="less">
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
</style>
