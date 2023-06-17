<template>
    <el-dialog
        custom-class="update-user-role-dialog"
        :model-value="isShowUpdateUserRoleDialog"
        @closed="onClose"
        title="Chỉnh sửa vai trò"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="form">
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="updateUserForm.roleId"
                    label="Vai trò"
                    :options="roleOptions"
                    placeholder="Chọn vai trò"
                    :error="translateYupError(updateUserForm.errors.roleId as IYupError)"
                />
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit()" class="submit-btn" type="primary">Cập nhật</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { IUpdateUserRoleBody, IUser, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminUserApiService from '@/common/service/admin.user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { adminUserModule } from '../store';

@Options({
    components: {},
})
export default class UpdateUserRoleDialog extends GlobalMixin {
    get roleOptions() {
        return appModule.roles.map((role) => {
            return {
                id: role._id,
                name: role.name,
            };
        });
    }

    get isShowUpdateUserRoleDialog() {
        return adminUserModule.isShowUpdateUserRoleDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get selectedUser() {
        return adminUserModule.selectedUser;
    }

    onClose() {
        adminUserModule.setIsShowUpdateUserRoleDialog(false);
        adminUserModule.setSelectedUser({} as IUser);
    }

    updateUserForm = setup(() => {
        const initValues: IUpdateUserRoleBody = {
            roleId: '',
        };

        const schema = yup.object({
            roleId: yup.string().required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IUpdateUserRoleBody>({
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

        const submit = (user: IUser) =>
            handleSubmit(async (values) => {
                const { roleId } = values;
                const response = await adminUserApiService.updateUserRole(user._id, {
                    roleId,
                });
                if (response.success) {
                    adminUserModule.setIsShowUpdateUserRoleDialog(false);
                    Object.assign(user, values);
                    clearFormData();
                    this.showSuccessNotificationFunction('Cập nhật thông tin thành công');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật thông tin thất bại');
                }
            })();

        const { value: roleId } = useField('roleId');

        return {
            roleId,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    @Watch('selectedUser')
    onSelectedUserChange() {
        this.updateUserForm.setValues(this.selectedUser);
    }

    async onSubmit() {
        await this.updateUserForm.submit(this.selectedUser);
    }
}
</script>

<style lang="scss" scoped></style>
