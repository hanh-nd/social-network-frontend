<template>
    <div class="password-section-wrapper">
        <div class="form-item old-password">
            <BaseInputText
                v-model:value="updatePasswordForm.oldPassword"
                label="Mật khẩu cũ"
                type="password"
                :isDisabled="!isEditing"
                :error="translateYupError(updatePasswordForm.errors.oldPassword as IYupError)"
            />
        </div>

        <div class="form-item new-password">
            <BaseInputText
                v-model:value="updatePasswordForm.password"
                :error="translateYupError(updatePasswordForm.errors.password as IYupError)"
                label="Mật khẩu mới"
                type="password"
                :isDisabled="!isEditing"
            />
        </div>

        <div class="form-item re-password">
            <BaseInputText
                v-model:value="updatePasswordForm.rePassword"
                :error="translateYupError(updatePasswordForm.errors.rePassword as IYupError)"
                label="Nhập lại mật khẩu mới"
                type="password"
                :isDisabled="!isEditing"
            />
        </div>

        <div class="edit-button" v-if="!isEditing" @click="isEditing = true">Chỉnh sửa</div>

        <div class="action-button" v-if="isEditing">
            <el-button @click="onCancel">Hủy</el-button>
            <el-button @click="onSubmit" type="primary">Cập nhật</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { IChangePasswordBody } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({})
export default class PasswordSection extends GlobalMixin {
    isEditing = false;

    updatePasswordForm = setup(() => {
        const initValues: IChangePasswordBody = {
            oldPassword: '',
            password: '',
            rePassword: '',
        };

        const schema = yup.object({
            oldPassword: yup.string().required(),
            password: yup.string().required(),
            rePassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp'),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IChangePasswordBody>({
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
            const { oldPassword, password } = values;
            const response = await userApiService.changePassword({
                oldPassword,
                password,
            });
            if (response.success) {
                Object.assign(this.loginUser, values);
                this.showSuccessNotificationFunction('Cập nhật thông tin thành công');
                this.isEditing = false;
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật thông tin thất bại');
            }
        });

        const { value: oldPassword } = useField<string>('oldPassword');
        const { value: password } = useField<string>('password');
        const { value: rePassword } = useField<string>('rePassword');

        return {
            oldPassword,
            password,
            rePassword,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    onCancel() {
        this.isEditing = false;
        this.updatePasswordForm.clearFormData();
    }

    onSubmit() {
        this.updatePasswordForm.submit();
    }
}
</script>

<style lang="scss" scoped>
.password-section-wrapper {
    background: $color-white;
    padding: 16px;
    border-radius: 8px;
    position: relative;

    .edit-button {
        position: absolute;
        right: 16px;
        top: 16px;
        cursor: pointer;
        color: $color-green;
        font-weight: 500;
    }
}
</style>
