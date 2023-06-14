<template>
    <div class="main-content-wrapper">
        <div class="content">
            <BaseCensorableContent :target="post" />
        </div>

        <div class="post-data">
            <div class="post-shared" v-if="post?.postShared">
                <BasePostSharedContent :post="post.postShared" />
            </div>
            <div class="images" @click="openPostDetailDialog">
                <BaseImageGrid :items="post?.medias" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: [],
})
export default class PostMainContent extends GlobalMixin {
    @Prop() post!: IPost;

    openPostDetailDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowPostDetailDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.main-content-wrapper {
    .post-data {
        .post-shared {
            padding: 16px;
            box-shadow: 0 0 0 1px $scroll-bar-dark;
            border-radius: 8px;
        }
    }
}
</style>
