import { IGetSuggestionListQuery, IUser } from '@/common/interfaces';
import userApiService from '@/common/service/user.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_SUGGESTION_LIST_QUERY } from './constants';

@Module({
    name: 'suggestion',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class SuggestionModule extends VuexModule {}

export const suggestionModule = getModule(SuggestionModule);
