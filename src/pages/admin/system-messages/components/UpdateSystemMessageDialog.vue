<template>
    <el-dialog
        custom-class="update-user-dialog"
        :model-value="isShowUpdateSystemMessageDialog"
        @closed="onClose"
        title="Chỉnh sửa thông tin chi tiết"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="form">
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateSystemMessageForm.template"
                    label="Template"
                    placeholder="Nhập template"
                    :error="translateYupError(updateSystemMessageForm.errors.template as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateSystemMessageForm.fullTemplate"
                    label="Template đầy đủ"
                    placeholder="Nhập template đày đủ"
                    :error="translateYupError(updateSystemMessageForm.errors.fullTemplate as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="updateSystemMessageForm.type"
                    label="Loại thông báo"
                    placeholder="Chọn loại thông báo"
                    :options="typeOptions"
                    :error="translateYupError(updateSystemMessageForm.errors.type as IYupError)"
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
import { SystemMessageType, SystemMessageTypeName } from '@/common/constants';
import { ISystemMessage, IUpdateSystemMessageBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminSystemMessageApiService from '@/common/service/admin.system-messages.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { adminSystemMessageModule } from '../store';

@Options({
    components: {},
})
export default class UpdateSystemMessageDialog extends GlobalMixin {
    get isShowUpdateSystemMessageDialog() {
        return adminSystemMessageModule.isShowUpdateSystemMessageDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get selectedSystemMessage() {
        return adminSystemMessageModule.selectedSystemMessage;
    }

    get typeOptions() {
        return Object.values(SystemMessageType).map((type) => {
            return {
                id: type,
                name: SystemMessageTypeName[type],
            };
        });
    }

    onClose() {
        adminSystemMessageModule.setIsShowUpdateSystemMessageDialog(false);
        adminSystemMessageModule.setSelectedSystemMessage({} as ISystemMessage);
    }

    updateSystemMessageForm = setup(() => {
        const initValues: IUpdateSystemMessageBody = {
            template: undefined,
            fullTemplate: undefined,
            type: undefined,
        };

        const schema = yup.object({
            template: yup.string(),
            fullTemplate: yup.string(),
            type: yup.string(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IUpdateSystemMessageBody>({
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

        const submit = (systemMessage: ISystemMessage) =>
            handleSubmit(async (values) => {
                const response = await adminSystemMessageApiService.updateSystemMessage(systemMessage._id, values);
                if (response.success) {
                    adminSystemMessageModule.setIsShowUpdateSystemMessageDialog(false);
                    Object.assign(systemMessage, values);
                    clearFormData();
                    this.showSuccessNotificationFunction('Cập nhật thông tin thành công');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật thông tin thất bại');
                }
            })();

        const { value: template } = useField<string>('template');
        const { value: fullTemplate } = useField<string>('fullTemplate');
        const { value: type } = useField<SystemMessageType>('type');

        return {
            template,
            fullTemplate,
            type,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    @Watch('selectedSystemMessage')
    onSelectedSystemMessageChange() {
        this.updateSystemMessageForm.setValues(this.selectedSystemMessage);
    }

    async onSubmit() {
        await this.updateSystemMessageForm.submit(this.selectedSystemMessage);
    }
}
</script>

<style lang="scss" scoped></style>
