<template>
    <div class="account-menu-wrapper">
        <el-dropdown :hide-on-click="true" placement="top-start" ref="dropdown" trigger="click">
            <div class="d-flex user-info" :class="{ sticky: isSticky }">
                <BaseRoundAvatar :user="loginUser" :size="32" />
                <p class="text-truncate">{{ name }}</p>
            </div>

            <template #dropdown>
                <el-dropdown-menu>
                    <router-link class="router-link" to="/my-account">
                        <el-dropdown-item class="dropdown-item">
                            <p>Trang cá nhân</p>
                        </el-dropdown-item>
                    </router-link>
                    <hr />
                    <hr />
                    <el-dropdown-item @click="logout" class="dropdown-item">
                        <p>Đăng xuất</p>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import localStorageAuthService from '@/common/authStorage';
import { HEIGHT_SHOW_STICKY_HEADER } from '@/common/constants';
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import appApiService from '@/common/service/app.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { ref } from 'vue';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

interface IDropdown {
    handleClose: () => void;
}

@Options({
    components: {},
})
export default class AccountMenuUser extends GlobalMixin {
    @Prop({ default: false }) readonly isSticky!: boolean;
    dropdown = ref();

    get name() {
        return appModule.loginUser?.fullName || appModule.loginUser?.email;
    }

    get avatar() {
        return appModule.loginUser?.avatarId
            ? `${process.env.VUE_APP_API_URL}/files/${appModule.loginUser.avatarId}`
            : require('@/assets/images/common/default-avatar.svg');
    }

    get loginUser() {
        return appModule.loginUser;
    }

    mounted(): void {
        window.addEventListener('scroll', this.scrollHandler, {
            passive: true,
        });
    }
    beforeDestroy(): void {
        window.removeEventListener('scroll', this.scrollHandler);
    }
    scrollHandler(): void {
        if (
            (window.pageYOffset > HEIGHT_SHOW_STICKY_HEADER && !this.isSticky) ||
            (window.pageYOffset < HEIGHT_SHOW_STICKY_HEADER && this.isSticky)
        ) {
            (this.$refs.dropdown as IDropdown)?.handleClose();
        }
    }
    logout() {
        appModule.setLoginUser({} as IUser);
        localStorageAuthService.resetAll();
        this.$router.push('/login');
        appApiService.logout();
    }
}
</script>

<style lang="scss" scoped>
p {
    margin-bottom: 0px;
}
hr {
    margin: 0;
    color: $color-black-3;
}
.router-link {
    text-decoration: none;
}
.user-info {
    justify-content: space-between;
    align-items: center;
    color: $color-black;
    gap: 8px;

    cursor: pointer;

    p {
        max-width: 150px;
        color: #1d1d1d;
    }
}
:deep(.dropdown-item) {
    border-radius: 12px;
}
:deep(.dropdown-item:hover) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
:deep(.dropdown-item:focus) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
:deep(.dropdown-item:active) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
ul {
    border-radius: 12px;
    width: 180px;
    padding: 0;
}
:deep(.el-dropdown-menu__item) {
    height: 36px;
    display: flex;
}
</style>
