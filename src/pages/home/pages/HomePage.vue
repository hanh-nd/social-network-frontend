<template>
    <div class="home-wrapper">
        <div class="home-container mx-auto">
            <div class="feed-tab col-9">
                <FeedTab />
            </div>
            <div class="right-contact col-3">
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
import FeedTab from '../components/FeedTab.vue';
import RightContact from '../components/RightContact.vue';
import CreateNewPostDialog from '../components/CreateNewPostDialog.vue';

@Options({
    components: {
        FeedTab,
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

        .feed-tab {
            padding-top: 8px;
        }

        .right-contact {
            padding-top: 8px;

            height: calc(100vh - 60px);
        }
    }
}
</style>
