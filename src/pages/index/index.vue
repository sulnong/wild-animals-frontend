
<template>
  <view class="content">
    <view class="top-area">
      这里放活动声明，关闭声音按钮
    </view>
    <view class="middle-area">
      还没想好放啥
    </view>
    <view class="bottom-area">
      <button class="btn-answer" @click="start_answer_questions">开始答题</button>
    </view>
  </view>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { useUserStore } from '../../store/user'
import {  onLoad } from '@dcloudio/uni-app'
import { cloud } from '../../../src/api/cloud'
import { wx } from '../../config'

async function start_answer_questions() {
  const res = cloud.invokeFunction('common-module', {})
  console.log(res)
}

onLoad(async (params) => {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  console.log('UserInfo: ', userInfo)
  // Check if have storage
  if (userInfo.openid && userInfo.openid != '') {
    console.log('open id: ', userInfo.openid)
    // re_auth if expired
  // Check if redirected
  } else if (params?.code) {
    // Get access_token by code
    const code = params.code
    console.log('code: ', code)
    const res = await cloud.invokeFunction('Get-OAuth-AccessToken', { code })
    if (res.err !== 0) {
      // get openid failed
      return
    }
    userStore.setUserinfo({ openid: res.openid})
  } else {
    // redirect to wx oauth to get code
    const wx_auth_url = `
    ${wx.OAUTH_URL}?appid=${wx.APPID}&redirect_uri=${wx.Redirect_Uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    console.log(`Redirect to ${wx_auth_url}... `)
    window.location.href = wx_auth_url
  }
  // console.log(params)
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
    height: 10vh;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .middle-area {
    height: 70vh;

  }
  
  .bottom-area {
    height: 10vh;
    border: 2px solid red;
    flex-direction: row;
    justify-content: center;
    
    .btn-answer {
      width: 40vw;
      height: 5vh;
    }
  }
  
  


}
</style>
