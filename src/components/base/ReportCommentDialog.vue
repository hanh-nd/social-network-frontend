<template>
    <el-dialog
        custom-class="report-post-dialog"
        :model-value="isShowReportCommentDialog"
        @closed="onClose"
        title="Báo cáo bài viết"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="body">
            <div class="content">
                <BaseInputText
                    v-model:value="reportCommentForm.reportReason"
                    :error="translateYupError(reportCommentForm.errors.reportReason as IYupError)"
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
import commentApiService from '@/common/service/comment.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class ReportCommentDialog extends GlobalMixin {
    get deviceType() {
        return appModule.deviceType;
    }

    get isShowReportCommentDialog() {
        return appModule.isShowReportCommentDialog;
    }

    get commentDetail() {
        return appModule.commentDetail;
    }

    onClose() {
        appModule.setIsShowReportCommentDialog(false);
    }

    reportCommentForm = setup(() => {
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
            if (!this.commentDetail?.post?._id) return;

            const response = await commentApiService.reportComment(
                this.commentDetail?.post?._id,
                this.commentDetail?._id,
                values,
            );
            if (response.success) {
                this.showSuccessNotificationFunction('Báo cáo bình luận thành công');
                appModule.setIsShowReportCommentDialog(false);
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Báo cáo bình luận thất bại');
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
        await this.reportCommentForm.submit();
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
