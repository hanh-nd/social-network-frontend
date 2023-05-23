<template>
    <el-dialog
        custom-class="create-new-chat-dialog"
        :model-value="isShowCreateChatDialog"
        @closed="onClose"
        title="Tạo đoạn hội thoại mới"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="header">
            <div class="chat-type">
                <BaseSingleSelect
                    v-model:value="createChatForm.type"
                    :options="typeOptions"
                    :error="translateYupError(createChatForm.errors.type as IYupError)"
                />
            </div>
        </div>
        <BaseDivider />
        <div class="body">
            <div class="private">
                <BaseMultipleSelect
                    v-model:value="createChatForm.members"
                    :filterable="true"
                    :options="searchUserOptions"
                    :error="translateYupError(createChatForm.errors.members as IYupError)"
                    :remote="true"
                    :remoteMethod="onSearchUsers"
                    :limit="multipleLimit"
                />
            </div>
            <BaseDivider />
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit" class="submit-btn" type="primary">Tạo</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType } from '@/common/constants';
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import chatApiService from '@/common/service/chat.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { debounce } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { ChatType, ChatTypeName } from '../constants';
import { ICreateChatBody } from '../interfaces';
import { chatModule } from '../store';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class CreateChatDialog extends GlobalMixin {
    get typeOptions() {
        return Object.values(ChatType).map((value) => {
            return {
                name: ChatTypeName[value],
                id: value,
            };
        });
    }

    get multipleLimit() {
        return this.createChatForm.type === ChatType.PRIVATE ? 1 : 0;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowCreateChatDialog() {
        return chatModule.isShowCreateChatDialog;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get searchUsers() {
        return chatModule.searchUsers.filter((user) => user._id !== this.loginUser._id);
    }

    get searchUserOptions() {
        return this.searchUsers.map((user) => {
            return {
                name: user.fullName,
                id: user._id,
            };
        });
    }

    onClose() {
        chatModule.setIsShowCreateChatDialog(false);
    }

    createChatForm = setup(() => {
        const initValues: ICreateChatBody = {
            members: [],
            type: ChatType.PRIVATE,
        };

        const schema = yup.object({
            name: yup.string(),
            members: yup.array().of(yup.string()),
            type: yup.string(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<ICreateChatBody>({
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
            const { members = [] } = values;
            const response = await chatApiService.createChat({
                ...values,
                members: [...members, this.loginUser._id],
            });
            if (response.success) {
                chatModule.setIsShowCreateChatDialog(false);
                chatModule.getChatList();
                clearFormData();
            } else {
                this.showErrorNotificationFunction(response?.message || 'Tạo đoạn hội thoại mới thất bại');
            }
        });

        const { value: name } = useField<string>('name');
        const { value: members } = useField<string[]>('members');
        const { value: type } = useField<ChatType>('type');

        return {
            name,
            members,
            type,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.createChatForm.submit();
    }

    onSearchUsers(keyword: string) {
        this.onSearchDebounce(keyword);
    }

    onSearchDebounce = debounce((keyword: string) => {
        chatModule.getSearchUsers(keyword);
    }, 200);
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
