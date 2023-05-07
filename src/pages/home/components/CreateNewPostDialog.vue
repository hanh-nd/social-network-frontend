<template>
    <el-dialog
        custom-class="create-new-post-dialog"
        :model-value="isShowCreatePostDialog"
        @closed="onClose"
        title="Tạo bài viêt mới"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="header">
            <div class="avatar">
                <BaseRoundAvatar :user="loginUser" :size="42" />
            </div>
            <div class="information">
                <div class="user-name">{{ loginUser.fullName || loginUser.email }}</div>
                <div class="privacy">
                    <BaseSingleSelect
                        v-model:value="createPostForm.privacy"
                        :options="privacyOptions"
                        :error="translateYupError(createPostForm.errors.privacy as IYupError)"
                    />
                </div>
            </div>
        </div>
        <BaseDivider />
        <div class="body">
            <div class="content">
                <BaseInputText
                    v-model:value="createPostForm.content"
                    :error="translateYupError(createPostForm.errors.content as IYupError)"
                    placeholder="Bạn muốn chia sẻ điều gì?"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <BaseImageGrid :items="createPostForm.pictureIds" :cells="3" />
            <BaseDivider />
            <div class="image-chooser">
                <BaseUploadSingleButton @on-file-uploaded="onSelectPictures">Chọn ảnh</BaseUploadSingleButton>
            </div>
            <BaseDivider />
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit" class="submit-btn" type="primary">Chia sẻ</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType, Privacy, PrivacyName, ValidationForm } from '@/common/constants';
import { IFile, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { ICreateNewPostBody } from '../interfaces';
import { homeModule } from '../store';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class CreateNewPostDialog extends GlobalMixin {
    get privacyOptions() {
        return Object.values(Privacy).map((value) => {
            return {
                name: PrivacyName[value],
                id: value,
            };
        });
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowCreatePostDialog() {
        return homeModule.isShowCreatePostDialog;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    onClose() {
        homeModule.setIsShowCreatePostDialog(false);
    }

    createPostForm = setup(() => {
        const initValues: ICreateNewPostBody = {
            privacy: Privacy.PUBLIC,
            content: '',
            pictureIds: [],
            videoIds: [],
        };

        const schema = yup.object({
            privacy: yup.number().integer().required(),
            content: yup.string().max(ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH).required(),
            pictureIds: yup.array().of(yup.string()),
            videoIds: yup.array().of(yup.string()),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm({
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
            const response = await postApiService.createPost(values);
            if (response.success) {
                this.showSuccessNotificationFunction('Tạo bài viết mới thành công');
                homeModule.setIsShowCreatePostDialog(false);
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Tạo bài viết mới thất bại');
            }
        });

        const { value: privacy } = useField<number>('privacy');
        const { value: content } = useField<string>('content');
        const { value: pictureIds } = useField<string[]>('pictureIds');
        const { value: videoIds } = useField<string[]>('videoIds');

        return {
            privacy,
            content,
            pictureIds,
            videoIds,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.createPostForm.submit();
    }

    async onSelectPictures(file: IFile, filePreview: File) {
        const pictureIds = this.createPostForm.pictureIds;
        pictureIds.push(file.id);
        this.createPostForm.setFieldValue('pictureIds', pictureIds);
    }
}
</script>
<style lang="scss" scoped>
.create-new-post-dialog {
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        .information {
            .user-name {
                font-weight: 700;
                font-size: 16px;
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
