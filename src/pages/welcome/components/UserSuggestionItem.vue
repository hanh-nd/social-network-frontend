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
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class UserSuggestionItem extends GlobalMixin {
    @Prop() user!: IUser;

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
