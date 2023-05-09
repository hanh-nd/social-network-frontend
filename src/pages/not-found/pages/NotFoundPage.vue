<template>
    <div class="container not-found-page">
        <div class="not-found-image">
            <img :src="require('@/assets/images/common/not-found.png')" />
        </div>
        <div class="not-found-btn">
            <el-button @click="goToHomePage">Về trang chủ</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class NotFoundPage extends GlobalMixin {
    goToHomePage() {
        this.$router.push({
            name: this.PageName.HOME_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
.not-found-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
}
</style>
