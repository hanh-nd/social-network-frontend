<template>
    <div class="profile-content-wrapper">
        <div class="create-new-post" v-if="isLoginUser(user)">
            <BaseCreateNewPostBar />
        </div>
        <div class="post-list">
            <BasePostList :postList="postList" @on-load-more="onLoadMore" />
        </div>
    </div>
</template>

<script lang="ts">
import { IPost, IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';

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

    mounted(): void {
        EventEmitter.on(EventName.POST_CREATED, this.postCreatedHandler);
    }

    unmounted(): void {
        EventEmitter.off(EventName.POST_CREATED, this.postCreatedHandler);
    }

    postCreatedHandler(post: IPost) {
        this.postList.unshift(post);
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
