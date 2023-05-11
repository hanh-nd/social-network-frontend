<template>
    <div class="search-result-wrapper">
        <AllSearchResultList v-if="searchBy === SearchBy.ALL" />
        <PostSearchResultList v-else-if="searchBy === SearchBy.POST" />
        <UserSearchResultList v-else-if="searchBy === SearchBy.PROFILE" />
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { SearchBy } from '../constants';
import { searchModule } from '../store';
import AllSearchResultList from './AllSearchResultList.vue';
import PostSearchResultList from './PostSearchResultList.vue';
import UserSearchResultList from './UserSearchResultList.vue';

@Options({
    components: {
        AllSearchResultList,
        PostSearchResultList,
        UserSearchResultList,
    },
})
export default class SearchResultList extends GlobalMixin {
    SearchBy = SearchBy;

    get searchBy() {
        return searchModule.searchBy;
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
