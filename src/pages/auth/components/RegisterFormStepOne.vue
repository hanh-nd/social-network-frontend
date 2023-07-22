<template>
    <div class="form">
        <div class="username form-items">
            <BaseInputText
                v-model:value="formData.username"
                label="Tên tài khoản"
                placeholder="Tên tài khoản"
                :error="translateYupError(formData.errors.username as IYupError)"
                @on-enter="nextStep"
                isRequired="true"
            />
        </div>

        <div class="password form-items">
            <BaseInputPassword
                v-model:value="formData.password"
                label="Mật khẩu"
                placeholder="Mật khẩu"
                :error="translateYupError(formData.errors.password as IYupError)"
                @on-enter="nextStep"
                isRequired="true"
            />
        </div>

        <div class="email form-items">
            <BaseInputText
                v-model:value="formData.email"
                label="Địa chỉ email"
                placeholder="Địa chỉ email"
                :error="translateYupError(formData.errors.email as IYupError)"
                @on-enter="nextStep"
                isRequired="true"
            />
        </div>

        <el-button @click="nextStep" class="next-step-btn" type="primary"> Tiếp theo </el-button>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model } from 'vue-property-decorator';
import { IRegisterForm } from '../interface';
import appApiService from '@/common/service/app.api.service';

@Options({
    components: {},
})
export default class RegisterFormStepOne extends GlobalMixin {
    @Model('formData', { type: Object }) formData!: IRegisterForm & { errors: any; validateField: any };

    async nextStep() {
        const results = await Promise.all([
            this.formData.validateField('username'),
            this.formData.validateField('password'),
            this.formData.validateField('email'),
        ]);
        const isValid = results.every((result) => result.valid);
        if (isValid) {
            const response = await appApiService.preRegister({
                username: this.formData.username,
                email: this.formData.email,
            });
            if (response?.success) {
                this.$emit(`on-next-step`);
            } else {
                this.showErrorNotificationFunction(response?.message || 'Đăng ký thất bại');
            }
        }
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

:deep(.next-step-btn) {
    height: 42px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
    border: none;
    width: 100%;
}
:deep(.next-step-btn:hover) {
    background-color: $color-green !important;
}
</style>
