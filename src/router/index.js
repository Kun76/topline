import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/index', name: 'home', component: () => import('@/views/home') }
]

const router = new VueRouter({
  routes
})

export default router

// 配置全局路由守卫验证登录状态
router.beforeEach((to, from, next) => {
  // 获取用户的登录信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 如果没有token切访问不是登录页面
  if (!userinfo && to.path !== '/login') {
    // 强制跳转登录界面
    return next('/login')
  }
  next()
})
