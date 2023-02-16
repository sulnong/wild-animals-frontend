<template>
  <view>
    <view class="content">
      <view class="bottom-area">
        <button class="btn-answer animate__animated animate__fadeInTopLeft" @click="start_answer_questions">
          开始答题
        </button>
		 <view class="activity-stastics">
			已有 <text style="color: #115A6A;font-weight: bold;">{{ globalConfig.data.totalUserNum }}</text> 人参与
		 </view>
      </view>
	 
    </view>
    <view class="activity-area">
      <view class="card-about">
        <view class="wd-wrap">
          <u-icon name="order" size="36"></u-icon>
          <text class="wd-label">活动说明</text>
        </view>

        <view class="label">活动时间</view>
        <view class="text">2023年2月28日-2023年3月2日</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动规则</view>
        <view class="text">活动期间全部答对即可参与抽奖，一天只能参与一次答题。</view>
        <u-line borderStyle="dashed" color="#909399"></u-line>
        <view class="label">活动说明</view>
        <view class="text">活动共举行3天，总计 500 份奖品，抽完即止。</view>
        <view class="text">每个人最多可中奖1次。</view>
        <view class="text">中奖后，请根据页面提示填写您的姓名和手机号，作为兑换依据。</view>
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
          <view v-if="userInfo.data.contact" class="prize-contact">
            <view class="label"> 兑奖凭据 </view>
            <view class="text"> {{ userInfo.data.contact.name }}   {{ userInfo.data.contact.phone }} </view>
            <u-line borderStyle="dashed" color="#909399"></u-line>
          </view>
          <view v-else class="prize-contact"> 
            <button class="contact-btn" @click="openContactInputModal">填写中奖凭据</button>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-fixed"></view>
    <u-toast ref="uToast" />
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

import { onLoad } from '@dcloudio/uni-app'
import { onShow } from '@dcloudio/uni-app'
import { getCurrentInstance, reactive, ComponentInternalInstance, nextTick, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { cloud } from '@/api/cloud'
import { wx } from '@/config'
import { wdGetSubsribe, wdGetConfig, wdGetLocation, wdToast, wdSubmitContact } from '@/api/wild-animals'
import wxjssdk from '@/utils/wxsdk'
import moment from 'moment'

let userInfo = reactive({ data: {} } as any)
let globalConfig = reactive({data: {} }as any)

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


let currentInstance = '' as any || undefined
const { proxy } = getCurrentInstance() as ComponentInternalInstance

onShow(async () => {
  currentInstance = proxy?.$refs
  await wdGetConfig()
  globalConfig.data = useUserStore().getConfig()
})

async function start_answer_questions() {
  let config = globalConfig.data
  let { active, isNeedSubscribe, isSecret, isLimitLocation } = config
  console.log('config: ', config)
  // 0. secret
  if (isSecret) {
    return uni.redirectTo({
      url: '/pages/answer-questions/answer-questions',
    })
  }
  // 1. 判断当前是否处于活动有效期
  if (!active.is_active) {
    return wdToast(currentInstance.uToast, active.tip, 'error')
  }
  console.log('1. Activity enabled: true')
  // 2. 判断用户所在位置 - 仅限淮北地区参与
  if (isLimitLocation) {
    const { err, ad_info } = await wdGetLocation()
    // 该接口为免费services API，可能失败，这时候就不处理
    // 仅当获取到用户位置且不为淮北市时执行
    // 2023.2.14 手机运营商网络精确不到市，限定安徽省
    if (!err) console.log('ad_info: ', ad_info)
    if (!err && ad_info.province != '安徽省') { return alert('该活动仅限淮北地区参与') }
  }
  // 3. 判断用户是否关注公众号
  if (isNeedSubscribe) {
    const { err, subscribe } = await wdGetSubsribe(userInfo.data.openid)
    if (!err && subscribe == 0) {
      setTimeout(() => {
        window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA3NDk4MDQ0MQ==&scene=110#wechat_redirect'
      }, 2000)
      return wdToast(currentInstance.uToast, '您需要关注淮北林业公众号后方可答题') 
    }
  }
  // 4. 判断用户是否已授权
  console.log('userInfo: ', userInfo.data)
  if (!userInfo.data.openid) {
    return wdToast(currentInstance.uToast, '您必须授权才能答题~')
  }
  console.log('2. User have authorized.')
  
  // 5. 判断用户当天是否已经答过题
  const today = moment().format('YYYY-MM-DD')
  if (userInfo.data.hasOwnProperty(today)) {
    return wdToast(currentInstance.uToast, '当日已答过题，一天只能答一次哦')
  }
  console.log('3. User have not answered at ', today)
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
  
  // 1. Check 用户环境
  let target = window.navigator.userAgent.toLowerCase()
  let isWeixin=target.match(/MicroMessenger/i) == 'micromessenger' ? true : false
  if (!isWeixin) { return alert('该活动必须在微信中参与') }

  // 设置微信分享给朋友、朋友圈卡片, 隐藏其他按钮
  await wxjssdk.wxconfig()
  await wxjssdk.updateAppMessageShareData()

  // 2. 检测本地缓存: 是否存在openid且不为空
  if (userInfo.data.openid && userInfo.data.openid != '') {
    console.log('update userinfo by openid')
    // 更新 local storage
    const { err, err_msg, data } = await cloud.invoke('get-userinfo-by-openid', { openid: userInfo.data.openid })
    if (err) {
      userStore.clearUserinfo() // 清除本地缓存
      return wdToast(currentInstance.uToast, '获取用户信息失败，请重新尝试', 'error')
    }
    userInfo.data = data
    userStore.setUserinfo(data)
  // 4. 检测是否为微信认证回跳页面
  } else if (params?.code) {
    const code = params.code
    console.log('code: ', code)
    // Get access_token by code
    const { err, err_msg, data } = await cloud.invoke('Get-UserInfo', { code })
    if (err && err != 3) {
      return wdToast(currentInstance.uToast, '获取用户信息失败，请退出后重试', 'error')
    }
    // err = 3 意味着尚未点击授权的用户
    if (err && err == 3) return
    userInfo.data = data
    userStore.setUserinfo(data)
  } else {
    redirectToWx()
  }
})

