<template>
    <div class="user-suggestion-list-wrapper">
        <div class="title">Những người bạn có thể biết</div>
        <div class="user-suggestion-list">
            <div class="user-suggestion-item" v-for="suggestion in userSuggestions" :key="suggestion._id">
                <UserSuggestionItem :user="suggestion" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { Options } from 'vue-class-component';
import UserSuggestionItem from './UserSuggestionItem.vue';

@Options({
    components: {
        UserSuggestionItem,
    },
})
export default class UserSuggestionList extends GlobalMixin {
    userSuggestions: IUser[] = [];

    created(): void {
        this.loadData();
    }

    async loadData() {
        const response = await userApiService.getUserSuggestions();
        if (response?.success) {
            this.userSuggestions = response?.data || [];
        } else {
            this.userSuggestions = [];
        }
    }
}
</script>

<style lang="scss" scoped>
.user-suggestion-list-wrapper {
    .title {
        font-size: 24px;
    }

    .user-suggestion-list {
        display: grid;
        gap: 60px;
        grid-template-columns: repeat(5, 1fr);
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .user-suggestion-list-wrapper {
        .user-suggestion-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
