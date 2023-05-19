<template>
    <div class="group-search-item">
        <div class="left-section">
            <div class="cover">
                <BaseRoundAvatar :fileId="group?.coverId" :size="42" />
            </div>
            <div class="information">
                <div class="name" @click="goToGroupDetailPage">
                    {{ group?.name }}
                </div>
                <div class="members">{{ group?.memberIds?.length || 0 }} thành viên</div>
            </div>
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
</template>

<script lang="ts">
import { IGroup } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { groupDetailModule } from '@/pages/group-detail/store';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class GroupSearchItem extends GlobalMixin {
    @Prop() group!: IGroup;

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

    goToGroupDetailPage() {
        this.$router.push({
            name: this.PageName.GROUP_DETAIL_PAGE,
            params: {
                id: this.group._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.group-search-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left-section {
        display: flex;
        flex-direction: row;
        gap: 8px;

        .information {
            display: flex;
            flex-direction: column;

            .name {
                cursor: pointer;
                font-weight: 500;
            }

            .members {
                font-size: 12px;
            }
        }
    }
}
</style>
