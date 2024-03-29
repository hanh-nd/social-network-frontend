<template>
    <div class="request-screen-container">
        <div class="request-screen-wrapper">
            <div class="header">
                <div class="main">Yêu cầu</div>
                <BaseDivider />
                <div class="sub">
                    <el-radio-group v-model="requestType">
                        <el-radio-button :label="RequestType.INCOMING">Yêu cầu đã nhận</el-radio-button>
                        <el-radio-button :label="RequestType.SENT">Yêu cầu đã gửi</el-radio-button>
                    </el-radio-group>
                </div>
                <BaseDivider />
            </div>
            <div class="request-list" v-infinite-scroll="onLoadMore" v-if="subscribeRequestList.length">
                <div class="subscribing-card" v-for="request in subscribeRequestList" :key="request._id">
                    <RequestItem :request="request" :isReceived="requestType === RequestType.INCOMING" />
                </div>
            </div>
            <div class="empty" v-else>
                <el-empty description="Chưa có yêu cầu theo dõi nào." />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ProfileScreenTab } from '../../constants';
import { profileModule } from '../../store';
import UserCard from '../common/UserCard.vue';
import RequestItem from './RequestItem.vue';

@Options({
    components: {
        UserCard,
        RequestItem,
    },
})
export default class RequestScreen extends GlobalMixin {
    RequestType = {
        INCOMING: 'INCOMING',
        SENT: 'SENT',
    };

    requestType = this.RequestType.INCOMING;

    @Watch('requestType')
    onRequestTypeChange() {
        profileModule.resetSubscribeRequestListQuery();
        profileModule.setIsFetchedAllSubscribeRequestList(false);
        if (this.requestType === this.RequestType.INCOMING) {
            profileModule.getReceivedSubscribeRequest({ append: false });
        } else {
            profileModule.getSentSubscribeRequest({ append: false });
        }
    }

    get profileUser() {
        return profileModule.profileUser;
    }

    get subscribeRequestList() {
        return profileModule.subscribeRequestList;
    }

    get isFetchedAllSubscribeRequestList() {
        return profileModule.isFetchedAllSubscribeRequestList;
    }

    get currentPage() {
        return profileModule.subscribeRequestListQuery.page as number;
    }

    mounted(): void {
        EventEmitter.emit(EventName.CHANGE_PROFILE_SCREEN_TAB, ProfileScreenTab.REQUEST);
        this.loadData();
    }

    loadData() {
        profileModule.resetSubscribeRequestListQuery();
        profileModule.getReceivedSubscribeRequest();
    }

    onLoadMore() {
        if (this.isFetchedAllSubscribeRequestList) return;

        profileModule.setSubscribeRequestListQuery({
            page: this.currentPage + 1,
        });
        if (this.requestType === this.RequestType.INCOMING) {
            profileModule.getReceivedSubscribeRequest({ append: true });
        } else {
            profileModule.getSentSubscribeRequest({ append: true });
        }
    }
}
</script>

<style lang="scss">
.request-screen-container {
    margin-bottom: 8px;
}

.request-screen-wrapper {
    background: $color-white;
    border-radius: 8px;
    padding: 16px;

    .header {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .main {
            font-size: 24px;
            font-weight: 700;
        }

        .sub {
            font-size: 14px;
        }
    }

    .request-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 60px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .request-screen-wrapper {
        .request-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .request-screen-wrapper {
        .request-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .request-screen-wrapper {
        .request-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .request-screen-wrapper {
        .request-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
