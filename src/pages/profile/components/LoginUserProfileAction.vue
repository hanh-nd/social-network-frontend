<template>
    <div class="login-user-profile-action-wrapper">
        <el-button @click="goToDescribeTab">Chỉnh sửa trang cá nhân</el-button>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { ProfileScreenTab } from '../constants';

@Options({
    components: {},
})
export default class LoginUserProfileAction extends GlobalMixin {
    goToDescribeTab() {
        EventEmitter.emit(EventName.CHANGE_PROFILE_SCREEN_TAB, ProfileScreenTab.DESCRIBE);
    }
}
</script>

<style lang="scss" scoped>
.login-user-profile-action-wrapper {
    display: flex;
    flex-direction: row;
}
</style>
