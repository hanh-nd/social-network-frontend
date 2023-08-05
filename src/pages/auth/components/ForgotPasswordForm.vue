<template>
    <div class="form">
        <div class="email form-items">
            <BaseInputText
                v-model:value="forgotPasswordForm.email"
                label="Địa chỉ email"
                placeholder="Địa chỉ email"
                :error="translateYupError(forgotPasswordForm.errors.email as IYupError)"
                @on-enter="onSubmit"
            />
        </div>

        <el-button
            @click="onSubmit"
            :disabled="isLoggingIn"
            :loading="isLoggingIn"
            class="forgot-password-btn"
            type="primary"
        >
            <template #loading>
                <BaseButtonInnerLoading />
            </template>
            {{ isLoggingIn ? '' : 'Quên mật khẩu' }}
        </el-button>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import appApiService from '@/common/service/app.api.service';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({
    components: {},
})
export default class ForgotPasswordForm extends GlobalMixin {
    isLoggingIn = false;

    forgotPasswordForm = setup(() => {
        const initValues = {
            email: '',
        };

        const schema = yup.object({
            email: yup.string().email().required(),
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
            const response = await appApiService.forgotPassword({
                email: values.email,
            });
            if (response.success) {
                this.showSuccessNotificationFunction('Yêu cầu thành công');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Yêu cầu thất bại');
            }
            this.isLoggingIn = false;
        });

        const { value: email } = useField('email');

        return {
            email,
            errors,
            submit,
            clearFormData,
        };
    });

    async onSubmit() {
        await this.forgotPasswordForm.submit();
        this.goToResetPasswordPage();
    }

    goToResetPasswordPage() {
        this.$router.push({
            name: this.PageName.RESET_PASSWORD_PAGE,
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

:deep(.forgot-password-btn) {
    height: 42px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
    border: none;
    width: 100%;
}
:deep(.forgot-password-btn:hover) {
    background-color: $color-green !important;
}
</style>
