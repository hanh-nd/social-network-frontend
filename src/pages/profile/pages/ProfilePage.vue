<template>
    <div class="profile-page-container">
        <div class="profile-page-wrapper mx-auto">
            <div class="header w-100">
                <ProfileHeader />
            </div>

            <div class="body w-100">
                <MainProfileScreen v-if="profileScreenTab === ProfileScreenTab.MAIN" />
                <DescribeScreen v-else-if="profileScreenTab === ProfileScreenTab.DESCRIBE" />
                <SubscriberScreen v-else-if="profileScreenTab === ProfileScreenTab.SUBSCRIBERS" />
                <SubscribingScreen v-else-if="profileScreenTab === ProfileScreenTab.SUBSCRIBING" />
                <BlocksScreen v-else-if="profileScreenTab === ProfileScreenTab.BLOCKS" />
                <RequestScreen v-else-if="profileScreenTab === ProfileScreenTab.REQUEST" />
                <QuestionScreen v-else-if="profileScreenTab === ProfileScreenTab.QUESTIONS" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import ProfileHeader from '../components/ProfileHeader.vue';
import BlocksScreen from '../components/blocks/BlocksScreen.vue';
import DescribeScreen from '../components/describe-screen/DescribeScreen.vue';
import MainProfileScreen from '../components/main-profile-screen/MainProfileScreen.vue';
import SubscriberScreen from '../components/subscribers/SubscriberScreen.vue';
import SubscribingScreen from '../components/subscribing/SubscribingScreen.vue';
import { ProfileScreenTab } from '../constants';
import { profileModule } from '../store';
import RequestScreen from '../components/requests/RequestScreen.vue';
import QuestionScreen from '../components/questions/QuestionScreen.vue';

@Options({
    components: {
        ProfileHeader,
        MainProfileScreen,
        SubscriberScreen,
        SubscribingScreen,
        DescribeScreen,
        BlocksScreen,
        RequestScreen,
        QuestionScreen,
    },
})
export default class ProfilePage extends GlobalMixin {
    ProfileScreenTab = ProfileScreenTab;

    get userId() {
        return this.$route.params?.id as string;
    }

    created() {
        this.loadData();
        profileModule.setProfileScreenTab(ProfileScreenTab.MAIN);
    }

    async loadData() {
        profileModule.getProfileUser(this.userId);
        profileModule.getProfileDetail(this.userId);
        profileModule.resetProfilePostListQuery();
        profileModule.getProfilePostList({ id: this.userId });
    }

    get profileScreenTab() {
        return profileModule.profileScreenTab;
    }
}
</script>

<style lang="scss" scoped>
.profile-page-container {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.profile-page-wrapper {
    width: 100%;
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;

    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
