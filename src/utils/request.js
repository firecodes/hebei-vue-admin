import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Vue from 'vue'

import apiUrl from '@/components/Global/index.vue'
Vue.prototype.apiUrl = apiUrl.apiUrl
console.log(apiUrl.apiUrl)

// create an axios instance
axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: Vue.prototype.apiUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// --zll--
// request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     // if (store.getters.token) {
//     //   // let each request carry token
//     //   // ['X-Token'] is a custom headers key
//     //   // please modify it according to the actual situation
//     //   config.headers['X-Token'] = getToken()
//     // }

//     clog
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom status
   * Here is just an example
   * You can also judge the status by HTTP Status status
   */
  response => {
    const res = response.data
    console.log(res)

    // if the custom status is not 20000, it is judged as an error.
    if (res.status !== 0 && res.status !== 200) {
      Message({
        message: res.msg || '获取数据失败',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || '获取数据失败'))
    } else {
      return res
    }
  },
  error => {
    // console.log(error.response.data.msg);
    // console.log('err ' + error) // for debug
    Message({
      message: error.response.data.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
