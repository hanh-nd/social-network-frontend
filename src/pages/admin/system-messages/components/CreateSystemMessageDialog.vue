<template>
    <el-dialog
        custom-class="create-system-message-dialog"
        :model-value="isShowCreateSystemMessageDialog"
        @closed="onClose"
        title="Tạo mới khảo sát"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="form">
            <div class="form-item">
                <BaseInputText
                    v-model:value="createSystemMessageForm.code"
                    label="Mã"
                    placeholder="Nhập mã định danh"
                    :error="translateYupError(createSystemMessageForm.errors.code as IYupError)"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="createSystemMessageForm.template"
                    label="Template"
                    placeholder="Nhập template"
                    :error="translateYupError(createSystemMessageForm.errors.template as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="createSystemMessageForm.fullTemplate"
                    label="Template đầy đủ"
                    placeholder="Nhập template đày đủ"
                    :error="translateYupError(createSystemMessageForm.errors.fullTemplate as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="createSystemMessageForm.type"
                    label="Loại thông báo"
                    placeholder="Chọn loại thông báo"
                    :options="typeOptions"
                    :error="translateYupError(createSystemMessageForm.errors.type as IYupError)"
                />
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit()" class="submit-btn" type="primary">Tạo mới</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { SystemMessageType, SystemMessageTypeName } from '@/common/constants';
import { ICreateSystemMessageBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminSystemMessageApiService from '@/common/service/admin.system-messages.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { adminSystemMessageModule } from '../store';

@Options({
    components: {},
})
export default class CreateSystemMessageDialog extends GlobalMixin {
    get isShowCreateSystemMessageDialog() {
        return adminSystemMessageModule.isShowCreateSystemMessageDialog;
    }

    get deviceType() {
        return appModule.deviceType;
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
        adminSystemMessageModule.setIsShowCreateSystemMessageDialog(false);
    }

    createSystemMessageForm = setup(() => {
        const initValues: ICreateSystemMessageBody = {
            code: '',
            template: '',
            fullTemplate: '',
            type: SystemMessageType.INFO,
        };

        const schema = yup.object({
            code: yup.string().required(),
            template: yup.string().required(),
            fullTemplate: yup.string().required(),
            type: yup.string().required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<ICreateSystemMessageBody>({
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
            const response = await adminSystemMessageApiService.createSystemMessage(values);
            if (response.success) {
                adminSystemMessageModule.setIsShowCreateSystemMessageDialog(false);
                clearFormData();
                this.showSuccessNotificationFunction('Tạo mới khảo sát thành công');
                adminSystemMessageModule.getSystemMessageList();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra khi tạo mới khảo sát');
            }
        });

        const { value: code } = useField<string>('code');
        const { value: template } = useField<string>('template');
        const { value: fullTemplate } = useField<string>('fullTemplate');
        const { value: type } = useField<SystemMessageType>('type');

        return {
            code,
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

    async onSubmit() {
        await this.createSystemMessageForm.submit();
    }
}
</script>

<style lang="scss" scoped></style>
