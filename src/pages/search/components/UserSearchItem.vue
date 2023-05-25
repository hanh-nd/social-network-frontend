<template>
    <div class="user-search-item">
        <div class="left-section">
            <div class="avatar">
                <BaseRoundAvatar :user="user" :size="48" />
            </div>
            <div class="name" @click="goToProfilePage">
                {{ user?.fullName || 'undefined' }}
            </div>
        </div>
        <div class="right-section">
            <div class="action">
                <el-button @click="onAction" :type="isSubscribing ? `default` : `primary`" v-if="!isSelf">{{
                    isSubscribing ? `Nhắn tin` : `Theo dõi`
                }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class UserSearchItem extends GlobalMixin {
    @Prop() user!: IUser;

    get isSubscribing() {
        return this.user?.isSubscribing || false;
    }

    get isSelf() {
        return this.user?.isSelf || false;
    }

    async onAction() {
        if (!this.user) return;

        const response = await userApiService.subscribeOrUnsubscribe(this.user._id);
        if (response?.success) {
            this.user.isSubscribing = !this.user.isSubscribing;
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }

    goToProfilePage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.user._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.user-search-item {
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
            cursor: pointer;
        }
    }
}
</style>
