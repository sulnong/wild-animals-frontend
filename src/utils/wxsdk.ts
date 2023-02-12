// /* eslint-disable @typescript-eslint/no-var-requires */
// import * as jweixin from 'weixin-js-sdk'
// import { wx as mywxconfig } from '@/config'
// import { cloud } from '@/api/cloud'

// let timestamp = parseInt(new Date().getTime() / 1000 + "")
// let nonceStr = Math.random().toString(36).slice(-8)
// let url = location.href
// const appId = mywxconfig.APPID
// const config = { nonceStr, timestamp, url }
// const jsApiList = ["closeWindow", "hideMenuItems", "updateAppMessageShareData", 
//   "updateTimelineShareData", "hideAllNonBaseMenuItem", "hideOptionMenu", "showMenuItems"]

// async function getSignature() {
//   const { err, err_msg, signature } = await cloud.invoke('wx-get-signature', { config })
//   if (err) return console.log(err_msg)
//   return signature
// }


// export default {
//   async wxconfig() {
//     let signature = await getSignature()
//     let wxconfig = {
//       debug: false,
//       appId,
//       timestamp,
//       nonceStr,
//       signature,
//       jsApiList
//     }
//     jweixin.config(wxconfig)
//   },
  
//   async hideMenuItems() {

//     jweixin.hideAllNonBaseMenuItem()
//     jweixin.hideOptionMenu()
//     jweixin.error((error: any) => {
//       console.log('error in jssdk: ', error)
//     })
//   },
  
//   async closeWindow() {
//     jweixin.ready(() => {
//       jweixin.closeWindow()
//     })
//   },
  
//   async customHide() {
//     jweixin.hideAllNonBaseMenuItem()
//     jweixin.ready(() => {
//       jweixin.showMenuItems({
//         menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"] // 要显示的菜单项，所有 menu 项见附录3
//       })
//     })
    
//   },
  
//   async updateAppMessageShareData() {   //需在用户可能点击分享按钮前就先调用
//     jweixin.ready(() => {
//       jweixin.hideAllNonBaseMenuItem()
//       jweixin.showMenuItems({
//         menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"] // 要显示的菜单项，所有 menu 项见附录3
//       })
//       jweixin.updateAppMessageShareData({
//         title: '淮北市世界野生动植物日答题抽奖', // 分享标题
//         desc: '快来参加抽奖活动吧', // 分享描述
//         link: process.env.NODE_ENV == 'development' ? 'https://hw2u9p-raffle.oss.sl-dev.laf.run' : 'https://hw2u9p-raffle.oss.sl-dev.laf.run', // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
//         imgUrl: 'https://hw2u9p-raffle.oss.sl-dev.laf.run/static/background.jpeg', // 分享图标
//         success: function () {
//           // 设置成功
//         }
//       })
//       jweixin.updateTimelineShareData({
//         title: '淮北市世界野生动植物日答题抽奖', // 分享标题
//         link: process.env.NODE_ENV == 'development' ? 'https://hw2u9p-raffle.oss.sl-dev.laf.run' : 'https://hw2u9p-raffle.oss.sl-dev.laf.run', // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
//         imgUrl: 'https://hw2u9p-raffle.oss.sl-dev.laf.run/static/background.jpeg', // 分享图标
//         success: function () {
//           // 设置成功
//         }
//       })
//     })
//   }
// }
 


