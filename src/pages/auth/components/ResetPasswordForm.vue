<template>
    <div class="form">
        <div class="token form-items">
            <BaseInputText
                v-model:value="resetPasswordForm.token"
                label="Mã xác thực"
                placeholder="Mã xác thực"
                :error="translateYupError(resetPasswordForm.errors.token as IYupError)"
                @on-enter="onSubmit"
            />
        </div>

        <div class="password form-items">
            <BaseInputPassword
                v-model:value="resetPasswordForm.password"
                label="Mật khẩu mới"
                placeholder="Mật khẩu mới"
                :error="translateYupError(resetPasswordForm.errors.password as IYupError)"
                @on-enter="onSubmit"
            />
        </div>

        <el-button
            @click="onSubmit"
            :disabled="isLoggingIn"
            :loading="isLoggingIn"
            class="reset-password-btn"
            type="primary"
        >
            <template #loading>
                <BaseButtonInnerLoading />
            </template>
            {{ isLoggingIn ? '' : 'Lấy lại mật khẩu' }}
        </el-button>
    </div>
</template>

<script lang="ts">
import localStorageAuthService from '@/common/authStorage';
import { ValidationForm } from '@/common/constants';
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import appApiService from '@/common/service/app.api.service';
import { SocketProvider } from '@/plugins/socket.io';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({
    components: {},
})
export default class ResetPasswordForm extends GlobalMixin {
    isLoggingIn = false;

    resetPasswordForm = setup(() => {
        const initValues = {
            token: '',
            password: '',
        };

        const schema = yup.object({
            token: yup.string().required(),
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
            const response = await appApiService.resetPassword({
                token: values.token,
                password: values.password,
            });
            if (response.success) {
                localStorageAuthService.setRefreshToken(response?.data?.refreshToken || '');
                localStorageAuthService.setAccessToken(response?.data?.accessToken || '');
                localStorageAuthService.setLoginUser(response?.data?.user || {});
                appModule.setLoginUser(response?.data?.user || {});
                SocketProvider.connect(response?.data?.user?._id);
                this.showSuccessNotificationFunction('Lấy lại mật khẩu thành công');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Lấy lại mật khẩu thất bại');
            }
            this.isLoggingIn = false;
        });

        const { value: token } = useField('token');
        const { value: password } = useField('password');

        return {
            token,
            password,
            errors,
            submit,
            clearFormData,
        };
    });

    async onSubmit() {
        await this.resetPasswordForm.submit();
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

:deep(.reset-password-btn) {
    height: 42px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
    border: none;
    width: 100%;
}
:deep(.reset-password-btn:hover) {
    background-color: $color-green !important;
}
</style>
