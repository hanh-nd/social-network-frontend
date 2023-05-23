import forEach from 'lodash/forEach';
import { Component, createApp } from 'vue';
import App from './App.vue';
import './assets/styles/bootstrap/bootstrap.min.css';
import './assets/styles/global.scss';
import { getGlobalComponents } from './common/loadGlobalComponents';
import plugins from './plugins';
import router from './plugins/vue-router';
import store from './plugins/vuex';
// import './registerServiceWorker';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueClickAway from 'vue3-click-away';

const app = createApp(App)
    .use(store)
    .use(router)
    .use(plugins.i18n)
    .use<{
        i18n: (key: string) => string;
    }>(plugins.ElementUI as any, {
        i18n: (key: string) => {
            return (plugins.i18n.global as any).t(key, plugins.i18n.global.locale);
        },
    })
    .use(VueClickAway);

// load all components under the folder @/components as glolal components
forEach(getGlobalComponents(), (component, name) => {
    app.component(name, component as Component);
});

forEach(Object.entries(ElementPlusIconsVue), ([key, component]) => {
    app.component(key, component);
});

router.isReady().then(() => {
    app.mount('#app');
});
