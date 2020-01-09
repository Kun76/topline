// 配置axios相关文件,
// 引入vue
import Vue from 'vue'
import router from '@/router'
// 导入axios模块
import axios from 'axios'
// 配置公共根地址(线上地址)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置为Vue的(原型)继承成员
Vue.prototype.$http = axios
// 设置请求拦截器
axios.interceptors.request.use(function (config) {
  // 每次请求都需要带着token发送给服务器,服务器才能响应
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 如果有token就执行
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // 请求错误的执行
  return Promise.reject(error)
})
// 设置响应拦截器,阻止401
axios.interceptors.response.use(function (response) {
  // 响应成功的操作
  return response
}, function (error) {
  console.dir(error)
  if (error.response.status === 401) {
    router.push({ name: 'login' })
    // return一个空函数来防止报错
    return new Promise(function () {})
  }
  return Promise.reject(error)
})
