<template>
    <div class="members-screen-wrapper">
        <div class="top-section">
            <div class="count-info">{{ group?.memberIds?.length }} thành viên</div>
            <div class="search">
                <BaseInputText v-model:value="keyword" placeholder="Tìm thành viên" />
            </div>
        </div>
        <div class="bottom-section">
            <div class="administrators">
                <div class="title">Quản trị viên</div>
                <div class="list">
                    <MemberCard
                        v-for="admin in administrators"
                        :key="admin.user._id"
                        :member="admin.user"
                        :isOwner="admin.isOwner"
                        :isAdministrator="true"
                    />
                </div>
            </div>
            <BaseDivider />
            <div class="members">
                <div class="title">Thành viên</div>
                <div class="list">
                    <MemberCard
                        v-for="member in filteredMembers"
                        :key="member._id"
                        :member="member"
                        :isOwner="false"
                        :isAdministrator="false"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../../store';
import MemberCard from './MemberCard.vue';

@Options({
    components: {
        MemberCard,
    },
})
export default class MembersScreen extends GlobalMixin {
    keyword = '';
    members: IUser[] = [];

    created(): void {
        this.getMembers();
    }

    get group() {
        return groupDetailModule.groupDetail;
    }

    get administrators() {
        return this.group?.administrators || [];
    }

    get filteredMembers() {
        return _.isEmpty(this.keyword)
            ? this.members
            : this.members.filter((member) => new RegExp(this.keyword, 'gi').test(member.fullName));
    }

    async getMembers() {
        const response = await groupApiService.getMembers(this.group._id);
        if (response?.success) {
            this.members = response?.data;
        } else {
            this.members = [];
        }
    }
}
</script>

<style lang="scss">
.members-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .top-section,
    .bottom-section {
        padding: 16px;
        border-radius: 8px;
        background: $color-white;

        .title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 8px;
        }
    }
}
</style>
