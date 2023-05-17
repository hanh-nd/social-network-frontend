<template>
    <AccountMenuUser v-if="isLogin"></AccountMenuUser>
    <AccountMenuGuest v-else></AccountMenuGuest>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import AccountMenuGuest from './AccountMenuGuest.vue';
import AccountMenuUser from './AccountMenuUser.vue';
import { appModule } from '@/plugins/vuex/appModule';

@Options({
    components: {
        AccountMenuGuest,
        AccountMenuUser,
    },
})
export default class AccountMenu extends GlobalMixin {
    get isLogin() {
        return appModule.isLogin;
    }
}
</script>

<style lang="scss" scoped></style>
