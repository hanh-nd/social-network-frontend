<template>
    <div class="full-reaction-wrapper">
        <el-popover
            popper-class="full-reaction-popover"
            placement="top-start"
            :width="200"
            trigger="hover"
            :teleported="false"
        >
            <div class="full-reaction">
                <div class="reaction" :class="target.reactionType === ReactionType.LIKE ? 'selected' : ''">
                    <Icon
                        :icon="target.reactionType === ReactionType.LIKE ? `solar:like-bold` : `solar:like-broken`"
                        height="24"
                        :inline="true"
                        @click="onLikeWrapper(ReactionType.LIKE)"
                    ></Icon>
                </div>
                <div class="reaction" :class="target.reactionType === ReactionType.LOVE ? 'selected' : ''">
                    <Icon
                        :icon="target.reactionType === ReactionType.LOVE ? `solar:heart-bold` : `solar:heart-broken`"
                        height="24"
                        @click="onLikeWrapper(ReactionType.LOVE)"
                        >Yêu thích</Icon
                    >
                </div>
                <div class="reaction" :class="target.reactionType === ReactionType.EMPATHIZE ? 'selected' : ''">
                    <Icon
                        :icon="
                            target.reactionType === ReactionType.EMPATHIZE ? `ri:empathize-fill` : `tabler:empathize`
                        "
                        height="24"
                        @click="onLikeWrapper(ReactionType.EMPATHIZE)"
                        >Đồng cảm</Icon
                    >
                </div>
                <div class="reaction" :class="target.reactionType === ReactionType.CELEBRATE ? 'selected' : ''">
                    <Icon
                        :icon="
                            target.reactionType === ReactionType.CELEBRATE
                                ? `mingcute:celebrate-fill`
                                : `mingcute:celebrate-line`
                        "
                        height="24"
                        @click="onLikeWrapper(ReactionType.CELEBRATE)"
                        >Chúc mừng</Icon
                    >
                </div>
                <div class="reaction" :class="target.reactionType === ReactionType.ANGRY ? 'selected' : ''">
                    <Icon
                        :icon="
                            target.reactionType === ReactionType.ANGRY
                                ? `icon-park-twotone:angry-face`
                                : `tabler:mood-angry`
                        "
                        height="24"
                        @click="onLikeWrapper(ReactionType.ANGRY)"
                        >Giận dữ</Icon
                    >
                </div>
            </div>

            <template #reference>
                <el-button @click="onLikeWrapper()" :type="target.isReacted ? `primary` : undefined">{{
                    target.isReacted ? getReactionTypeString(target.reactionType) : `Thích`
                }}</el-button>
            </template>
        </el-popover>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { IComment, IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Icon } from '@iconify/vue';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        Icon,
    },
})
export default class FullReactionBar extends GlobalMixin {
    @Prop() target!: IPost | IComment;
    @Prop() onLike!: CallableFunction;

    ReactionType = ReactionType;

    get isReacted() {
        return this.target.isReacted;
    }

    get reactionType() {
        return this.target.reactionType;
    }

    async onLikeWrapper(type = ReactionType.LIKE) {
        if (this.isReacted && this.reactionType !== type) {
            // Unlike
            await this.onLike();
        }

        this.onLike(type);
    }
}
</script>

<style lang="scss" scoped>
.full-reaction-wrapper {
    :deep(.full-reaction-popover) {
        width: 300px !important;
        .full-reaction {
            display: flex;
            flex-direction: row;
            justify-content: space-around;

            .reaction {
                cursor: pointer;
                padding: 4px;
                border-radius: 8px;

                &.selected {
                    background: $color-gray;
                }

                &:hover {
                    background: $color-gray;
                }
            }
        }
    }

    .el-button {
        width: 100%;
    }
}
</style>
