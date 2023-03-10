import { defineStore } from 'pinia'
import { ref } from 'vue'
interface UserInfo {
  nickname: String,
  openid: String
  headimgurl: String
  is_subscribe: Boolean
}

export const useUserStore = defineStore('user', () => {
    // get from localStorage
    function getUserInfo(): UserInfo {
      return uni.getStorageSync('user')
    }
    
    const userInfo = ref(getUserInfo())
    
    // set userinfo into localStorage actions
    function setUserinfo(userInfo: UserInfo) {
      uni.setStorageSync('user', userInfo)
    }
    
    function clearUserinfo() {
      uni.removeStorageSync('user')
    }
    
    function setConfig(config: any) {
      uni.setStorageSync('config', config)
    }
    
    function getConfig() {
      return uni.getStorageSync('config')
    }

    return { userInfo, getUserInfo, setUserinfo, clearUserinfo, getConfig, setConfig }
})

