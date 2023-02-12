
import { showError } from '@/utils/show'
import { Cloud, EnvironmentType, UniRequest } from 'laf-client-sdk'
import { API_BASE_URL } from '@/config'


// export const cloud = new Cloud({
//   baseUrl: API_BASE_URL,
//   getAccessToken: () => getToken() || '',
//   requestClass: CloudRequest,
//   environment: EnvironmentType.UNI_APP,
// })

export const cloud = {
  invoke: async function(url: string, data: any) {
    return new Promise((reslover, reject) => {
      wx.request({
        url: `${API_BASE_URL}/${url}`, 
        data, 
        method: 'POST', 
        success: (res) => {
          reslover(res.data)
        },
        fail: (err) => {
          wx.showToast({ title: err.errMsg})
          wx.showToast({ title: err.errMsg})
          reject(err)
        }
      })
    })
  }
}


