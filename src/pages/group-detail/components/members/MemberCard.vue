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
                        isOwner ? `Người sáng lập` : isAdministrator ? `Quản trị viên` : `Thành viên`
                    }}</el-tag>
                </div>
            </div>
        </div>
        <div class="right-section">
            <div class="is-user" v-if="isUser()">
                <div v-if="!isOwner">
                    <BaseThreeDotMenu>
                        <el-dropdown-item
                            ><el-icon :size="16"><Edit /></el-icon>Rời khỏi nhóm</el-dropdown-item
                        >
                    </BaseThreeDotMenu>
                </div>
            </div>
            <div class="action" v-else>
                <el-button @click="subscribeOrUnsubscribe" :type="member?.isSubscribing ? `default` : `primary`">{{
                    member?.isSubscribing ? `Hủy theo dõi` : `Theo dõi`
                }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class MemberCard extends GlobalMixin {
    @Prop() member!: IUser;
    @Prop({ default: false }) isAdministrator!: boolean;
    @Prop({ default: false }) isOwner!: boolean;

    isUser() {
        return this.member._id == appModule.loginUser._id;
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
}
</style>
