<template>
    <div class="group-search-result-wrapper">
        <div class="empty" v-if="!groupSearchResults.length">
            <el-empty description="Không tìm thấy thông tin." />
        </div>
        <div class="result" v-else>
            <GroupSearchItem v-for="group in groupSearchResults" :key="group._id" :group="group" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { searchModule } from '../store';
import GroupSearchItem from './GroupSearchItem.vue';

@Options({
    components: {
        GroupSearchItem,
    },
})
export default class GroupSearchResultList extends GlobalMixin {
    get groupSearchResults() {
        return searchModule.searchResults.groups;
    }

    get searchBy() {
        return searchModule.searchBy;
    }
}
</script>

<style lang="scss" scoped>
.group-search-result-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
