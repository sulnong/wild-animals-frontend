
<template>
  <view class="content">
    <view class="top-area">
       <u-icon name="info-circle" size="60"></u-icon>
	   <text class="text-explain" @click="go_to_about">活动说明</text>
    </view>
    <view class="middle-area">
      还没想好放啥
    </view>
    <view class="bottom-area">
	  <button class="btn-answer"
	  @click="start_answer_questions">开始答题</button>
    </view>
  </view>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { useUserStore } from '../../store/user'
import { onLoad } from '@dcloudio/uni-app'
import { cloud } from '../../../src/api/cloud'
import { wx } from '../../config'

function test() {
  window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA3NDk4MDQ0MQ==&scene=110#wechat_redirect'
}

function go_to_about() {
	uni.navigateTo({
		url: '/pages/about/about'
	})
}

async function start_answer_questions() {
	uni.redirectTo({
		url: '/pages/answer-questions/answer-questions'
	})
}


onLoad(async (params) => {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  console.log('UserInfo: ', userInfo)
  // Check if have storage
  if (userInfo.openid && userInfo.openid != '') {
    console.log('open id: ', userInfo.openid)
  // Check if redirected
  } else if (params?.code) {
    // Get access_token by code
    const code = params.code
    console.log('code: ', code)
    const res = await cloud.invokeFunction('Get-UserInfo', { code })
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
    height: 99vh;
    background-image: url("../../static/background.jpeg");
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;

  .top-area {
	border: 2px solid red;
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
  
  .middle-area {
    height: 70vh;

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
</style>
