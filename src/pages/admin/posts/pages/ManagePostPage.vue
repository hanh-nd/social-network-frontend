<template>
    <div class="manage-post-page-wrapper">
        <div class="manage-post-page-container mx-auto">
            <div class="search">
                <BaseInputText @on-enter="onEnter" v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="table">
                <PostTable />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import PostTable from '../components/PostTable.vue';
import { adminPostModule } from '../store';

@Options({
    components: {
        PostTable,
    },
})
export default class ManagePostPage extends GlobalMixin {
    keyword = '';

    onEnter() {
        adminPostModule.resetPostListQuery();
        adminPostModule.setPostListQuery({
            keyword: this.keyword,
        });
        adminPostModule.getPostList();
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        adminPostModule.getPostList();
    }
}
</script>
<style lang="scss" scoped>
.manage-post-page-wrapper {
    .manage-post-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
}
</style>
