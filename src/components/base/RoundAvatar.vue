<template>
    <div class="avatar-wrapper" @click="onAvatarClick">
        <img :src="avatar" alt="" :style="style" />
    </div>
</template>

<script lang="ts">
import { getAvatarUrl } from '@/common/helpers';
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class RoundAvatar extends GlobalMixin {
    @Prop() user!: IUser | undefined;
    @Prop({ default: 32 }) size!: number;
    @Prop({ default: '' }) linkTo!: string;
    @Prop() onClick!: CallableFunction;
    @Prop() fileId!: string;

    get avatar() {
        return getAvatarUrl(this.user || { avatarId: this.fileId });
    }

    get style() {
        return {
            width: `${this.size}px`,
            height: `${this.size}px`,
        };
    }

    onAvatarClick() {
        if (_.isFunction(this.onClick)) {
            this.onClick();
        } else {
            this.goToProfilePage();
        }
    }

    goToProfilePage() {
        if (!this.user?._id) return;

        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.user?._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.avatar-wrapper {
    vertical-align: middle;
    cursor: pointer;

    img {
        border: 2px solid $color-gray-2;
        border-radius: 50%;
    }
}
</style>
