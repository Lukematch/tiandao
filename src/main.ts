<<<<<<< HEAD
import Vue from 'vue'
import App from './App.vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app' }, App)))
app.$mount();
=======
import { createSSRApp } from 'vue';

// 引入UnoCSS
import 'virtual:uno.css';

// 引入uview-plus
import uviewPlus from 'uview-plus';
import App from '@/App.vue';

// 引入状态管理
import setupStore from '@/store';

// 引入请求封装
import setupRequest from '@/utils/request';

// 权限管理
import '@/permission';

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus);
  // 状态管理
  setupStore(app);
  // 网络请求
  setupRequest();

  return {
    app,
  };
}
// #endif
>>>>>>> e50d52e (Refactor  uni-app->uniapp-vue3-template)
