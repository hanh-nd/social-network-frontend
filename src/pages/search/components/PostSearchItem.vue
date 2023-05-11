<template>
    <div class="post-search-item"></div>
</template>

<script lang="ts">
import { IPost, IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class PostSearchItem extends GlobalMixin {
    @Prop() post!: IPost;
}
</script>

<style lang="scss" scoped>
.post-search-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .left-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }
}
</style>
