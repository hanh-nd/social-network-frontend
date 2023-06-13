import { ISearchQuery, ISearchResults } from '@/common/interfaces';
import searchApiService from '@/common/service/search.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { SearchBy } from './constants';

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
        groups: [],
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
                    groups: [],
                },
            );
        } else {
            this.SET_SEARCH_RESULTS(
                response?.data || {
                    posts: [],
                    users: [],
                    groups: [],
                },
            );
        }
    }

    @Action
    async searchUsers(query: ISearchQuery) {
        const response = await searchApiService.searchUsers(query);
        if (response?.success) {
            this.SET_SEARCH_RESULTS({
                ...this.searchResults,
                users: response?.data || [],
            });
        } else {
            this.SET_SEARCH_RESULTS({
                ...this.searchResults,
                users: [],
            });
        }
    }

    @Action
    async searchPosts(query: ISearchQuery) {
        const response = await searchApiService.searchPosts(query);
        if (response?.success) {
            this.SET_SEARCH_RESULTS({
                ...this.searchResults,
                posts: response?.data || [],
            });
        } else {
            this.SET_SEARCH_RESULTS({
                ...this.searchResults,
                posts: [],
            });
        }
    }

    @Action
    async searchGroups(query: ISearchQuery) {
        const response = await searchApiService.searchGroups(query);
        if (response?.success) {
            this.SET_SEARCH_RESULTS({
                ...this.searchResults,
                groups: response?.data || [],
            });
        } else {
            this.SET_SEARCH_RESULTS({
                ...this.searchResults,
                groups: [],
            });
        }
    }

    @Mutation
    SET_SEARCH_RESULTS(searchResults: ISearchResults) {
        this.searchResults = searchResults;
    }
}

export const searchModule = getModule(SearchModule);
