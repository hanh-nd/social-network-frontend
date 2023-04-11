<template>
    <div>
        <MenuHeader></MenuHeader>
        <StickyHeader>
            <template #default="{ isVisible }">
                <div class="sticky-header">
                    <MenuHeader :isSticky="true" :isVisible="isVisible"></MenuHeader>
                </div>
            </template>
        </StickyHeader>
    </div>
</template>

<script lang="ts">
import StickyHeader from '@/layouts/components/main-header/StickyHeader.vue';
import { Options, Vue } from 'vue-class-component';
import MenuHeader from './main-header/MenuHeader.vue';

@Options({
    components: {
        StickyHeader,
        MenuHeader,
    },
})
export default class MainHeader extends Vue {}
</script>

<style lang="scss" scoped></style>
