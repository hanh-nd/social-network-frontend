<template>
    <div class="logo-menu-wrapper">
        <div class="logo">
            <router-link to="/">
                <img src="@/assets/images/common/logo.svg" alt="" />
            </router-link>
        </div>
        <div class="search-bar">
            <BaseAutocomplete
                v-model:value="keyword"
                :options="options"
                placeholder="Nhập từ khóa để tìm kiếm"
                @on-change-keyword="onChangeKeyword"
                @on-enter="goToSearchPage"
            >
                <template #options="{ item }">
                    <div class="option" @click="goToProfilePage(item.id)">
                        {{ item.value }}
                    </div>
                </template>
            </BaseAutocomplete>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { searchModule } from '@/pages/search/store';
import { appModule } from '@/plugins/vuex/appModule';
import { debounce } from 'lodash';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class LogoMenu extends GlobalMixin {
    keyword = '';

    get options() {
        return this.userSearchResults.map((u) => {
            return {
                value: u.fullName,
                id: u._id,
            };
        });
    }

    get userSearchResults() {
        return searchModule.searchResults.users;
    }

    onChangeKeyword() {
        this.onSearchDebounce();
        appModule.setSearchKeyword(this.keyword);
    }

    onSearchDebounce = debounce(() => {
        searchModule.search({
            keyword: this.keyword,
            size: 5,
        });
    }, 200);

    goToSearchPage() {
        this.$router.push({
            name: this.PageName.SEARCH_PAGE,
            query: {
                keyword: this.keyword,
            },
        });
    }

    goToProfilePage(id: string) {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.logo-menu-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80%;
    gap: 8px;
    .logo {
        height: 100%;

        img {
            height: 100%;
        }
    }

    :deep(.search-bar) {
        .el-input__wrapper {
            box-shadow: none;
        }
    }
}
</style>