<template>
    <div class="overview-screen-wrapper">
        <div class="overview">
            <div class="summary-section">
                <div class="header">Giới thiệu</div>
                <div class="summary">
                    <GroupSummaryForm />
                </div>
            </div>

            <div class="administrators-section">
                <div class="header">
                    <div class="left-section">Thành viên</div>
                    <div class="right-section">
                        <el-button type="info" @click="openMembersScreen">Xem tất cả</el-button>
                    </div>
                </div>

                <div class="administrators">
                    <div class="title">{{ group.administrators.length }} quản trị viên</div>
                    <div class="administrator-list">
                        <BaseRoundAvatar
                            v-for="admin in group.administrators.slice(0, 5)"
                            :key="admin.user._id"
                            :user="admin.user"
                            :size="56"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="privacy">
            <GroupPrivacyForm />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { GroupDetailScreenTab } from '../../constants';
import { groupDetailModule } from '../../store';
import GroupPrivacyForm from './GroupPrivacyForm.vue';
import GroupSummaryForm from './GroupSummaryForm.vue';

@Options({
    components: {
        GroupSummaryForm,
        GroupPrivacyForm,
    },
})
export default class OverviewScreen extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    openMembersScreen() {
        EventEmitter.emit(EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB, GroupDetailScreenTab.MEMBERS);
    }
}
</script>

<style lang="scss">
.overview-screen-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;

    .overview {
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .summary-section,
        .administrators-section {
            border-radius: 8px;
            padding: 16px;
            background: $color-white;
        }

        .summary-section {
            .header {
                font-size: 24px;
                font-weight: 500;
            }
        }

        .administrators-section {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 24px;
                font-weight: 500;
            }

            .administrators {
                .title {
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .administrator-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
            }
        }
    }

    .privacy {
        flex: 2;
    }
}
</style>
