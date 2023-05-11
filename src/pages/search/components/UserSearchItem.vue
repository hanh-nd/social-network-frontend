<template>
    <div class="user-search-item">
        <div class="left-section">
            <div class="avatar">
                <BaseRoundAvatar :user="user" :size="48" />
            </div>
            <div class="name">
                {{ user?.fullName || 'undefined' }}
            </div>
        </div>
        <div class="right-section">
            <div class="action">
                <el-button @click="onAction">{{ isSubscribing ? `Nhắn tin` : `Theo dõi` }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
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

    onAction() {
        if (!this.user) return;

        if (this.isSubscribing) {
            //
        } else {
            //
            this.user.isSubscribing = true;
        }
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
    }
}
</style>
