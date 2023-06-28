<template>
    <div class="information-section-wrapper">
        <div class="form-item username">
            <BaseInputText v-model:value="loginUser.username" label="Tên tài khoản" :isDisabled="true" />
        </div>

        <div class="form-item full-name">
            <BaseInputText
                v-model:value="updateUserForm.fullName"
                label="Tên đầy đủ"
                :error="translateYupError(updateUserForm.errors.fullName as IYupError)"
                :isDisabled="!isEditing"
            />
        </div>

        <div class="form-item email">
            <BaseInputText
                v-model:value="updateUserForm.email"
                label="Địa chỉ email"
                :error="translateYupError(updateUserForm.errors.email as IYupError)"
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
import { IUpdateProfileBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({})
export default class InformationSection extends GlobalMixin {
    isEditing = false;

    get loginUser() {
        return appModule.loginUser;
    }

    updateUserForm = setup(() => {
        const initValues: IUpdateProfileBody = {
            fullName: this.loginUser.fullName,
            email: this.loginUser.email,
        };

        const schema = yup.object({
            fullName: yup.string(),
            email: yup.string(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IUpdateProfileBody>({
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
            const { fullName, email } = values;
            const response = await userApiService.updateProfile({
                fullName,
                email,
            });
            if (response.success) {
                Object.assign(this.loginUser, values);
                this.showSuccessNotificationFunction('Cập nhật thông tin thành công');
                this.isEditing = false;
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật thông tin thất bại');
            }
        });

        const { value: fullName } = useField<string>('fullName');
        const { value: email } = useField<string>('email');

        return {
            fullName,
            email,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    onCancel() {
        this.isEditing = false;
        this.updateUserForm.setFieldValue('fullName', this.loginUser.fullName);
        this.updateUserForm.setFieldValue('email', this.loginUser.email);
    }

    onSubmit() {
        this.updateUserForm.submit();
    }
}
</script>

<style lang="scss" scoped>
.information-section-wrapper {
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
