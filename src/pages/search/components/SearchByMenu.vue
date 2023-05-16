<template>
    <div class="search-by-menu-wrapper">
        <el-radio-group v-model="searchBy">
            <el-radio-button :label="SearchBy.ALL">Tất cả</el-radio-button>
            <el-radio-button :label="SearchBy.POST">Bài viết</el-radio-button>
            <el-radio-button :label="SearchBy.PROFILE">Người dùng</el-radio-button>
            <el-radio-button :label="SearchBy.GROUP">Nhóm</el-radio-button>
        </el-radio-group>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { SearchBy } from '../constants';
import { searchModule } from '../store';

@Options({
    components: {},
})
export default class SearchByMenu extends GlobalMixin {
    SearchBy = SearchBy;

    get searchBy() {
        return searchModule.searchBy;
    }

    set searchBy(searchBy: SearchBy) {
        searchModule.setSearchBy(searchBy);
    }
}
</script>

<style lang="scss" scoped>
.search-by-menu-wrapper {
    background-color: $color-gray;

    .search-page-container {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
}
</style>
