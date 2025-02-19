import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'

//导入ElementPlus依赖
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

//导入ElementPlus图标
import * as ElementPlusIconVue from '@element-plus/icons-vue'

import piniaPersistedstate from 'pinia-plugin-persistedstate';

//创建App实例
const app=createApp(App)

//创建Pinia实例
const pinia=createPinia()

//遍历注册图标
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
    app.component(key, component);
}

app.use(pinia);
pinia.use(piniaPersistedstate);  // 使用持久化插件
app.use(ElementPlus);
app.mount('#app')
