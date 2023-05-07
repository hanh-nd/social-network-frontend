<template>
    <div class="create-comment-bar">
        <div class="avatar">
            <BaseRoundAvatar :user="loginUser" />
        </div>

        <div class="content form-items">
            <BaseInputText
                v-model:value="commentForm.content"
                type="textarea"
                :autosize="true"
                placeholder="Nhập bình luận"
                :error="translateYupError(commentForm.errors.content as IYupError)"
                @on-enter="onSubmit"
            />
        </div>

        <el-button
            @click="onSubmit"
            :disabled="isCommenting"
            :loading="isCommenting"
            class="comment-btn"
            type="primary"
        >
            <template #loading>
                <BaseButtonInnerLoading />
            </template>
            {{ isCommenting ? '' : 'Gửi' }}
        </el-button>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import commentApiService from '@/common/service/comment.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-commented'],
})
export default class LoginForm extends GlobalMixin {
    @Prop() postId!: string;

    isCommenting = false;

    get loginUser() {
        return appModule.loginUser;
    }

    commentForm = setup(() => {
        const initValues = {
            content: '',
            pictureId: undefined,
        };

        const schema = yup.object({
            content: yup.string().required(),
            pictureId: yup.string().optional(),
        });

        const { resetForm, errors, handleSubmit } = useForm({
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

        const submit = (postId: string) =>
            handleSubmit(async (values) => {
                this.isCommenting = true;
                const response = await commentApiService.createComment(postId, {
                    content: values.content,
                    pictureId: values.pictureId,
                });

                if (response?.success) {
                    clearFormData();
                    this.$emit(`on-commented`);
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Không tạo được bình luận.');
                }

                this.isCommenting = false;
            })();

        const { value: content } = useField<string>('content');
        const { value: pictureId } = useField<string>('pictureId');

        return {
            content,
            pictureId,
            errors,
            submit,
            clearFormData,
        };
    });

    async onSubmit() {
        await this.commentForm.submit(this.postId);
    }
}
</script>
<style lang="scss" scoped>
.create-comment-bar {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;

    .content {
        width: 100%;

        :deep(.input-container) {
            margin-bottom: 0;
        }
    }
}
</style>
