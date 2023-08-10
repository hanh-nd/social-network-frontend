<template>
    <el-dialog
        custom-class="add-member-dialog"
        :model-value="isShowAddMemberDialog"
        @closed="onClose"
        title="Thêm người vào đoạn hội thoại"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="body">
            <div class="private">
                <BaseMultipleSelect
                    v-model:value="toAddIds"
                    :filterable="true"
                    :options="searchUserOptions"
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
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import chatApiService from '@/common/service/chat.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { debounce, remove } from 'lodash';
import { Options } from 'vue-class-component';
import { ChatType } from '../constants';
import { chatModule } from '../store';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class AddMemberDialog extends GlobalMixin {
    toAddIds = [];

    get multipleLimit() {
        return this.chat.type === ChatType.PRIVATE ? 1 : 0;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowAddMemberDialog() {
        return chatModule.isShowAddMemberDialog;
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

    get chat() {
        return chatModule.chatDetail;
    }

    onClose() {
        chatModule.setIsShowAddMemberDialog(false);
    }

    async onSubmit() {
        const result = await Promise.all(
            this.toAddIds.map((id) => chatApiService.addOrRemoveMember(this.chat._id, id)),
        );
        const final = result.reduce(
            (final: { toRemove: IUser[]; toAdd: IUser[] }, current: any) => {
                const { toRemove = null, toAdd = null } = current.data;
                if (toRemove) {
                    final.toRemove.push(toRemove);
                }
                if (toAdd) {
                    final.toAdd.push(toAdd);
                }
                return {
                    toRemove: final.toRemove,
                    toAdd: final.toAdd,
                };
            },
            { toRemove: [], toAdd: [] },
        );
        const { toAdd = [], toRemove = [] } = final;
        remove(this.chat.members, (m) => toRemove.map((t) => t._id).includes(`${m._id}`));
        this.chat.members.push(...toAdd);
        this.onClose();
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
.add-member-dialog {
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
