import authStorageService from '@/common/authStorage';
import { DeviceType, MD_GRID_BREAKPOINT } from '@/common/constants';
import { ICustomer } from '@/common/interfaces';
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
    loginCustomer: ICustomer = {} as ICustomer;
    screenWidth = window.innerWidth;

    get deviceType() {
        return this.screenWidth <= MD_GRID_BREAKPOINT
            ? DeviceType.MOBILE
            : DeviceType.DESKTOP;
    }

    get isCustomerLogin() {
        return !isEmpty(this.loginCustomer);
    }

    @Action
    setLoginCustomer(customer: ICustomer) {
        this.SET_LOGIN_CUSTOMER(customer);
    }

    @Action
    async getCustomerProfile() {
        const response = await appApiService.getCustomerProfile();
        if (response?.success) {
            this.setLoginCustomer(response?.data || {});
            authStorageService.setLoginCustomer(response?.data || {});
        } else {
            this.setLoginCustomer({} as ICustomer);
            authStorageService.setLoginCustomer({} as ICustomer);
        }
    }

    @Action
    setScreenWidth(screenWidth: number) {
        this.SET_SCREEN_WIDTH(screenWidth);
    }

    @Mutation
    SET_LOGIN_CUSTOMER(customer: ICustomer) {
        this.loginCustomer = customer;
    }

    @Mutation
    SET_SCREEN_WIDTH(screenWidth: number) {
        this.screenWidth = screenWidth;
    }
}

export const appModule = getModule(AppModule);
