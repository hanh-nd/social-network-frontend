import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex';

@Module({
    name: 'auth',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AuthModule extends VuexModule {}

export const authModule = getModule(AuthModule);
