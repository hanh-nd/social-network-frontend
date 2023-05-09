<template>
    <div class="share-post-dialog-wrapper">
        <el-dialog
            custom-class="share-post-dialog"
            :model-value="isShowSharePostDialog"
            title="Chia sẻ lên dòng thời gian của bạn"
            @opened="onOpen"
            @closed="onClose"
            :width="deviceType === DeviceType.MOBILE ? `80%` : `50%`"
            center
        >
            <div class="header">
                <BaseInputText
                    v-model:value="sharePostForm.content"
                    type="textarea"
                    :autosize="{
                        minRows: 5,
                    }"
                    placeholder="Bạn muốn chia sẻ điều gì?"
                    :error="translateYupError(sharePostForm.errors.content as IYupError)"
                />
            </div>
            <div class="content">
                <BasePostContent :post="post" />
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <div class="privacy">
                        <BaseSingleSelect
                            v-model:value="sharePostForm.privacy"
                            :options="privacyOptions"
                            :error="translateYupError(sharePostForm.errors.privacy as IYupError)"
                        />
                    </div>
                    <div class="button-group">
                        <el-button class="cancel" @click="onCancel">Hủy</el-button>
                        <el-button type="primary" @click="onSubmit">Chia sẻ</el-button>
                    </div>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Privacy, PrivacyName, ValidationForm } from '@/common/constants';
import { ICreateNewPostBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

@Options({
    components: {},
    emits: [],
})
export default class PostDetailDialog extends GlobalMixin {
    get post() {
        return appModule.postDetail;
    }

    get isShowSharePostDialog() {
        return appModule.isShowSharePostDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get privacyOptions() {
        return Object.values(Privacy).map((value) => {
            return {
                name: PrivacyName[value],
                id: value,
            };
        });
    }

    onOpen() {
        this.sharePostForm.setFieldValue('postSharedId', this.post._id);
    }

    goToProfilePage() {
        this.onClose();
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.post?.author?._id,
            },
        });
    }

    onClose() {
        appModule.setIsShowSharePostDialog(false);
    }

    sharePostForm = setup(() => {
        const initValues: ICreateNewPostBody = {
            privacy: Privacy.PUBLIC,
            content: '',
            pictureIds: [],
            videoIds: [],
            postSharedId: undefined,
        };

        const schema = yup.object({
            privacy: yup.number().integer().required(),
            content: yup.string().max(ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH).required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<ICreateNewPostBody>({
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
                this.showSuccessNotificationFunction('Chia sẻ bài viết mới thành công');
                appModule.setIsShowCreatePostDialog(false);
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Chia sẻ bài viết mới thất bại');
            }
        });

        const { value: privacy } = useField<number>('privacy');
        const { value: content } = useField<string>('content');

        return {
            privacy,
            content,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.sharePostForm.submit();
        this.onClose();
    }

    async onCancel() {
        this.onClose();
    }
}
</script>

<style lang="scss" scoped>
:deep(.share-post-dialog) {
    margin-top: 40px;
    max-height: 90%;
    overflow: auto;
    .el-dialog__body {
        display: flex;
        flex-direction: column;
    }
}
</style>
