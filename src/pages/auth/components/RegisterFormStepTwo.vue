<template>
    <div class="form">
        <div class="fullName form-items">
            <BaseInputText
                v-model:value="formData.fullName"
                label="Tên của bạn"
                placeholder="Tên của bạn"
                :error="translateYupError(formData.errors.fullName as IYupError)"
                @on-enter="onSubmit"
                isRequired="true"
            />
        </div>

        <div class="phone form-items">
            <BaseInputText
                v-model:value="formData.phone"
                label="Số điện thoại"
                placeholder="Số điện thoại"
                :error="translateYupError(formData.errors.phone as IYupError)"
                @on-enter="onSubmit"
            />
        </div>

        <div class="birthday form-items">
            <BaseDatePicker
                v-model:value="formData.birthday"
                label="Ngày sinh"
                placeholder="Ngày sinh"
                :error="translateYupError(formData.errors.birthday as IYupError)"
                @on-enter="onSubmit"
            />
        </div>

        <div class="address form-items">
            <div>Địa chỉ</div>
            <BaseInputText
                v-model:value="formData.address!.province"
                placeholder="Tỉnh/Thành phố"
                :error="translateYupError(formData.errors.address?.province as IYupError)"
                @on-enter="onSubmit"
            />
            <BaseInputText
                v-model:value="formData.address!.ward"
                placeholder="Quận/Huyện"
                :error="translateYupError(formData.errors.address?.ward as IYupError)"
                @on-enter="onSubmit"
            />
            <BaseInputText
                v-model:value="formData.address!.district"
                placeholder="Phường/Xã"
                :error="translateYupError(formData.errors.address?.district as IYupError)"
                @on-enter="onSubmit"
            />
            <BaseInputText
                v-model:value="formData.address!.detail"
                placeholder="Địa chỉ chi tiết"
                :error="translateYupError(formData.errors.address?.detail as IYupError)"
                @on-enter="onSubmit"
            />
        </div>
        <div class="d-flex flex-row w-100">
            <el-button @click="onPrevious" class="register-btn" type="primary">Quay lại</el-button>
            <el-button @click="onSubmit" class="register-btn" type="primary">Đăng ký</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model } from 'vue-property-decorator';
import { IRegisterForm } from '../interface';

@Options({
    components: {},
})
export default class RegisterFormStepTwo extends GlobalMixin {
    @Model('formData', { type: Object }) formData!: IRegisterForm & { errors: any };

    async onSubmit() {
        this.$emit('on-next-step');
    }

    async onPrevious() {
        this.$emit('on-previous-step');
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

:deep(.register-btn) {
    height: 42px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
    border: none;
    width: 100%;
}
:deep(.register-btn:hover) {
    background-color: $color-green !important;
}
.password {
    margin-bottom: 0px !important;
}
</style>
