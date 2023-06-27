<template>
    <div class="suggestion-page-wrapper">
        <div class="suggestion-page-container mx-auto">
            <div class="title">Gợi ý dành cho bạn</div>
            <div class="suggestion-list">
                <SuggestionList @on-load-more="onLoadMore" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import SuggestionList from '../components/SuggestionList.vue';
import { suggestionModule } from '../store';

@Options({
    components: {
        SuggestionList,
    },
})
export default class SuggestionPage extends GlobalMixin {
    created(): void {
        this.loadData();
    }

    loadData() {
        suggestionModule.resetSuggestionListQuery();
        suggestionModule.getSuggestionList(false);
    }

    get currentPage() {
        return suggestionModule.suggestionListQuery.page as number;
    }

    get isFetchedAllSuggestions() {
        return suggestionModule.isFetchedAllSuggestions;
    }

    onLoadMore() {
        if (this.isFetchedAllSuggestions) return;

        suggestionModule.setSuggestionListQuery({
            page: this.currentPage + 1,
        });

        suggestionModule.getSuggestionList(true);
    }
}
</script>

<style lang="scss" scoped>
.suggestion-page-wrapper {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.suggestion-page-container {
    width: 100%;
    max-width: $content-max-width + $content-padding * 2;
    padding: $content-padding;
    margin: auto;

    display: flex;
    flex-direction: column;
    gap: 8px;

    .title {
        font-size: 32px;
        font-weight: 700;
    }
}
</style>
