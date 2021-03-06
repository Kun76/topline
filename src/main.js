import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局初始化文件
import '@/assets/css/global.css'
// 导入element模块
// import ElementUI from 'element-ui'
import '@/utils/element.js'
// 引入axios相关文件
import '@/utils/ax.js'
// 注册全部的组件和事件方法
// Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
