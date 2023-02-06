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

    return { userInfo, setUserinfo }
})

