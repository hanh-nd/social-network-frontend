<template>
    <div class="register-form-container">
        <RegisterFormStepOne :formData="registerForm" v-if="currentStep === 1" @on-next-step="onNextStep" />
        <RegisterFormStepTwo
            :formData="registerForm"
            v-if="currentStep === 2"
            @on-previous-step="currentStep--"
            @on-next-step="onSubmit"
        />
    </div>
</template>

<script lang="ts">
import localStorageAuthService from '@/common/authStorage';
import { ValidationForm } from '@/common/constants';
import { IAddress } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import appApiService from '@/common/service/app.api.service';
import { SocketProvider } from '@/plugins/socket.io';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { isEmpty } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import RegisterFormStepOne from './RegisterFormStepOne.vue';
import RegisterFormStepTwo from './RegisterFormStepTwo.vue';

@Options({
    components: {
        RegisterFormStepOne,
        RegisterFormStepTwo,
    },
})
export default class RegisterForm extends GlobalMixin {
    isRegistering = false;
    currentStep = 1;

    registerForm = setup(() => {
        const initValues = {
            username: '',
            password: '',
            fullName: '',
            email: '',
            phone: undefined,
            birthday: undefined,
            address: {},
        };

        const schema = yup.object({
            username: yup.string().required(),
            password: yup
                .string()
                .min(ValidationForm.PASSWORD_MIN_LENGTH)
                .max(ValidationForm.INPUT_TEXT_MAX_LENGTH)
                .required(),
            fullName: yup.string().required(),
            email: yup.string().required().email(),
            phone: yup.string().optional(),
            birthday: yup.date().optional(),
            address: yup
                .object({
                    province: yup.string(),
                    ward: yup.string(),
                    district: yup.string(),
                    detail: yup.string(),
                })
                .optional(),
        });

        const { resetForm, errors, handleSubmit, validateField } = useForm({
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
            this.isRegistering = true;
            const response = await appApiService.register({
                username: values.username,
                password: values.password,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                address: isEmpty(values.address) ? undefined : (values.address as IAddress),
                birthday: values.birthday,
            });
            if (response.success) {
                localStorageAuthService.setRefreshToken(response?.data?.refreshToken || '');
                localStorageAuthService.setAccessToken(response?.data?.accessToken || '');
                localStorageAuthService.setLoginUser(response?.data?.user || {});
                appModule.setLoginUser(response?.data?.user || {});
                SocketProvider.connect(response?.data?.user?._id);
                this.showSuccessNotificationFunction('Đăng ký thành công');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Đăng ký thất bại');
            }
            this.isRegistering = false;
        });

        const { value: username } = useField('username');
        const { value: password } = useField('password');
        const { value: fullName } = useField('fullName');
        const { value: email } = useField('email');
        const { value: phone } = useField('phone');
        const { value: birthday } = useField('birthday');
        const { value: address } = useField('address');

        return {
            username,
            password,
            fullName,
            email,
            phone,
            birthday,
            address,
            errors,
            submit,
            clearFormData,
            validateField,
        };
    });

    async onNextStep() {
        this.currentStep++;
    }

    async onSubmit() {
        await this.registerForm.submit();
        this.goToWelcomePage();
    }

    goToWelcomePage() {
        this.$router.push({
            name: this.PageName.WELCOME_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
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
</style>
