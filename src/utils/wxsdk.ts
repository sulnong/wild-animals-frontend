/* eslint-disable @typescript-eslint/no-var-requires */
// const wxsdk = require('jweixin-module')
import * as wxSDK from 'jweixin-module'
import { wx } from '../config'
import { cloud } from '../api/cloud'

let timestamp = parseInt(new Date().getTime() / 1000) + ""
let nonceStr = Math.random().toString(36).slice(-8)
let jsTicket = cloud.invoke('Get-Ticket', {})
wxSDK.config({
  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  debug: true,
  // 必填，公众号的唯一标识
  appId: wx.APPID,
  // 必填，生成签名的时间戳
  timestamp: timestamp,
  // 必填，生成签名的随机串
  nonceStr: nonceStr,
  // 必填，签名
  signature: string,
  // 必填，需要使用的JS接口列表
  jsApiList: string[],
}) 
 


