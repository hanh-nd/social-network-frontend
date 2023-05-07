<template>
    <div class="post-list-wrapper" v-infinite-scroll="onLoadMore">
        <div class="post" v-for="post in postList" :key="post._id">
            <Post :post="post" />
        </div>
    </div>
</template>

<script lang="ts">
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Post from './Post.vue';

@Options({
    components: {
        Post,
    },
    emits: ['on-load-more'],
})
export default class PostList extends GlobalMixin {
    @Prop() postList!: IPost[];

    onLoadMore() {
        this.$emit('on-load-more');
    }
}
</script>

<style lang="scss" scoped></style>
