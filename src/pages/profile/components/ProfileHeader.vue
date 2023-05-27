<template>
    <div class="profile-header-wrapper">
        <div class="cover">
            <BaseHoverToShow class="upload-cover">
                <template #hover v-if="isLoginUser(user)">
                    <BaseUploadSingleButton :onUploaded="onUpdateCover">Cập nhật ảnh bìa</BaseUploadSingleButton>
                </template>
                <img v-if="user?.coverId" :src="getImageSourceById(user?.coverId)" alt="" />
            </BaseHoverToShow>

            <div class="avatar">
                <BaseHoverToShow class="upload-avatar">
                    <template #hover v-if="isLoginUser(user)">
                        <BaseUploadSingleButton :isDiv="true" :onUploaded="onUpdateAvatar">
                            <el-icon :size="32"><UploadFilled /></el-icon
                        ></BaseUploadSingleButton>
                    </template>
                    <BaseRoundAvatar :user="user" :size="150" />
                </BaseHoverToShow>
            </div>
        </div>

        <div class="overview">
            <div class="name">
                {{ user?.fullName }}
            </div>
            <div class="describe">
                <div class="login-user" v-if="isLoginUser(user)">
                    <ProfileDescribeForm />
                </div>
                <div class="guest" v-else>
                    {{ user.describe }}
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="menu">
                <ProfileMenu />
            </div>
            <div class="action">
                <ProfileAction />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IFile, IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';
import ProfileAction from './ProfileAction.vue';
import ProfileDescribeForm from './ProfileDescribeForm.vue';
import ProfileMenu from './ProfileMenu.vue';

@Options({
    components: {
        ProfileMenu,
        ProfileDescribeForm,
        ProfileAction,
    },
})
export default class ProfileHeader extends GlobalMixin {
    get user() {
        return profileModule.profileUser || ({} as IUser);
    }

    async onUpdateAvatar(file: IFile, filePreview: File) {
        const { id } = file;
        const response = await userApiService.updateProfile({
            avatarId: id,
        });
        if (response?.success) {
            profileModule.getProfileUser(this.user._id);
        }
    }

    async onUpdateCover(file: IFile, filePreview: File) {
        const { id } = file;
        const response = await userApiService.updateProfile({
            coverId: id,
        });
        if (response?.success) {
            profileModule.getProfileUser(this.user._id);
        }
    }
}
</script>

<style lang="scss" scoped>
.profile-header-wrapper {
    border-radius: 6px;
    background: $color-white;

    .cover {
        display: flex;
        justify-content: center;
        height: 260px;
        background: $color-gray-4;
        margin-top: 8px;
        position: relative;
        border-radius: 8px 8px 0 0;

        :deep(.upload-cover) {
            .hover-section {
                display: flex;
                align-items: flex-end;
                padding: 16px;
            }

            .content {
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px 8px 0 0;
                    object-fit: cover;
                }
            }
        }

        .avatar {
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: -20px;

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
    }

    .overview {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 30px;

        .name {
            font-size: 24px;
            font-weight: 700;
        }
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .menu {
            width: 50%;
        }

        .action {
            width: 50%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .profile-header-wrapper {
        .footer {
            .menu {
                width: 0;
            }
        }
    }
}
</style>
