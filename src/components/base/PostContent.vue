<template>
    <div class="post-content-wrapper">
        <div class="header">
            <div class="avatar">
                <BaseRoundAvatar :user="post?.author" :size="42" />
            </div>
            <div class="information">
                <div class="name">
                    {{ post?.author.fullName || 'hihi' }}
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
                <div class="images">
                    <BaseImageGrid :items="post?.pictureIds" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IComment, IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: [],
})
export default class PostContent extends GlobalMixin {
    @Prop() post!: IPost;
}
</script>

<style lang="scss" scoped>
.post-content-wrapper {
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
            }

            .created-at {
                font-size: 12px;
            }
        }
    }
}
</style>
