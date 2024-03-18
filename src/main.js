import { createApp, reactive } from 'vue';
import router from './plugins/router';
import App from './App.vue';
import axios from 'axios';
import uikit from '@/views/components/uikit';
import utils from '@/views/utils';
import EventBus from '@/plugins/eventbus';
import '@/assets/styles/global.css';
import '@/assets/styles/fonts.css';
import ShowSingleton from '@/singletons/show.singleton';

function registerComponents(components, app) {
  Object.keys(components).forEach((componentKey) => {
    const component = components[componentKey];
    if (component.name) {
      app.component(component.name, component);
    } else {
      registerComponents(component, app);
    }
  });
}

try {
  const app = createApp(App);
  app.config.globalProperties.$show = reactive(ShowSingleton);
  app.config.globalProperties.$http = axios;
  app.config.globalProperties.$utils = reactive(utils);
  app.config.errorHandler = (err) => {
    console.log(err);
    EventBus.emit('app_error', err);
  };
  app.use(router);
  app.mount('#app');
  registerComponents(uikit, app);
} catch (err) {
  console.log(err);
}
