<template>
    <div class="create-post-bar-wrapper">
        <div class="avatar">
            <router-link to="/my-profile">
                <BaseRoundAvatar :user="loginUser" />
            </router-link>
        </div>
        <div class="post-button">
            <el-button type="primary" @click="openCreatePostDialog">Đăng bài viết</el-button>
        </div>
        <div class="image-button">
            <BaseRoundAvatar :user="loginUser" />
        </div>
    </div>
</template>

<script lang="ts">
import { getAvatarUrl } from '@/common/helpers';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../../store';

@Options({
    components: {},
})
export default class CreatePostBar extends GlobalMixin {
    get avatar() {
        return getAvatarUrl(this.loginUser);
    }
    get loginUser() {
        return appModule.loginUser;
    }

    openCreatePostDialog() {
        groupDetailModule.setIsShowCreatePostDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.create-post-bar-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: $color-white;
    border-radius: 8px;

    .post-button {
        flex: 1;

        .el-button {
            width: 100%;
        }
    }
}
</style>
