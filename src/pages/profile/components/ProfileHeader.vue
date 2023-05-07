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
                <ProfileDescribeForm />
            </div>
        </div>

        <div class="menu">
            <ProfileMenu />
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

@Options({
    components: {
        ProfileMenu,
        ProfileDescribeForm,
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
}
</style>
