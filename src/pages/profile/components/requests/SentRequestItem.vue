<template>
    <div class="sent-request-item-wrapper">
        <UserCard :user="request?.receiver">
            <div class="action" v-if="isPending">
                <div class="cancel">
                    <el-button @click="onCancel">Hủy</el-button>
                </div>
            </div>
            <div v-else>Đã được xử lý.</div>
        </UserCard>
    </div>
</template>

<script lang="ts">
import { SubscribeRequestStatus } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ISubscribeRequest } from '../../interfaces';
import UserCard from '../common/UserCard.vue';

@Options({
    components: {
        UserCard,
    },
    emits: ['on-cancel'],
})
export default class SentRequestItem extends GlobalMixin {
    @Prop() request!: ISubscribeRequest;

    get isPending() {
        return this.request.status === SubscribeRequestStatus.PENDING;
    }

    async onCancel() {
        const response = await userApiService.updateSubscribeRequest(this.request._id, {
            status: SubscribeRequestStatus.REJECTED,
        });
        if (response?.success) {
            this.$emit('on-cancel');
            this.request.status = SubscribeRequestStatus.REJECTED;
            this.showSuccessNotificationFunction('Hủy yêu cầu thành công');
        } else {
            this.showSuccessNotificationFunction(response?.message || 'Hủy yêu cầu thất bại');
        }
    }
}
</script>

<style lang="scss" scoped>
.sent-request-item-wrapper {
    :deep(.action) {
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;

        .el-button {
            width: 100%;
        }
    }
}
</style>
