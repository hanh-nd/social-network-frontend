<template>
    <div class="group-privacy-form-wrapper">
        <div class="header">
            <div class="title">Quyền riêng tư</div>

            <div class="edit-btn" v-if="isAdministrator()">
                <div @click="onEditDescribe">Cập nhật</div>
            </div>
        </div>
        <BaseDivider />

        <div class="privacy-form" v-if="isAdministrator() && isEditing">
            <div class="private">
                <BaseSingleSelect
                    label="Hiển thị"
                    v-model:value="updatePrivacyForm.isPrivate"
                    :options="privateOptions"
                    :error="translateYupError(updatePrivacyForm.errors.private as IYupError)"
                />
            </div>
            <div class="review-post">
                <BaseSingleSelect
                    label="Phê duyệt bài viết"
                    v-model:value="updatePrivacyForm.reviewPost"
                    :options="reviewPostOptions"
                    :error="translateYupError(updatePrivacyForm.errors.reviewPost as IYupError)"
                />
            </div>
            <div class="submit-btn">
                <el-button @click="onSubmit" type="primary">Lưu</el-button>
            </div>
        </div>
        <div class="privacy-content" v-else>
            <div class="private-section">
                <div class="header">{{ group?.private ? `Nhóm riêng tư` : `Nhóm công khai` }}</div>
                <div class="private">
                    {{
                        group?.private
                            ? `Chỉ thành viên nhóm mới xem được bài viết`
                            : `Mọi người đều có thể xem bài viêt của nhóm`
                    }}
                </div>
            </div>
            <BaseDivider />
            <div class="review-post-section">
                <div class="header">{{ group?.reviewPost ? `Duyệt bài viết` : `Không duyệt bài viết` }}</div>
                <div class="private">
                    {{
                        group?.reviewPost
                            ? `Các bài viết của thành viên cần sự phê duyệt của quản trị viên.`
                            : `Mọi bài viết từ thành viên sẽ được đăng tải ngay lập tức.`
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { groupDetailModule } from '../../store';

@Options({
    components: {},
})
export default class ProfileDescribeForm extends GlobalMixin {
    isEditing = false;

    get privateOptions() {
        return [
            {
                name: 'Công khai. Tất cả mọi người đều xem được bài viết trong nhóm.',
                id: false,
            },
            {
                name: 'Riêng tư. Chỉ những thành viên trong nhóm mới xem được bài viết.',
                id: true,
            },
        ];
    }

    get reviewPostOptions() {
        return [
            {
                name: 'Không. Mọi bài viết từ thành viên sẽ được đăng tải ngay lập tức.',
                id: false,
            },
            {
                name: 'Có. Các bài viết của thành viên cần sự phê duyệt của quản trị viên.',
                id: true,
            },
        ];
    }

    get group() {
        return groupDetailModule.groupDetail;
    }

    get administratorIds() {
        return this.group?.administrators?.map((admin) => `${admin.user?._id}`) || [];
    }

    get loginUser() {
        return appModule.loginUser;
    }

    isAdministrator() {
        return this.administratorIds.includes(`${this.loginUser?._id}`);
    }

    updatePrivacyForm = setup(() => {
        const initValues = {
            private: this.group?.private,
            reviewPost: this.group?.reviewPost,
        };

        const schema = yup.object({
            private: yup.bool(),
            reviewPost: yup.bool(),
        });

        const { resetForm, setValues, errors, handleSubmit } = useForm({
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
            const response = await groupApiService.updateGroup(this.group._id, values);
            if (response.success) {
                this.group.private = values.private ?? this.group.private;
                this.group.reviewPost = values.reviewPost ?? this.group.reviewPost;
                this.showSuccessNotificationFunction('Cập nhật thành công.');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật thất bại');
            }

            this.isEditing = false;
        });

        const { value: isPrivate } = useField<string>('private');
        const { value: reviewPost } = useField<string>('reviewPost');

        return {
            isPrivate,
            reviewPost,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    @Watch('group')
    onUserChange() {
        this.updatePrivacyForm.setValues({
            private: this.group?.private,
            reviewPost: this.group?.reviewPost,
        });
    }

    onEditDescribe() {
        this.isEditing = true;
    }

    async onSubmit() {
        await this.updatePrivacyForm.submit();
    }
}
</script>

<style lang="scss" scoped>
.group-privacy-form-wrapper {
    padding: 16px;
    background: $color-white;
    border-radius: 8px;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title {
            font-size: 24px;
            font-weight: 500;
        }
    }
    .privacy-form {
        display: flex;
        flex-direction: column;

        .input-form {
            width: 100%;
        }
    }
    .privacy-content {
        display: flex;
        flex-direction: column;

        .header {
            font-weight: 500;
        }
    }

    .edit-btn {
        color: $color-green;
        cursor: pointer;
        font-weight: 500;
        font-size: 16px;
    }
}
</style>
