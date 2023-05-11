<template>
    <div class="search-result-wrapper">
        <div class="empty" v-if="!userSearchResults.length && !postSearchResults.length">
            <el-empty description="Không tìm thấy thông tin." />
        </div>
        <div class="result">
            <div class="result-list-wrapper" v-if="userSearchResults.length">
                <div class="title">Người dùng</div>
                <div class="result-list">
                    <UserSearchItem v-for="user in userSearchResults" :key="user._id" :user="user" />
                </div>
            </div>
            <div class="result-list-wrapper" v-if="postSearchResults.length">
                <div class="title">Bài viết</div>
                <div class="result-list">
                    <BasePostList :postList="postSearchResults" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { searchModule } from '../store';
import UserSearchItem from './UserSearchItem.vue';

@Options({
    components: {
        UserSearchItem,
    },
})
export default class AllSearchResultList extends GlobalMixin {
    get searchBy() {
        return searchModule.searchBy;
    }

    get userSearchResults() {
        return searchModule.searchResults.users;
    }

    get postSearchResults() {
        return searchModule.searchResults.posts;
    }
}
</script>

<style lang="scss" scoped>
.search-result-wrapper {
    background-color: $color-gray;

    .result {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .result-list-wrapper {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
            border-radius: 8px;
            background: $color-white;

            .title {
                font-size: 18px;
                font-weight: 700;
            }

            .result-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
        }
    }
}
</style>
