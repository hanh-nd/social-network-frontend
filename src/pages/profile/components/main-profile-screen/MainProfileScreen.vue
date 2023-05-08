<template>
    <div class="main-profile-screen-wrapper">
        <div class="body w-100">
            <div class="overview">
                <ProfileOverview />
            </div>

            <div class="content">
                <ProfileContent @on-load-more-profile-posts="onLoadMoreProfilePosts" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import ProfileContent from './ProfileContent.vue';
import ProfileOverview from './ProfileOverview.vue';
import { profileModule } from '../../store';
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

    onLoadMoreProfilePosts() {
        profileModule.getProfilePostList(this.userId);
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
