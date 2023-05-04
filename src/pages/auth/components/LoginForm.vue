<template>
    <div class="form">
        <div class="username form-items">
            <div>Tên tài khoản</div>
            <el-input
                @keyup.enter="onSubmit"
                :class="{ 'input-error': loginForm.errors.username }"
                v-model="loginForm.username"
                placeholder="Tên tài khoản"
            />
            <span v-show="loginForm.errors.username" class="form-error">
                {{ translateYupError(loginForm.errors.username as IYupError) }}</span
            >
        </div>

        <div class="password form-items">
            <div>Mật khẩu</div>
            <el-input
                @keydown.space.prevent
                @keyup.enter="onSubmit"
                :class="{ 'input-error': loginForm.errors.password }"
                v-model="loginForm.password"
                placeholder="Mật khẩu"
                type="password"
            />
            <span v-show="loginForm.errors.username" class="form-error">
                {{ translateYupError(loginForm.errors.password as IYupError) }}</span
            >
        </div>

        <el-button @click="onSubmit" :disabled="isLoggingIn" :loading="isLoggingIn" class="login-btn" type="primary">
            <template #loading>
                <BaseButtonInnerLoading />
            </template>
            {{ isLoggingIn ? '' : 'Đăng nhập' }}
        </el-button>
    </div>
</template>

<script lang="ts">
import localStorageAuthService from '@/common/authStorage';
import { ValidationForm } from '@/common/constants';
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import appApiService from '@/common/service/app.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({
    components: {},
})
export default class LoginForm extends GlobalMixin {
    isLoggingIn = false;

    loginForm = setup(() => {
        const initValues = {
            username: '',
            password: '',
        };

        const schema = yup.object({
            username: yup.string().required(),
            password: yup
                .string()
                .min(ValidationForm.PASSWORD_MIN_LENGTH)
                .max(ValidationForm.INPUT_TEXT_MAX_LENGTH)
                .required(),
        });

        const { resetForm, errors, handleSubmit } = useForm({
            validationSchema: schema,
            initialValues: initValues,
        });

        const clearFormData = () => {
            resetForm({
                values: {
                    ...initValues,
                },
            });
        };

        const submit = handleSubmit(async (values) => {
            this.isLoggingIn = true;
            const response = await appApiService.login({
                username: values.username,
                password: values.password,
            });
            if (response.success) {
                localStorageAuthService.setRefreshToken(response?.data?.refreshToken || '');
                localStorageAuthService.setAccessToken(response?.data?.accessToken || '');
                localStorageAuthService.setLoginUser(response?.data?.user || {});
                appModule.setLoginUser(response?.data?.user || {});
                this.showSuccessNotificationFunction('Đăng nhập thành công');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Đăng nhập thất bại');
            }
            this.isLoggingIn = false;
        });

        const { value: username } = useField('username');
        const { value: password } = useField('password');

        return {
            username,
            password,
            errors,
            submit,
            clearFormData,
        };
    });

    async onSubmit() {
        await this.loginForm.submit();
        this.goToHomePage();
    }

    goToHomePage() {
        this.$router.push({
            name: this.PageName.HOME_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.form-error {
    display: block !important;
    height: 24px;
    font-size: 13px;
    color: $color-red !important;
    width: 100%;
    word-break: break-word;
}

.form-items {
    width: 100%;
    flex: 1;
    p {
        display: none;
    }
    span {
        font-size: 11px;
        font-weight: 400;
        line-height: 15px;
        color: $color-green;
        padding-top: 2px;
    }
}

:deep(.el-input) {
    height: 42px;
    --el-input-placeholder-color: $color-black-2v !important;

    .el-input__wrapper.is-focus {
        border: 2px solid $color-green;
        box-shadow: none;
    }
}

.input-error {
    :deep(.el-input__wrapper) {
        background-color: $color-blue-1;
    }
    :deep(.el-input__wrapper.is-focus) {
        border: 2px solid $color-red;
    }
}

:deep(.login-btn) {
    height: 42px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
    border: none;
    width: 100%;
}
:deep(.login-btn:hover) {
    background-color: $color-green !important;
}
.password {
    margin-bottom: 0px !important;
}
</style>
