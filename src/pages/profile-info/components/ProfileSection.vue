<template>
    <div class="profile-section-wrapper">
        <div class="top-section">
            <BaseHoverToShow class="upload-avatar">
                <template #hover>
                    <BaseUploadSingleButton :isDiv="true" :onUploaded="onUpdateAvatar">
                        <el-icon :size="32"><UploadFilled /></el-icon
                    ></BaseUploadSingleButton>
                </template>
                <BaseRoundAvatar :user="loginUser" :size="230" />
            </BaseHoverToShow>
        </div>

        <div class="bottom-section">
            <div class="name">
                {{ loginUser.fullName }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IFile } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({})
export default class ProfileSection extends GlobalMixin {
    get loginUser() {
        return appModule.loginUser;
    }

    async onUpdateAvatar(file: IFile, filePreview: File) {
        const { id } = file;
        const response = await userApiService.updateProfile({
            avatarId: id,
        });
        if (response?.success) {
            appModule.setLoginUser({
                ...this.loginUser,
                avatarId: id,
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.profile-section-wrapper {
    background: $color-white;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-section {
        :deep(.upload-avatar) {
            .hover-section {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .content {
                display: flex;
                justify-content: center;
            }
        }
    }
    .bottom-section {
        .name {
            font-size: 28px;
            font-weight: 500;
        }
    }
}
</style>
