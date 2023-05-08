<template>
    <div class="user-card-wrapper">
        <div class="top-section" @click="goToProfilePage">
            <div class="avatar" v-if="user?.avatarId">
                <img :src="getImageSourceById(user?.avatarId)" alt="" />
            </div>
        </div>
        <div class="bottom-section">
            <div class="name">
                {{ user.fullName || ' ' }}
            </div>
            <div class="button">
                <el-button @click="subscribeOrUnsubscribe">{{
                    user?.isSubscribing ? `Hủy theo dõi` : `Theo dõi`
                }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import userApiService from '@/common/service/user.api.service';
@Options({
    components: {},
})
export default class UserCard extends GlobalMixin {
    @Prop() user!: IUser;

    goToProfilePage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.user._id,
            },
        });
    }

    async subscribeOrUnsubscribe() {
        const response = await userApiService.subscribeOrUnsubscribe(this.user._id);
        if (response?.success) {
            //
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }
}
</script>

<style lang="scss">
.user-card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    background: $color-white;

    .top-section {
        cursor: pointer;

        img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
        }
    }

    .bottom-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;

        .name {
            text-align: center;
            font-weight: 700;
        }

        .button {
            text-align: center;
        }
    }
}
</style>
