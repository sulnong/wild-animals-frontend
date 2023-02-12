import { cloud } from './cloud'
import { useUserStore } from '@/store/user'
const userInfo = useUserStore().getUserInfo()
const openid = userInfo.openid

export async function wdSubmitContact(name: string, phone: string) {
  return await cloud.invoke('wd-submit-contact', { openid, name, phone })
}