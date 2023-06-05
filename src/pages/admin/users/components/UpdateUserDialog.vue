<template>
    <el-dialog
        custom-class="update-user-dialog"
        :model-value="isShowUpdateUserDialog"
        @closed="onClose"
        title="Chỉnh sửa thông tin chi tiết"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="form">
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateUserForm.fullName"
                    label="Tên"
                    placeholder="Nhập tên"
                    :error="translateYupError(updateUserForm.errors.fullName as IYupError)"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateUserForm.phone"
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    :error="translateYupError(updateUserForm.errors.phone as IYupError)"
                />
            </div>

            <div class="form-item">
                <BaseDatePicker
                    v-model:value="updateUserForm.birthday"
                    label="Ngày sinh"
                    placeholder="Ngày sinh"
                    :error="translateYupError(updateUserForm.errors.birthday as IYupError)"
                    @on-enter="onSubmit"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateUserForm.describe"
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                    :error="translateYupError(updateUserForm.errors.describe as IYupError)"
                />
            </div>
            <div class="form-item">
                <div style="font-weight: 700">Địa chỉ</div>
                <BaseInputText
                    v-model:value="updateUserForm.address!.province"
                    placeholder="Tỉnh/Thành phố"
                    :error="translateYupError(updateUserForm.errors['address.province'] as IYupError)"
                    @on-enter="onSubmit"
                />
                <BaseInputText
                    v-model:value="updateUserForm.address!.district"
                    placeholder="Quận/Huyện"
                    :error="translateYupError(updateUserForm.errors['address.district'] as IYupError)"
                    @on-enter="onSubmit"
                />
                <BaseInputText
                    v-model:value="updateUserForm.address!.ward"
                    placeholder="Phường/Xã"
                    :error="translateYupError(updateUserForm.errors['address.ward'] as IYupError)"
                    @on-enter="onSubmit"
                />
                <BaseInputText
                    v-model:value="updateUserForm.address!.detail"
                    placeholder="Địa chỉ chi tiết"
                    :error="translateYupError(updateUserForm.errors['address.detail'] as IYupError)"
                    @on-enter="onSubmit"
                />
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit()" class="submit-btn" type="primary">Chỉnh sửa</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { IAddress, IUpdateProfileBody, IUser, IYupError } from '@/common/interfaces';
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
export default class UpdateUserDialog extends GlobalMixin {
    get isShowUpdateUserDialog() {
        return adminUserModule.isShowUpdateUserDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get selectedUser() {
        return adminUserModule.selectedUser;
    }

    onClose() {
        adminUserModule.setIsShowUpdateUserDialog(false);
        adminUserModule.setSelectedUser({} as IUser);
    }

    updateUserForm = setup(() => {
        const initValues: IUpdateProfileBody = {
            fullName: '',
            phone: '',
            address: {} as IAddress,
            describe: '',
            birthday: undefined,
        };

        const schema = yup.object({
            fullName: yup.string(),
            phone: yup.string(),
            address: yup.object(),
            describe: yup.string(),
            birthday: yup.date().optional(),
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

        const submit = (user: IUser) =>
            handleSubmit(async (values) => {
                const response = await adminUserApiService.updateUser(user._id, values);
                if (response.success) {
                    adminUserModule.setIsShowUpdateUserDialog(false);
                    Object.assign(user, values);
                    clearFormData();
                    this.showSuccessNotificationFunction('Cập nhật thông tin thành công');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật thông tin thất bại');
                }
            })();

        const { value: fullName } = useField<string>('fullName');
        const { value: phone } = useField<string>('phone');
        const { value: address } = useField<IAddress>('address');
        const { value: describe } = useField<string>('describe');
        const { value: birthday } = useField('birthday');

        return {
            fullName,
            phone,
            address,
            describe,
            birthday,
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
