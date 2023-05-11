<template>
    <div class="user-search-result-wrapper">
        <div class="empty" v-if="!userSearchResults.length">
            <el-empty description="Không tìm thấy thông tin." />
        </div>
        <div class="result" v-else>
            <UserSearchItem v-for="user in userSearchResults" :key="user._id" :user="user" />
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
export default class UserSearchResultList extends GlobalMixin {
    get userSearchResults() {
        return searchModule.searchResults.users;
    }

    get searchBy() {
        return searchModule.searchBy;
    }
}
</script>

<style lang="scss" scoped>
.user-search-result-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
