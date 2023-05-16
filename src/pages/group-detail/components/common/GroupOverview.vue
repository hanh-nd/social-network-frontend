<template>
    <div class="group-overview-wrapper">
        <div class="overview">
            <div class="header">Giới thiệu</div>

            <div class="footer">Ngày lập nhóm - {{ parseDateTime(group?.createdAt, DateFormat.DD_MM_YYYY_DASH) }}</div>
        </div>

        <div class="settings">
            <div class="private">
                <div class="header">{{ group?.private ? `Nhóm riêng tư` : `Nhóm công khai` }}</div>
                <div class="describe">
                    {{
                        group?.private
                            ? `Chỉ thành viên nhóm mới xem được bài viết`
                            : `Mọi người đều có thể xem bài viêt của nhóm`
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../../store';

@Options({
    components: {},
})
export default class GroupOverview extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }
}
</script>

<style lang="scss" scoped>
.group-overview-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .overview,
    .settings {
        background: $color-white;
        border-radius: 8px;
        padding: 16px;

        .header {
            font-weight: 700;
            font-size: 16px;
        }

        .footer {
            font-size: 12px;
        }
    }
}
</style>
