import { getCurrentBaseURL } from './utils/url'

/**
 * HTTP 接口请求入口地址
 */
export const API_BASE_URL = 'https://hw2u9p.sl-dev.laf.run'

/**
 * 当前站部署地址，主要用于授权等场景
 */
export const DEPLOY_URL = getCurrentBaseURL()


/**
 * 微信相关信息
 */
export const wx = {
  APPID: process.env.NODE_ENV == 'development' ? 'wx6570365231fbe051' : 'wx6570365231fbe051',
  OAUTH_URL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  REDIRECT_URI: process.env.NODE_ENV == 'development' ? 
    'http%3A%2F%2Fhw2u9p-raffle.oss.sl-dev.laf.run' : 'https%3A%2F%2Fhw2u9p-raffle.oss.sl-dev.laf.run' // 加不加s的区别
  // REDIRECT_URI: 'http%3A%2F%2Fsl-dev.io'
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
