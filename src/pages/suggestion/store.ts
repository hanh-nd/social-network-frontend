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
class SuggestionModule extends VuexModule {
    suggestionList: IUser[] = [];
    suggestionListQuery: IGetSuggestionListQuery = cloneDeep(INIT_GET_SUGGESTION_LIST_QUERY);
    isFetchedAllSuggestions = false;

    @Action
    async getSuggestionList(append = false) {
        const response = await userApiService.getUserSuggestions(this.suggestionListQuery);
        if (response?.success) {
            const data = response.data || [];
            if (append) {
                this.APPEND_SUGGESTION_LIST(data);
            } else {
                this.SET_SUGGESTION_LIST(data);
            }
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_SUGGESTIONS(true);
            }
        } else {
            if (append) {
                this.APPEND_SUGGESTION_LIST([]);
            } else {
                this.SET_SUGGESTION_LIST([]);
            }
            this.SET_IS_FETCHED_ALL_SUGGESTIONS(true);
        }
    }

    @Mutation
    SET_SUGGESTION_LIST(suggestionList: IUser[]) {
        this.suggestionList = suggestionList;
    }

    @Mutation
    APPEND_SUGGESTION_LIST(suggestionList: IUser[]) {
        this.suggestionList.push(...suggestionList);
    }

    @Action
    setSuggestionListQuery(suggestionListQuery: IGetSuggestionListQuery) {
        this.SET_SUGGESTION_LIST_QUERY(suggestionListQuery);
    }

    @Action
    resetSuggestionListQuery() {
        this.RESET_SUGGESTION_LIST_QUERY();
    }

    @Mutation
    SET_SUGGESTION_LIST_QUERY(suggestionListQuery: IGetSuggestionListQuery) {
        this.suggestionListQuery = {
            ...this.suggestionListQuery,
            ...suggestionListQuery,
        };
    }

    @Mutation
    RESET_SUGGESTION_LIST_QUERY() {
        this.suggestionListQuery = cloneDeep(INIT_GET_SUGGESTION_LIST_QUERY);
    }

    @Mutation
    SET_IS_FETCHED_ALL_SUGGESTIONS(isFetchedAllSuggestions: boolean) {
        this.isFetchedAllSuggestions = isFetchedAllSuggestions;
    }
}

export const suggestionModule = getModule(SuggestionModule);
