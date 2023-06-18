<template>
    <div class="group-detail-action-wrapper">
        <div class="administrator" v-if="isAdministrator()">
            <AdministratorGroupAction />
        </div>
        <div class="member" v-else>
            <MemberGroupAction />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../store';
import AdministratorGroupAction from './AdministratorGroupAction.vue';
import MemberGroupAction from './MemberGroupAction.vue';

@Options({
    components: {
        AdministratorGroupAction,
        MemberGroupAction,
    },
})
export default class GroupDetailAction extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    get administratorIds() {
        return this.group?.administrators?.map((admin) => `${admin.user?._id}`) || [];
    }

    get loginUser() {
        return appModule.loginUser;
    }

    isAdministrator() {
        return this.administratorIds.includes(`${this.loginUser?._id}`);
    }
}
</script>

<style lang="scss" scoped>
.group-detail-action-wrapper {
    display: flex;
    flex-direction: row;
    padding-right: 16px;
}
</style>