async function openContactInputModal() {
  showContactModal.value = true
  await nextTick()
  currentInstance.uForm.setRules(formRules)
}

async function handleConfirmModal() {
  console.log('confirm')
  showContactModal.value = true
  currentInstance.uForm.validate(async (valid: any) => {
    if (!valid) return // 表单输入框不消失，直到用户填对或者手动点击取消为止
    const { err, err_msg } = await wdSubmitContact(userInfo.data.openid, contactForm.name, contactForm.phone)
    if (err) {
      console.log(err)
    }
    currentInstance.uToast.show({
      title: '填写成功, 手机号和姓名将作为兑换凭据',
      type: 'success',
      position: 'top',
      duration: 3000
    })
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    }, 3000)
    showContactModal.value = false
  })
}

function handleCancelModal() {
  console.log('Close modal')
  showContactModal.value = false
}

</script>

<style lang="scss">
// card 与屏幕左右两侧的间距
$card-margin-side:10rpx;

.content {
  width: 100vw;
  height: 80vh;
  background-image: url('/static/background.png');
  background-size: 100% 95vh;
  // background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  // background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .bottom-area {
    height: 30vh;
    flex-direction: row;
    justify-content: center;
    position: relative;

    .btn-answer {
      position: absolute;
      bottom: 300rpx;
      right: 25rpx;
      width: 300rpx;
      height: 120rpx;
      @include flex-row-center;
      background-image: url('/static/start-btn-background.png');
      color: #115A6A;
    }
	
	.activity-stastics {
		// border: 2px solid red;
		position: absolute;
		bottom: 10rpx;
		right: 80rpx;
		width: 300rpx;
		height: 100rpx;
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
	  .prize-contact {
		  .label {
		    font-size: 30rpx;
		    font-weight: 600;
		    margin-top: 30rpx;
			color: black;
		  }
		  
		  .text {
		    color: #909909;
		    margin: 20rpx 0;
		  }
      
      .contact-btn {
        margin-top: 40rpx;
        width: 50%;
        height: 100rpx;
        background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
      }
	  }
  }
  }
}
.slot-content {
    padding: 0 30rpx;
    .tip {
      margin: 20rpx 0rpx;
      color: #909909;
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
