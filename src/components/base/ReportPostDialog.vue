<template>
    <el-dialog
        custom-class="report-post-dialog"
        :model-value="isShowReportPostDialog"
        @closed="onClose"
        title="Báo cáo bài viết"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="body">
            <div class="content">
                <BaseInputText
                    v-model:value="reportPostForm.reportReason"
                    :error="translateYupError(reportPostForm.errors.reportReason as IYupError)"
                    placeholder="Bài viết vi phạm điều gì?"
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
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class ReportPostDialog extends GlobalMixin {
    get deviceType() {
        return appModule.deviceType;
    }

    get isShowReportPostDialog() {
        return appModule.isShowReportPostDialog;
    }

    get postDetail() {
        return appModule.postDetail;
    }

    onClose() {
        appModule.setIsShowReportPostDialog(false);
    }

    reportPostForm = setup(() => {
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
            const response = await postApiService.reportPost(this.postDetail._id, values);
            if (response.success) {
                this.showSuccessNotificationFunction('Báo cáo bài viết thành công');
                appModule.setIsShowReportPostDialog(false);
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Báo cáo bài viết thất bại');
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
        await this.reportPostForm.submit();
    }
}
</script>
<style lang="scss" scoped>
.report-post-dialog {
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
