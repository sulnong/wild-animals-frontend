/* eslint-disable @typescript-eslint/no-var-requires */
import * as jweixin from 'weixin-js-sdk'
// const jweixin = require('jweixin-module')
// console.log(jweixin)
import { wx as mywxconfig } from '@/config'
import { cloud } from '@/api/cloud'

let timestamp = parseInt(new Date().getTime() / 1000 + "")
let nonceStr = Math.random().toString(36).slice(-8)
let url = location.href
const appId = mywxconfig.APPID
const config = { nonceStr, timestamp, url }
const jsApiList = ["closeWindow", "hideMenuItems", "updateAppMessageShareData", 
  "closeWindow", "hideAllNonBaseMenuItem"]

async function getSignature() {
  const { err, err_msg, signature } = await cloud.invoke('wx-get-signature', { config })
  if (err) return console.log(err_msg)
  return signature
}

async function wxconfig() {
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
}

async function hidMenuItems() {
  wxconfig()
  jweixin.ready(() => {
    jweixin.hidMenuItems()
  })
}

async function test() {
  console.log(config)
}

export default {
  wxconfig,
  test,
  hidMenuItems
}
 


