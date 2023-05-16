<template>
    <div class="join-request-page-container">
        <div class="join-request-page-wrapper mx-auto">
            <div class="title">Yêu cầu tham gia nhóm</div>
            <div class="empty" v-if="!joinRequestList?.length">
                <el-empty description="Chưa có yêu cầu nào." />
            </div>
            <div class="join-request-list" v-else>
                <JoinRequestItem
                    v-for="joinRequest in joinRequestList"
                    :key="joinRequest._id"
                    :joinRequest="joinRequest"
                    @on-accept="removeJoinRequest"
                    @on-reject="removeJoinRequest"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import JoinRequestItem from '../components/join-request/JoinRequestItem.vue';
import { groupDetailModule } from '../store';

@Options({
    components: {
        JoinRequestItem,
    },
})
export default class JoinGroupRequestPage extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    get joinRequestList() {
        return groupDetailModule.joinRequestList;
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        groupDetailModule.getGroupDetail(this.groupId);
        groupDetailModule.getJoinRequestList(this.groupId);
    }

    removeJoinRequest(requestId: string) {
        _.remove(groupDetailModule.joinRequestList, (request) => `${request._id}` == requestId);
    }
}
</script>

<style lang="scss" scoped>
.join-request-page-container {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.join-request-page-wrapper {
    width: 100%;
    margin: auto;
    max-width: map-get($grid-breakpoints, sm);

    display: flex;
    flex-direction: column;
    gap: 8px;

    .title {
        margin-top: 8px;
        font-weight: 500;
        font-size: 24px;
    }

    .join-request-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
