<template>
    <div class="manage-group-page-wrapper">
        <div class="manage-group-page-container mx-auto">
            <div class="search">
                <BaseInputText @on-enter="onEnter" v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="table">
                <GroupTable />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import GroupTable from '../components/GroupTable.vue';
import { adminGroupModule } from '../store';

@Options({
    components: {
        GroupTable,
    },
})
export default class ManageGroupPage extends GlobalMixin {
    keyword = '';

    onEnter() {
        adminGroupModule.resetGroupListQuery();
        adminGroupModule.setGroupListQuery({
            keyword: this.keyword,
        });
        adminGroupModule.getGroupList();
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        adminGroupModule.getGroupList();
    }
}
</script>
<style lang="scss" scoped>
.manage-group-page-wrapper {
    .manage-group-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
}
</style>
