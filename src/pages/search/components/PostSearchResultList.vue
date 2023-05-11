<template>
    <div class="post-search-result-wrapper">
        <div class="empty" v-if="!postSearchResults.length">
            <el-empty description="Không tìm thấy thông tin." />
        </div>
        <div class="result" v-else>
            <BasePostList :postList="postSearchResults" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { searchModule } from '../store';

@Options({
    components: {},
})
export default class PostSearchResultList extends GlobalMixin {
    get searchBy() {
        return searchModule.searchBy;
    }

    get postSearchResults() {
        return searchModule.searchResults.posts;
    }
}
</script>

<style lang="scss" scoped>
.search-page-wrapper {
    background-color: $color-gray;

    .search-page-container {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
}
</style>
