<template>
    <div class="post-shared-content-wrapper" v-if="isShowPost">
        <div class="header">
            <div class="avatar">
                <BaseRoundAvatar :user="post?.author" :size="42" />
            </div>
            <div class="information">
                <div class="name" @click="goToProfilePage">
                    {{ post?.author?.fullName || 'hihi' }}
                </div>
                <div class="created-at">
                    <el-tooltip
                        :content="parseDateTime(post?.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm)"
                        :hide-after="100"
                    >
                        {{ parseDateTimeRelative(post?.createdAt) }}
                    </el-tooltip>
                </div>
            </div>
            <div class="settings"></div>
        </div>

        <div class="main-content">
            <div class="content">
                {{ post?.content }}
            </div>

            <div class="post-data">
                <div class="images" @click="openPostDetailDialog">
                    <BaseImageGrid :items="post?.pictureIds" />
                </div>
            </div>
        </div>
    </div>
    <div class="error" v-else>
        <el-empty description="Bài viết không tồn tại hoặc đã bị xóa" />
    </div>
</template>

<script lang="ts">
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: [],
})
export default class PostContent extends GlobalMixin {
    @Prop() post!: IPost;

    goToProfilePage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.post?.author?._id,
            },
        });
    }

    openPostDetailDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowPostDetailDialog(true);
    }

    get isShowPost() {
        return _.isNil(this.post.deletedAt);
    }
}
</script>

<style lang="scss" scoped>
.post-shared-content-wrapper {
    display: flex;
    flex-direction: column;

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .information {
            display: flex;
            flex-direction: column;

            .name {
                font-weight: 500;
                cursor: pointer;
            }

            .created-at {
                font-size: 12px;
            }
        }
    }
}
</style>
