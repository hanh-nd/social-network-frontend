<template>
    <ElConfigProvider :locale="locale">
        <router-view />
    </ElConfigProvider>
</template>

<script lang="ts">
import vi from '@/plugins/element-ui/locale/vi';
import { ElConfigProvider } from 'element-plus';
import { Options } from 'vue-class-component';
import { RouteRecordName } from 'vue-router';
import localStorageAuthService from './common/authStorage';
import { GlobalMixin } from './common/mixins';
import appApiService from './common/service/app.api.service';
import { SocketProvider } from './plugins/socket.io';
import { appModule } from './plugins/vuex/appModule';

@Options({
    components: {
        ElConfigProvider,
    },
})
export default class App extends GlobalMixin {
    locale = vi;
    intervalId = 0;

    created(): void {
        SocketProvider.init();
        const loginUser = localStorageAuthService.getLoginUser();
        appModule.setLoginUser(loginUser);
        appModule.getTags();
        appModule.getRoles();
        if (loginUser?._id) {
            appApiService.ping();
            SocketProvider.connect(loginUser._id);
        }

        window.addEventListener('error', (e) => {
            if (e.message === 'ResizeObserver loop limit exceeded') {
                const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
                const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute('style', 'display: none');
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute('style', 'display: none');
                }
            }
        });
    }

    get pageName(): RouteRecordName {
        return this.$router.currentRoute?.value?.name || '';
    }

    get loginUser() {
        return appModule.loginUser;
    }

    setScreenWidth() {
        appModule.setScreenWidth(window.innerWidth);
    }

    mounted() {
        this.intervalId = setInterval(() => {
            if (this.loginUser?._id) {
                appApiService.ping();
            }
        }, 60000);

        window.addEventListener('resize', this.setScreenWidth);
        document.addEventListener('focusin', this.removeReadonlyElSelect);
        document.addEventListener('click', this.removeReadonlyElSelect);
        document.addEventListener('touchstart', this.removeReadonlyElSelect);
    }

    beforeUnmount() {
        clearInterval(this.intervalId);

        window.removeEventListener('resize', this.setScreenWidth);
        document.removeEventListener('focusin', this.removeReadonlyElSelect);
        document.removeEventListener('click', this.removeReadonlyElSelect);
        document.removeEventListener('touchstart', this.removeReadonlyElSelect);
    }
    removeReadonlyElSelect = function () {
        document.querySelectorAll('.el-select.remove-readonly input[readonly]').forEach((el) => {
            el.removeAttribute('readonly');
        });
    };
}
</script>
