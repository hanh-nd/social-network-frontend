<template>
    <div class="profile-content-wrapper">
        <div class="create-new-post">
            <BaseCreateNewPostBar />
        </div>
        <div class="post-list">
            <BasePostList :postList="postList" @on-load-more="onLoadMore" />
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';

@Options({
    components: {},
})
export default class ProfileContent extends GlobalMixin {
    get user() {
        return profileModule.profileUser || ({} as IUser);
    }

    get postList() {
        return profileModule.profilePostList;
    }

    onLoadMore() {
        this.$emit(`on-load-more-profile-posts`);
    }
}
</script>

<style lang="scss" scoped>
.profile-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .create-new-post {
        border-radius: 6px;
        padding: 8px;
        background: $color-white;
    }
}
</style>
