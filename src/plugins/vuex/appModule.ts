import authStorageService from '@/common/authStorage';
import { DeviceType, MD_GRID_BREAKPOINT } from '@/common/constants';
import { IUser } from '@/common/interfaces';
import { default as appApiService } from '@/common/service/app.api.service';
import store from '@/plugins/vuex';
import { isEmpty } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

@Module({
    name: 'app',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AppModule extends VuexModule {
    loginUser: IUser = {} as IUser;
    screenWidth = window.innerWidth;

    get deviceType() {
        return this.screenWidth <= MD_GRID_BREAKPOINT
            ? DeviceType.MOBILE
            : DeviceType.DESKTOP;
    }

    get isLogin() {
        return !isEmpty(this.loginUser);
    }

    @Action
    setLoginUser(user: IUser) {
        this.SET_LOGIN_USER(user);
    }

    @Action
    async getUserProfile() {
        const response = await appApiService.getUserProfile();
        if (response?.success) {
            this.setLoginUser(response?.data || {});
            authStorageService.setLoginUser(response?.data || {});
        } else {
            this.setLoginUser({} as IUser);
            authStorageService.setLoginUser({} as IUser);
        }
    }

    @Action
    setScreenWidth(screenWidth: number) {
        this.SET_SCREEN_WIDTH(screenWidth);
    }

    @Mutation
    SET_LOGIN_USER(loginUser: IUser) {
        this.loginUser = loginUser;
    }

    @Mutation
    SET_SCREEN_WIDTH(screenWidth: number) {
        this.screenWidth = screenWidth;
    }
}

export const appModule = getModule(AppModule);
