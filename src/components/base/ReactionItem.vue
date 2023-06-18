<template>
    <div class="reaction-item">
        <div class="left-section">
            <div class="avatar">
                <BaseRoundAvatar :user="reaction?.author" :size="32" />
            </div>
            <div class="name" @click="goToUserProfile">
                {{ reaction?.author?.fullName }}
            </div>
        </div>
        <div class="right-section">
            <div class="button" v-if="!reaction?.author?.isSelf">
                <el-button
                    @click="onMessageOrSubscribe"
                    :type="reaction?.author?.isSubscribing ? `default` : `primary`"
                    >{{ reaction?.author?.isSubscribing ? `Nhắn tin` : `Theo dõi` }}</el-button
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IReaction } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class ReactionItem extends GlobalMixin {
    @Prop() reaction!: IReaction;

    onMessageOrSubscribe() {
        //
    }

    goToUserProfile() {
        if (!this.reaction?.author?._id) return;

        appModule.setIsShowReactionListDialog(false);
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.reaction?.author?._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.reaction-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px;

    .left-section {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;

        .name {
            cursor: pointer;
        }
    }
}
</style>
