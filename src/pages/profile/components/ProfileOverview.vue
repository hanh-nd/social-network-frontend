<template>
    <div class="profile-overview-wrapper">
        <div class="statistic">
            <div class="subscribers">
                <div class="count">
                    {{ user?.numberOfSubscribers || 0 }}
                </div>
                <div class="title">Người theo dõi</div>
            </div>
            <BaseDivider direction="vertical" :height="32" />
            <div class="subscribing">
                <div class="count">
                    {{ user?.numberOfSubscribing || 0 }}
                </div>
                <div class="title">Đang theo dõi</div>
            </div>
        </div>

        <div class="overview">
            <div class="header">Giới thiệu</div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';

@Options({
    components: {},
})
export default class ProfileOverview extends GlobalMixin {
    get user() {
        return profileModule.profileUser || ({} as IUser);
    }
}
</script>

<style lang="scss" scoped>
.profile-overview-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .statistic {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background: $color-white;
        padding: 16px;

        .subscribers,
        .subscribing {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;

            .count {
                color: $color-black;
                font-weight: 700;
                font-size: 18;
            }
        }
    }

    .overview {
        border-radius: 6px;
        background: $color-white;
        padding: 16px;
    }
}
</style>
