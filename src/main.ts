import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import './styles/index.scss';
import 'animate.css';
import App from './App.vue';
import router from './router';
import './permission';
import 'virtual:svg-icons-register';

// eslint-disable-next-line no-console
console.log(
  `%c${import.meta.env.VITE_APP_ENV_NAME}`,
  'background: #00ae66;color: #fff;padding: 4px 12px;border-radius: 4px;font-size: 12px;font-family: pingfang'
);

const app = createApp(App);

app.use(createPinia()).use(router).mount('#app');
