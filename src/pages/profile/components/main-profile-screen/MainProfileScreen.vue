<template>
    <div class="main-profile-screen-wrapper">
        <div class="body w-100">
            <div class="overview">
                <ProfileOverview />
            </div>

            <div class="content">
                <ProfileContent @on-load-more-profile-posts="onLoadMoreProfilePostDebounced" />
                <div class="reload" v-if="isFetchedAllPostList">Bạn đã đọc hết tin.</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';
import ProfileContent from './ProfileContent.vue';
import ProfileOverview from './ProfileOverview.vue';
@Options({
    components: {
        ProfileOverview,
        ProfileContent,
    },
})
export default class MainProfileScreen extends GlobalMixin {
    get userId() {
        return this.$route.params?.id as string;
    }

    get currentPage() {
        return profileModule.profilePostListQuery.page as number;
    }

    get isFetchedAllPostList() {
        return profileModule.isFetchedAllPostList;
    }

    onLoadMoreProfilePostDebounced() {
        if (this.isFetchedAllPostList) return;

        profileModule.setProfilePostListQuery({
            page: this.currentPage + 1,
        });
        profileModule.getProfilePostList({ id: this.userId, append: true });
    }
}
</script>

<style lang="scss" scoped>
.main-profile-screen-wrapper {
    width: 100%;

    .body {
        display: flex;
        flex-direction: row;
        gap: 8px;

        .overview {
            flex: 2;
            position: sticky;
            top: 65px;
            align-self: flex-start;
        }

        .content {
            flex: 3;
        }

        .reload {
            text-align: center;
            margin: 16px 0;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .main-profile-screen-wrapper {
        .body {
            flex-direction: column;

            .overview {
                position: unset;
                width: 100%;
                flex: unset;
            }

            .content {
                width: 100%;
                flex: unset;
            }
        }
    }
}
</style>
