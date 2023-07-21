<template>
    <div class="setting-section-wrapper">
        <div class="form-item alert-range">
            <BaseSingleSelect
                label="Cảnh báo mỗi"
                v-model:value="updateUserForm.alertRange"
                :isDisabled="!isEditing"
                :options="alertRangeOptions"
                :error="translateYupError(updateUserForm.errors.alertRange as IYupError)"
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
import { IUpdateAlertTimeRange, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({})
export default class SettingSection extends GlobalMixin {
    isEditing = false;

    get loginUser() {
        return appModule.loginUser;
    }

    get alertRangeOptions() {
        return [1, 5, 10, 15, 20, 25, 30].map((range) => {
            return {
                id: range,
                name: `${range} phút`,
            };
        });
    }

    updateUserForm = setup(() => {
        const initValues: IUpdateAlertTimeRange = {
            alertRange: this.loginUser.alertRange || 5,
        };

        const schema = yup.object({
            fullName: yup.string(),
            email: yup.string(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IUpdateAlertTimeRange>({
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
            const { alertRange } = values;
            const response = await userApiService.updateSetting({
                alertRange,
            });
            if (response.success) {
                Object.assign(this.loginUser, values);
                this.showSuccessNotificationFunction('Cập nhật cài đặt thành công');
                this.isEditing = false;
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật cài đặt thất bại');
            }
        });

        const { value: alertRange } = useField<string>('alertRange');

        return {
            alertRange,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    onCancel() {
        this.isEditing = false;
        this.updateUserForm.setFieldValue('alertRange', this.loginUser.alertRange);
    }

    onSubmit() {
        this.updateUserForm.submit();
    }
}
</script>

<style lang="scss" scoped>
.setting-section-wrapper {
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
