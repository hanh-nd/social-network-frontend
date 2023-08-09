<template>
    <div class="reset-password-container">
        <div class="left-panel container">
            <div class="logo">
                <img :src="require('@/assets/images/common/new-logo.png')" />
            </div>
            <div class="welcome">Lấy lại mật khẩu</div>
            <div class="reset-password">
                <ResetPasswordForm />
            </div>
        </div>
        <div class="right-panel"></div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import ResetPasswordForm from '../components/ResetPasswordForm.vue';

@Options({
    components: {
        ResetPasswordForm,
    },
})
export default class ResetPasswordPage extends GlobalMixin {}
</script>
<style lang="scss" scoped>
.reset-password-container {
    display: flex;
    flex-direction: row;
    flex: 1;
}

.left-panel {
    flex: 1;
    max-width: map-get($grid-breakpoints, sm);

    .logo {
        padding: 40px 0;

        img {
            width: 250px;
        }
    }

    .welcome {
        padding: 40px 0;
        font-size: 32px;
        font-weight: 500;
    }

    .login {
        padding: 12px 0;
        .btn {
            padding: 0;
            font-weight: 700;
            color: $color-green;
        }
    }
}

.right-panel {
    flex: 1;
    background: url('../../..//assets/images/auth/right-cover.jpg') no-repeat;
    background-color: $color-green;
    background-size: contain;
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .right-panel {
        display: none;
    }
}
</style>
