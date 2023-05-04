<template>
    <div class="home-wrapper">
        <div class="home-container mx-auto">
            <el-button @click="goToLoginPage">CLICK</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class HomePage extends GlobalMixin {
    created() {
        this.loadData();
    }

    loadData() {
        appModule.getUserProfile();
    }

    goToLoginPage() {
        this.$router.push({
            name: this.PageName.LOGIN_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
.home-container {
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;
}
</style>
