
// import { AppFunctionResult, UserInfo } from '@/utils/types'
import { cloud } from './cloud'

export async function getUserinfoByOpenid(openid: string) {
  return await cloud.invoke('wd-get-userinfo-by-openid', { openid })
}

export async function getUserinfoByCode(code: string) {
  return await cloud.invoke('wx-get-userinfo-by-code', { code })
}
/**
 * @deprected use get-userinfo-by-code instead
 */
export async function wxCode2Session(code: string) {
  return await cloud.invoke('wx-code2session', { code })
}



