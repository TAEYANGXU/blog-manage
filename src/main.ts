
import { createApp } from 'vue'
import App from './App.vue'
import  router  from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";
import './style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

console.log('当前环境:', import.meta.env.PROD ? '生产环境' : '开发环境');

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

app.use(ElementPlus);

app.mount('#app')

