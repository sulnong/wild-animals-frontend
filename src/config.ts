/**
 * HTTP 接口请求入口地址
 */
export const API_BASE_URL = 'https://la8qzk.sl-dev.laf.run'



/**
 * 微信相关信息
 */
export const microprogramwild = {
  APPID: 'wxeef2e7afd1ca4f7f',
  OAUTH_URL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
}

/**
 * 构建信息
 */
export const BUILD_INFO = {
  // 代码版本：tag or hash
  version: process.env.VUE_APP_BUILD_VERSION,
  // 代码提交版本 git commit version hash
  commithash: process.env.VUE_APP_BUILD_COMMITHASH,
  // 代码分支: git branch
  branch: process.env.VUE_APP_BUILD_BRANCH,
  // 构建时间: number (ms)
  time: process.env.VUE_APP_BUILD_TIME,
}
