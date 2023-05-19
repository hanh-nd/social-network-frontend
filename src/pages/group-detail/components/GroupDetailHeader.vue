<template>
    <div class="group-detail-header-wrapper">
        <div class="cover">
            <img v-if="group?.coverId" :src="getImageSourceById(group?.coverId)" alt="" />
        </div>

        <div class="overview">
            <div class="left-section">
                <div class="name">
                    {{ group?.name }}
                </div>
                <div class="members" @click="openMembersScreen">{{ group?.memberIds?.length || 0 }} thành viên</div>
            </div>
            <div class="right-section">
                <div class="leave" v-if="group?.isMember">
                    <el-button @click="leave">Rời khỏi nhóm</el-button>
                </div>
                <div class="cancel-request" v-else-if="group?.isPending">
                    <el-button @click="cancelRequest">Hủy yêu cầu tham gia</el-button>
                </div>
                <div class="request-to-join" v-else>
                    <el-button @click="requestToJoin" type="primary">Tham gia</el-button>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="menu">
                <GroupDetailMenu />
            </div>
            <div class="action">
                <GroupDetailAction />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IGroup } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { GroupDetailScreenTab } from '../constants';
import { groupDetailModule } from '../store';
import GroupDetailAction from './GroupDetailAction.vue';
import GroupDetailMenu from './GroupDetailMenu.vue';

@Options({
    components: {
        GroupDetailMenu,
        GroupDetailAction,
    },
})
export default class GroupDetailHeader extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail || ({} as IGroup);
    }

    get isMember() {
        return this.group?.memberIds?.includes(`${appModule?.loginUser?._id}`);
    }

    openMembersScreen() {
        EventEmitter.emit(EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB, GroupDetailScreenTab.MEMBERS);
    }

    async leave() {
        const response = await groupApiService.leave(this.group._id);
        if (response?.success) {
            groupDetailModule.getGroupDetail(this.group._id);
            groupDetailModule.getGroupMembers(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu rời khỏi nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu rời khỏi nhóm thất bại.`);
        }
    }

    async cancelRequest() {
        const response = await groupApiService.cancelToJoin(this.group._id);
        if (response?.success) {
            groupDetailModule.getGroupDetail(this.group._id);
            this.showSuccessNotificationFunction(`Hủy yêu cầu tham gia nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Hủy yêu cầu tham gia nhóm thất bại.`);
        }
    }

    async requestToJoin() {
        const response = await groupApiService.requestToJoin(this.group._id);
        if (response?.success) {
            groupDetailModule.getGroupDetail(this.group._id);
            groupDetailModule.getGroupMembers(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu tham gia nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu tham gia nhóm thất bại.`);
        }
    }
}
</script>

<style lang="scss" scoped>
.group-detail-header-wrapper {
    border-radius: 6px;
    background: $color-white;

    .cover {
        height: 300px;
        background: $color-gray-4;
        margin-top: 8px;
        position: relative;
        border-radius: 8px 8px 0 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
        }
    }

    .overview {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .left-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;

            .name {
                font-size: 24px;
                font-weight: 700;
            }

            .members {
                cursor: pointer;
            }
        }

        .right-section {
            padding: 16px;
        }
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .menu {
            width: 50%;
        }

        .action {
            width: 50%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .group-detail-header-wrapper {
        .footer {
            .menu {
                width: 0;
            }
        }
    }
}
</style>
