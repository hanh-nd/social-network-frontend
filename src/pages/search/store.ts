import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { SearchBy } from './constants';
import { ISearchQuery, ISearchResults } from '@/common/interfaces';
import searchApiService from '@/common/service/search.api.service';

@Module({
    name: 'search',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class SearchModule extends VuexModule {
    searchBy = SearchBy.ALL;
    searchResults: ISearchResults = {
        posts: [],
        users: [],
    };

    @Action
    setSearchBy(searchBy: SearchBy) {
        this.SET_SEARCH_BY(searchBy);
    }

    @Mutation
    SET_SEARCH_BY(searchBy: SearchBy) {
        this.searchBy = searchBy;
    }

    @Action
    async search(query: ISearchQuery) {
        const response = await searchApiService.search(query);
        if (response?.success) {
            this.SET_SEARCH_RESULTS(
                response?.data || {
                    posts: [],
                    users: [],
                },
            );
        } else {
            this.SET_SEARCH_RESULTS(
                response?.data || {
                    posts: [],
                    users: [],
                },
            );
        }
    }

    @Mutation
    SET_SEARCH_RESULTS(searchResults: ISearchResults) {
        this.searchResults = searchResults;
    }
}

export const searchModule = getModule(SearchModule);
