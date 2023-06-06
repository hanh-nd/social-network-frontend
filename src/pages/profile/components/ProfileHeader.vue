<template>
    <div class="profile-header-wrapper">
        <div class="cover">
            <img v-if="user?.coverId" :src="getImageSourceById(user?.coverId)" alt="" />

            <div class="avatar">
                <BaseRoundAvatar :user="user" :size="150" />
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
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';
import ProfileDescribeForm from './ProfileDescribeForm.vue';
import ProfileMenu from './ProfileMenu.vue';
import ProfileAction from './ProfileAction.vue';

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
}
</script>

<style lang="scss" scoped>
.profile-header-wrapper {
    border-radius: 6px;
    background: $color-white;

    .cover {
        height: 260px;
        background: $color-gray-4;
        margin-top: 8px;
        position: relative;
        border-radius: 8px 8px 0 0;

        .avatar {
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: -20px;
            width: 100%;
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
