<template>
    <el-dialog
        custom-class="create-new-group-dialog"
        :model-value="isShowCreateNewGroupDialog"
        @closed="onClose"
        title="Tạo nhóm mới"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="body">
            <div class="name">
                <BaseInputText
                    v-model:value="createGroupForm.name"
                    :error="translateYupError(createGroupForm.errors.name as IYupError)"
                    placeholder="Nhập tên nhóm"
                    :maxLength="ValidationForm.INPUT_TEXT_MAX_LENGTH"
                    label="Tên nhóm"
                    isRequired="true"
                />
            </div>
            <div class="private">
                <BaseSingleSelect
                    label="Hiển thị"
                    v-model:value="createGroupForm.isPrivate"
                    :options="privateOptions"
                    :error="translateYupError(createGroupForm.errors.private as IYupError)"
                />
            </div>
            <div class="review-post">
                <BaseSingleSelect
                    label="Phê duyệt bài viết"
                    v-model:value="createGroupForm.reviewPost"
                    :options="reviewPostOptions"
                    :error="translateYupError(createGroupForm.errors.reviewPost as IYupError)"
                />
            </div>
            <div class="image-chooser">
                <img v-if="createGroupForm.coverId" :src="getImageSourceById(createGroupForm.coverId)" />
                <BaseUploadSingleButton @on-file-uploaded="onSelectPictures">Chọn ảnh bìa</BaseUploadSingleButton>
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit" class="submit-btn" type="primary">Tạo</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType, ValidationForm } from '@/common/constants';
import { ICreateGroupBody, IFile, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { groupModule } from '../store';

@Options({
    components: {},
})
export default class CreateNewGroupDialog extends GlobalMixin {
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

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowCreateNewGroupDialog() {
        return groupModule.isShowCreateNewGroupDialog;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    onClose() {
        groupModule.setIsShowCreateNewGroupDialog(false);
    }

    createGroupForm = setup(() => {
        const initValues: ICreateGroupBody = {
            name: '',
            private: false,
            reviewPost: false,
            coverId: undefined,
        };

        const schema = yup.object({
            name: yup.string().max(ValidationForm.INPUT_TEXT_MAX_LENGTH).required(),
            private: yup.bool(),
            reviewPost: yup.bool(),
            coverId: yup.string(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<ICreateGroupBody>({
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
            const response = await groupApiService.createGroup(values);
            if (response?.success) {
                const createdGroup = response?.data;
                this.showSuccessNotificationFunction('Tạo nhóm mới thành công');
                groupModule.setIsShowCreateNewGroupDialog(false);
                groupModule.joinedGroupList.unshift(createdGroup);
                groupModule.createdGroupList.unshift(createdGroup);
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Tạo nhóm mới thất bại');
            }
        });

        const { value: name } = useField<number>('name');
        const { value: isPrivate } = useField<boolean>('private');
        const { value: reviewPost } = useField<boolean>('reviewPost');
        const { value: coverId } = useField<string>('coverId');

        return {
            name,
            isPrivate,
            reviewPost,
            coverId,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.createGroupForm.submit();
    }

    async onSelectPictures(file: IFile, filePreview: File) {
        this.createGroupForm.setFieldValue('coverId', file.id);
    }
}
</script>
<style lang="scss" scoped>
.create-new-group-dialog {
    .body {
        .image-chooser {
            display: flex;
            flex-direction: column;
            justify-content: center;

            img {
                width: 100%;
                height: 150px;
                object-fit: cover;
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
