<template>
    <div class="comment-wrapper">
        <div class="left-section">
            <div class="avatar">
                <BaseRoundAvatar :user="comment?.author" />
            </div>
            <div class="body">
                <div class="body-content">
                    <div class="author-name" @click="goToProfilePage">
                        {{ comment?.author?.fullName || comment?.author?.username }}
                    </div>
                    <div class="content">
                        <div class="edit-input" v-if="isEditing">
                            <BaseInputText
                                v-model:value="editCommentForm.content"
                                :error="editCommentForm.errors.content"
                                placeholder="Nhập bình luận"
                                type="textarea"
                                :autosize="true"
                                @on-enter="onSubmit"
                            />
                            <el-button @click="onSubmit">Gửi</el-button>
                        </div>
                        <div class="comment" v-else>
                            {{ comment.content }}
                        </div>
                    </div>
                </div>
                <div class="action-group">
                    <BaseFullReactionBar :target="comment" :onLike="reactComment" />

                    <div class="reaction-count">
                        <Icon icon="solar:like-bold" height="16" />
                        {{ comment?.numberOfReacts }}
                    </div>
                    <div class="created-at">
                        <Icon icon="mingcute:time-fill" height="16" />
                        {{ parseDateTimeRelative(comment?.createdAt) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="right-section">
            <div class="author-settings" v-if="isAuthor()">
                <BaseThreeDotMenu>
                    <el-dropdown-item @click="editComment"
                        ><el-icon :size="16"><Edit /></el-icon>Chỉnh sửa bình luận</el-dropdown-item
                    >
                    <el-dropdown-item @click="deleteComment"
                        ><el-icon :size="16"><Delete /></el-icon>Xóa</el-dropdown-item
                    >
                </BaseThreeDotMenu>
            </div>
            <div class="guest-settings" v-else>
                <BaseThreeDotMenu>
                    <el-dropdown-item @click="reportComment"
                        ><el-icon :size="16"><Service /></el-icon>Báo cáo bình luận</el-dropdown-item
                    >
                    <el-dropdown-item @click="blockUser"
                        ><el-icon :size="16"><Remove /></el-icon>Chặn người dùng này</el-dropdown-item
                    >
                </BaseThreeDotMenu>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { IComment } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import commentApiService from '@/common/service/comment.api.service';
import postApiService from '@/common/service/post.api.service';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { Icon } from '@iconify/vue';
import { isNil } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
    components: {
        Icon,
    },
    emits: [],
})
export default class Comment extends GlobalMixin {
    @Prop() comment!: IComment;
    isEditing = false;

    get isShow() {
        return isNil(this.comment.deletedAt);
    }

    goToProfilePage() {
        if (!this.comment?.author?._id) return;

        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.comment?.author?._id,
            },
        });
    }

    async reactComment(type = ReactionType.LIKE) {
        if (!this.comment?.post?._id) return;

        const response = await postApiService.reactComment(this.comment?.post?._id, this.comment?._id, {
            type,
        });
        if (response?.success) {
            this.comment.isReacted = !this.comment.isReacted;
            this.comment.numberOfReacts += this.comment.isReacted ? 1 : -1;
            this.comment.reactionType = type;
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra khi tương tác bình luận này.`);
        }
    }

    isAuthor() {
        return appModule.loginUser?._id === this.comment?.author?._id;
    }

    editComment() {
        this.isEditing = true;
    }

    async deleteComment() {
        if (!this.comment?.post?._id) return;
        const response = await commentApiService.deleteComment(this.comment?.post?._id, this.comment?._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`Xóa bình luận thành công`);
            Object.assign(this.comment, {
                deletedAt: new Date(),
            });
        } else {
            this.showErrorNotificationFunction(`Xóa bình luận thất bại`);
        }
    }

    async reportComment() {
        appModule.setCommentDetail(this.comment);
        appModule.setIsShowReportCommentDialog(true);
    }

    async blockUser() {
        if (!this.comment?.author?._id) return;
        const response = await userApiService.blockUser(this.comment?.author?._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`Chặn người dùng thành công`);
        } else {
            this.showErrorNotificationFunction(`Chặn người dùng thất bại`);
        }
    }

    @Watch('comment')
    onCommentChange() {
        this.editCommentForm.setFieldValue('content', this.comment.content);
    }

    editCommentForm = setup(() => {
        const initValues = {
            content: this.comment?.content || '',
        };

        const schema = yup.object({
            content: yup.string().required(),
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

        const submit = (comment: IComment) =>
            handleSubmit(async (values) => {
                if (!comment?.post?._id) return;
                const response = await commentApiService.editComment(comment?.post?._id, comment?._id, {
                    content: values.content,
                });
                if (response.success) {
                    comment.content = values.content;
                    this.showSuccessNotificationFunction('Cập nhật bình luận thành công.');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật bình luận thất bại');
                }

                this.isEditing = false;
            })();

        const { value: content } = useField<string>('content');

        return {
            content,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.editCommentForm.submit(this.comment);
    }
}
</script>

<style lang="scss" scoped>
.comment-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left-section {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 8px;
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .body-content {
            padding: 8px;
            border-radius: 8px;
            background: $color-gray;

            .author-name {
                font-weight: 700;
                cursor: pointer;
            }
        }

        .action-group {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;

            :deep(.full-reaction-popover) {
                width: 300px !important;
                .full-reaction {
                    display: flex;
                    flex-direction: row;
                }
            }

            .react {
                cursor: pointer;
                .reacted {
                    color: $color-green;
                    font-weight: 700;
                }
            }
        }
    }
}
</style>
