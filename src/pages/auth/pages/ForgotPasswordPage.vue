<template>
    <div class="forgot-password-container">
        <div class="left-panel container">
            <div class="logo">
                <img :src="require('@/assets/images/common/new-logo.png')" />
            </div>
            <div class="welcome">Quên mật khẩu</div>
            <div class="forgot-password">
                <ForgotPasswordForm />
            </div>
            <div class="login">
                Đã nhớ lại mật khẩu?
                <span class="btn" @click="goToLoginPage">Đăng nhập</span>
            </div>
        </div>
        <div class="right-panel"></div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import ForgotPasswordForm from '../components/ForgotPasswordForm.vue';

@Options({
    components: {
        ForgotPasswordForm,
    },
})
export default class ForgotPasswordPage extends GlobalMixin {
    goToLoginPage() {
        this.$router.push({
            name: this.PageName.LOGIN_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
.forgot-password-container {
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
