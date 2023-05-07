<template>
    <div class="profile-page-container">
        <div class="profile-page-wrapper mx-auto">
            <div class="header w-100">
                <ProfileHeader />
            </div>

            <div class="body w-100">
                <div class="overview">
                    <ProfileOverview />
                </div>

                <div class="content">
                    <ProfileContent @on-load-more-profile-posts="onLoadMoreProfilePosts" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import ProfileContent from '../components/ProfileContent.vue';
import ProfileHeader from '../components/ProfileHeader.vue';
import ProfileMenu from '../components/ProfileMenu.vue';
import ProfileOverview from '../components/ProfileOverview.vue';
import { profileModule } from '../store';
@Options({
    components: {
        ProfileHeader,
        ProfileMenu,
        ProfileOverview,
        ProfileContent,
    },
})
export default class ProfilePage extends GlobalMixin {
    get userId() {
        return this.$route.params?.id as string;
    }

    created() {
        this.loadData();
    }

    async loadData() {
        profileModule.getProfileUser(this.userId);
        profileModule.getProfilePostList(this.userId);
    }

    onLoadMoreProfilePosts() {
        profileModule.getProfilePostList(this.userId);
    }
}
</script>

<style lang="scss" scoped>
.profile-page-container {
    width: 100%;
    background: $color-gray;
}

.profile-page-wrapper {
    width: 100%;
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;

    display: flex;
    flex-direction: column;
    gap: 8px;

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
    .profile-page-wrapper {
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
