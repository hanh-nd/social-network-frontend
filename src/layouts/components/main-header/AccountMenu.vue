<template>
    <AccountMenuUser v-if="isLogin" :shouldRegisterSocket="shouldRegisterSocket"></AccountMenuUser>
    <AccountMenuGuest v-else></AccountMenuGuest>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import AccountMenuGuest from './AccountMenuGuest.vue';
import AccountMenuUser from './AccountMenuUser.vue';
import { appModule } from '@/plugins/vuex/appModule';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        AccountMenuGuest,
        AccountMenuUser,
    },
})
export default class AccountMenu extends GlobalMixin {
    @Prop({ default: false }) readonly shouldRegisterSocket!: boolean;
    get isLogin() {
        return appModule.isLogin;
    }
}
</script>

<style lang="scss" scoped></style>
