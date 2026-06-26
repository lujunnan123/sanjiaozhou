import { createApp } from 'vue'
import App from './App.vue'

// 👇 引入 Element Plus
import ElementPlus from 'element-plus'
// 👇 引入样式（必须！）
import 'element-plus/dist/index.css'

const app = createApp(App)

// 👇 注册
app.use(ElementPlus)

app.mount('#app')