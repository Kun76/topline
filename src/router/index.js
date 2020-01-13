import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd') },
      { path: '/articleedit/:aid', name: 'articleedit', component: () => import('@/views/articleedit') },
      { path: '/account', name: 'account', component: () => import('@/views/account') },
      { path: '/material', name: 'material', component: () => import('@/views/material') }
    ]

  }
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
