import { cloud } from './cloud'
import { useUserStore } from '@/store/user'
const userInfo = useUserStore().getUserInfo()
const openid = userInfo.openid

export async function wdSubmitContact(name: string, phone: string) {
  return await cloud.invoke('wd-submit-contact', { openid, name, phone })
}

/**
 * 判断当前用户是否已关注公众号
 */
export async function wdGetSubsribe(openid: string) {
  return await cloud.invoke('wx-get-subscribe', { openid })
}


/**
 * 获取当前活动状态：尚未开始，正在进行，已结束
 */
export async function wdGetActive() {
  return await cloud.invoke('wd-get-active', { })
}

/**
 * 获取活动通用配置：活动状态、是否需要关注公众号、是否 secret
 */
export async function wdGetConfig() {
  const config = await cloud.invoke('wd-get-config', { openid })
  useUserStore().setConfig(config)
}

export async function wdGetLocation() {
  return await cloud.invoke('wx-get-location', { })
}

/**
 * uView toast wrapper
 */
export function wdToast(inst: any, title: string, type: string = 'primary', position: string = 'top', duration: number = 2000) {
  inst.show({
    title,
    type,
    position,
    duration
  })
}