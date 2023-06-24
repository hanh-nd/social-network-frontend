<template>
    <div class="manage-system-message-page-wrapper">
        <div class="manage-system-message-page-container mx-auto">
            <div class="search">
                <BaseInputText @on-enter="onEnter" v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="table">
                <SystemMessageTable />
            </div>
        </div>
    </div>
    <CreateSystemMessageDialog />
    <UpdateSystemMessageDialog />
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import SystemMessageTable from '../components/SystemMessageTable.vue';
import { adminSystemMessageModule } from '../store';
import CreateSystemMessageDialog from '../components/CreateSystemMessageDialog.vue';
import UpdateSystemMessageDialog from '../components/UpdateSystemMessageDialog.vue';

@Options({
    components: {
        SystemMessageTable,
        CreateSystemMessageDialog,
        UpdateSystemMessageDialog,
    },
})
export default class ManageSystemMessagePage extends GlobalMixin {
    keyword = '';

    onEnter() {
        adminSystemMessageModule.resetSystemMessageListQuery();
        adminSystemMessageModule.setSystemMessageListQuery({
            keyword: this.keyword,
        });
        adminSystemMessageModule.getSystemMessageList();
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        adminSystemMessageModule.getSystemMessageList();
    }
}
</script>
<style lang="scss" scoped>
.manage-system-message-page-wrapper {
    .manage-system-message-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
}
</style>
