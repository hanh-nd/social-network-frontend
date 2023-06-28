<template>
    <div class="profile-info-page-wrapper">
        <div class="profile-info-page-container mx-auto">
            <div class="left-section">
                <ProfileSection />
            </div>
            <div class="right-section">
                <div class="top-section">
                    <InformationSection />
                </div>
                <div class="bottom-section">
                    <PasswordSection />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import InformationSection from '../components/InfomationSection.vue';
import PasswordSection from '../components/PasswordSection.vue';
import ProfileSection from '../components/ProfileSection.vue';

@Options({
    components: {
        InformationSection,
        ProfileSection,
        PasswordSection,
    },
})
export default class ProfileInfoPage extends GlobalMixin {
    created(): void {
        this.loadData();
    }

    loadData() {
        //
    }
}
</script>

<style lang="scss" scoped>
.profile-info-page-wrapper {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.profile-info-page-container {
    width: 100%;
    max-width: $content-max-width + $content-padding * 2;
    padding: $content-padding;
    margin: auto;

    display: flex;
    flex-direction: row;
    gap: 16px;

    .left-section,
    .right-section {
        flex: 1;
    }

    .right-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}

@media only screen and (max-width: (map-get($grid-breakpoints, md))) {
    .profile-info-page-container {
        flex-direction: column;
    }
}
</style>
