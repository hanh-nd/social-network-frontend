<template>
    <div class="create-new-post-bar-wrapper">
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

@Options({
    components: {},
})
export default class CreateNewPostBar extends GlobalMixin {
    get avatar() {
        return getAvatarUrl(this.loginUser);
    }
    get loginUser() {
        return appModule.loginUser;
    }

    openCreatePostDialog() {
        appModule.setIsShowCreatePostDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.create-new-post-bar-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 16px;

    .post-button {
        flex: 1;

        .el-button {
            width: 100%;
        }
    }
}
</style>
