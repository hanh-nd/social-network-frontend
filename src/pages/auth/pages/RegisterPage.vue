<template>
    <div class="login-container">
        <div class="left-panel container">
            <div class="logo">
                <img :src="require('@/assets/images/common/logo.svg')" />
            </div>
            <div class="welcome">Xin chào bạn!</div>
            <div class="login">
                <RegisterForm />
            </div>
            <div class="register">
                Đã có tài khoản?
                <span class="btn" @click="goToLoginPage">Đăng nhập</span>
            </div>
        </div>
        <div class="right-panel"></div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import RegisterForm from '../components/RegisterForm.vue';

@Options({
    components: { RegisterForm },
})
export default class RegisterPage extends GlobalMixin {
    goToLoginPage() {
        this.$router.push({
            name: this.PageName.LOGIN_PAGE,
        });
    }
}
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

    .logo {
        padding: 40px 0;

        img {
            width: 120px;
        }
    }

    .welcome {
        padding: 40px 0;
        font-size: 32px;
        font-weight: 500;
    }

    .register {
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
