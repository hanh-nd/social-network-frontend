<template>
    <div class="hidable-content-wrapper" v-if="isAuthor || (!isAuthor && !isToxic)">
        <div class="content-wrapper" v-if="isShow || !isToxic">
            <div class="content">
                {{ target?.content }}
            </div>
            <div class="hide" v-if="isToxic" @click="show">Ẩn</div>
        </div>
        <div class="censored" v-else>
            Nội dung đã được ẩn đi do chứa từ ngữ không phù hợp. <span class="show" @click="show">Hiện</span>
        </div>
    </div>
</template>

<script lang="ts">
import { IComment, IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class CensorableContent extends GlobalMixin {
    @Prop() target!: IPost | IComment;
    isShow = false;

    get loginUser() {
        return appModule.loginUser;
    }

    get isAuthor() {
        return this.target.author._id == this.loginUser._id || this.target.author == this.loginUser._id;
    }

    get isToxic() {
        return this.target?.isToxic || false;
    }

    show() {
        this.isShow = !this.isShow;
    }
}
</script>

<style lang="scss" scoped>
.hidable-content-wrapper {
    .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: inherit;
        }
    }

    .show,
    .hide {
        font-weight: 500;
        text-decoration: underline;
        color: $color-green;
        cursor: pointer;
    }
}
</style>
