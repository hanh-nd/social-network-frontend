<template>
    <ElConfigProvider :locale="locale">
        <router-view />
    </ElConfigProvider>
</template>

<script lang="ts">
import vi from '@/plugins/element-ui/locale/vi';
import { ElConfigProvider } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import { RouteRecordName } from 'vue-router';
import localStorageAuthService from './common/authStorage';
import { appModule } from './plugins/vuex/appModule';

@Options({
    components: {
        ElConfigProvider,
    },
})
export default class App extends Vue {
    locale = vi;

    created(): void {
        const loginUser = localStorageAuthService.getLoginUser();
        appModule.setLoginUser(loginUser);
    }

    get pageName(): RouteRecordName {
        return this.$router.currentRoute?.value?.name || '';
    }

    setScreenWidth() {
        appModule.setScreenWidth(window.innerWidth);
    }

    mounted() {
        window.addEventListener('resize', this.setScreenWidth);
        document.addEventListener('focusin', this.removeReadonlyElSelect);
        document.addEventListener('click', this.removeReadonlyElSelect);
        document.addEventListener('touchstart', this.removeReadonlyElSelect);
    }

    beforeUnmount() {
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
