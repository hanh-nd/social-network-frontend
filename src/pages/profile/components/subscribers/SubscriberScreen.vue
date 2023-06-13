<template>
    <div class="subscriber-screen-container">
        <div class="subscriber-screen-wrapper">
            <div class="header">
                <div class="main">Người theo dõi</div>
                <div class="sub">{{ profileUser?.numberOfSubscribers || 0 }} người</div>
            </div>
            <BaseDivider />
            <div class="subscriber-list" v-if="subscriberList.length">
                <div class="subscriber-card" v-for="subscriber in subscriberList" :key="subscriber._id">
                    <UserCard :user="subscriber">
                        <el-button @click="subscribeOrUnsubscribe(subscriber)" v-if="!subscriber?.isSelf">{{
                            subscriber?.isSubscribing ? `Hủy theo dõi` : `Theo dõi`
                        }}</el-button>
                    </UserCard>
                </div>
            </div>
            <div class="empty" v-else>
                <el-empty description="Danh sách hiện đang trống." />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';
import UserCard from '../common/UserCard.vue';

@Options({
    components: {
        UserCard,
    },
})
export default class SubscriberScreen extends GlobalMixin {
    get profileUser() {
        return profileModule.profileUser;
    }

    get subscriberList() {
        return profileModule.subscriberList;
    }

    mounted(): void {
        this.loadData();
    }

    loadData() {
        profileModule.getSubscriberList(this.profileUser?._id);
    }

    async subscribeOrUnsubscribe(user: IUser) {
        const response = await userApiService.subscribeOrUnsubscribe(user._id);
        if (response?.success) {
            user.isSubscribing = !user.isSubscribing;
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }
}
</script>

<style lang="scss">
.subscriber-screen-container {
    margin-bottom: 8px;
}
.subscriber-screen-wrapper {
    background: $color-white;
    border-radius: 8px;
    padding: 16px;

    .header {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: 8px;

        .main {
            font-size: 24px;
            font-weight: 700;
        }

        .sub {
            font-size: 14px;
        }
    }

    .subscriber-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 60px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .subscriber-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .subscriber-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .subscriber-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .subscriber-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
