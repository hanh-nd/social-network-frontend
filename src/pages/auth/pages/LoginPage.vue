<template>
    <div class="login-container">
        <div class="left-panel">
            <LoginForm />
        </div>
        <div class="right-panel"></div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import LoginForm from '../components/LoginForm.vue';

@Options({
    components: { LoginForm },
})
export default class LoginPage extends GlobalMixin {}
</script>
<style lang="scss" scoped>
.login-container {
    display: flex;
    flex-direction: row;
    flex: 1;
}

.left-panel {
    flex: 1;
    max-width: map-get($grid-breakpoints, sm);
}

.right-panel {
    flex: 1;
    background: url('../../..//assets/images/auth/right-cover.jpg') center no-repeat;
    background-color: $color-bg-green;
    background-size: cover;
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .right-panel {
        display: none;
    }
}
</style>
