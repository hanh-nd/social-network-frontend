<template>
    <div class="container">
        <div class="welcome-wrapper">
            <WelcomeMessage />
        </div>
        <div class="choose-avatar-wrapper">
            <ChooseAvatar />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import ChooseAvatar from '../components/ChooseAvatar.vue';
import WelcomeMessage from '../components/WelcomeMessage.vue';

@Options({
    components: {
        WelcomeMessage,
        ChooseAvatar,
    },
})
export default class WelcomePage extends GlobalMixin {
    get loginUser() {
        return appModule.loginUser;
    }
}
</script>
<style lang="scss" scoped></style>
