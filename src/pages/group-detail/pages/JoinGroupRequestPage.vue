<template>
    <div class="join-request-page-container">
        <div class="join-request-page-wrapper mx-auto">
            <div class="group-menu">
                <GroupMenu />
            </div>
            <div class="screen">
                <div class="title">Yêu cầu tham gia nhóm</div>
                <div class="empty" v-if="!joinRequestList?.length">
                    <el-empty description="Chưa có yêu cầu nào." />
                </div>
                <div class="join-request-list" v-else v-infinite-scroll="onLoadMoreJoinRequests">
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
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import GroupMenu from '../components/common/GroupMenu.vue';
import JoinRequestItem from '../components/join-request/JoinRequestItem.vue';
import { groupDetailModule } from '../store';

@Options({
    components: {
        JoinRequestItem,
        GroupMenu,
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
        groupDetailModule.resetJoinRequestListQuery();
        groupDetailModule.getJoinRequestList({ id: this.groupId });
    }

    removeJoinRequest(requestId: string) {
        _.remove(groupDetailModule.joinRequestList, (request) => `${request._id}` == requestId);
    }

    get currentPage() {
        return groupDetailModule.joinRequestListQuery.page as number;
    }

    get isFetchedAllJoinedRequestList() {
        return groupDetailModule.isFetchedAllJoinedRequestList;
    }

    onLoadMoreJoinRequests() {
        if (this.isFetchedAllJoinedRequestList) return;

        groupDetailModule.setJoinRequestListQuery({
            page: this.currentPage + 1,
        });
        groupDetailModule.getJoinRequestList({ id: this.groupId, append: true });
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
    display: flex;
    flex-direction: row;
    height: 100%;
    gap: 8px;

    .screen {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-width: map-get($grid-breakpoints, lg);
        gap: 8px;
    }

    .group-menu {
        position: sticky;
        top: 58px;
        height: calc(100vh - 60px);
        padding-top: 8px;
        width: 300px;
    }

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

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .join-request-page-wrapper {
        flex-direction: column;

        .group-menu {
            display: none;
        }
    }
}
</style>
