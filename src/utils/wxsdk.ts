/* eslint-disable @typescript-eslint/no-var-requires */
import * as jweixin from 'weixin-js-sdk'
import { wx as mywxconfig } from '@/config'
import { cloud } from '@/api/cloud'

let timestamp = parseInt(new Date().getTime() / 1000 + "")
let nonceStr = Math.random().toString(36).slice(-8)
let url = location.href
const appId = mywxconfig.APPID
const config = { nonceStr, timestamp, url }
const jsApiList = ["closeWindow", "hideMenuItems", "updateAppMessageShareData", 
  "closeWindow", "hideAllNonBaseMenuItem", "hideOptionMenu"]

async function getSignature() {
  const { err, err_msg, signature } = await cloud.invoke('wx-get-signature', { config })
  if (err) return console.log(err_msg)
  return signature
}


export default {
  async wxconfig() {
    let signature = await getSignature()
    let wxconfig = {
      debug: false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList
    }
    jweixin.config(wxconfig)
  },
  
  async hideMenuItems() {
    this.wxconfig()
    jweixin.ready(() => {
      console.log('wx config ready')
      jweixin.hideMenuItems({
        menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:refresh"]
      })
      jweixin.hideOptionMenu()
    })
    jweixin.error((error: any) => {
      console.log('error in jssdk: ', error)
    })
  },
  
  async closeWindow() {
    this.wxconfig()
    jweixin.ready(() => {
      console.log('wx config ready')
      jweixin.closeWindow()
    })
  },
}
 


