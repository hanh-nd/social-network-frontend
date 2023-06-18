<template>
    <div class="member-card-wrapper">
        <div class="left-section">
            <div class="avatar">
                <BaseRoundAvatar :user="member" :size="42" />
            </div>
            <div class="name">
                <div class="full-name">
                    {{ member?.fullName }}
                </div>
                <div class="tag">
                    <el-tag type="success">{{
                        admin?.isOwner ? `Người sáng lập` : !!admin ? `Quản trị viên` : `Thành viên`
                    }}</el-tag>
                </div>
            </div>
        </div>
        <div class="right-section">
            <div class="is-user" v-if="isUser()">
                <BaseThreeDotMenu>
                    <el-dropdown-item @click="leave"
                        ><el-icon :size="16"><Edit /></el-icon>Rời khỏi nhóm</el-dropdown-item
                    >
                </BaseThreeDotMenu>
            </div>
            <div class="action" v-else>
                <el-button
                    @click="subscribeOrUnsubscribe"
                    :type="member?.isSubscribing ? `default` : `primary`"
                    v-if="!member?.isSelf"
                    >{{ member?.isSubscribing ? `Hủy theo dõi` : `Theo dõi` }}</el-button
                >
                <div class="administrator" v-if="isLoginUserAdmin">
                    <BaseThreeDotMenu>
                        <el-dropdown-item v-if="!!admin" @click="removeAdministrator"
                            ><el-icon :size="16"><Edit /></el-icon>Hủy tư cách quản trị viên</el-dropdown-item
                        >
                        <el-dropdown-item v-else @click="makeAdministrator"
                            ><el-icon :size="16"><Edit /></el-icon>Chỉ định làm quản trị viên</el-dropdown-item
                        >
                    </BaseThreeDotMenu>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { groupDetailModule } from '../../store';

@Options({})
export default class MemberCard extends GlobalMixin {
    @Prop() member!: IUser;

    isUser() {
        return this.member._id == this.loginUser._id;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get group() {
        return groupDetailModule.groupDetail;
    }

    get administrators() {
        return this.group.administrators || [];
    }

    get admin() {
        return this.group.administrators.find((admin) => `${admin.user._id || admin.user}` == `${this.member._id}`);
    }

    get isLoginUserAdmin() {
        return !!this.group.administrators.find(
            (admin) => `${admin.user._id || admin.user}` == `${this.loginUser._id}`,
        );
    }

    async subscribeOrUnsubscribe() {
        if (!this.member) return;

        const response = await userApiService.subscribeOrUnsubscribe(this.member._id);
        if (response?.success) {
            this.member.isSubscribing = !this.member.isSubscribing;
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
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

    async removeAdministrator() {
        const response = await groupApiService.removeAdministrator(this.group._id, this.member._id);
        if (response?.success) {
            groupDetailModule.getGroupDetail(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu hủy bỏ tư cách quản trị viên thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu hủy bỏ tư cách quản trị viên thất bại.`);
        }
    }

    async makeAdministrator() {
        const response = await groupApiService.makeAdministrator(this.group._id, this.member._id);
        if (response?.success) {
            groupDetailModule.getGroupDetail(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu chỉ định tư cách quản trị viên thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu chỉ định tư cách quản trị viên thất bại.`);
        }
    }
}
</script>

<style lang="scss" scoped>
.member-card-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .left-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        .name {
            display: flex;
            flex-direction: column;
        }
    }

    .right-section {
        .action {
            display: flex;
            flex-direction: row;
            gap: 8px;
        }
    }
}
</style>
