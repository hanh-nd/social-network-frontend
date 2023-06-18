<template>
    <el-dialog
        custom-class="create-question-dialog"
        :model-value="isShowCreateQuestionDialog"
        @opened="onOpen"
        @closed="onClose"
        title="Đặt câu hỏi mới"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="header">
            <div class="avatar">
                <BaseRoundAvatar :user="loginUser" :size="42" />
            </div>
            <div class="information">
                <div class="user-name">{{ loginUser?.fullName || loginUser?.email }}</div>

                <div class="bottom">
                    <div class="anonymous">
                        <BaseSingleSelect
                            v-model:value="createQuestionForm.isAnonymous"
                            :options="isAnonymousOptions"
                            :error="translateYupError(createQuestionForm.errors.isAnonymous as IYupError)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <BaseDivider />
        <div class="body">
            <div class="content">
                <BaseInputText
                    v-model:value="createQuestionForm.question"
                    :error="translateYupError(createQuestionForm.errors.question as IYupError)"
                    placeholder="Bạn muốn đặt câu hỏi gì?"
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
                <el-button @click="onSubmit" class="submit-btn" type="primary">Chia sẻ</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType } from '@/common/constants';
import { ICreateQuestionBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import questionApiService from '@/common/service/question.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { profileModule } from '../../store';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class CreateQuestionDialog extends GlobalMixin {
    get isAnonymousOptions() {
        return [
            {
                id: false,
                name: 'Công khai. Người nhận sẽ thấy bạn đặt câu hỏi.',
            },
            {
                id: true,
                name: 'Ẩn danh. Người nhận sẽ không thấy người đặt câu hỏi là ai.',
            },
        ];
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowCreateQuestionDialog() {
        return profileModule.isShowCreateQuestionDialog;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get profile() {
        return profileModule.profileUser;
    }

    onOpen() {
        if (this.profile?._id) {
            this.createQuestionForm.setFieldValue('receiver', this.profile._id);
        }
    }

    onClose() {
        profileModule.setIsShowCreateQuestionDialog(false);
    }

    createQuestionForm = setup(() => {
        const initValues: ICreateQuestionBody = {
            receiver: '',
            isAnonymous: false,
            question: '',
        };

        const schema = yup.object({
            receiver: yup.string().required(),
            isAnonymous: yup.bool(),
            question: yup.string().required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<ICreateQuestionBody>({
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
            const response = await questionApiService.createQuestion(values);
            if (response?.success) {
                this.showSuccessNotificationFunction(`Đặt câu hỏi thành công`);
                clearFormData();
                this.onClose();
            } else {
                this.showErrorNotificationFunction(response?.message || `Đặt câu hỏi thất bại`);
            }
        });

        const { value: receiver } = useField<string>('receiver');
        const { value: isAnonymous } = useField<string>('isAnonymous');
        const { value: question } = useField<string>('question');

        return {
            isAnonymous,
            receiver,
            question,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.createQuestionForm.submit();
    }
}
</script>
<style lang="scss" scoped>
.create-question-dialog {
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        .information {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .user-name {
                font-weight: 700;
                font-size: 16px;
            }

            .bottom {
                display: flex;
                flex-direction: row;
                gap: 8px;
            }

            :deep(.form-container) {
                margin-bottom: 0;
            }

            :deep(.validation-error) {
                display: none;
            }

            :deep(.el-input) {
                height: 32px;
            }
        }
    }

    .body {
        .content {
            :deep(.el-textarea__inner) {
                border: none !important;
                box-shadow: none !important;
                background-color: transparent !important;
            }
        }
    }

    .footer {
        .submit-btn {
            width: 100%;
        }
    }
}
</style>
