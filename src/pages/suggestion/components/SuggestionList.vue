<template>
    <div class="user-suggestion-list-wrapper">
        <div class="user-suggestion-list" v-infinite-scroll="onLoadMore" v-if="userSuggestions.length">
            <div class="user-suggestion-item" v-for="suggestion in userSuggestions" :key="suggestion._id">
                <SuggestionItem :user="suggestion" />
            </div>
        </div>
        <div class="empty" v-else>
            <el-empty description="Tạm thời hệ thống chưa tìm được người phù hợp để gợi ý cho bạn. :<" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { suggestionModule } from '../store';
import SuggestionItem from './SuggestionItem.vue';

@Options({
    components: {
        SuggestionItem,
    },
    emits: ['on-load-more'],
})
export default class SuggestionList extends GlobalMixin {
    get userSuggestions() {
        return suggestionModule.suggestionList;
    }

    onLoadMore() {
        this.$emit('on-load-more');
    }
}
</script>

<style lang="scss" scoped>
.user-suggestion-list-wrapper {
    .user-suggestion-list {
        display: grid;
        gap: 60px;
        grid-template-columns: repeat(5, 1fr);
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
