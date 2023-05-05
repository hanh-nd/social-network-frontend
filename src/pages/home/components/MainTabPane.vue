<template>
    <div class="main-tab-pane-wrapper">
        <div class="create-new-post-bar">
            <CreateNewPostBar />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import CreateNewPostBar from './CreateNewPostBar.vue';

@Options({
    components: {
        CreateNewPostBar,
    },
})
export default class MainTabPane extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.main-tab-pane-wrapper {
    margin: auto;
    max-width: map-get($grid-breakpoints, sm);

    .create-new-post-bar {
        background: $color-white;
        border-radius: 6px;
    }
}
</style>
