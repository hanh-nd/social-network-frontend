<template>
    <div class="container">
        <el-button @click="goToLoginPage">CLICK</el-button>
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
<style lang="scss" scoped></style>
