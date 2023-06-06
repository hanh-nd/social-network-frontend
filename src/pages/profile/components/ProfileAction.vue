<template>
    <div class="profile-action-wrapper">
        <div class="login-user" v-if="isLoginUser(profileUser)">
            <LoginUserProfileAction />
        </div>
        <div class="user" v-else>
            <UserProfileAction />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';
import LoginUserProfileAction from './LoginUserProfileAction.vue';
import UserProfileAction from './UserProfileAction.vue';

@Options({
    components: {
        LoginUserProfileAction,
        UserProfileAction,
    },
})
export default class ProfileAction extends GlobalMixin {
    get profileUser() {
        return profileModule.profileUser;
    }
}
</script>

<style lang="scss" scoped>
.profile-action-wrapper {
    display: flex;
    flex-direction: row;
    padding-right: 16px;
}
</style>
