<template>
    <el-dialog
        custom-class="report-user-dialog"
        :model-value="isShowReportUserDialog"
        @closed="onClose"
        title="Báo cáo người dùng"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="body">
            <div class="content">
                <BaseInputText
                    v-model:value="reportUserForm.reportReason"
                    :error="translateYupError(reportUserForm.errors.reportReason as IYupError)"
                    placeholder="Người dùng vi phạm điều gì?"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit" class="submit-btn" type="primary">Báo cáo</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType, ValidationForm } from '@/common/constants';
import { IReportPostBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { profileModule } from '../store';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class ReportUserDialog extends GlobalMixin {
    get deviceType() {
        return appModule.deviceType;
    }

    get isShowReportUserDialog() {
        return profileModule.isShowReportUserDialog;
    }

    get profileUser() {
        return profileModule.profileUser;
    }

    onClose() {
        profileModule.setIsShowReportUserDialog(false);
    }

    reportUserForm = setup(() => {
        const initValues: IReportPostBody = {
            reportReason: '',
        };

        const schema = yup.object({
            reportReason: yup.string().max(ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH).required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IReportPostBody>({
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
            if (!this.profileUser?._id) return;

            const response = await userApiService.reportUser(this.profileUser._id, values);
            if (response.success) {
                this.showSuccessNotificationFunction('Báo cáo người dùng thành công');
                profileModule.setIsShowReportUserDialog(false);
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Báo cáo người dùng thất bại');
            }
        });

        const { value: reportReason } = useField<string>('reportReason');

        return {
            reportReason,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.reportUserForm.submit();
    }
}
</script>
<style lang="scss" scoped>
.report-user-dialog {
    .body {
        .content {
            :deep(.el-textarea__inner) {
                border: none !important;
                box-shadow: none !important;
                background-color: transparent !important;
            }
        }

        .image-chooser {
            display: flex;
            justify-content: center;
        }
    }

    .footer {
        .submit-btn {
            width: 100%;
        }
    }
}
</style>
