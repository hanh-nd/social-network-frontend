<template>
    <div class="home-wrapper">
        <div class="home-container mx-auto">
            <div class="feed-menu">
                <FeedMenu />
            </div>
            <div class="feed-screen">
                <FeedScreen />
            </div>
            <div class="right-contact">
                <RightContact />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import FeedMenu from '../components/FeedMenu.vue';
import FeedScreen from '../components/FeedScreen.vue';
import RightContact from '../components/RightContact.vue';

@Options({
    components: {
        FeedMenu,
        FeedScreen,
        RightContact,
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
            min-width: 250px;
        }

        .feed-screen {
            padding-top: 8px;
            margin: 0 8px;
            flex: 1;
        }

        .right-contact {
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
            padding-top: 8px;
            min-width: 250px;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .home-wrapper .home-container {
        .right-contact {
            display: none;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .home-wrapper .home-container {
        .feed-menu {
            min-width: 70px;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .feed-screen {
        flex: 1;
    }
}
</style>
