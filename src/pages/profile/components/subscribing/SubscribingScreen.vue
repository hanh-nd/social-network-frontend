<template>
    <div class="subscribing-screen-container">
        <div class="subscribing-screen-wrapper">
            <div class="header">
                <div class="main">Đang theo dõi</div>
                <div class="sub">{{ profileUser?.numberOfSubscribing || 0 }} người</div>
            </div>
            <BaseDivider />
            <div class="subscribing-list" v-if="subscribingList.length">
                <div class="subscribing-card" v-for="subscribing in subscribingList" :key="subscribing._id">
                    <UserCard :user="subscribing">
                        <el-button @click="subscribeOrUnsubscribe(subscribing)" v-if="!subscribing?.isSelf">{{
                            subscribing?.isSubscribing ? `Hủy theo dõi` : `Theo dõi`
                        }}</el-button>
                    </UserCard>
                </div>
            </div>
            <div class="empty" v-else>
                <el-empty description="Bạn chưa theo dõi ai. Hãy mở rộng kết nối thêm đi nè." />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';
import UserCard from '../common/UserCard.vue';
import { IUser } from '@/common/interfaces';
import userApiService from '@/common/service/user.api.service';

@Options({
    components: {
        UserCard,
    },
})
export default class SubscribingScreen extends GlobalMixin {
    get profileUser() {
        return profileModule.profileUser;
    }

    get subscribingList() {
        return profileModule.subscribingList;
    }

    mounted(): void {
        this.loadData();
    }

    loadData() {
        profileModule.getSubscribingList(this.profileUser?._id);
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
.subscribing-screen-container {
    margin-bottom: 8px;
}

.subscribing-screen-wrapper {
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

    .subscribing-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 60px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .subscribing-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .subscribing-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .subscribing-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .subscribing-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
