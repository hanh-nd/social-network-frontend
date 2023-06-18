<template>
    <div class="manage-user-page-wrapper">
        <div class="manage-user-page-container mx-auto">
            <div class="search">
                <BaseInputText @on-enter="onEnter" v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="table">
                <UserTable />
            </div>
        </div>
    </div>
    <UpdateUserDialog />
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import UserTable from '../components/UserTable.vue';
import { adminUserModule } from '../store';
import UpdateUserDialog from '../components/UpdateUserDialog.vue';

@Options({
    components: {
        UserTable,
        UpdateUserDialog,
    },
})
export default class ManageUserPage extends GlobalMixin {
    keyword = '';

    onEnter() {
        adminUserModule.resetUserListQuery();
        adminUserModule.setUserListQuery({
            keyword: this.keyword,
        });
        adminUserModule.getUserList();
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        adminUserModule.getUserList();
    }
}
</script>
<style lang="scss" scoped>
.manage-user-page-wrapper {
    .manage-user-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
}
</style>
