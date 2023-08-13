<template>
    <div class="search-page-wrapper">
        <div class="search-page-container mx-auto">
            <div class="search-by-menu">
                <SearchByMenu />
            </div>
            <div class="search-result-list">
                <SearchResultList />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { get } from 'lodash';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import SearchByMenu from '../components/SearchByMenu.vue';
import SearchResultList from '../components/SearchResultList.vue';
import { SearchBy } from '../constants';
import { searchModule } from '../store';
@Options({
    components: {
        SearchByMenu,
        SearchResultList,
    },
})
export default class SearchPage extends GlobalMixin {
    get keyword() {
        return get(this.query, 'keyword', '') as string;
    }

    get query() {
        return this.$route.query;
    }

    created() {
        this.loadData();
    }

    async loadData() {
        searchModule.search({
            keyword: this.keyword,
            size: 10,
        });
    }

    get searchBy() {
        return searchModule.searchBy;
    }

    @Watch('searchBy', { immediate: true })
    onSearchByChange() {
        switch (this.searchBy) {
            case SearchBy.ALL:
                return searchModule.search({
                    keyword: this.keyword,
                    size: 10,
                });
            case SearchBy.PROFILE:
                return searchModule.searchUsers({
                    keyword: this.keyword,
                    size: 50,
                });
            case SearchBy.POST:
                return searchModule.searchPosts({
                    keyword: this.keyword,
                    size: 50,
                });
            case SearchBy.GROUP:
                return searchModule.searchGroups({
                    keyword: this.keyword,
                    size: 50,
                });
        }
    }
}
</script>

<style lang="scss" scoped>
.search-page-wrapper {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.search-page-container {
    width: 100%;
    max-width: map-get($grid-breakpoints, md);
    padding: $content-padding;
    margin: auto;

    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
