<template>
    <div class="home-wrapper">
        <div class="home-container mx-auto">
            <div class="feed-menu col-sm-2">
                <FeedMenu />
            </div>
            <div class="feed-screen col-sm-8">
                <FeedScreen />
            </div>
            <div class="right-contact col-sm-2 d-none d-sm-block">
                <RightContact />
            </div>
        </div>

        <!--Dialog-->
        <CreateNewPostDialog />
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import CreateNewPostDialog from '../components/CreateNewPostDialog.vue';
import FeedMenu from '../components/FeedMenu.vue';
import FeedScreen from '../components/FeedScreen.vue';
import RightContact from '../components/RightContact.vue';

@Options({
    components: {
        FeedMenu,
        FeedScreen,
        RightContact,
        CreateNewPostDialog,
    },
})
export default class HomePage extends GlobalMixin {
    created() {
        this.loadData();
    }

    loadData() {
        appModule.getUserProfile();
    }

    goToLoginPage() {
        this.$router.push({
            name: this.PageName.LOGIN_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
.home-wrapper {
    background-color: $color-gray;

    .home-container {
        display: flex;
        flex-direction: row;
        height: 100%;

        .feed-menu {
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
            padding-top: 8px;
        }

        .feed-screen {
            padding-top: 8px;
            margin: 0 8px;
        }

        .right-contact {
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
            padding-top: 8px;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .feed-screen {
        flex: 1;
    }
}
</style>
