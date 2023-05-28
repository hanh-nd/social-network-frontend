<template>
    <div class="request-item-wrapper">
        <div class="received" v-if="isReceived">
            <ReceivedRequestItem :request="request" @on-accept="onAccept" @on-cancel="onCancel" />
        </div>
        <div class="sent" v-else>
            <SentRequestItem :request="request" @on-cancel="onCancel" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ISubscribeRequest } from '../../interfaces';
import { profileModule } from '../../store';
import UserCard from '../common/UserCard.vue';
import ReceivedRequestItem from './ReceivedRequestItem.vue';
import SentRequestItem from './SentRequestItem.vue';

@Options({
    components: {
        UserCard,
        ReceivedRequestItem,
        SentRequestItem,
    },
})
export default class RequestItem extends GlobalMixin {
    @Prop() request!: ISubscribeRequest;
    @Prop() isReceived!: boolean;

    get profile() {
        return profileModule.profileUser;
    }

    async onAccept() {
        if (this.profile?._id) {
            profileModule.getProfileUser(this.profile._id);
        }
    }

    async onCancel() {
        if (this.profile?._id) {
            profileModule.getProfileUser(this.profile._id);
        }
    }
}
</script>

<style lang="scss" scoped></style>
