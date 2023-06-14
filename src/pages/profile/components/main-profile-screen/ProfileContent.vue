<template>
    <div class="profile-content-wrapper">
        <div class="create-new-post" v-if="isLoginUser(user)">
            <BaseCreateNewPostBar />
        </div>
        <div class="" v-if="!isLoginUser(user) && isPrivate && !isSubscribing">
            <el-empty description="Đây là tài khoản riêng tư. Hãy theo dõi người dùng này để xem thêm." />
        </div>
        <div class="post-list" v-else>
            <BasePostList :postList="postList" @on-load-more="onLoadMore" />
        </div>
    </div>
</template>

<script lang="ts">
import { SocketEvent } from '@/common/constants';
import { IPost, IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { SocketProvider } from '@/plugins/socket.io';
import { isNil } from 'lodash';
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

    get isSubscribing() {
        return this.user?.isSubscribing || false;
    }

    get isPrivate() {
        return isNil(this.user?.private) ? true : this.user.private;
    }

    mounted(): void {
        EventEmitter.on(EventName.POST_CREATED, this.postCreatedHandler);
        SocketProvider.socket.on(SocketEvent.POST_UPDATE, ({ postId, ...rest }) => {
            this.postUpdateHandler(postId, rest);
        });
    }

    unmounted(): void {
        EventEmitter.off(EventName.POST_CREATED, this.postCreatedHandler);
        SocketProvider.socket.off(SocketEvent.POST_UPDATE);
    }

    postCreatedHandler(post: IPost) {
        this.postList.unshift(post);
    }

    postUpdateHandler(postId: string, rest: Partial<IPost>) {
        const post = this.postList.find((p) => p._id === postId);
        if (!post) return;

        Object.assign(post, rest);
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
