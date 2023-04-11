import store from '@/plugins/vuex';
import { Module, VuexModule, getModule } from 'vuex-module-decorators';

@Module({
    name: 'home',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class HomeModule extends VuexModule {}

export const homeModule = getModule(HomeModule);
