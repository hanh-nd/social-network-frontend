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
import { GlobalMixin } from '@/common/mixins';
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

    get groupId() {
        return this.$route.params.id as string;
    }

    created(): void {
        groupDetailModule.getGroupMembers(this.groupId);
    }

    get group() {
        return groupDetailModule.groupDetail;
    }

    get administrators() {
        return this.group?.administrators || [];
    }

    get members() {
        return groupDetailModule.groupMembers;
    }

    get filteredMembers() {
        return _.isEmpty(this.keyword)
            ? this.members
            : this.members.filter((member) => new RegExp(this.keyword, 'gi').test(member.fullName));
    }
}
</script>

<style lang="scss">
.members-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;

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
