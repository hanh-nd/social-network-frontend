<template>
    <div class="avatar-wrapper">
        <router-link :to="linkTo">
            <img :src="avatar" alt="" :style="style" />
        </router-link>
    </div>
</template>

<script lang="ts">
import { getAvatarUrl } from '@/common/helpers';
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class CreateNewPost extends GlobalMixin {
    @Prop() user!: IUser | undefined;
    @Prop({ default: 32 }) size!: number;
    @Prop({ default: '' }) linkTo!: string;

    get avatar() {
        return getAvatarUrl(this.user);
    }

    get style() {
        return {
            width: `${this.size}px`,
            height: `${this.size}px`,
        };
    }
}
</script>

<style lang="scss" scoped>
.avatar-wrapper {
    vertical-align: middle;

    img {
        border: 2px solid $color-gray-2;
        border-radius: 50%;
    }
}
</style>
