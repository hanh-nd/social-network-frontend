<template>
    <div class="user-suggestion-item-wrapper h-100">
        <div class="top-section w-100 h-100" @click="goToProfilePage">
            <div class="avatar h-100">
                <img :src="getAvatarUrl(user)" alt="" />
            </div>
        </div>
        <div class="bottom-section">
            <div class="name">
                {{ user?.fullName || 'undefined' }}
            </div>
            <div class="button">
                <el-button
                    @click="subscribeOrUnsubscribe"
                    :type="user?.isSubscribing ? `default` : `primary`"
                    v-if="!user?.isSelf"
                    >{{ user?.isSubscribing ? `Hủy theo dõi` : `Theo dõi` }}</el-button
                >
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

@Options({})
export default class SuggestionItem extends GlobalMixin {
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
        if (!this.user) return;

        const response = await userApiService.subscribeOrUnsubscribe(this.user._id);
        if (response?.success) {
            this.user.isSubscribing = !this.user.isSubscribing;
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }
}
</script>

<style lang="scss" scoped>
.user-suggestion-item-wrapper {
    border: 1px solid $color-light-gray;
    border-radius: 8px;
    .title {
        font-size: 24px;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    background: $color-white;
    padding: 8px;

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
