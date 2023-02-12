import { cloud } from '@/api/cloud'
import { wd_contact } from '@/utils/types'
import { useUserStore } from '@/store/user'
const userInfo = useUserStore().getUserInfo()
const openid = userInfo.openid

export async function wdGetActive() {
  return await cloud.invoke('wd-get-active', {})
}

export async function wdGetQuestions() {
  return await cloud.invoke('wd-get-questions', { })
}

export async function wdUploadResults(answer_result: any) {
  return await cloud.invoke('wd-upload-result', { openid, answer_result })
}

export async function wdRaffle() {
  return await cloud.invoke('wd-raffle', { openid })
}

export async function wdSubmitContact(contact: wd_contact) {
  return await cloud.invoke('wd-submit-contact', { openid, contact })
}