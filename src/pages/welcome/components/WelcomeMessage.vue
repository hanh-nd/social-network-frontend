<template>
    <div class="welcome-message">
        Xin chào, <span class="name">{{ loginUser.fullName }}</span
        >!
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class WelcomeMessage extends GlobalMixin {
    get loginUser() {
        return appModule.loginUser;
    }
}
</script>
<style lang="scss" scoped>
.welcome-message {
    padding: 40px 0;
    font-size: 32px;

    .name {
        font-weight: 700;
        color: $color-green;
    }
}
</style>
