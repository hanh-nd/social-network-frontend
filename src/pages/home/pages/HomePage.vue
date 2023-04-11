<template>
    <div class="container"></div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class HomePage extends GlobalMixin {
    created() {
        this.loadData();
    }

    loadData() {
        //
    }
}
</script>
<style lang="scss" scoped></style>
