<template>
    <el-dialog
        v-model="isShowLoginDialog"
        @closed="onCloseLoginDialog"
        custom-class="auth-dialog"
    >
        <div class="container d-flex login-form p-0">
            <div class="login-left"></div>
            <div class="login-right d-flex">
                <div class="text">
                    <p class="login-text">
                        {{ $t('common.login.capitalizedLoginText') }}
                    </p>
                    <p class="slogan-text d-flex">{{ $t('common.login.sloganText') }}</p>
                </div>

                <div class="form">
                    <div class="email form-items">
                        <el-input
                            @keyup.enter="onClickButtonLogin"
                            :class="{ 'input-error': loginForm.errors.email }"
                            v-model="loginForm.email"
                            :placeholder="$t('common.login.form.placeholders.email')"
                        >
                        </el-input>
                        <span v-show="loginForm.errors.email" class="form-error">{{
                            translateYupError(loginForm.errors.email as IYupError)
                        }}</span>
                    </div>
                    <div class="password form-items">
                        <el-input
                            @keydown.space.prevent
                            @keyup.enter="onClickButtonLogin"
                            :class="{ 'input-error': loginForm.errors.password }"
                            v-model="loginForm.password"
                            :placeholder="$t('common.login.form.placeholders.password')"
                            type="password"
                        />
                        <span v-show="loginForm.errors.password" class="form-error">{{
                            translateYupError(loginForm.errors.password as IYupError)
                        }}</span>
                    </div>
                    <div class="forget-password">
                        <p @click="showForgotPasswordDialog">
                            {{ $t('common.login.forgetPassword') }}
                        </p>
                    </div>
                    <el-button
                        @click="onClickButtonLogin"
                        :disabled="isLoggingin"
                        :loading="isLoggingin"
                        class="login-btn"
                        type="primary"
                    >
                        <template #loading>
                            <BaseButtonInnerLoading />
                        </template>
                        {{ isLoggingin ? '' : $t('common.login.capitalizedLoginText') }}
                    </el-button>
                    <div class="social-login">
                        <hr />
                        <p v-html="$t('common.login.socialLogin')"></p>
                    </div>
                    <div class="icon">
                        <img class="icon-cursor" alt="" @click="onClickButtonFacebook" />
                        <img class="icon-cursor" alt="" @click="onClickButtonGoogle" />
                    </div>
                </div>
                <div class="bottom-text">
                    <p>
                        {{ $t('common.login.bottomText') }}
                        <span @click="showRegisterDialog">{{
                            $t('common.login.register')
                        }}</span>
                    </p>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script lang="ts">
import { FORM_VALIDATION } from '@/common/constants';
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import * as yup from 'yup';

const googleLoginLink: string = process.env.VUE_APP_GOOGLE_LOGIN_LINK || '#';
const facebookLoginLink: string = process.env.VUE_APP_FACEBOOK_LOGIN_LINK || '#';
@Options({
    components: {},
    emits: ['show-register-form', 'on-login-success', 'show-forgot-password-form'],
})
export default class LoginDialog extends GlobalMixin {
    isLoggingin = false;
    isShowLoginDialog = false;

    loginForm = setup(() => {
        const initValues = {
            email: '',
            password: '',
        };
        const schema = yup.object({
            email: yup.string().required().email(),
            password: yup
                .string()
                .min(FORM_VALIDATION.passwordMinLength)
                .max(FORM_VALIDATION.textMaxLength)
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

        const submitLoginForm = handleSubmit(async (values) => {
            this.isLoggingin = true;

            this.isLoggingin = false;
        });

        const { value: email } = useField('email');
        const { value: password } = useField('password');
        return {
            email,
            password,
            errors,
            submitLoginForm,
            clearFormData,
        };
    });

    async onClickButtonLogin() {
        await this.loginForm.submitLoginForm();
    }

    onCloseLoginDialog() {
        this.loginForm.clearFormData();
    }

    showRegisterDialog(): void {
        this.loginForm.clearFormData();
    }

    showForgotPasswordDialog(): void {
        this.loginForm.clearFormData();
    }

    onClickButtonGoogle() {
        window.location.href = googleLoginLink;
    }

    onClickButtonFacebook() {
        window.location.href = facebookLoginLink;
    }
}
</script>
<style lang="scss" scoped>
.login-form {
    border-radius: 28px;
    width: 695px;
    margin: 0 auto;
}
.login-left {
    width: 313px;
    background: linear-gradient(46.76deg, #da132b 29.59%, #f5787f 77.92%);
    border-radius: 26px 0px 0px 26px;
    .left-img {
        height: 100%;
        max-width: 313px;
    }
}
.login-right {
    width: 382px;
    background-color: white;
    border-radius: 0 28px 28px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 27px 29px;
    padding-bottom: 0 !important;
}
.text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .login-text {
        color: black;
        top: 27px;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 0;
        line-height: 28px;
    }
    .slogan-text {
        color: black;
        font-size: 14px;
        font-weight: 400;
    }
}
.form-error {
    display: block !important;
    height: 24px;
    font-size: 13px;
    color: $color-red;
    width: 100%;
    word-break: break-word;
}
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .forget-password {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        p {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 400;
            color: #403d50;
            cursor: pointer;
        }
    }
}
.form-items {
    p {
        display: none;
    }
    span {
        font-size: 11px;
        font-weight: 400;
        line-height: 15px;
        color: $color-red;
        padding-top: 2px;
    }
}
:deep(.el-input__wrapper) {
    background-color: $color-gray;
    border: none;
    width: 323px;
    height: 44px;
    border-radius: 12px;
    box-shadow: none;
}
:deep(.el-input) {
    --el-input-placeholder-color: $color-black-2v !important;
}
.input-error {
    :deep(.el-input__wrapper) {
        background-color: $color-blue-1;
    }
    :deep(.el-input__wrapper.is-focus) {
        border: 1px solid $color-red;
    }
}
:deep(.el-input__wrapper:hover) {
    box-shadow: none;
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: none;
    border: 1px solid $color-black-2v;
}
.el-button--text {
    margin-right: 15px;
}
:deep(.login-btn) {
    width: 315px;
    height: 42px;
    background: $color-blue-gray !important;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
    border-radius: 22px;
    border: none;
}
:deep(.login-btn:hover) {
    background-color: $color-red !important;
}
.password {
    margin-bottom: 0px !important;
}
.social-login {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 315px;
    background-color: white;
    margin-top: 25px;
    margin-bottom: 17px;
    hr {
        border: 1px solid #f3f3f3;
        width: 100%;
        margin: 0;
    }
    p {
        background-color: white;
        position: absolute;
        top: 0;
        transform: translateY(-45%);
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin-bottom: 0 !important;
        padding-left: 5px;
        padding-right: 7px;
    }
}
.icon {
    display: flex;
    justify-content: space-between;
    width: 35%;
    .icon-cursor {
        cursor: pointer;
    }
}
.bottom-text {
    margin-top: 13px;
    margin-bottom: 15px;
    p {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 0 !important;
    }
    span {
        color: #43d4c9;
        cursor: pointer;
        font-weight: 500;
    }
}
@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .login-left {
        display: none;
    }
    .login-right {
        //display: none;
        width: 345px;
        border-radius: 12px;
    }
    .text {
        text-align: center;
        .login-text {
            color: black;
            top: 27px;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 0;
            line-height: 28px;
        }
        .slogan-text {
            color: black;
            font-size: 14px;
            font-weight: 400;
        }
    }
    .form {
        width: 285px;
    }
    :deep(.el-input__wrapper) {
        width: 285px;
    }
    .login-btn {
        width: 285px;
    }
}
</style>
