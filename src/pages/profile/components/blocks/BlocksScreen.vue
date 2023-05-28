<template>
    <div class="block-screen-container">
        <div class="block-screen-wrapper">
            <div class="header">
                <div class="main">Đã chặn</div>
                <div class="sub">{{ profileUser?.numberOfBlocked || 0 }} người</div>
            </div>
            <BaseDivider />
            <div class="subscribing-list">
                <div class="subscribing-card" v-for="blocked in blockedList" :key="blocked._id">
                    <UserCard :user="blocked">
                        <el-button @click="blockOrUnblock(blocked)" v-if="!blocked?.isSelf">{{
                            blocked?.isBlocked ? `Bỏ chặn` : `Chặn`
                        }}</el-button>
                    </UserCard>
                </div>
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
export default class BlocksScreen extends GlobalMixin {
    get profileUser() {
        return profileModule.profileUser;
    }

    get blockedList() {
        return profileModule.blockedList;
    }

    mounted(): void {
        this.loadData();
    }

    loadData() {
        profileModule.getBlockedList();
    }

    async blockOrUnblock(user: IUser) {
        if (!this.profileUser?._id) return;

        const response = await userApiService.blockUser(user._id);
        if (response?.success) {
            profileModule.getBlockedList();
            profileModule.getProfileUser(this.profileUser._id);
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }
}
</script>

<style lang="scss">
.block-screen-container {
    margin-bottom: 8px;
}

.block-screen-wrapper {
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
    .block-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .block-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .block-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .block-screen-wrapper {
        .subscribing-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
