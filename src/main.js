import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import ElementPlus from 'element-plus';
import './main.scss';
import icons from './utils/icons';

import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale/lang/zh-cn';

const app = createApp(App);
app.use(router).use(ElementPlus, { locale }).use(icons);
app.mount('#app');
